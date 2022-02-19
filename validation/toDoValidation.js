const Validator = require("validator");
const isEmpty = require("./isEmpty");

const valudateToDoInput = (data) => {
  let errors = {};

  // content 필드 확인
  if (isEmpty(data.content)) {
    errors.content = "Content 필드는 비워둘수 없습니다.";
  } else if (!Validator.isLength(data.content, { min: 1, max: 300 })) {
    errors.content =
      "Content 필드는 최소 1글자에서 300글자까지 입력가능합니다.";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = valudateToDoInput;
