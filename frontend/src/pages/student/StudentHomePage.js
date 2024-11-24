// import React, { useEffect, useState } from 'react'
// import { Container, Grid, Paper, Typography } from '@mui/material'
// import { useDispatch, useSelector } from 'react-redux';
// import { calculateOverallAttendancePercentage } from '../../components/attendanceCalculator';
// import CustomPieChart from '../../components/CustomPieChart';
// import { getUserDetails } from '../../redux/userRelated/userHandle';
// import styled from 'styled-components';
// import SeeNotice from '../../components/SeeNotice';
// import CountUp from 'react-countup';
// import Subject from "../../assets/subjects.svg";
// import Assignment from "../../assets/assignment.svg";
// import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';

// const StudentHomePage = () => {
//     const dispatch = useDispatch();

//     const { userDetails, currentUser, loading, response } = useSelector((state) => state.user);
//     const { subjectsList } = useSelector((state) => state.sclass);

//     const [subjectAttendance, setSubjectAttendance] = useState([]);

//     const classID = currentUser.sclassName._id

//     useEffect(() => {
//         dispatch(getUserDetails(currentUser._id, "Student"));
//         dispatch(getSubjectList(classID, "ClassSubjects"));
//     }, [dispatch, currentUser._id, classID]);

//     const numberOfSubjects = subjectsList && subjectsList.length;

//     useEffect(() => {
//         if (userDetails) {
//             setSubjectAttendance(userDetails.attendance || []);
//         }
//     }, [userDetails])

//     const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
//     const overallAbsentPercentage = 100 - overallAttendancePercentage;

//     const chartData = [
//         { name: 'Present', value: overallAttendancePercentage },
//         { name: 'Absent', value: overallAbsentPercentage }
//     ];
//     return (
//         <>
//             <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//                 <Grid container spacing={3}>
//                     <Grid item xs={12} md={3} lg={3}>
//                         <StyledPaper>
//                             <img src={Subject} alt="Subjects" />
//                             <Title>
//                                 Total Subjects
//                             </Title>
//                             <Data start={0} end={numberOfSubjects} duration={2.5} />
//                         </StyledPaper>
//                     </Grid>
//                     <Grid item xs={12} md={3} lg={3}>
//                         <StyledPaper>
//                             <img src={Assignment} alt="Assignments" />
//                             <Title>
//                                 Total Assignments
//                             </Title>
//                             <Data start={0} end={15} duration={4} />
//                         </StyledPaper>
//                     </Grid>
//                     <Grid item xs={12} md={4} lg={3}>
//                         <ChartContainer>
//                             {
//                                 response ?
//                                     <Typography variant="h6">No Attendance Found</Typography>
//                                     :
//                                     <>
//                                         {loading
//                                             ? (
//                                                 <Typography variant="h6">Loading...</Typography>
//                                             )
//                                             :
//                                             <>
//                                                 {
//                                                     subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 ? (
//                                                         <>
//                                                             <CustomPieChart data={chartData} />
//                                                         </>
//                                                     )
//                                                         :
//                                                         <Typography variant="h6">No Attendance Found</Typography>
//                                                 }
//                                             </>
//                                         }
//                                     </>
//                             }
//                         </ChartContainer>
//                     </Grid>
//                     <Grid item xs={12}>
//                         <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
//                             <SeeNotice />
//                         </Paper>
//                     </Grid>
//                 </Grid>
//             </Container>
//         </>
//     )
// }

// const ChartContainer = styled.div`
//   padding: 2px;
//   display: flex;
//   flex-direction: column;
//   height: 240px;
//   justify-content: center;
//   align-items: center;
//   text-align: center;
// `;

// const StyledPaper = styled(Paper)`
//   padding: 16px;
//   display: flex;
//   flex-direction: column;
//   height: 200px;
//   justify-content: space-between;
//   align-items: center;
//   text-align: center;
// `;

// const Title = styled.p`
//   font-size: 1.25rem;
// `;

// const Data = styled(CountUp)`
//   font-size: calc(1.3rem + .6vw);
//   color: green;
// `;



// export default StudentHomePage

//new implementation 
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
import io from 'socket.io-client';

const socket = io('http://localhost:2003');  

const StudentHomePage = () => {
  const dispatch = useDispatch();
  const [studentLocation, setStudentLocation] = useState(null);
  const [isPresent, setIsPresent] = useState(null);
  useEffect(() => {
    // Listen for the request to provide location
    socket.on('request-student-location', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setStudentLocation({ latitude, longitude });

                    // Send student location to backend
                    fetch('http://localhost:2003/api/student-location', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ studentLocation: { latitude, longitude } }),
                    }).then(response => response.json())
                      .then(data => {
                          console.log(data.message);
                          setIsPresent(true)
                          // Optionally, handle attendance response
                      });
                },
                (error) => {
                    console.error("Error getting student's location:", error.message);
                }
            );
        }
    });
}, []);



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

      // Attendance chart data
      const totalClasses = attendance.reduce(
        (sum, sub) => sum + (sub.total || 0),
        0
      );
      const attendedClasses = attendance.reduce(
        (sum, sub) => sum + (sub.attended || 0),
        0
      );
      const attendancePercentage = Math.round(
        (attendedClasses / totalClasses) * 100
      );
      setAttendanceData([
        { name: "Present", value: attendancePercentage },
        { name: "Absent", value: 100 - attendancePercentage },
      ]);

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
            <div>
        </div>

          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentHomePage;
