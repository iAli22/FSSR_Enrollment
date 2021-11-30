import mongoose from "mongoose";

const studentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    fullNameEn: {
      type: String,
      required: true,
    },
    fullNameAr: {
      type: String,
      required: true,
    },
    nid: {
      type: String,
      required: true,
      unique: true,
    },
    birthday: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    militaryStatus: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    gradYear: {
      type: Number,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    major: {
      type: mongoose.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    minor: {
      type: mongoose.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    level: {
      type: Number,
      required: true,
      default: 1,
      enum: [1, 2, 3, 4],
    },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
