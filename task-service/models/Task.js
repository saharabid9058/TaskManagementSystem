const mongoose = require('mongoose');

const checklistItemSchema = new mongoose.Schema({ item: String, checked: { type: Boolean, default: false } });

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: { type: Date, required: true },
  checklist: [checklistItemSchema],
  userId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'missed'], default: 'pending' },
  aiRisk: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  aiPriority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  aiSuggestion: String
}, { timestamps: true });

taskSchema.statics.updateMissedTasks = async function() {
  const now = new Date();
  await this.updateMany({ dueDate: { $lt: now }, completed: false }, { status: 'missed' });
};

module.exports = mongoose.model('Task', taskSchema);
