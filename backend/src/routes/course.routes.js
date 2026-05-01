const express = require("express");

const {
  createCourse,
  getCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/course.controller");

const authMiddleware = require("../middleware/auth.middleware");

const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

// public routes
router.get("/", getCourses);

router.get("/:id", getSingleCourse);

// admin routes
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createCourse
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateCourse
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteCourse
);

module.exports = router;