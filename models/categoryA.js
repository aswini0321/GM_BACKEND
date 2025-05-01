const mongoose = require('mongoose');

const CategoryASchema = new mongoose.Schema({
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
    ownershipDetails: { type: String },
    layoutNo: { type: String },
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

// Use the Object type or subdocument type
const CategoryA = mongoose.model('CategoryA', CategoryASchema);

module.exports = CategoryA;
