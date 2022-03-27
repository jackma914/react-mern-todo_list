const Validator = require("validator");
const isEmpty = require("./isEmpty");

const validateRegisterInput = (data) => {
  let errors = {};

  // 이메일 필드 검사
  if (isEmpty(data.email)) {
    errors.email = "이메일은 비워둘수 없습니다.";
    //Validator의 isEmail 메서드를 이용해 email 양식을 검사합니다.
  } else if (!Validator.isEmail(data.email)) {
    errors.email =
      "이메일 양식이 잘못 되었습니다. 유요한 이메일 양식을 입력하세요.";
  }

  // 비밀번호 필드 검사
  if (isEmpty(data.password)) {
    errors.password = "비밀번호는 비워둘수 없습니다.";
    //Validator의 isLength 메서드를 이용해 password의 옵션인 6~150자 사이 인지를 검사합니다.
  } else if (!Validator.isLength(data.password, { min: 6, max: 150 })) {
    errors.password = "비밀번호는 6~150자 사이어야 합니다. ";
  }

  // 이름 필드 검사
  if (isEmpty(data.name)) {
    errors.name = "이름은 비워둘수 없습니다.";
    //Validator의 isLength 메서드를 이용해 password의 옵션인 6~150자 사이 인지를 검사합니다.
  } else if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "이름은 2~30자 사이어야 합니다. ";
  }

  //비밀번호 확인 필드 검사
  if (isEmpty(data.confirmPassword)) {
    errors.confirmPassword = "비밀번호 확인 필드는 비워둘수 없습니다.";
    //Validator의 equals 메서드를 이용해 password와 비교합니다.
  } else if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = "비밀번호와 일치하지 않습니다. ";
  }

  return {
    errors,

    // isValid는 errors 배열이 비어있는지를 확인합니다. 객체가 비어있다면 true를 반환합니다. 오류가 있으면 false를 반환합니다.
    isValid: isEmpty(errors),
  };
};

module.exports = validateRegisterInput;
