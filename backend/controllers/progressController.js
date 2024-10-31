const Question = require('../models/Question');
const Level = require('../models/Level');
const User = require('../models/User');

exports.submitAnswer = async (req, res) => {
  const { questionId } = req.params;
  const { userAnswers } = req.body; // User's submitted answers (can be array for ordering)

  try {
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    let isCorrect = false;

    switch (question.type) {
      case 'mcq':
        isCorrect = userAnswers[0] === question.correctAnswers[0];
        break;
      case 'multiple-correct':
        isCorrect = userAnswers.sort().toString() === question.correctAnswers.sort().toString();
        break;
      case 'ordering':
        isCorrect = userAnswers.toString() === question.correctAnswers.toString();
        break;
      case 'drag-and-drop':
        isCorrect = userAnswers.toString() === question.correctAnswers.toString();
        break;
      default:
        return res.status(400).json({ message: 'Invalid question type' });
    }

    if (isCorrect) {
      return res.status(200).json({ message: 'Correct answer!' });
    } else {
      return res.status(400).json({ message: 'Incorrect answer. Try again.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.completeLevel = async (req, res) => {
  const { levelId } = req.params;
  const userId = req.body.userId; // Accept userId from the request body

  if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
  }

  try {
      const level = await Level.findById(levelId);
      if (!level) return res.status(404).json({ message: 'Level not found' });

      // Check if the user has already completed this level
      const alreadyCompleted = level.completedByUsers.some(user => user.userId.toString() === userId);
      if (alreadyCompleted) {
          return res.status(400).json({ message: 'Level already completed by this user' });
      }

      level.completedByUsers.push({ userId, completed: true });
      await level.save();

      // Check if the entire course is completed
      const course = await Course.findOne({ levels: levelId }).populate('levels');
      const allLevelsCompleted = course.levels.every(lvl =>
          lvl.completedByUsers.some(user => user.userId.toString() === userId.toString())
      );

      if (allLevelsCompleted) {
          const user = await User.findById(userId);
          user.completedCourses.push(course._id);
          await user.save();
      }

      res.status(200).json({ message: 'Level completed successfully!' });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};

