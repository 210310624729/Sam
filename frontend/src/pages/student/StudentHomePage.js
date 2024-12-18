import React, { useEffect, useState, useMemo } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import styled from "styled-components";
import { getUserDetails } from "../../redux/userRelated/userHandle";
import { getSubjectList } from "../../redux/sclassRelated/sclassHandle";
// import io from 'socket.io-client';

// const socket = io('http://localhost:2003');  

const StudentHomePage = () => {
  const dispatch = useDispatch();
  const [studentLocation, setStudentLocation] = useState(null);
  const [isPresent, setIsPresent] = useState(null);
//   useEffect(() => {
//     // Listen for the request to provide location
//     socket.on('request-student-location', () => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const { latitude, longitude } = position.coords;
//                     setStudentLocation({ latitude, longitude });

//                     // Send student location to backend
//                     fetch('http://localhost:2003/api/student-location', {
//                         method: 'POST',
//                         headers: {
//                             'Content-Type': 'application/json',
//                         },
//                         body: JSON.stringify({ studentLocation: { latitude, longitude } }),
//                     }).then(response => response.json())
//                       .then(data => {
//                           console.log(data.message);
//                           setIsPresent(true)
//                           // Optionally, handle attendance response
//                       });
//                 },
//                 (error) => {
//                     console.error("Error getting student's location:", error.message);
//                 }
//             );
//         }
//     });
// }, []);



  // Redux state
  const { currentUser, userDetails } = useSelector((state) => state.user);
  const { subjectsList } = useSelector((state) => state.sclass);

  // Local state
  const [studyPlanner, setStudyPlanner] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [studyHours, setStudyHours] = useState(0);
  const [timeAllocation, setTimeAllocation] = useState([]);

  const classID = currentUser?.sclassName?._id;



  // Fetch user details and subjects
  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getUserDetails(currentUser._id, "Student"));
    }
    if (classID) {
      dispatch(getSubjectList(classID, "ClassSubjects"));
    }
  }, [dispatch, currentUser?._id, classID]);

  // Process attendance and study planner data
  useEffect(() => {
    if (userDetails) {
      const attendance = userDetails.attendance || [];
      const examResults = userDetails.examResult || [];

      console.log(attendance);
      

      const totalClasses = attendance.length;

      // Count number of "Present" statuses
      const presentCount = attendance.filter(
        ({ status }) => status === "Present"
      ).length;

      console.log("totalClasses", totalClasses);
      console.log("presentCount", presentCount);

      // Calculate attendance percentage
      const attendancePercentage =
        totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

      console.log("attendancePercentage", attendancePercentage);

      // Prepare data for chart
      const attendanceData = [
        { name: "Present", value: attendancePercentage },
        { name: "Absent", value: 100 - attendancePercentage },
      ];

      setAttendanceData(attendanceData);

      // Study planner chart data
      if (examResults.length > 0) {
        const totalMarks = examResults.reduce(
          (sum, sub) => sum + (sub.marksObtained || 0),
          0
        );
        const plannerData = examResults.map((subject) => ({
          subject: subject.subName?.subName || "Unknown",
          timePercentage:
            ((totalMarks - (subject.marksObtained || 0)) / totalMarks) * 100,
        }));
        setStudyPlanner(plannerData);
      }
    }
  }, [userDetails]);

  // Calculate time allocation based on study hours
  useEffect(() => {
    if (studyHours > 0) {
      const allocation = studyPlanner.map((subject) => ({
        subject: subject.subject,
        time: ((studyHours * subject.timePercentage) / 100).toFixed(1), // Hours per subject
      }));
      setTimeAllocation(allocation);
    }
  }, [studyHours, studyPlanner]);

  // Dynamic colors for study planner subjects
  const COLORS = useMemo(
    () =>
      Array.from(
        { length: studyPlanner.length },
        (_, i) => `hsl(${(i * 360) / studyPlanner.length}, 70%, 60%)`
      ),
    [studyPlanner.length]
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Study Planner Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Study Planner
            </Typography>
            {studyPlanner.length > 0 ? (
              <PieChart width={400} height={300}>
                <Pie
                  data={studyPlanner}
                  dataKey="timePercentage"
                  nameKey="subject"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ subject, timePercentage }) =>
                    `${subject}: ${timePercentage.toFixed(1)}%`
                  }
                >
                  {studyPlanner.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            ) : (
              <Typography variant="h6">No Study Data Found</Typography>
            )}
          </Paper>
        </Grid>

        {/* Attendance Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Attendance Chart
            </Typography>
            {attendanceData.length > 0 ? (
              <PieChart width={400} height={300}>
                <Pie
                  data={attendanceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  <Cell fill="#4CAF50" /> {/* Green */}
                  <Cell fill="#F44336" /> {/* Red */}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            ) : (
              <Typography variant="h6">No Attendance Data Found</Typography>
            )}
          </Paper>
        </Grid>

        {/* Study Hours Allocation */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Enter Study Hours to Allocate Time
            </Typography>
            <TextField
              type="number"
              label="Study Hours"
              variant="outlined"
              value={studyHours}
              onChange={(e) => setStudyHours(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={() => setTimeAllocation([])} // Reset time allocation if needed
            >
              Calculate Allocation
            </Button>
            {timeAllocation.length > 0 && (
              <div>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Time Allocation Per Subject
                </Typography>
                <ul>
                  {timeAllocation.map((allocation, index) => (
                    <li key={index}>
                      {allocation.subject}: {allocation.time} hours
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div></div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentHomePage;
