const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    // 데이터베이스에 어떤 종류의 데이터를  저장할지를 정합니다.
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
    //createdAt, updatedAt 필드를 자동 생성합니다.
    timestamps: true,
  }
);
