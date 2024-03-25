const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  companyName: {
    type: String,
    required: [true, "Please add a company name"],
    maxLength: 40,
  },
  username: {
    type: String,
    required: [true, "Please add a username"],
    unique: true,
    maxLength: 40,
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: /^\S+@\S+\.\S+$/,
    maxLength: 100,
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minLength: 8,
    maxLength: 300,
  },
  organizationType: {
    type: String,
    maxLength: 50,
  },
  cityMunicipality: {
    type: String,
    maxLength: 50,
  },
  province: {
    type: String,
    maxLength: 50,
  },
  image: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
    maxLength: 500,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
