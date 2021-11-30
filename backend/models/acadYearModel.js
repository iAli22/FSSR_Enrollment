import mongoose from 'mongoose';

const acadYearSchema = mongoose.Schema(
  {
    year: {
      type: String,
      required: true,
      unique: true
    },
    semesters: [{ type: mongoose.Types.ObjectId, ref: 'Semester' }]
  },
  { timestamps: true }
);

const AcadYear = mongoose.model('AcadYear', acadYearSchema);

export default AcadYear;
