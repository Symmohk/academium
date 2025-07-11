const mongoose = require('mongoose');

const TutorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  curriculum: { type: String, enum: ['IGCSE', 'CBC', 'GCSE'], required: true },
  rating: { type: Number, default: 0 },
  sessions: { type: Number, default: 0 },
  hourlyRate: { type: Number, required: true },
  online: { type: Boolean, default: false },
  image: { type: String }
});

module.exports = mongoose.model('Tutor', TutorSchema);
