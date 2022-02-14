const Validator = require("validator");
const isEmpty = require("./isEmpty");

const validateRegisterInput = (data) => {
  let errors = {};

  //check the email field

  //데이터가 빈 데이터인지를 먼저 봅니다.
  if (isEmpty(data.email)) {
    errors.email = "Email field can not be empty";

    // isEmail은 이메일 형식을 검사합니다.
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid, please provide a valid email";
  }

  //check password field
  if (isEmpty(data.password)) {
    errors.password = "Password field can not be empty";
  } else if (!Validator.isLength(data.password, { min: 6, max: 150 })) {
    errors.password = "Password must be between 6 and 150 characters long";
  }

  //check name field
  if (isEmpty(data.name)) {
    errors.name = "Name field can not be empty";
  } else if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters long";
  }

  // check confirm password field
  if (isEmpty(data.confirmPassword)) {
    errors.confirmPassword = "Confirm Password field can not be empty";

    //password와 confirmPassword가 문자열이 일치하는지 검증합니다.
  } else if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = "Password and Confirm Password field must match";
  }

  return {
    errors,

    //isEmpty가 비어있으면 true를 반환합니다.
    isValid: isEmpty(errors),
  };
};

module.exports = validateRegisterInput;
