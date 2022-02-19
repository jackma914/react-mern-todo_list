const Validator = require("validator");
const isEmpty = require("./isEmpty");

const validateRegisterInput = (data) => {
  let errors = {};

  // 이메일 검사 필드
  // 이메일 칸이 비었는지를 검사하는 imEmpty를 이용해 검사합니다.
  if (isEmpty(data.email)) {
    errors.email = "Email field can not be empty";

    // Validator의 isEmail 메서드를 이용해서 이메일 양식을 검사합니다.
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid, please provide a valid email";
  }

  // 이름 검사 필드
  if (isEmpty(data.name)) {
    errors.password = "Name field can not be empty";

    // Validater의 isLength 메서드를 이용해 비밀번호의 최소,최대 숫자수를 정해서 검사할수 있습니다.
  } else if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters long";
  }

  // 비밀번호 검사 필드
  if (isEmpty(data.password)) {
    errors.password = "Password field can not be empty";

    // Validater의 isLength 메서드를 이용해 비밀번호의 최소,최대 숫자수를 정해서 검사할수 있습니다.
  } else if (!Validator.isLength(data.password, { min: 6, max: 150 })) {
    errors.password = "Password must be between 6 and 150 characters long";
  }

  // 비밀번호 확인 필드
  if (isEmpty(data.confirmPassword)) {
    errors.confirmPassword = "Confirm Password field can not be empty";

    //Validator의 equals를 이용해서 비밀번호와 비밀번호 확인 필드를 비교해서 검사합니다.
  } else if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = "Password and Confirm Password fields must match";
  }

  return {
    errors,

    // isEmpty가 비어있으면 true를 반환합니다.
    isVlid: isEmpty(errors),
  };
};

module.exports = validateRegisterInput;
