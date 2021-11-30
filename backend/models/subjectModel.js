import mongoose from 'mongoose';

const subjectSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true
    },
    title: {
      type: String,
      required: true
    },
    credit: {
      type: Number,
      required: true,
      default: 3
    },
    prerequisite: {
      type: mongoose.Types.ObjectId,
      default: null,
      ref: 'Subject'
    }
  },
  { timestamps: true }
);

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;
