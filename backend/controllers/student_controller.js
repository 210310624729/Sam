const bcrypt = require('bcrypt');
const Student = require('../models/studentSchema.js');
const Subject = require('../models/subjectSchema.js');
const Attendance = require("../models/studentSchema.js");

const studentRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const existingStudent = await Student.findOne({
            rollNum: req.body.rollNum,
            school: req.body.adminID,
            sclassName: req.body.sclassName,
        });

        if (existingStudent) {
            res.send({ message: 'Roll Number already exists' });
        }
        else {
            const student = new Student({
                ...req.body,
                school: req.body.adminID,
                password: hashedPass
            });

            let result = await student.save();

            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const studentLogIn = async (req, res) => {
    try {
        let student = await Student.findOne({ rollNum: req.body.rollNum, name: req.body.studentName });
        if (student) {
            const validated = await bcrypt.compare(req.body.password, student.password);
            if (validated) {
                student = await student.populate("school", "schoolName")
                student = await student.populate("sclassName", "sclassName")
                student.password = undefined;
                student.examResult = undefined;
                student.attendance = undefined;
                res.send(student);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "Student not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudents = async (req, res) => {
    try {
        let students = await Student.find({ school: req.params.id }).populate("sclassName", "sclassName");
        if (students.length > 0) {
            let modifiedStudents = students.map((student) => {
                return { ...student._doc, password: undefined };
            });
            res.send(modifiedStudents);
        } else {
            res.send({ message: "No students found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudentDetail = async (req, res) => {
    try {
        let student = await Student.findById(req.params.id)
            .populate("school", "schoolName")
            .populate("sclassName", "sclassName")
            .populate("examResult.subName", "subName")
            .populate("attendance.subName", "subName sessions");
        if (student) {
            student.password = undefined;
            res.send(student);
        }
        else {
            res.send({ message: "No student found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteStudent = async (req, res) => {
    try {
        const result = await Student.findByIdAndDelete(req.params.id)
        res.send(result)
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteStudents = async (req, res) => {
    try {
        const result = await Student.deleteMany({ school: req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No students found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteStudentsByClass = async (req, res) => {
    try {
        const result = await Student.deleteMany({ sclassName: req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No students found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

const updateStudent = async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            res.body.password = await bcrypt.hash(res.body.password, salt)
        }
        let result = await Student.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })

        result.password = undefined;
        res.send(result)
    } catch (error) {
        res.status(500).json(error);
    }
}

const updateExamResult = async (req, res) => {

    const { subName, marksObtained } = req.body;

    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.send({ message: 'Student not found' });
        }

        const existingResult = student.examResult.find(
            (result) => result.subName.toString() === subName
        );

        if (existingResult) {
            existingResult.marksObtained = marksObtained;
        } else {
            student.examResult.push({ subName, marksObtained });
        }

        const result = await student.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

//new marks schema controller 

// const updateExamResult = async (req, res) => {
//   const { subName, examType, examName, percentage } = req.body;

//   try {
//     const student = await Student.findById(req.params.id);

//     if (!student) {
//       return res.status(404).send({ message: "Student not found" });
//     }

//     // Find the exam result entry for the specified subject
//     let existingResult = student.examResult.find(
//       (result) => result.subName.toString() === subName
//     );

//     // If no entry exists for the subject, create a new one
//     if (!existingResult) {
//       existingResult = { subName, internalMarks: {}, externalMarks: {} };
//       student.examResult.push(existingResult);
//     }

//     // Update either internal or external marks based on `examType`
//     if (examType === "internal") {
//       existingResult.internalMarks.set(examName, percentage);
//     } else if (examType === "external") {
//       existingResult.externalMarks.set(examName, percentage);
//     } else {
//       return res.status(400).send({ message: "Invalid exam type" });
//     }

//     // Save the updated student document
//     const result = await student.save();
//     return res.status(200).send(result);
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while updating the exam result" });
//   }
// };


const studentAttendance = async (req, res) => {
    const { subName, status, date } = req.body;

    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.send({ message: 'Student not found' });
        }

        const subject = await Subject.findById(subName);

        const existingAttendance = student.attendance.find(
            (a) =>
                a.date.toDateString() === new Date(date).toDateString() &&
                a.subName.toString() === subName
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            // Check if the student has already attended the maximum number of sessions
            const attendedSessions = student.attendance.filter(
                (a) => a.subName.toString() === subName
            ).length;

            if (attendedSessions >= subject.sessions) {
                return res.send({ message: 'Maximum attendance limit reached' });
            }

            student.attendance.push({ date, status, subName });
        }

        const result = await student.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllStudentsAttendanceBySubject = async (req, res) => {
    const subName = req.params.id;

    try {
        const result = await Student.updateMany(
            { 'attendance.subName': subName },
            { $pull: { attendance: { subName } } }
        );
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllStudentsAttendance = async (req, res) => {
    const schoolId = req.params.id

    try {
        const result = await Student.updateMany(
            { school: schoolId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const removeStudentAttendanceBySubject = async (req, res) => {
    const studentId = req.params.id;
    const subName = req.body.subId

    try {
        const result = await Student.updateOne(
            { _id: studentId },
            { $pull: { attendance: { subName: subName } } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};


const removeStudentAttendance = async (req, res) => {
    const studentId = req.params.id;

    try {
        const result = await Student.updateOne(
            { _id: studentId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};
//new 

// In your studentController.js file

const getStudentAttendance = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('attendance.subName'); // Populate subject name

        if (!student) {
            return res.status(404).send({ message: 'Student not found' });
        }

        // Aggregate attendance data (count Present and Absent)
        const attendanceCount = student.attendance.reduce(
            (acc, curr) => {
                if (curr.status === 'Present') {
                    acc.present++;
                } else if (curr.status === 'Absent') {
                    acc.absent++;
                }
                return acc;
            },
            { present: 0, absent: 0 }
        );

        return res.status(200).json(attendanceCount); // Send the aggregated data
    } catch (error) {
        return res.status(500).json({ message: "Error fetching attendance data", error });
    }
};

//new implemenation



// Calculate attendance dynamically based on location
const getAttendanceWithLocation = async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Latitude and longitude are required." });
  }

  try {
    // Fetch all attendance records
    const attendanceRecords = await Attendance.find();

    // Example dynamic logic: calculate presence/absence based on a distance threshold
    const thresholdDistance = 5; // kilometers
    const userLocation = { latitude, longitude };

    // Sample logic to determine "Present" or "Absent" (replace with actual logic)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const toRad = (value) => (value * Math.PI) / 180;
      const R = 6371; // Earth's radius in kilometers
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const updatedAttendance = attendanceRecords.map((record) => {
      const sampleClassLocation = { latitude: 23.8103, longitude: 23.4125 }; // Replace with actual class location
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        sampleClassLocation.latitude,
        sampleClassLocation.longitude
      );

      const isPresent = distance <= thresholdDistance;
      return {
        ...record._doc,
        status: isPresent ? "Present" : "Absent",
      };
    });

    res.json(updatedAttendance);
  } catch (error) {
    res.status(500).json({ error: "Error calculating attendance with location." });
  }
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;  // Distance in kilometers
  };
  
  // Function to update student attendance based on location
  const updateAttendanceWithLocation = async (studentId, subName, date, latitude, longitude) => {
    try {
      // Fetch student by ID
      const student = await Student.findById(studentId);
      if (!student) {
        return { message: 'Student not found' };
      }
  
      // Fetch subject by ID
      const subject = await Subject.findById(subName);
      if (!subject) {
        return { message: 'Subject not found' };
      }
  
      // Check if attendance already exists for the given date and subject
      const existingAttendance = student.attendance.find(
        (a) =>
          a.date.toDateString() === new Date(date).toDateString() &&
          a.subName.toString() === subName
      );
  
      // Default status, will be updated based on distance
      let status = "Absent"; // Assume absent by default
  
      // Calculate distance between student location and class location
      const thresholdDistance = 5; // kilometers (threshold distance)
      const sampleClassLocation = { latitude: 23, longitude: 23}; // Example class location (replace with actual class location)
  
      const distance = calculateDistance(latitude, longitude, sampleClassLocation.latitude, sampleClassLocation.longitude);
  
      // If the student is within the threshold distance, mark as present
      if (distance <= thresholdDistance) {
        status = 'Present';
      }
  
      // If attendance already exists, update the status
      if (existingAttendance) {
        existingAttendance.status = status;
      } else {
        // If no previous attendance, add a new attendance record
        student.attendance.push({ date, status, subName });
      }
  
      // Save the updated student record
      await student.save();
  
      return { message: 'Attendance updated successfully', status };
  
    } catch (error) {
      console.error("Error updating student attendance:", error);
      throw new Error("Error updating attendance");
    }
  };
  
  // Main function to handle student attendance update
  const studentAttendancenew = async (req, res) => {
    const { subName, date, latitude, longitude } = req.body;
    const studentId = req.params.id; // Student ID should come from the route parameter
  
    try {
      const result = await updateAttendanceWithLocation(studentId, subName, date, latitude, longitude);
  
      // If there is an error or failure in the update, return the message
      if (result.message !== 'Attendance updated successfully') {
        return res.status(400).json({ message: result.message });
      }
  
      // If attendance is updated successfully, return the result
      return res.json({ message: result.message, status: result.status });
  
    } catch (error) {
      console.error("Error handling attendance:", error);
      res.status(500).json({ error: 'Failed to update attendance' });
    }
  };
  



module.exports = { getStudentAttendance };


module.exports = {
    studentAttendancenew,
    getAttendanceWithLocation,
    //old ones
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudents,
    deleteStudent,
    updateStudent,
    studentAttendance,
    deleteStudentsByClass,
    updateExamResult,

    clearAllStudentsAttendanceBySubject,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
    removeStudentAttendance,
    getStudentAttendance,
};