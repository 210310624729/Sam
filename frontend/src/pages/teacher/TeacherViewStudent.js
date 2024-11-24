// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { getUserDetails } from '../../redux/userRelated/userHandle';
// import { useNavigate, useParams } from 'react-router-dom'
// import { Box, Button, Collapse, Table, TableBody, TableHead, Typography } from '@mui/material';
// import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
// import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../components/attendanceCalculator';
// import CustomPieChart from '../../components/CustomPieChart'
// import { PurpleButton } from '../../components/buttonStyles';
// import { StyledTableCell, StyledTableRow } from '../../components/styles';

// const TeacherViewStudent = () => {

//     const navigate = useNavigate()
//     const params = useParams()
//     const dispatch = useDispatch();
//     const { currentUser, userDetails, response, loading, error } = useSelector((state) => state.user);

//     const address = "Student"
//     const studentID = params.id
//     const teachSubject = currentUser.teachSubject?.subName
//     const teachSubjectID = currentUser.teachSubject?._id

//     useEffect(() => {
//         dispatch(getUserDetails(studentID, address));
//     }, [dispatch, studentID]);

//     if (response) { console.log(response) }
//     else if (error) { console.log(error) }

//     const [sclassName, setSclassName] = useState('');
//     const [studentSchool, setStudentSchool] = useState('');
//     const [subjectMarks, setSubjectMarks] = useState('');
//     const [subjectAttendance, setSubjectAttendance] = useState([]);

//     const [openStates, setOpenStates] = useState({});

//     const handleOpen = (subId) => {
//         setOpenStates((prevState) => ({
//             ...prevState,
//             [subId]: !prevState[subId],
//         }));
//     };

//     useEffect(() => {
//         if (userDetails) {
//             setSclassName(userDetails.sclassName || '');
//             setStudentSchool(userDetails.school || '');
//             setSubjectMarks(userDetails.examResult || '');
//             setSubjectAttendance(userDetails.attendance || []);
//         }
//     }, [userDetails]);

//     const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
//     const overallAbsentPercentage = 100 - overallAttendancePercentage;

//     const chartData = [
//         { name: 'Present', value: overallAttendancePercentage },
//         { name: 'Absent', value: overallAbsentPercentage }
//     ];

//     return (
//         <>
//             {loading
//                 ?
//                 <>
//                     <div>Loading...</div>
//                 </>
//                 :
//                 <div>
//                     Name: {userDetails.name}
//                     <br />
//                     Roll Number: {userDetails.rollNum}
//                     <br />
//                     Class: {sclassName.sclassName}
//                     <br />
//                     School: {studentSchool.schoolName}
//                     <br /><br />

//                     <h3>Attendance:</h3>
//                     {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0
//                         &&
//                         <>
//                             {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { present, allData, subId, sessions }], index) => {
//                                 if (subName === teachSubject) {
//                                     const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);

//                                     return (
//                                         <Table key={index}>
//                                             <TableHead>
//                                                 <StyledTableRow>
//                                                     <StyledTableCell>Subject</StyledTableCell>
//                                                     <StyledTableCell>Present</StyledTableCell>
//                                                     <StyledTableCell>Total Sessions</StyledTableCell>
//                                                     <StyledTableCell>Attendance Percentage</StyledTableCell>
//                                                     <StyledTableCell align="center">Actions</StyledTableCell>
//                                                 </StyledTableRow>
//                                             </TableHead>

