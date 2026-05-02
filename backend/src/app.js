const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const authMiddleware = require("./middleware/auth.middleware");
const courseRoutes = require("./routes/course.routes");
const enrollmentRoutes = require("./routes/enrollment.routes");
const errorMiddleware = require("./middleware/error.middleware");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://course-managment-system.vercel.app",
];

// app.use(
//   cors({
//     origin: function (origin, callback) {

//       // allow requests with no origin
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },

//     credentials: true,
//   })
// );

// app.use(express.json());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/protected", authMiddleware);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/enrollments", enrollmentRoutes);


app.get(
  "/api/v1/protected",
  authMiddleware,
  (req, res) => {
    res.json({
      success: true,
      message: "Protected route accessed",
      user: req.user,
    });
  }
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Course Management API Running",
  });
});

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);




app.use(errorMiddleware);
module.exports = app;