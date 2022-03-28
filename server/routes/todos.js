const express = require("express");
const router = express.Router();
const ToDo = require("../models/ToDo");
const requiresAuth = require("../middleware/permisstion");
const validateToDoInput = require("../validation/toDoValidation");

// @route   GET /apit/todos/test
// @설명    todos route 테스트
// @access  Public
router.get("/test", (req, res) => {
  res.send("todos 테스트");
});

// @route   POST /apit/todos/new
// @설명    새로운 todo 생성
// @access  Private
router.post("/new", requiresAuth, async (req, res) => {
  try {
    //todo 유효성 검사입니다.
    const { isValid, errors } = validateToDoInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    // 새로운 투두 생성
    const newToDo = new ToDo({
      user: req.user._id,
      content: req.body.content,
      complete: false,
    });

    // 투두 저장
    await newToDo.save();

    return res.json(newToDo);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

// @route   GET /apit/todos/current
// @설명    현재 사용자의 todos
// @access  Private
router.get("/current", requiresAuth, async (req, res) => {
  try {
    const completeToDos = await ToDo.find({
      user: req.user._id,
      complete: true,
    }).sort({ completedAt: -1 });

    const incompleteToDos = await ToDo.find({
      user: req.user._id,
      complete: false,
    }).sort({ createdAt: -1 });

    return res.json({ incomplete: incompleteToDos, complete: completeToDos });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

module.exports = router;
