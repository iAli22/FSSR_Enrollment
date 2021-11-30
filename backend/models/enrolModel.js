import mongoose from 'mongoose';

const enrolSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    courses: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Course'
      }
    ],
    semester: {
      type: mongoose.Types.ObjectId,
      ref: 'Semester',
      required: true
    },
    isApproved: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Enrolment = mongoose.model('Enrolment', enrolSchema);

export default Enrolment;
