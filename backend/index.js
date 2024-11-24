const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const bodyParser = require("body-parser");
const Routes = require("./routes/route.js");
const {studentAttendancenew} = require("./controllers/student_controller.js");
dotenv.config();
const http = require('http');
const Student = require('./models/studentSchema.js'); 
// const socketIo = require('socket.io');
const server = http.createServer(app);
// Remove the CORS configuration from the socketIo setup
// const io = socketIo(server, {
//   cors: {
//     origin: ['http://localhost:3000','http://localhost:3001'],
//     methods: ['GET', 'POST']
//   }
// });


// let teacherLocation = null; 
// let students = [];

// app.post('/api/teacher-location', (req, res) => {
//   teacherLocation = req.body; 
//   console.log("Teacher's Location:", teacherLocation);

//   io.emit('request-student-location', { teacherLocation });

//   res.status(200).send({ message: 'Teacher location received, notifying students' });
// });
// app.post('/api/student-location', (req, res) => {
//   const {  studentLocation } = req.body;
  
//   if (teacherLocation && studentLocation) {
//       const distance = calculateDistance(
//           teacherLocation.latitude,
//           teacherLocation.longitude,
//           studentLocation.latitude,
//           studentLocation.longitude
//       );
//       const isPresent = distance <= 30; 
//   }

//   res.status(200).send({ message: 'Student location received' });
// });
// const calculateDistance = (lat1, lon1, lat2, lon2) => {
//   const toRad = (x) => (x * Math.PI) / 180;
//   const R = 6371; 
//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lon2 - lon1);
//   const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
//       Math.sin(dLon / 2) * Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const distance = R * c * 1000; 
//   return distance;
// };

// io.on('connection', (socket) => {
//   console.log('A student connected');
//   students.push({ id: socket.id, location: null });
//   socket.on('disconnect', () => {
//       console.log('A student disconnected');
//   });
// });
const PORT = process.env.PORT || 6234;

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001"], // Frontend domain
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true, // Allow cookies or authorization headers
  preflightContinue: false, // Allow the preflight request to finish
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB DataBase"))
  .catch((err) => console.log("💥 NOT CONNECTED TO NETWORK : ", err));

app.use("/", Routes);
app.post("/atloc/:id", studentAttendancenew);

//#@
app.get('/student/:studentId/subjects', async (req, res) => {
  try {
      const studentId = req.params.studentId;

      // Find the student by ID and populate the subject names in the examResult field
      const student = await Student.findById(studentId).populate('examResult.subName'); // Populate subjects

      if (!student) {
          return res.status(404).json({ message: 'Student not found' });
      }

      // Extract the subjects from the student's examResult
      const subjects = student.examResult.map(result => ({
          subName: result.subName.name,  // Assuming 'name' is a field in the 'subject' model
          subId: result.subName._id
      }));

      res.json(subjects);
  } catch (error) {
      console.error('Error fetching subjects:', error);
      res.status(500).json({ message: 'Server Error' });
  }
});


// Test an OPTIONS route explicitly if needed
app.options("/AdminReg", cors(corsOptions)); // Handle OPTIONS preflight

app.listen(PORT, () => {
  console.log(`✅ Server started at port no. ${PORT}`);
});
