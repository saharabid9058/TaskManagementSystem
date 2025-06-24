const mongoose = require('mongoose');

const checklistItemSchema = new mongoose.Schema({
  item: String,
  checked: { type: Boolean, default: false }
});

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: { type: Date, required: true },
  checklist: [checklistItemSchema],  
  userId: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'missed'], 
    default: 'pending' 
  }
}, { timestamps: true });


taskSchema.pre('save', function (next) {
  if (this.status !== 'completed' && new Date(this.dueDate) < new Date()) {
    this.status = 'missed';
  }
  next();
});

taskSchema.statics.updateMissedTasks = async function () {
  await this.updateMany(
    { status: { $ne: 'completed' }, dueDate: { $lt: new Date() } },
    { $set: { status: 'missed' } }
  );
};

module.exports = mongoose.model('Task', taskSchema);