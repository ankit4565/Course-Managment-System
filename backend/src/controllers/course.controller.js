const prisma = require("../config/db");



const createCourse = async (req, res) => {
  try {
    const { title, description, price } = req.body;

    // validation
    if (!title || !description || !price) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // create course
    const course = await prisma.course.create({
      data: {
        title,
        description,
        price: parseFloat(price),

        createdBy: req.user.id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getSingleCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: {
        id,
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, description, price } = req.body;

    // check existing course
    const existingCourse = await prisma.course.findUnique({
      where: {
        id,
      },
    });

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // update course
    const updatedCourse = await prisma.course.update({
      where: {
        id,
      },

      data: {
        title,
        description,
        price: parseFloat(price),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // check existing course
    const existingCourse = await prisma.course.findUnique({
      where: {
        id,
      },
    });

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // delete course
    await prisma.course.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
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
  createCourse,
  getCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
};