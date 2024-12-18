const Course = require('../models/Course');
const Level = require('../models/Level');
const Slide = require('../models/Slide');
const Question = require('../models/Question');
const User =require('../models/User')

exports.addCourse = async (req, res) => {
  const { title, description, language, levels } = req.body;

  try {
    // Create Levels and Slides
    const createdLevels = await Promise.all(levels.map(async (level) => {
      // Create slides for the level
      const createdSlides = await Promise.all(level.slides.map(async (slide) => {

        // Create the slide first
        const createdSlide = await Slide.create({
          sections: [],  // Initialize with empty sections for now
        });

        // Now, create the sections for the slide
        const sections = await Promise.all(slide.sections.map(async (section) => {
          // Create questions if provided in the section
          const createdQuestions = await Promise.all((section.questions || []).map(async (question) => {
            const createdQuestion = await Question.create({
              questionText: question.questionText,
              type: question.type,
              options: question.options,
              correctAnswers: question.correctAnswers,
              code: question.code, // Add code if present
              slideId: createdSlide._id // Now set the slideId after the slide is created
            });
            return createdQuestion._id;  // Return the created question's ObjectId
          }));

          return {
            content: section.content,
            code: section.code,
            questions: createdQuestions, // Store the created question IDs
          };
        }));

        // Now update the created slide with the sections
        createdSlide.sections = sections;
        await createdSlide.save(); // Save the slide after adding sections

        return createdSlide; // Return the created slide
      }));

      // Create the level and associate it with its slides
      const createdLevel = await Level.create({
        title: level.title,
        slides: createdSlides.map((s) => s._id),
      });

      return createdLevel; // Return the created level
    }));

    // Create the Course and associate it with its levels
    const course = await Course.create({
      title,
      description,
      language,
      levels: createdLevels.map((l) => l._id),
    });

    res.status(201).json({ message: 'Course created successfully!', course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Failed to create course ${error.message}` });
  }
};




exports.getCourse = async (req, res) => {
  const courseId = req.params.id; // Get the course ID from the URL parameters

  try {
    // Populate levels, slides, sections, and questions within sections
    const course = await Course.findById(courseId)
      .populate({
        path: 'levels',
        populate: {
          path: 'slides',
          populate: {
            path: 'sections.questions', // Populate questions within each section of slides
          },
        },
      });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve course', error });
  }
};


  
exports.getAllCourses = async (req, res) => {
  try {
    // Fetch courses and populate levels with title only
    const courses = await Course.find()
      .populate({
        path: 'levels',
        select: 'title' // Only fetch the title of the levels
      })
      .select('title description language levels'); // Select only the required fields

    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch courses', error });
  }
};


exports.fetchIncompletedCourses = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Fetch user details
    const user = await User.findById(userId).populate('completedCourses');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const completedCoursesIds = user.completedCourses.map(course => course._id.toString());

    // Fetch all courses and populate levels with slides and sections
    const courses = await Course.find()
      .populate({
        path: 'levels',
        populate: {
          path: 'slides',
          populate: {
            path: 'sections.questions', // Populate sections and their questions
          },
        },
      });

    // Filter for incompleted courses
    const incompletedCourses = courses.filter(course => {
      const isCompleted = completedCoursesIds.includes(course._id.toString());

      const hasUserCompletedLevel = course.levels.some(level =>
        level.completedByUsers.some(completedUser => completedUser.userId.toString() === userId)
      );

      return !isCompleted && hasUserCompletedLevel; // Include if not completed and has at least one level completed by user
    });

    return res.status(200).json(incompletedCourses);
  } catch (error) {
    console.error(`Error fetching incompleted courses: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};


exports.searchCourses = async (req, res) => {
  const { title, language } = req.query;
  
  try {
     
    const searchCriteria = {};
    if (title) {
      searchCriteria.title = { $regex: title, $options: 'i' }; 
    }
    if (language) {
      searchCriteria.language = { $regex: language, $options: 'i' }; 
    }

    // Find courses based on the search criteria
    const courses = await Course.find(searchCriteria)
      .populate({
        path: 'levels',
        select: 'title' // Only fetch the title of the levels
      })
      .select('title description language levels'); // Select only required fields

    // Return the filtered list of courses
    res.status(200).json(courses);
  } catch (error) {
    console.error(`Error searching courses: ${error.message}`);
    res.status(500).json({ message: 'Failed to search courses', error });
  }
};

exports.deleteCourse = async (req, res) => {
  const courseId = req.params.id;

  try {
    // Find the course to delete
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    console.log(`Deleting course: ${courseId}`);

    // Delete related levels and slides, if they exist
    for (let levelId of course.levels) {
      console.log(`Deleting level: ${levelId}`);
      const level = await Level.findById(levelId);
      if (!level) {
        console.log(`Level not found: ${levelId}`);
        continue;  // Skip if level is not found
      }

      // Delete all associated slides
      for (let slideId of level.slides) {
        console.log(`Deleting slide: ${slideId}`);
        const slide = await Slide.findById(slideId);
        if (!slide) {
          console.log(`Slide not found: ${slideId}`);
          continue;  // Skip if slide is not found
        }

        // Delete associated questions for the slide
        console.log(`Deleting questions for slide: ${slideId}`);
        await Question.deleteMany({ slideId: slide._id }); // Delete all questions related to this slide

        // Remove the slide itself
        const slideDeletionResult = await Slide.deleteOne({ _id: slide._id });
        if (slideDeletionResult.deletedCount > 0) {
          console.log(`Slide deleted: ${slideId}`);
        } else {
          console.log(`Failed to delete slide: ${slideId}`);
        }
      }

      // Remove the level itself
      const levelDeletionResult = await Level.deleteOne({ _id: level._id });
      if (levelDeletionResult.deletedCount > 0) {
        console.log(`Level deleted: ${levelId}`);
      } else {
        console.log(`Failed to delete level: ${levelId}`);
      }
    }

    // Now delete the course itself
    const courseDeletionResult = await Course.deleteOne({ _id: courseId });
    if (courseDeletionResult.deletedCount > 0) {
      console.log(`Course deleted: ${courseId}`);
    } else {
      console.log(`Failed to delete course: ${courseId}`);
    }

    res.status(200).json({ message: 'Course and related data deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Failed to delete course', error });
  }
};