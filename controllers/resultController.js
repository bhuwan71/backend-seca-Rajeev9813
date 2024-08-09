const Result = require("../models/resultModel");

// Get all results
const getResults = async (req, res) => {
  try {
    const results = await Result.find({}).populate("quizId", "quizName");
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single result by user ID
const getResult = async (req, res) => {
  const { id: userId } = req.params; // Assume id is the userId in this case
  try {
    // Find results for the particular user
    const results = await Result.find({ userId }).populate("quizId", "quizName");

    if (results.length === 0) {
      return res.status(404).json({ message: "No results found for this user" });
    }

    res.status(200).json({
      success: true,
      message: "Results fetched successfully!",
      results: results,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Create a new result
const createResult = async (req, res) => {
  try {
    const { userId, quizId, score } = req.body;

    if (!userId || !quizId || !score) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const result = await Result.create({
      userId,
      quizId,
      score,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user progress
const getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;

    const results = await Result.find({ userId }).populate("quizId", "quizName");

    if (!results.length) {
      return res.status(404).json({ message: "No results found for this user" });
    }

    const progress = results.map(result => {
      const [correct, total] = result.score.split("/").map(Number);
      return {
        quizName: result.quizId.quizName,
        correct,
        total,
        percentage: (correct / total) * 100,
      };
    });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getResults,
  getResult,
  createResult,
  getUserProgress,
};
