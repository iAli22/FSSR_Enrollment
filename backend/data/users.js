import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'admin'
  },
  {
    name: 'John',
    email: 'john@example.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'student'
  },
  {
    name: 'Jane',
    email: 'jane@example.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'student'
  }
];

export default users;
