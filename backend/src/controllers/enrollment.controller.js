const prisma = require("../config/db");

const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // check course exists
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // check already enrolled
    const existingEnrollment =
      await prisma.enrollment.findFirst({
        where: {
          userId: req.user.id,
          courseId,
        },
      });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "Already enrolled",
      });
    }

    // create enrollment
    const enrollment =
      await prisma.enrollment.create({
        data: {
          userId: req.user.id,
          courseId,
        },
      });

    return res.status(201).json({
      success: true,
      message: "Course enrolled successfully",
      data: enrollment,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getMyEnrollments = async (req, res) => {
  try {
    const enrollments =
      await prisma.enrollment.findMany({
        where: {
          userId: req.user.id,
        },

        include: {
          course: true,
        },
      });

    return res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  enrollCourse,
  getMyEnrollments,
};