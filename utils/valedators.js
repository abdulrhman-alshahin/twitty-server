module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};
  const regEx =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (username.trim() == "") {
    errors.username = "username must not be empty";
  }
  if (email.trim() == "") {
    errors.email = "email must not be empty";
  } else if (!email.match(regEx)) {
    errors.email = "email must be a valid email";
  }
  if (password.length < 8) {
    errors.password = "password must be more than 8 charecters";
  } else if (password != confirmPassword) {
    errors.confirmPassword = "password must match";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (username, password) => {
  const errors = {};
  if (username.trim() == "") {
    errors.username = "username must not be empty";
  }
  if (password == "") {
    errors.password = "password must not be empty";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
