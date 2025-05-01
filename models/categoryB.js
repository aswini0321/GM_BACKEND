const mongoose = require('mongoose');

// Define the category schema
const categoryBSchema = new mongoose.Schema({
  mandal: String,
  gramPanchayat: String,
  propertyDetails: {
    description: String,
    surveyNo: String,
    extent: String,
    boundaries: String,
  },
  possessionDetails: {
    type: { type: String },  
    giftDetails: { type: String },  
    byWhom: { type: String },  
  },
  encroachmentDetails: {
    identified: Boolean,
    actionTaken: String,
  },
  photos: {
    beforePhoto: String,  
    afterPhoto: String,
  },
  remarks: String,
});

const CategoryB = mongoose.model('CategoryB', categoryBSchema);
module.exports = CategoryB;

