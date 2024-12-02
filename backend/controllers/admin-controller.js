const bcrypt = require('bcrypt');
const Admin = require('../models/adminSchema.js');
const Sclass = require('../models/sclassSchema.js');
const Student = require('../models/studentSchema.js');
const Teacher = require('../models/teacherSchema.js');
const Subject = require('../models/subjectSchema.js');
const Notice = require('../models/noticeSchema.js');
const Complain = require('../models/complainSchema.js');


// const adminRegister = async (req, res) => {
//     try {
//         const salt = await bcrypt.genSalt(10);
//         const hashedPass = await bcrypt.hash(req.body.password, salt);

//         const admin = new Admin({
//             ...req.body,
//             password: hashedPass
//         });

//         const existingAdminByEmail = await Admin.findOne({ email: req.body.email });
//         const existingSchool = await Admin.findOne({ schoolName: req.body.schoolName });

//         if (existingAdminByEmail) {
//             res.send({ message: 'Email already exists' });
//         }
//         else if (existingSchool) {
//             res.send({ message: 'School name already exists' });
//         }
//         else {
//             let result = await admin.save();
//             result.password = undefined;
//             res.send(result);
//         }
//     } catch (err) {
//         res.status(500).json(err);
//     }
// };

// const adminLogIn = async (req, res) => {
//     if (req.body.email && req.body.password) {
//         let admin = await Admin.findOne({ email: req.body.email });
//         if (admin) {
//             const validated = await bcrypt.compare(req.body.password, admin.password);
//             if (validated) {
//                 admin.password = undefined;
//                 res.send(admin);
//             } else {
//                 res.send({ message: "Invalid password" });
//             }
//         } else {
//             res.send({ message: "User not found" });
//         }
//     } else {
//         res.send({ message: "Email and password are required" });
//     }
// };

const adminRegister = async (req, res) => {
    try {
        const admin = new Admin({
            ...req.body
        });

        const existingAdminByEmail = await Admin.findOne({ email: req.body.email });
        const existingSchool = await Admin.findOne({ schoolName: req.body.schoolName });

        if (existingAdminByEmail) {
            res.send({ message: 'Email already exists' });
        }
        else if (existingSchool) {
            res.send({ message: 'School name already exists' });
        }
        else {
            let result = await admin.save();
            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const adminLogIn = async (req, res) => {
    if (req.body.email && req.body.password) {
        let admin = await Admin.findOne({ email: req.body.email });
        if (admin) {
            if (req.body.password === admin.password) {
                admin.password = undefined;
                res.send(admin);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "User not found" });
        }
    } else {
        res.send({ message: "Email and password are required" });
    }
};

const getAdminDetail = async (req, res) => {
    try {
        let admin = await Admin.findById(req.params.id);
        if (admin) {
            admin.password = undefined;
            res.send(admin);
        }
        else {
            res.send({ message: "No admin found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

// const deleteAdmin = async (req, res) => {
//     try {
//         const result = await Admin.findByIdAndDelete(req.params.id)

//         await Sclass.deleteMany({ school: req.params.id });
//         await Student.deleteMany({ school: req.params.id });
//         await Teacher.deleteMany({ school: req.params.id });
//         await Subject.deleteMany({ school: req.params.id });
//         await Notice.deleteMany({ school: req.params.id });
//         await Complain.deleteMany({ school: req.params.id });

//         res.send(result)
//     } catch (error) {
//         res.status(500).json(err);
//     }
// }

// const updateAdmin = async (req, res) => {
//     try {
//         if (req.body.password) {
//             const salt = await bcrypt.genSalt(10)
//             res.body.password = await bcrypt.hash(res.body.password, salt)
//         }
//         let result = await Admin.findByIdAndUpdate(req.params.id,
//             { $set: req.body },
//             { new: true })

//         result.password = undefined;
//         res.send(result)
//     } catch (error) {
//         res.status(500).json(err);
//     }
// }

// module.exports = { adminRegister, adminLogIn, getAdminDetail, deleteAdmin, updateAdmin };

//newwww 

//&&&&&&&&&&&&*(*&^)

// const uploadStudents = async (req, res) => {
//   try {
//     const { students } = req.body;

//     if (!students || students.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No students data provided",
//       });
//     }

//     const processedStudents = [];
//     for (let studentData of students) {
//       const { Name, RollNumber, Password, Class } = studentData;

//       if (!Name || !RollNumber || !Password || !Class) {
//         return res.status(400).json({
//           success: false,
//           message: "Missing required student data",
//         });
//       }

//       const sclass = await Sclass.findOne({ sclassName: Class });
//       if (!sclass) {
//         return res.status(404).json({
//           success: false,
//           message: `Class ${Class} not found`,
//         });
//       }

//       const existingStudent = await Student.findOne({
//         rollNum: RollNumber,
//         school: "673da56b7d5944206df1e7f3",
//       });
//       if (existingStudent) {
//         return res.status(400).json({
//           success: false,
//           message: `Student with roll number ${RollNumber} already exists`,
//         });
//       }

//       const newStudent = new Student({
//         name: Name,
//         rollNum: RollNumber,
//         password: Password,
//         sclassName: sclass._id,
//         school: "673da56b7d5944206df1e7f3",
//       });

//       await newStudent.save();
//       processedStudents.push(newStudent);
//     }

//     return res.status(201).json({
//       success: true,
//       message: `${processedStudents.length} students uploaded successfully`,
//       students: processedStudents,
//     });
//   } catch (error) {
//     console.error("Error uploading students:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };


const uploadStudents = async (req, res) => {
  try {
    const { students } = req.body;

    if (!students || students.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No students data provided",
      });
    }

    const processedStudents = [];
    for (let studentData of students) {
      const { Name, RollNumber, Password, Class } = studentData;

      if (!Name || !RollNumber || !Password || !Class) {
        return res.status(400).json({
          success: false,
          message: "Missing required student data",
        });
      }

      const sclass = await Sclass.findOne({ sclassName: Class });
      if (!sclass) {
        return res.status(404).json({
          success: false,
          message: `Class ${Class} not found`,
        });
      }

      const existingStudent = await Student.findOne({
        rollNum: RollNumber,
        school: "673da56b7d5944206df1e7f3",
      });
      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: `Student with roll number ${RollNumber} already exists`,
        });
      }

      // Hash the password using bcrypt
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(Password, saltRounds);

      const newStudent = new Student({
        name: Name,
        rollNum: RollNumber,
        password: hashedPassword,
        sclassName: sclass._id,
        school: "673da56b7d5944206df1e7f3",
      });

      await newStudent.save();
      processedStudents.push(newStudent);
    }

    return res.status(201).json({
      success: true,
      message: `${processedStudents.length} students uploaded successfully`,
      students: processedStudents,
    });
  } catch (error) {
    console.error("Error uploading students:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = { adminRegister, adminLogIn, getAdminDetail,uploadStudents};
