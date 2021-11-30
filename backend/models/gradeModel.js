import mongoose from "mongoose";

const gradeSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Types.ObjectId,
      ref: "Student",
      required: true
    },
    course: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
      required: true
    },
    percent: {
      type: Number,
      default: null,
      min: 0,
      max: 100
    }
  },
  { timestamps: true }
);

const Grade = mongoose.model("Grade", gradeSchema);

export default Grade;
