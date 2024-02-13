const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: {
      value: true,
      message: 'Поле country является обязательным',
    },
  },
  director: {
    type: String,
    required: {
      value: true,
      message: 'Поле director является обязательным',
    },
  },
  duration: {
    type: Number,
    required: {
      value: true,
      message: 'Поле duration является обязательным',
    },
  },
  year: {
    type: String,
    required: {
      value: true,
      message: 'Поле year является обязательным',
    },
  },
  description: {
    type: String,
    required: {
      value: true,
      message: 'Поле description является обязательным',
    },
  },
  image: {
    type: String,
    required: {
      value: true,
      message: 'Поле image является обязательным',
    },
    validate: {
      validator: (link) => validator.isURL(link),
      message: (props) => `${props.value} неверный формат ссылки`,
    },
  },
  trailerLink: {
    type: String,
    required: {
      value: true,
      message: 'Поле trailerLink является обязательным',
    },
    validate: {
      validator: (link) => validator.isURL(link),
      message: (props) => `${props.value} неверный формат ссылки`,
    },
  },
  thumbnail: {
    type: String,
    required: {
      value: true,
      message: 'Поле thumbnail является обязательным',
    },
    validate: {
      validator: (link) => validator.isURL(link),
      message: (props) => `${props.value} неверный формат ссылки`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: {
      value: true,
      message: 'Поле owner является обязательным',
    },
    ref: 'user',
  },
  movieId: {
    type: Number,
    required: {
      value: true,
      message: 'Поле movieId является обязательным',
    },
  },
  nameRU: {
    type: String,
    required: {
      value: true,
      message: 'Поле nameRU является обязательным',
    },
  },
  nameEN: {
    type: String,
    required: {
      value: true,
      message: 'Поле ameEN является обязательным',
    },
  },
});

module.exports = mongoose.model('movie', movieSchema);
