const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const availabilitySchema = new Schema({
  date: { type: Date, required: true },
  availableHours: { type: [String], default: [] } // '09:00', '09:30', etc.
});

const employeeSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ['partTime', 'part'] },
  availability: { type: [availabilitySchema], default: [] },
  unavailableDates: { type: [Date], default: [] } // For 'part'
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
