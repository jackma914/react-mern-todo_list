const Validator = require("validator");
const isEmpty = require("./isEmpty");

const validateToDoInput = (data) => {
  let errors = {};

  //check content field
  if (isEmpty(data.content)) {
    errors.content = "콘텐츠 필드는 비워둘 수 없습니다.";
  } else if (!Validator.isLength(data.content, { min: 1, max: 300 })) {
    errors.content = "콘텐츠 필드는 1~300자 사이여야 합니다.";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = validateToDoInput;
