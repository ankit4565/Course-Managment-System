const express = require("express");

const {
  enrollCourse,
  getMyEnrollments,
} = require("../controllers/enrollment.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// enroll course
router.post(
  "/:courseId",
  authMiddleware,
  enrollCourse
);

// get logged-in user enrollments
router.get(
  "/my-courses",
  authMiddleware,
  getMyEnrollments
);

module.exports = router;