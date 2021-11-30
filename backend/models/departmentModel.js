import mongoose from 'mongoose';

const derpartmentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    subjects: [
      {
        _id: false,
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subject',
          required: true
        },
        type: {
          type: String,
          required: true,
          enum: ['general', 'major', 'elective', 'minor']
        },
        level: {
          type: Number,
          enum: [1, 2, 3, 4]
        }
      }
    ]
  },
  { timestamps: true }
);

const Department = mongoose.model('Department', derpartmentSchema);

export default Department;
