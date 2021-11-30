import mongoose from 'mongoose';

const courseSchema = mongoose.Schema(
  {
    subject: {
      type: mongoose.Types.ObjectId,
      ref: 'Subject',
      required: true
    },
    instructor: {
      type: String,
      required: true
    },
    semester: {
      type: mongoose.Types.ObjectId,
      ref: 'Semester',
      required: true
    }
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);

export default Course;
