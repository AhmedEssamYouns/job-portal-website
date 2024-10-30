const Course = require('../models/Course');
const Level = require('../models/Level');
const Slide = require('../models/Slide');
const Question = require('../models/Question');

exports.addCourse = async (req, res) => {
  const { title, description, language, levels } = req.body; // Course data from request

  try {
    // Create Levels and Slides
    const createdLevels = await Promise.all(levels.map(async (level) => {
      // Create slides for the level
      const createdSlides = await Promise.all(level.slides.map(async (slide) => {
        // Create the slide first
        const createdSlide = await Slide.create({
          content: slide.content,
          code: slide.code,
          questions: [] // Initialize with an empty questions array
        });

        // Create questions for the slide, passing the slideId
        const createdQuestions = await Promise.all(slide.questions.map(async (question) => {
          // Add the slideId to the question
          const createdQuestion = await Question.create({ 
            ...question, 
            slideId: createdSlide._id // Use the newly created slide's ID
          });
          return createdQuestion._id; // Return the ID of the created question
        }));

        // Update the slide to include the questions
        createdSlide.questions = createdQuestions;
        await createdSlide.save(); // Save the updated slide with questions

        return createdSlide; // Return the created slide
      }));

      // Create the level and associate it with its slides
      return await Level.create({
        title: level.title,
        slides: createdSlides.map(s => s._id),
      });
    }));

    // Create the Course and associate it with its levels
    const course = await Course.create({
      title,
      description,
      language,
      levels: createdLevels.map(l => l._id),
    });

    res.status(201).json({ message: 'Course created successfully!', course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create course', error });
  }
};

exports.getCourse = async (req, res) => {
    const courseId = req.params.id; // Get the course ID from the URL parameters
  
    try {
      // Populate levels and their associated slides and questions
      const course = await Course.findById(courseId)
        .populate({
          path: 'levels',
          populate: {
            path: 'slides',
            populate: {
              path: 'questions',
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
      // Fetch courses and populate levels for more details
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