//                                             <TableBody>
//                                                 <StyledTableRow>
//                                                     <StyledTableCell>{subName}</StyledTableCell>
//                                                     <StyledTableCell>{present}</StyledTableCell>
//                                                     <StyledTableCell>{sessions}</StyledTableCell>
//                                                     <StyledTableCell>{subjectAttendancePercentage}%</StyledTableCell>
//                                                     <StyledTableCell align="center">
//                                                         <Button variant="contained" onClick={() => handleOpen(subId)}>
//                                                             {openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}Details
//                                                         </Button>
//                                                     </StyledTableCell>
//                                                 </StyledTableRow>
//                                                 <StyledTableRow>
//                                                     <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
//                                                         <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
//                                                             <Box sx={{ margin: 1 }}>
//                                                                 <Typography variant="h6" gutterBottom component="div">
//                                                                     Attendance Details
//                                                                 </Typography>
//                                                                 <Table size="small" aria-label="purchases">
//                                                                     <TableHead>
//                                                                         <StyledTableRow>
//                                                                             <StyledTableCell>Date</StyledTableCell>
//                                                                             <StyledTableCell align="right">Status</StyledTableCell>
//                                                                         </StyledTableRow>
//                                                                     </TableHead>
//                                                                     <TableBody>
//                                                                         {allData.map((data, index) => {
//                                                                             const date = new Date(data.date);
//                                                                             const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
//                                                                             return (
//                                                                                 <StyledTableRow key={index}>
//                                                                                     <StyledTableCell component="th" scope="row">
//                                                                                         {dateString}
//                                                                                     </StyledTableCell>
//                                                                                     <StyledTableCell align="right">{data.status}</StyledTableCell>
//                                                                                 </StyledTableRow>
//                                                                             );
//                                                                         })}
//                                                                     </TableBody>
//                                                                 </Table>
//                                                             </Box>
//                                                         </Collapse>
//                                                     </StyledTableCell>
//                                                 </StyledTableRow>
//                                             </TableBody>
//                                         </Table>
//                                     )
//                                 }
//                                 else {
//                                     return null
//                                 }
//                             })}
//                             <div>
//                                 Overall Attendance Percentage: {overallAttendancePercentage.toFixed(2)}%
//                             </div>

//                             <CustomPieChart data={chartData} />
//                         </>
//                     }
//                     <br /><br />
//                     <Button
//                         variant="contained"
//                         onClick={() =>
//                             navigate(
//                                 `/Teacher/class/student/attendance/${studentID}/${teachSubjectID}`
//                             )
//                         }
//                     >
//                         Add Attendance
//                     </Button>
//                     <br /><br /><br />
//                     <h3>Subject Marks:</h3>

//                     {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0 &&
//                         <>
//                             {subjectMarks.map((result, index) => {
//                                 if (result.subName.subName === teachSubject) {
//                                     return (
//                                         <Table key={index}>
//                                             <TableHead>
//                                                 <StyledTableRow>
//                                                     <StyledTableCell>Subject</StyledTableCell>
//                                                     <StyledTableCell>Marks</StyledTableCell>
//                                                 </StyledTableRow>
//                                             </TableHead>
//                                             <TableBody>
//                                                 <StyledTableRow>
//                                                     <StyledTableCell>{result.subName.subName}</StyledTableCell>
//                                                     <StyledTableCell>{result.marksObtained}</StyledTableCell>
//                                                 </StyledTableRow>
//                                             </TableBody>
//                                         </Table>
//                                     )
//                                 }
//                                 else if (!result.subName || !result.marksObtained) {
//                                     return null;
//                                 }
//                                 return null
//                             })}
//                         </>
//                     }
//                     <PurpleButton variant="contained"
//                         onClick={() =>
//                             navigate(
//                                 `/Teacher/class/student/marks/${studentID}/${teachSubjectID}`
//                             )}>
//                         Add Marks
//                     </PurpleButton>
//                     <br /><br /><br />
//                 </div>
//             }
//         </>
//     )
// }

// export default TeacherViewStudent

//new 

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../../redux/userRelated/userHandle";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Collapse,
  Table,
  TableBody,
  TableHead,
  Typography,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import {
  calculateOverallAttendancePercentage,
  calculateSubjectAttendancePercentage,
  groupAttendanceBySubject,
} from "../../components/attendanceCalculator";
import CustomPieChart from "../../components/CustomPieChart";
import { PurpleButton } from "../../components/buttonStyles";
import { StyledTableCell, StyledTableRow } from "../../components/styles";

