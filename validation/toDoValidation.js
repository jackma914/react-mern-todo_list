const Validator = require("validator");
const isEmpty = require("./isEmpty");

const validateToDoInput = (data) => {
  let errors = {};

  // content 필드 확인
  if (isEmpty(data.content)) {
    errors.content = "입력칸은 비워둘수 없습니다.";
  } else if (!Validator.isLength(data.content, { mon: 1, max: 300 })) {
    errors.content = "입력칸은 1~300자 사이여야 합니다.";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = validateToDoInput;
