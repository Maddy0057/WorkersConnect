const mongoose = require('mongoose');

// Worker Schema
const workerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  profilePicture: { type: String, required: true }, // Google Drive URL
  category: { type: String, required: true }, // e.g., "Plumbing", "Electrical", etc.
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
  },
  about: { type: String, required: true },
 
  bestWorks: [{
    title: { type: String, required: true, minlength: 0, maxlength: 25 },
    imageUrl: { type: String, required: true }, // Google Drive URL
  }],
  
  // Reviews for the worker
  reviews: [{
    reviewerName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true , minlength: 0, maxlength: 25},
    date: { type: Date, required: true }
  }],
  
  badges: [{ type: String }], // e.g., ["Verified Professional", "Licensed", "Insured"]
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Request Schema
const requestSchema = new mongoose.Schema({
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true, match: /.+\@.+\..+/ },
  message: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now }
});

// Export Models
module.exports = {
  Worker: mongoose.model('Worker', workerSchema),
  Request: mongoose.model('Request', requestSchema)
};
