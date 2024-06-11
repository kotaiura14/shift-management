const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  date: { type: String, required: true }, // Date型からString型に変更
  availableHours: [String]
});

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  availability: [availabilitySchema],
  unavailableDates: [String] // Date型からString型に変更
});

module.exports = mongoose.model('Employee', employeeSchema);
