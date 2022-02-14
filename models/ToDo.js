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
    complete: {
      type: Boolean,
      default: false,
    },
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
