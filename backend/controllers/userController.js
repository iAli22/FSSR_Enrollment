import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';
import Student from '../models/studentModel.js';

// @desc   Auth user & get token
// @route  POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password.');
  }
});

// @desc   Get logged in user
// @route  GET /api/users
// @access  Private
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    let student = {};
    if (user.role === 'student') {
      student = await Student.findOne({ user: user._id })
        .select('-_id -user -createdAt -updatedAt -__v')
        .populate('major', 'name')
        .populate('minor', 'name');
      student = student.toObject();
    }

    res.json({
      name: user.name,
      email: user.email,
      role: user.role,
      ...student
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { authUser, getUser };
