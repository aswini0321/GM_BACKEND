const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();

const PDFCO_API_KEY = process.env.PDFCO_API_KEY; // stored api key

const ParsePDF = async (fileBuffer) => {
  try {
    const formData = new FormData();
    formData.append("file", fileBuffer, "uploaded.pdf"); // Attach the file buffer

    const uploadResponse = await axios.post("https://api.pdf.co/v1/file/upload", formData, {
      headers: {
        "x-api-key": PDFCO_API_KEY,
        "Content-Type": "multipart/form-data",
        ...formData.getHeaders(),
      },
    });

    if (uploadResponse.data.error) {
      throw new Error(uploadResponse.data.message || "Error uploading file to PDF.co");
    }

    const uploadedFileUrl = uploadResponse.data.url;

    // Convert uploaded PDF to text
    const conversionResponse = await axios.post(
      "https://api.pdf.co/v1/pdf/convert/to/text",
      { url: uploadedFileUrl },
      {
        headers: {
          "x-api-key": PDFCO_API_KEY,
        },
      }
    );

    if (conversionResponse.data.error) {
      throw new Error(conversionResponse.data.message || "Error converting PDF to text");
    }

    // Retrieve the parsed text from the URL
    const parsedTextUrl = conversionResponse.data.url;
    const textResponse = await axios.get(parsedTextUrl);
    const parsedText = textResponse.data;
    console.log(parsedText);

    // Convert the parsed text to JSON
    const parsedJson = convertTextToJson(parsedText);

    console.log(parsedJson); // Return the JSON object
    return parsedJson;
  } catch (error) {
    console.error("Error in parsePDF:", error.message || error);
    throw error;
  }
};

// Function to convert text to JSON
const convertTextToJson = (text) => {
  const questions = [];
  const lines = text.split("\n");

  let currentQuestion = null;

  lines.forEach((line) => {
    line = line.trim();

    // If the line starts with a "Q" (e.g., "Sample Question 1:")
    if (line.startsWith("Sample Question")) {
      // If a current question exists, push it to the questions array
      if (currentQuestion) {
        questions.push(currentQuestion);
      }

      // Create a new question object with the question text
      currentQuestion = { 
        question: line.replace("Sample Question", "").trim(),
        options: []
      };
    } else if (line && currentQuestion) {
      // Push the option to the current question's options array
      currentQuestion.options.push(line);
    }
  });

  // Push the last question
  if (currentQuestion) questions.push(currentQuestion);

  return questions; // Return as an array of question objects
};

module.exports = ParsePDF;
