const { Schema, model } = require("mongoose");

const ToDoSchema = new Schema(
  {
    user: {
      //mongoose.Schema.Types.ObjectId 라는 형식을 가지고 있습니다.
      //레퍼런스(ref) 로 모델을 가르키고 있는 형태입니다.
      //바로 User._id 를 보관하겠다는 것입니다.
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },

    // todo의 완료 여부를 표시할때 사용합니다.
    complete: {
      type: Boolean,
      default: false,
    },

    //
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// export the model

const ToDo = model("ToDo", ToDoSchema);
module.exports = ToDo;

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
