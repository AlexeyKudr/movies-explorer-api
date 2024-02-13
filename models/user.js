const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    require: {
      value: true,
      message: 'Поле email является обязательным',
    },
    validate: {
      validator: validator.isEmail,
      message: 'Неправильно введен email',
    },
  },
  password: {
    type: String,
    select: false,
    require: {
      value: true,
      message: 'Поле password является обязательным',
    },
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Алексей',
  },
});

module.exports = mongoose.model('user', userSchema);
