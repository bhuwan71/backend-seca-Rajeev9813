const Quiz = require("../models/Quiz");

// Get all quizzes
const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({});
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single quiz by ID
const getQuiz = async (req, res) => {
  const quizId = req.params.id;
  try {
    const quiz = await Quiz.findById(quizId);
    res.status(201).json({
      success: true,
      message: "Quiz fetched successfully!",
      quiz: quiz,
    });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    // // Assuming there is a user field in quiz model to check ownership
    // if (quiz.user.toString() !== req.user.id) {
    //   return res.status(401).json({ message: "Not authorized" });
    // }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new quiz
const createQuiz = async (req, res) => {
  try {
    const {
      quizName,
      quizDescription,
      quizCategory,
      questions,
      duration,
      difficultyLevel,
      quizImage,
    } = req.body;

    if (
      !quizName ||
      !quizDescription ||
      !quizCategory ||
      !questions ||
      !duration
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const quiz = await Quiz.create({
      quizName,
      quizDescription,
      quizCategory,
      questions,
      duration,
      difficultyLevel,
      quizImage,
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a quiz by ID
const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (quiz.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a quiz by ID
const deleteQuiz = async (req, res) => {
  try {
    // Uncomment and modify the following lines if you have user authorization logic
    // if (quiz.user.toString() !== req.user.id) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Not authorized",
    //   });
    // }
    await Quiz.findByIdAndDelete(req.params.id);
    res.status(201).json({
      success: true,
      message: "Quiz deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
};
