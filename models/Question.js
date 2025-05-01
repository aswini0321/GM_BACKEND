const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String]
});

const QuestionModel = mongoose.model("Question", questionSchema);
module.exports = QuestionModel;
