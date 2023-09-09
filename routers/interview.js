const express = require("express");
const {
  addInterview,
  create,
  enrollInInterview,
  deallocate,
  editInterview,
  update,
  destroy
} = require("../controllers/interviewController");
const router = express.Router();

// redering add interview page
router.get("/add-interview", addInterview);

// creating a new interview
router.post("/create", create);

//rendering edit page
router.get("/edit-interview/:id",editInterview);

// updating the student
router.post("/update/:id", update);

// deleting a particular student
router.get("/destroy/:interviewId", destroy);

// enrolling student in an interview
router.post("/enroll-in-interview/:id", enrollInInterview);

// deallocate the student from the interview
router.get("/deallocate/:studentId/:interviewId", deallocate);

// exporting the router
module.exports = router;