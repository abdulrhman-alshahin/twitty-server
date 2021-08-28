const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/valedators");
const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");

const generateToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

module.exports = {
  Mutation: {
    register: async (
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) => {
      // validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("validation error", {
          errors,
        });
      }
      // make sure user doesn't already exist
      if (await User.findOne({ username })) {
        throw new UserInputError("username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      } else if (await User.findOne({ email })) {
        throw new UserInputError("email is already registerd", {
          errors: {
            email: "email is already registerd",
          },
        });
      }
      //hash password and create an auth token
      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        password,
        username,
        createdAt: new Date().toISOString(),
      });
      const user = await newUser.save();
      const token = generateToken(user);
      return { ...user._doc, id: user.id, token };
    },
    login: async (_, { loginInput: { username, password } }) => {
      const { valid, errors } = validateLoginInput(username, password);
      if (!valid) {
        throw new UserInputError("validation error", { errors });
      }
      const user = await User.findOne({ username });
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("user not found", { errors });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong crendetials";
        throw new UserInputError("Wrong crendetials", { errors });
      }
      const token = generateToken(user);
      return { ...user._doc, id: user.id, token };
    },
  },
};
