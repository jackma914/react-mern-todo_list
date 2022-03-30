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

// @route   POST /api/todos/new
// @설명    새로운 todo 생성
// @access  Private
router.post("/new", requiresAuth, async (req, res) => {
  try {
    // todo 유효성 검사입니다.
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

// @route   GET /api/todos/current
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

// @route   PUT /api/todos/:toDoId/complete
// @설명    todo를 완료 표시
// @access  Private
router.put("/:toDoId/complete", requiresAuth, async (req, res) => {
  try {
    const toDo = await ToDo.findOne({
      user: req.user._id,
      _id: req.params.toDoId,
    });

    if (!toDo) {
      return res.status(404).json({ error: "todo를 찾을 수 없습니다." });
    }

    if (toDo.complete) {
      return res.status(400).json({ error: "todo는 이미 완료되었습니다. " });
    }

    const updatedToDo = await ToDo.findOneAndUpdate(
      {
        user: req.user._id,
        _id: req.params.toDoId,
      },
      {
        complete: true,
        completedAt: new Date(),
      },
      {
        //  업데이트 된 새 문서를 반환하려면 new속성이로 설정된 객체를 추가 인수로 전달해야합니다
        new: true,
      }
    );

    console.log(updatedToDo);
    return res.json(updatedToDo);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

// @route   PUT /api/todos/:toDoId/incomplete
// @설명    todo를  미완료 표시
// @access  Private
router.put("/:toDoId/incomplete", requiresAuth, async (req, res) => {
  try {
    const toDo = await ToDo.findOne({
      user: req.user._id,
      _id: req.params.toDoId,
    });

    if (!toDo) {
      return res.status(404).json({ error: "todo를 찾지 못했습니다." });
    }

    if (!toDo.complete) {
      return res.status(400).json({ error: "todo는 이미 미완료 입니다." });
    }

    const updatedToDo = await ToDo.findOneAndUpdate(
      {
        user: req.user._id,
        _id: req.params.toDoId,
      },
      {
        complete: false,
        completedAt: null,
      },
      {
        new: true,
      }
    );
    console.log(updatedToDo);
    return res.json(updatedToDo);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

// @route   PUT /api/todos/:toDoId/
// @설명    업데이트 todo
// @access  Private
router.put("/:toDoId", requiresAuth, async (req, res) => {
  try {
    const toDo = await ToDo.findOne({
      user: req.user._id,
      _id: req.params.toDoId,
    });

    if (!toDo) {
      return res.status(404).json({ error: "todo를 찾지 못하였습니다." });
    }

    const { isValid, errors } = validateToDoInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const updatedToDo = await ToDo.findOneAndUpdate(
      {
        user: req.user._id,
        _id: req.params.toDoId,
      },
      {
        content: req.body.content,
      },
      {
        new: true,
      }
    );

    return res.json(updatedToDo);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

// @route   PUT /api/todos/:toDoId
// @설명    todo 삭제
// @access  Private
router.delete("/:toDoId", requiresAuth, async (req, res) => {
  try {
    const toDo = await ToDo.findOne({
      user: req.user._id,
      _id: req.params.toDoId,
    });
    if (!toDo) {
      return res.status(404).json({ error: "todo를 찾지 못하였습니다." });
    }

    await ToDo.findOneAndRemove({
      user: req.user._id,
      _id: req.params.toDoId,
    });

    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

module.exports = router;
