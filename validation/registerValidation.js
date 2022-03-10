const Validator = require("validator");
const isEmpty = require("./isEmpty");

const validateRegisterInput = (data) => {
  let errors = {};

  // 이메일 검사 필드
  // 이메일 칸이 비었는지를 검사하는 imEmpty를 이용해 검사합니다.
  if (isEmpty(data.email)) {
    errors.email = "이메일 필드는 비워둘 수 없습니다.";

    // Validator의 isEmail 메서드를 이용해서 이메일 양식을 검사합니다.
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "이메일이 잘못되었습니다. 유효한 이메일을 입력하세요.";
  }

  // 이름 검사 필드
  if (isEmpty(data.name)) {
    errors.name = " 이름 필드는 비워둘 수 없습니다.";

    // Validater의 isLength 메서드를 이용해 비밀번호의 최소,최대 숫자수를 정해서 검사할수 있습니다.
  } else if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "이름은 2~30자 사이여야 합니다.";
  }

  // 비밀번호 검사 필드
  if (isEmpty(data.password)) {
    errors.password = "비밀번호 입력란은 비워둘 수 없습니다.";

    // Validater의 isLength 메서드를 이용해 비밀번호의 최소,최대 숫자수를 정해서 검사할수 있습니다.
  } else if (!Validator.isLength(data.password, { min: 6, max: 150 })) {
    errors.password = "비밀번호는 6~150자 사이여야 합니다.";
  }

  // 비밀번호 확인 필드
  if (isEmpty(data.confirmPassword)) {
    errors.confirmPassword = "비밀번호 확인 필드는 비워둘 수 없습니다.";

    //Validator의 equals를 이용해서 비밀번호와 비밀번호 확인 필드를 비교해서 검사합니다.
  } else if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword =
      "비밀번호 및 비밀번호 확인 필드가 일치해야 합니다.";
  }

  return {
    errors,

    // isEmpty가 비어있으면 true를 반환합니다.
    isVlid: isEmpty(errors),
  };
};

module.exports = validateRegisterInput;
