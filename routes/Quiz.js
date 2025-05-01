// const express = require("express");
// const multer = require("multer");
// const axios = require("axios");
// const FormData = require("form-data"); // Required for using FormData
// require("dotenv").config();
// const app = express();
// const cors = require("cors");
// app.use(cors());
// const router = express.Router();

// // Multer setup for file uploads (using memory storage)
// const storage = multer.memoryStorage(); // Store file in memory
// const upload = multer({ storage: storage });

// // PDF.co API setup
// const PDFCO_API_KEY = process.env.PDFCO_API_KEY; // Store your PDF.co API Key in .env

// // Endpoint to upload PDF and process it
// router.post("/upload", upload.single("pdf"), async (req, res) => {
//   try {
//     // Ensure a file was uploaded
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded." });
//     }

//     // Access the file buffer
//     const fileBuffer = req.file.buffer;

//     // Step 1: Upload the PDF file to PDF.co's temporary file storage
//     const formData = new FormData();
//     formData.append("file", fileBuffer, "uploaded.pdf"); // Attach the file buffer

//     const uploadResponse = await axios.post("https://api.pdf.co/v1/file/upload", formData, {
//       headers: {
//         "x-api-key": PDFCO_API_KEY, // Use your PDF.co API key
//         "Content-Type": "multipart/form-data", // Ensure proper headers for FormData
//         ...formData.getHeaders(),
//       },
//     });

//     // Log the upload response for debugging
//     console.log("Upload response:", uploadResponse.data);

//     // Step 2: Check if file upload was successful and get the URL
//     if (uploadResponse.data.error === false) {
//       const uploadedFileUrl = uploadResponse.data.url; // The URL of the uploaded file


//       // Step 3: Use the uploaded file URL to convert to text using PDF.co API
//       const conversionResponse = await axios.post("https://api.pdf.co/v1/pdf/convert/to/text", {
//         url: uploadedFileUrl, // URL of the uploaded file
//       }, {
//         headers: {
//           "x-api-key": PDFCO_API_KEY, // Use your PDF.co API key
//         },
//       });

//       // Log the conversion response
//       console.log("Conversion response:", conversionResponse.data);

//       // Handle success
//       if (conversionResponse.data.error === false) {
//         const parsedTextUrl = conversionResponse.data.url;

//         // Download the parsed text from the URL
//         const textResponse = await axios.get(parsedTextUrl);
        
//         // Now we have the parsed text
//         const pdfText = textResponse.data;
//         console.log("Parsed Text:", pdfText);
//         // Send back the extracted text or process it further
//         res.json({
//           message: "File uploaded and processed successfully",
//           text: pdfText, // Send back the extracted text or any further processed data
//         });
//       } else {
//         // Handle failure
//         res.status(500).json({
//           error: "Error with PDF.co text conversion API",
//           details: conversionResponse.data.message || "Unknown error",
//         });
//       }
//     } else {
//       // Handle file upload failure
//       res.status(500).json({
//         error: "Error with PDF.co file upload",
//         details: uploadResponse.data.message || "Unknown error",
//       });
//     }
//   } catch (error) {
//     // Log error details for debugging
//     console.error("Error processing PDF:", error.response ? error.response.data : error.message);

//     // Return error response
//     res.status(500).json({
//       error: "Error processing the PDF with PDF.co",
//       details: error.message || "Unknown error",
//     });
//   }
// });

// // Get all questions (if needed for other parts of your app)
// router.get("/questions", async (req, res) => {
//   try {
//     const questions = await QuestionModel.find();
//     res.status(200).json(questions);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;
