const mongoose = require('mongoose');

const CategoryCSchema = new mongoose.Schema({
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
    vestedDetails: { type: String },
    underWhom: { type: String },
  },
  encroachmentDetails: {
    identified: String,
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

// Use the Object type or subdocument type
const CategoryC = mongoose.model('CategoryC', CategoryCSchema);
module.exports = CategoryC;