const TeacherViewStudent = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { currentUser, userDetails, response, loading, error } = useSelector(
    (state) => state.user
  );

  const address = "Student";
  const studentID = params.id;
  const teachSubject = currentUser.teachSubject?.subName;
  const teachSubjectID = currentUser.teachSubject?._id;

useEffect(() => {
  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      console.log("Requesting location access...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location obtained:", position.coords);
          console.log({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            console.error("Permission denied. Location access is required.");
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            console.error("Location information is unavailable.");
          } else if (error.code === error.TIMEOUT) {
            console.error("The request to get the location timed out.");
          } else {
            console.error("Error getting location:", error.message);
          }
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  requestLocationPermission();

  // Optionally, cleanup function if needed in the future
  return () => {
    // Clean up code if necessary
  };
}, []);


  useEffect(() => {
    dispatch(getUserDetails(studentID, address));
  }, [dispatch, studentID]);

  const [sclassName, setSclassName] = useState("");
  const [studentSchool, setStudentSchool] = useState("");
  const [subjectMarks, setSubjectMarks] = useState("");
  const [subjectAttendance, setSubjectAttendance] = useState([]);
  const [openStates, setOpenStates] = useState({});

  const handleOpen = (subId) => {
    setOpenStates((prevState) => ({
      ...prevState,
      [subId]: !prevState[subId],
    }));
  };

  useEffect(() => {
    if (userDetails) {
      setSclassName(userDetails.sclassName || "");
      setStudentSchool(userDetails.school || "");
      setSubjectMarks(userDetails.examResult || "");
      setSubjectAttendance(userDetails.attendance || []);
    }
  }, [userDetails]);

  const overallAttendancePercentage =
    calculateOverallAttendancePercentage(subjectAttendance);
  const overallAbsentPercentage = 100 - overallAttendancePercentage;

  const chartData = [
    { name: "Present", value: overallAttendancePercentage },
    { name: "Absent", value: overallAbsentPercentage },
  ];

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <Typography variant="h5">Student Details</Typography>
          <div>Name: {userDetails.name}</div>
          <div>Roll Number: {userDetails.rollNum}</div>
          <div>Class: {sclassName.sclassName}</div>
          <div>School: {studentSchool.schoolName}</div>

          <Typography variant="h6" mt={2}>
            Attendance
          </Typography>
          {subjectAttendance &&
            Array.isArray(subjectAttendance) &&
            subjectAttendance.length > 0 && (
              <>
                {Object.entries(
                  groupAttendanceBySubject(subjectAttendance)
                ).map(
                  ([subName, { present, allData, subId, sessions }], index) => {
                    if (subName === teachSubject) {
                      const subjectAttendancePercentage =
                        calculateSubjectAttendancePercentage(present, sessions);

                      return (
                        <Table key={index}>
                          <TableHead>
                            <StyledTableRow>
                              <StyledTableCell>Subject</StyledTableCell>
                              <StyledTableCell>Present</StyledTableCell>
                              <StyledTableCell>Total Sessions</StyledTableCell>
                              <StyledTableCell>
                                Attendance Percentage
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                Actions
                              </StyledTableCell>
                            </StyledTableRow>
                          </TableHead>
                          <TableBody>
                            <StyledTableRow>
                              <StyledTableCell>{subName}</StyledTableCell>
                              <StyledTableCell>{present}</StyledTableCell>
                              <StyledTableCell>{sessions}</StyledTableCell>
                              <StyledTableCell>
                                {subjectAttendancePercentage}%
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <Button
                                  variant="contained"
                                  onClick={() => handleOpen(subId)}
                                >
                                  {openStates[subId] ? (
                                    <KeyboardArrowUp />
                                  ) : (
                                    <KeyboardArrowDown />
                                  )}{" "}
                                  Details
                                </Button>
                              </StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                              <StyledTableCell
                                style={{ paddingBottom: 0, paddingTop: 0 }}
                                colSpan={6}
                              >
                                <Collapse
                                  in={openStates[subId]}
                                  timeout="auto"
                                  unmountOnExit
                                >
                                  <Box sx={{ margin: 1 }}>
                                    <Typography
                                      variant="h6"
                                      gutterBottom
                                      component="div"
                                    >
                                      Attendance Details
                                    </Typography>
                                    <Table size="small" aria-label="purchases">
                                      <TableHead>
                                        <StyledTableRow>
                                          <StyledTableCell>
                                            Date
                                          </StyledTableCell>
                                          <StyledTableCell align="right">
                                            Status
                                          </StyledTableCell>
                                        </StyledTableRow>
                                      </TableHead>
                                      <TableBody>
                                        {allData.map((data, index) => (
                                          <StyledTableRow key={index}>
                                            <StyledTableCell
                                              component="th"
                                              scope="row"
                                            >
                                              {new Date(data.date)
                                                .toISOString()
                                                .substring(0, 10)}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                              {data.status}
                                            </StyledTableCell>
                                          </StyledTableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </Box>
                                </Collapse>
                              </StyledTableCell>
                            </StyledTableRow>
                          </TableBody>
                        </Table>
                      );
                    }
                    return null;
                  }
                )}
                <Typography mt={2}>
                  Overall Attendance Percentage:{" "}
                  {overallAttendancePercentage.toFixed(2)}%
                </Typography>
                <CustomPieChart data={chartData} />
              </>
            )}
          <Button
            variant="contained"
            onClick={() =>
              navigate(
                `/Teacher/class/student/attendance/${studentID}/${teachSubjectID}`
              )
            }
            sx={{ mt: 2 }}
          >
            Add Attendance
          </Button>

          <Typography variant="h6" mt={4}>
            Subject Marks
          </Typography>
          {subjectMarks &&
            Array.isArray(subjectMarks) &&
            subjectMarks.length > 0 && (
              <>
                {subjectMarks.map((result, index) => {
                  if (result.subName.subName === teachSubject) {
                    return (
                      <Box key={index} mt={2}>
                        <Typography variant="subtitle1">
                          {result.subName.subName}
                        </Typography>

                        <Typography variant="subtitle2">
                          Internal Marks
                        </Typography>
                        <Table>
                          <TableHead>
                            <StyledTableRow>
                              <StyledTableCell>Exam Name</StyledTableCell>
                              <StyledTableCell>Percentage</StyledTableCell>
                            </StyledTableRow>
                          </TableHead>
                          <TableBody>
                            {Object.entries(result.internalMarks || {}).map(
                              ([examName, percentage]) => (
                                <StyledTableRow key={examName}>
                                  <StyledTableCell>{examName}</StyledTableCell>
                                  <StyledTableCell>
                                    {percentage}%
                                  </StyledTableCell>
                                </StyledTableRow>
                              )
                            )}
                          </TableBody>
                        </Table>

                        <Typography variant="subtitle2" mt={2}>
                          External Marks
                        </Typography>
                        <Table>
                          <TableHead>
                            <StyledTableRow>
                              <StyledTableCell>Exam Name</StyledTableCell>
                              <StyledTableCell>Percentage</StyledTableCell>
                            </StyledTableRow>
                          </TableHead>
                          <TableBody>
                            {Object.entries(result.externalMarks || {}).map(
                              ([examName, percentage]) => (
                                <StyledTableRow key={examName}>
                                  <StyledTableCell>{examName}</StyledTableCell>
                                  <StyledTableCell>
                                    {percentage}%
                                  </StyledTableCell>
                                </StyledTableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </Box>
                    );
                  }
                  return null;
                })}
              </>
            )}
          <PurpleButton
            variant="contained"
            onClick={() =>
              navigate(
                `/Teacher/class/student/marks/${studentID}/${teachSubjectID}`
              )
            }
            sx={{ mt: 2 }}
          >
            Add Marks
          </PurpleButton>
        </div>
      )}
    </>
  );
};

export default TeacherViewStudent;
