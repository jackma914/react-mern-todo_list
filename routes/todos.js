const express = require("express");
const router = express.Router();
const ToDo = require("../models/ToDo");
const requiresAuth = require("../middleware/permission");
const validateToDoInput = require("../validation/toDoValidation");

// @route   GET / api/todos/test
// @desc    Test the todos route
// @access Public
router.get("/test", (req, res) => {
  res.send("Todos test");
});

// @route   POST / api/todos/new
// @desc    Create a new todo
// @access Public
router.post("/new", requiresAuth, async (req, res) => {
  try {
    const { isValid, errors } = validateToDoInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // new todo 생성
    const newToDo = new ToDo({
      user: req.user._id,
      content: req.body.content,
      complete: false,
    });

    // new todo 저장
    await newToDo.save();
    return res.json(newToDo);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

// @route   GET / api/todos/current
// @desc    Current users todos
// @access Private
router.get("/current", requiresAuth, async (req, res) => {
  try {
    console.log(req.user._id);
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

//
// todo 업데이트, 수정
// @route   PUT / api/todos/:toDoId/complete
// @desc    Mark a todo as complete
// @access Private
router.put("/:toDoId/complete", requiresAuth, async (req, res) => {
  try {
    const toDo = await ToDo.findOne({
      user: req.user._id,
      //params를 이용해서 /:toDoId의 id를 가져올수있습니다.
      _id: req.params.toDoId,
    });
    console.log(toDo);

    if (!toDo) {
      return res.status(404).json({ error: "Could not find ToDo" });
    }
    if (toDo.complete) {
      return res.status(400).json({ error: "ToDo is already complete" });
    }

    const updatedToDo = await ToDo.findByIdAndUpdate(
      {
        user: req.user._id,
        _id: req.params.toDoId,
      },
      {
        complete: true,
        completedAt: new Date(),
      },

      {
        //만약 Update를 실행한 뒤의 정보를 받고 싶다면 new 옵션을 사용해야합니다. { new: true }를 넣으면 수정 이후의 다큐먼트를 반환합니다.
        new: true,
      }
    );
    return res.json(updatedToDo);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

// @route   PUT / api/todos/:toDoId/incomplete
// @desc    Mark a todo as incomplete
// @access Private
router.put("/:toDoId/incomplete", requiresAuth, async (req, res) => {
  try {
    const toDo = await ToDo.findOne({
      user: req.user._id,
      _id: req.params.toDoId,
    });

    if (!toDo) {
      return res.status(404).json({ error: "Could not find ToDo" });
    }

    if (!toDo.complete) {
      return res.status(400).json({ error: "ToDo is already incomplete" });
    }

    const updatedToDo = await ToDo.findByIdAndUpdate(
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

    return res.json(updatedToDo);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

//
// todo content 수정
// @route   PUT / api/todos/:toDoId
// @desc    Update a todo
// @access  Private
router.put("/:toDoID", requiresAuth, async (req, res) => {
  try {
    const toDo = await ToDo.findOne({
      user: req.user._id,
      _id: req.params.toDoID,
    });
    if (!toDo) {
      return res.status(404).json({ error: "Could not find ToDo" });
    }

    const { isValid, errors } = validateToDoInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const updatedToDo = await ToDo.findByIdAndUpdate(
      {
        user: req.user._id,
        _id: req.params.toDoID,
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

//
// todo 삭제
// @route   DELETE / api/todos/:toDoId
// @desc    Delete a todo
// @access  Private
router.delete("/:toDoId", requiresAuth, async (req, res) => {
  try {
    const toDo = await ToDo.findOne({
      user: req.user._id,
      _id: req.params.toDoId,
    });

    if (!toDo) {
      return res.status(404).json({ error: " Could not find ToDo" });
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
