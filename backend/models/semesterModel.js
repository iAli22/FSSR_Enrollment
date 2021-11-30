import mongoose from 'mongoose';

const semesterSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ['first', 'second', 'summer']
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    isEnrollAvail: {
      type: Boolean,
      default: false
    },
    acadYear: {
      type: mongoose.Types.ObjectId,
      ref: 'AcadYear'
    },
    courses: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Course'
      }
    ]
  },
  { timestamps: true }
);

const Semester = mongoose.model('Semester', semesterSchema);

export default Semester;
