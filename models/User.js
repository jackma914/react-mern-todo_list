const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// export the model
const User = model("User", UserSchema);
module.exports = User;

// required:꼭 입력해야 한다.
// unique:다른 행과 중복되면 안 된다.
// trim:공백을 제거합니다.(문자열 타입에 사용)
// default:문서가 생성되면 기본값으로 저장됩니다.
// lowercase:대문자를 소문자로 저장한다(문자열 타입)
// match:정규식으로 저장하려는 값과 비교한다.
// validate:함수로 개발자가 조건을 만듭니다.
// set:값을 입력할 때 함수로 조건을 만듭니다.
// get:값을 출력할 때 함수로 조건을 만듭니다.
// ref:해당하는 모델을 참조할 때 사용한다.
