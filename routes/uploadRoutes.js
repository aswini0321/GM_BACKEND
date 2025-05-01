const express = require("express");
const multer = require("multer");
const ParsePDF = require("../components/ParsePDF.js");
const QuestionModel = require("../models/Question.js"); // Import the Question model
const router = express.Router();

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to upload and parse PDF
router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const fileBuffer = req.file.buffer;
    const parsedJson = await ParsePDF(fileBuffer);

    // Optionally save questions to the database
    const savedQuestions = await QuestionModel.insertMany(parsedJson);

    res.json({
      message: "File uploaded, processed successfully, and questions saved to the database",
      questions: savedQuestions,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error processing PDF",
      details: error.message || "Unknown error",
    });
  }
});

// Route to get all questions
router.get("/questions", async (req, res) => {
  try {
    const questions = await QuestionModel.find();
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
