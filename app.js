require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const json2xls = require('json2xls');
const ExcelJS = require('exceljs');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB URI
const DB_URI = process.env.DB_URI;

// Connect to MongoDB
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define Schema for Categories A, B, and C
const categorySchema = new mongoose.Schema({
  mandal: String,
  gramPanchayat: String,
  propertyDetails: {
    description: String,
    surveyNo: String,
    extent: String,
    boundaries: String,
  },
  possessionDetails: {
    type: { type: String },  // 'Owned' / 'Gifted' / 'Vested' / 'Others'
    ownershipDetails: { type: String },  // How it is owned by the Panchayat
    layoutNo: { type: String },  // If through Layout, specify layout number
  },
  encroachmentDetails: {
    identified: Boolean,
    actionTaken: String,
  },
  photos: {
    beforePhoto: {
      lat: String,
      lon: String,
      photoUrl: String,
    },
    afterPhoto: {
      lat: String,
      lon: String,
      photoUrl: String,
    },
  },
  remarks: String,
});

const CategoryA = mongoose.model('CategoryA', categorySchema);
const CategoryB = mongoose.model('CategoryB', categorySchema);
const CategoryC = mongoose.model('CategoryC', categorySchema);

// Create Route for Category A
app.post('/category-a', async (req, res) => {
  try {
    const { mandal, gramPanchayat, propertyDetails, possessionDetails, encroachmentDetails, photos, remarks } = req.body;

    const newCategoryA = new CategoryA({
      mandal,
      gramPanchayat,
      propertyDetails,
      possessionDetails,
      encroachmentDetails,
      photos,
      remarks,
    });

    await newCategoryA.save();
    res.status(201).json({ success: true, message: 'Category A data saved successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to save Category A data.' });
  }
});

// Create Route for Category B
app.post('/category-b', async (req, res) => {
  try {
    const { mandal, gramPanchayat, propertyDetails, possessionDetails, encroachmentDetails, photos, remarks } = req.body;

    const newCategoryB = new CategoryB({
      mandal,
      gramPanchayat,
      propertyDetails,
      possessionDetails,
      encroachmentDetails,
      photos,
      remarks,
    });

    await newCategoryB.save();
    res.status(201).json({ success: true, message: 'Category B data saved successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to save Category B data.' });
  }
});

// Create Route for Category C
app.post('/category-c', async (req, res) => {
  try {
    const { mandal, gramPanchayat, propertyDetails, possessionDetails, encroachmentDetails, photos, remarks } = req.body;

    const newCategoryC = new CategoryC({
      mandal,
      gramPanchayat,
      propertyDetails,
      possessionDetails,
      encroachmentDetails,
      photos,
      remarks,
    });

    await newCategoryC.save();
    res.status(201).json({ success: true, message: 'Category C data saved successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to save Category C data.' });
  }
});

// Fetch Data for Category A
app.get('/category-a', async (req, res) => {
  try {
    const categoryAData = await CategoryA.find();
    res.status(200).json({ success: true, data: categoryAData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch Category A data.' });
  }
});

// Fetch Data for Category B
app.get('/category-b', async (req, res) => {
  try {
    const categoryBData = await CategoryB.find();
    res.status(200).json({ success: true, data: categoryBData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch Category B data.' });
  }
});

// Fetch Data for Category C
app.get('/category-c', async (req, res) => {
  try {
    const categoryCData = await CategoryC.find();
    res.status(200).json({ success: true, data: categoryCData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch Category C data.' });
  }
});
// Export specific category data to Excel with flattened column names and without photos
app.get('/export/:category', async (req, res) => {
  try {
    const { category } = req.params;
    let data = [];

    let model;
    if (category === 'a') model = CategoryA;
    else if (category === 'b') model = CategoryB;
    else if (category === 'c') model = CategoryC;
    else return res.status(400).json({ success: false, message: 'Invalid category' });

    const rawData = await model.find();

    // Flatten and exclude 'photos' field
    data = rawData.map(doc => {
      const obj = doc.toObject();
      delete obj.photos;  // Remove photos from export

      // Flatten the object keys
      return {
        'Mandal': obj.mandal,
        'Gram Panchayat': obj.gramPanchayat,
        'Property Description': obj.propertyDetails.description,
        'Survey No': obj.propertyDetails.surveyNo,
        'Extent': obj.propertyDetails.extent,
        'Boundaries': obj.propertyDetails.boundaries,
        'Possession Type': obj.possessionDetails.type,
        'Ownership Details': obj.possessionDetails.ownershipDetails,
        'Layout No': obj.possessionDetails.layoutNo,
        'Encroachment Identified': obj.encroachmentDetails.identified,
        'Encroachment Action Taken': obj.encroachmentDetails.actionTaken,
        'Remarks': obj.remarks
      };
    });

    const xls = json2xls(data);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=category_${category.toUpperCase()}_data.xlsx`);
    res.end(xls, 'binary');
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ success: false, message: 'Failed to export data.' });
  }
});

// Export Data to Excel
app.get('/export', async (req, res) => {
  try {
    const categoryAData = await CategoryA.find();
    const categoryBData = await CategoryB.find();
    const categoryCData = await CategoryC.find();

    const allData = {
      categoryA: categoryAData,
      categoryB: categoryBData,
      categoryC: categoryCData,
    };

    const xls = json2xls(allData);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader('Content-Disposition', 'attachment; filename=category_data.xlsx');
    res.end(xls, 'binary');
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to export data.' });
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
