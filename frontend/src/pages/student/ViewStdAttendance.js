// import React, { useEffect, useState } from 'react'
// import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
// import { BottomNavigation, BottomNavigationAction, Box, Button, Collapse, Paper, Table, TableBody, TableHead, Typography } from '@mui/material';
// import { useDispatch, useSelector } from 'react-redux';
// import { getUserDetails } from '../../redux/userRelated/userHandle';
// import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../components/attendanceCalculator';

// import CustomBarChart from '../../components/CustomBarChart'

// import InsertChartIcon from '@mui/icons-material/InsertChart';
// import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
// import TableChartIcon from '@mui/icons-material/TableChart';
// import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
// import { StyledTableCell, StyledTableRow } from '../../components/styles';

// const ViewStdAttendance = () => {
//     const dispatch = useDispatch();

//     const [openStates, setOpenStates] = useState({});

//     const handleOpen = (subId) => {
//         setOpenStates((prevState) => ({
//             ...prevState,
//             [subId]: !prevState[subId],
//         }));
//     };

//     const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);

//     useEffect(() => {
//         dispatch(getUserDetails(currentUser._id, "Student"));
//     }, [dispatch, currentUser._id]);

//     if (response) { console.log(response) }
//     else if (error) { console.log(error) }

//     const [subjectAttendance, setSubjectAttendance] = useState([]);
//     const [selectedSection, setSelectedSection] = useState('table');

//     useEffect(() => {
//         if (userDetails) {
//             setSubjectAttendance(userDetails.attendance || []);
//         }
//     }, [userDetails])

//     const attendanceBySubject = groupAttendanceBySubject(subjectAttendance)

//     const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);

//     const subjectData = Object.entries(attendanceBySubject).map(([subName, { subCode, present, sessions }]) => {
//         const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
//         return {
//             subject: subName,
//             attendancePercentage: subjectAttendancePercentage,
//             totalClasses: sessions,
//             attendedClasses: present
//         };
//     });

//     const handleSectionChange = (event, newSection) => {
//         setSelectedSection(newSection);
//     };

//     const renderTableSection = () => {
//         return (
//             <>
//                 <Typography variant="h4" align="center" gutterBottom>
//                     Attendance
//                 </Typography>
//                 <Table>
//                     <TableHead>
//                         <StyledTableRow>
//                             <StyledTableCell>Subject</StyledTableCell>
//                             <StyledTableCell>Present</StyledTableCell>
//                             <StyledTableCell>Total Sessions</StyledTableCell>
//                             <StyledTableCell>Attendance Percentage</StyledTableCell>
//                             <StyledTableCell align="center">Actions</StyledTableCell>
//                         </StyledTableRow>
//                     </TableHead>
//                     {Object.entries(attendanceBySubject).map(([subName, { present, allData, subId, sessions }], index) => {
//                         const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);

//                         return (
//                             <TableBody key={index}>
//                                 <StyledTableRow>
//                                     <StyledTableCell>{subName}</StyledTableCell>
//                                     <StyledTableCell>{present}</StyledTableCell>
//                                     <StyledTableCell>{sessions}</StyledTableCell>
//                                     <StyledTableCell>{subjectAttendancePercentage}%</StyledTableCell>
//                                     <StyledTableCell align="center">
//                                         <Button variant="contained"
//                                             onClick={() => handleOpen(subId)}>
//                                             {openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}Details
//                                         </Button>
//                                     </StyledTableCell>
//                                 </StyledTableRow>
//                                 <StyledTableRow>
//                                     <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
//                                         <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
//                                             <Box sx={{ margin: 1 }}>
//                                                 <Typography variant="h6" gutterBottom component="div">
//                                                     Attendance Details
//                                                 </Typography>
//                                                 <Table size="small" aria-label="purchases">
//                                                     <TableHead>
//                                                         <StyledTableRow>
//                                                             <StyledTableCell>Date</StyledTableCell>
//                                                             <StyledTableCell align="right">Status</StyledTableCell>
//                                                         </StyledTableRow>
//                                                     </TableHead>
//                                                     <TableBody>
//                                                         {allData.map((data, index) => {
//                                                             const date = new Date(data.date);
//                                                             const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
//                                                             return (
//                                                                 <StyledTableRow key={index}>
//                                                                     <StyledTableCell component="th" scope="row">
//                                                                         {dateString}
//                                                                     </StyledTableCell>
//                                                                     <StyledTableCell align="right">{data.status}</StyledTableCell>
//                                                                 </StyledTableRow>
//                                                             )
//                                                         })}
//                                                     </TableBody>
//                                                 </Table>
//                                             </Box>
//                                         </Collapse>
//                                     </StyledTableCell>
//                                 </StyledTableRow>
//                             </TableBody>
//                         )
//                     }
//                     )}
//                 </Table>
//                 <div>
//                     Overall Attendance Percentage: {overallAttendancePercentage.toFixed(2)}%
//                 </div>
//             </>
//         )
//     }

//     const renderChartSection = () => {
//         return (
//             <>
//                 <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
//             </>
//         )
//     };

//     return (
//         <>
//             {loading
//                 ? (
//                     <div>Loading...</div>
//                 )
//                 :
//                 <div>
//                     {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 ?
//                         <>
//                             {selectedSection === 'table' && renderTableSection()}
//                             {selectedSection === 'chart' && renderChartSection()}

//                             <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
//                                 <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
//                                     <BottomNavigationAction
//                                         label="Table"
//                                         value="table"
//                                         icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
//                                     />
//                                     <BottomNavigationAction
//                                         label="Chart"
//                                         value="chart"
//                                         icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
//                                     />
//                                 </BottomNavigation>
//                             </Paper>
//                         </>
//                         :
//                         <>
//                             <Typography variant="h6" gutterBottom component="div">
//                                 Currently You Have No Attendance Details
//                             </Typography>
//                         </>
//                     }
//                 </div>
//             }
//         </>
//     )
// }

// export default ViewStdAttendance

//new 

// import React, { useEffect, useState } from "react";
// import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
// import {
//   BottomNavigation,
//   BottomNavigationAction,
//   Box,
//   Button,
//   Collapse,
//   Paper,
//   Table,
//   TableBody,
//   TableHead,
//   Typography,
// } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import { getUserDetails } from "../../redux/userRelated/userHandle";
// import {
//   calculateOverallAttendancePercentage,
//   calculateSubjectAttendancePercentage,
//   groupAttendanceBySubject,
// } from "../../components/attendanceCalculator";

// import InsertChartIcon from "@mui/icons-material/InsertChart";
// import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
// import TableChartIcon from "@mui/icons-material/TableChart";
// import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
// import { StyledTableCell, StyledTableRow } from "../../components/styles";

// // Importing PieChart component
// import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"; // Import PieChart from recharts

// const ViewStdAttendance = () => {
//   const dispatch = useDispatch();

//   const [openStates, setOpenStates] = useState({});
//   const [pieChartData, setPieChartData] = useState([]);

//   const handleOpen = (subId) => {
//     setOpenStates((prevState) => ({
//       ...prevState,
//       [subId]: !prevState[subId],
//     }));
//   };

//   const { userDetails, currentUser, loading, response, error } = useSelector(
//     (state) => state.user
//   );

//   useEffect(() => {
//     dispatch(getUserDetails(currentUser._id, "Student"));
//   }, [dispatch, currentUser._id]);

//   if (response) {
//     console.log(response);
//   } else if (error) {
//     console.log(error);
//   }

//   const [subjectAttendance, setSubjectAttendance] = useState([]);
//   const [selectedSection, setSelectedSection] = useState("table");

//   useEffect(() => {
//     if (userDetails) {
//       setSubjectAttendance(userDetails.attendance || []);
//     }
//   }, [userDetails]);

//   const attendanceBySubject = groupAttendanceBySubject(subjectAttendance);

//   const overallAttendancePercentage =
//     calculateOverallAttendancePercentage(subjectAttendance);

//   const subjectData = Object.entries(attendanceBySubject).map(
//     ([subName, { subCode, present, sessions }]) => {
//       const subjectAttendancePercentage = calculateSubjectAttendancePercentage(
//         present,
//         sessions
//       );
//       return {
//         subject: subName,
//         attendancePercentage: subjectAttendancePercentage,
//         totalClasses: sessions,
//         attendedClasses: present,
//       };
//     }
//   );

//   // Function to generate Pie Chart data
//   const calculatePieChartData = () => {
//     const presentCount = subjectAttendance.filter(
//       (item) => item.status === "Present"
//     ).length;
//     const absentCount = subjectAttendance.filter(
//       (item) => item.status === "Absent"
//     ).length;
//     return [
//       { name: "Present", value: presentCount },
//       { name: "Absent", value: absentCount },
//     ];
//   };

//   useEffect(() => {
//     if (subjectAttendance && subjectAttendance.length > 0) {
//       const pieData = calculatePieChartData();
//       setPieChartData(pieData);
//     }
//   }, [subjectAttendance]);

//   const handleSectionChange = (event, newSection) => {
//     setSelectedSection(newSection);
//   };

//   const renderTableSection = () => {
//     return (
//       <>
//         <Typography variant="h4" align="center" gutterBottom>
//           Attendance
//         </Typography>
//         <Table>
//           <TableHead>
//             <StyledTableRow>
//               <StyledTableCell>Subject</StyledTableCell>
//               <StyledTableCell>Present</StyledTableCell>
//               <StyledTableCell>Total Sessions</StyledTableCell>
//               <StyledTableCell>Attendance Percentage</StyledTableCell>
//               <StyledTableCell align="center">Actions</StyledTableCell>
//             </StyledTableRow>
//           </TableHead>
//           {Object.entries(attendanceBySubject).map(
//             ([subName, { present, allData, subId, sessions }], index) => {
//               const subjectAttendancePercentage =
//                 calculateSubjectAttendancePercentage(present, sessions);

//               return (
//                 <TableBody key={index}>
//                   <StyledTableRow>
//                     <StyledTableCell>{subName}</StyledTableCell>
//                     <StyledTableCell>{present}</StyledTableCell>
//                     <StyledTableCell>{sessions}</StyledTableCell>
//                     <StyledTableCell>
//                       {subjectAttendancePercentage}%
//                     </StyledTableCell>
//                     <StyledTableCell align="center">
//                       <Button
//                         variant="contained"
//                         onClick={() => handleOpen(subId)}
//                       >
//                         {openStates[subId] ? (
//                           <KeyboardArrowUp />
//                         ) : (
//                           <KeyboardArrowDown />
//                         )}
//                         Details
//                       </Button>
//                     </StyledTableCell>
//                   </StyledTableRow>
//                   <StyledTableRow>
//                     <StyledTableCell
//                       style={{ paddingBottom: 0, paddingTop: 0 }}
//                       colSpan={6}
//                     >
//                       <Collapse
//                         in={openStates[subId]}
//                         timeout="auto"
//                         unmountOnExit
//                       >
//                         <Box sx={{ margin: 1 }}>
//                           <Typography variant="h6" gutterBottom component="div">
//                             Attendance Details
//                           </Typography>
//                           <Table size="small" aria-label="purchases">
//                             <TableHead>
//                               <StyledTableRow>
//                                 <StyledTableCell>Date</StyledTableCell>
//                                 <StyledTableCell align="right">
//                                   Status
//                                 </StyledTableCell>
//                               </StyledTableRow>
//                             </TableHead>
//                             <TableBody>
//                               {allData.map((data, index) => {
//                                 const date = new Date(data.date);
//                                 const dateString =
//                                   date.toString() !== "Invalid Date"
//                                     ? date.toISOString().substring(0, 10)
//                                     : "Invalid Date";
//                                 return (
//                                   <StyledTableRow key={index}>
//                                     <StyledTableCell component="th" scope="row">
//                                       {dateString}
//                                     </StyledTableCell>
//                                     <StyledTableCell align="right">
//                                       {data.status}
//                                     </StyledTableCell>
//                                   </StyledTableRow>
//                                 );
//                               })}
//                             </TableBody>
//                           </Table>
//                         </Box>
//                       </Collapse>
//                     </StyledTableCell>
//                   </StyledTableRow>
//                 </TableBody>
//               );
//             }
//           )}
//         </Table>
//         <div>
//           Overall Attendance Percentage:{" "}
//           {overallAttendancePercentage.toFixed(2)}%
//         </div>
//       </>
//     );
//   };

//   const renderChartSection = () => {
//     return (
//       <>
//         <PieChart width={400} height={400}>
//           <Pie
//             data={pieChartData}
//             dataKey="value"
//             nameKey="name"
//             cx="50%"
//             cy="50%"
//             outerRadius={100}
//             fill="#8884d8"
//             label
//           >
//             {pieChartData.map((entry, index) => (
//               <Cell
//                 key={`cell-${index}`}
//                 fill={entry.name === "Present" ? "#4caf50" : "#f44336"}
//               />
//             ))}
//           </Pie>
//           <Tooltip />
//           <Legend />
//         </PieChart>
//       </>
//     );
//   };

//   return (
//     <>
//       {loading ? (
//         <div>Loading...</div>
//       ) : (
//         <div>
//           {subjectAttendance &&
//           Array.isArray(subjectAttendance) &&
//           subjectAttendance.length > 0 ? (
//             <>
//               {selectedSection === "table" && renderTableSection()}
//               {selectedSection === "chart" && renderChartSection()}

//               <Paper
//                 sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
//                 elevation={3}
//               >
//                 <BottomNavigation
//                   value={selectedSection}
//                   onChange={handleSectionChange}
//                   showLabels
//                 >
//                   <BottomNavigationAction
//                     label="Table"
//                     value="table"
//                     icon={
//                       selectedSection === "table" ? (
//                         <TableChartIcon />
//                       ) : (
//                         <TableChartOutlinedIcon />
//                       )
//                     }
//                   />
//                   <BottomNavigationAction
//                     label="Chart"
//                     value="chart"
//                     icon={
//                       selectedSection === "chart" ? (
//                         <InsertChartIcon />
//                       ) : (
//                         <InsertChartOutlinedIcon />
//                       )
//                     }
//                   />
//                 </BottomNavigation>
//               </Paper>
//             </>
//           ) : (
//             <Typography variant="h6" gutterBottom component="div">
//               Currently You Have No Attendance Details
//             </Typography>
//           )}
//         </div>
//       )}
//     </>
//   );
// };

// export default ViewStdAttendance;


// import React, { useEffect, useState } from "react";
// import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
// import {
//   BottomNavigation,
//   BottomNavigationAction,
//   Box,
//   Button,
//   Collapse,
//   Paper,
//   Table,
//   TableBody,
//   TableHead,
//   Typography,
// } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import { getUserDetails } from "../../redux/userRelated/userHandle";
// import {
//   calculateOverallAttendancePercentage,
//   calculateSubjectAttendancePercentage,
//   groupAttendanceBySubject,
// } from "../../components/attendanceCalculator";

// import InsertChartIcon from "@mui/icons-material/InsertChart";
// import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
// import TableChartIcon from "@mui/icons-material/TableChart";
// import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
// import { StyledTableCell, StyledTableRow } from "../../components/styles";

// // Importing PieChart component
// import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"; // Import PieChart from recharts

// const ViewStdAttendance = () => {
//   const dispatch = useDispatch();

//   const [openStates, setOpenStates] = useState({});
//   const [pieChartData, setPieChartData] = useState([]);

//   const handleOpen = (subId) => {
//     setOpenStates((prevState) => ({
//       ...prevState,
//       [subId]: !prevState[subId],
//     }));
//   };

//   const { userDetails, currentUser, loading, response, error } = useSelector(
//     (state) => state.user
//   );

//   useEffect(() => {
//     dispatch(getUserDetails(currentUser._id, "Student"));
//   }, [dispatch, currentUser._id]);

//   if (response) {
//     console.log(response);
//   } else if (error) {
//     console.log(error);
//   }

//   const [subjectAttendance, setSubjectAttendance] = useState([]);
//   const [selectedSection, setSelectedSection] = useState("table");

//   useEffect(() => {
//     if (userDetails) {
//       setSubjectAttendance(userDetails.attendance || []);
//     }
//   }, [userDetails]);

//   const attendanceBySubject = groupAttendanceBySubject(subjectAttendance);

//   const overallAttendancePercentage =
//     calculateOverallAttendancePercentage(subjectAttendance);

//   const subjectData = Object.entries(attendanceBySubject).map(
//     ([subName, { subCode, present, sessions }]) => {
//       const subjectAttendancePercentage = calculateSubjectAttendancePercentage(
//         present,
//         sessions
//       );
//       return {
//         subject: subName,
//         attendancePercentage: subjectAttendancePercentage,
//         totalClasses: sessions,
//         attendedClasses: present,
//       };
//     }
//   );

//   // Function to generate Pie Chart data
//   const calculatePieChartData = () => {
//     const presentCount = subjectAttendance.filter(
//       (item) => item.status === "Present"
//     ).length;
//     const absentCount = subjectAttendance.filter(
//       (item) => item.status === "Absent"
//     ).length;
//     return [
//       { name: "Present", value: presentCount },
//       { name: "Absent", value: absentCount },
//     ];
//   };

//   useEffect(() => {
//     if (subjectAttendance && subjectAttendance.length > 0) {
//       const pieData = calculatePieChartData();
//       setPieChartData(pieData);
//     }
//   }, [subjectAttendance]);

//   const handleSectionChange = (event, newSection) => {
//     setSelectedSection(newSection);
//   };

//   // Calculate if the student can achieve 75% attendance
//   const calculateRequiredAttendance = (totalSessions, present, absent) => {
//     const requiredAttendance = totalSessions * 0.75;
//     const remainingSessions = totalSessions - (present + absent);

//     // If the required attendance is more than the remaining sessions
//     if (requiredAttendance > present + remainingSessions) {
//       return {
//         canAchieve75: false,
//         missingAttendances: requiredAttendance - present,
//       };
//     }

//     return {
//       canAchieve75: true,
//       missingAttendances: requiredAttendance - present,
//     };
//   };

//   const renderTableSection = () => {
//     return (
//       <>
//         <Typography variant="h4" align="center" gutterBottom>
//           Attendance
//         </Typography>
//         <Table>
//           <TableHead>
//             <StyledTableRow>
//               <StyledTableCell>Subject</StyledTableCell>
//               <StyledTableCell>Present</StyledTableCell>
//               <StyledTableCell>Total Sessions Till Now</StyledTableCell>
//               <StyledTableCell>Attendance Percentage</StyledTableCell>
//               <StyledTableCell align="center">Actions</StyledTableCell>
//             </StyledTableRow>
//           </TableHead>
//           {Object.entries(attendanceBySubject).map(
//             (
//               [subName, { present, allData, subId, sessions, absent }],
//               index
//             ) => {
//                 const tot=present+absent
//               const subjectAttendancePercentage = Math.round(
//                 (100 * present) / tot
//               );

                
//               const { canAchieve75, missingAttendances } =
//                 calculateRequiredAttendance(sessions, present, absent);

//               return (
//                 <TableBody key={index}>
//                   <StyledTableRow>
//                     <StyledTableCell>{subName}</StyledTableCell>
//                     <StyledTableCell>{present}</StyledTableCell>
//                     <StyledTableCell>{present+absent}</StyledTableCell>
//                     <StyledTableCell>
//                       {subjectAttendancePercentage}%
//                     </StyledTableCell>
//                     <StyledTableCell align="center">
//                       <Button
//                         variant="contained"
//                         onClick={() => handleOpen(subId)}
//                       >
//                         {openStates[subId] ? (
//                           <KeyboardArrowUp />
//                         ) : (
//                           <KeyboardArrowDown />
//                         )}
//                         Details
//                       </Button>
//                     </StyledTableCell>
//                   </StyledTableRow>
//                   <StyledTableRow>
//                     <StyledTableCell
//                       style={{ paddingBottom: 0, paddingTop: 0 }}
//                       colSpan={6}
//                     >
//                       <Collapse
//                         in={openStates[subId]}
//                         timeout="auto"
//                         unmountOnExit
//                       >
//                         <Box sx={{ margin: 1 }}>
//                           <Typography variant="h6" gutterBottom component="div">
//                             Attendance Details
//                           </Typography>
//                           <Table size="small" aria-label="purchases">
//                             <TableHead>
//                               <StyledTableRow>
//                                 <StyledTableCell>Date</StyledTableCell>
//                                 <StyledTableCell align="right">
//                                   Status
//                                 </StyledTableCell>
//                               </StyledTableRow>
//                             </TableHead>
//                             <TableBody>
//                               {allData.map((data, index) => {
//                                 const date = new Date(data.date);
//                                 const dateString =
//                                   date.toString() !== "Invalid Date"
//                                     ? date.toISOString().substring(0, 10)
//                                     : "Invalid Date";
//                                 return (
//                                   <StyledTableRow key={index}>
//                                     <StyledTableCell component="th" scope="row">
//                                       {dateString}
//                                     </StyledTableCell>
//                                     <StyledTableCell align="right">
//                                       {data.status}
//                                     </StyledTableCell>
//                                   </StyledTableRow>
//                                 );
//                               })}
//                             </TableBody>
//                           </Table>
//                         </Box>
//                       </Collapse>
//                     </StyledTableCell>
//                   </StyledTableRow>
//                   {/* Add message for 75% attendance requirement */}
//                   {!canAchieve75 && (
//                     <StyledTableRow>
//                       <StyledTableCell colSpan={5} style={{ color: "red" }}>
//                         You are unable to complete 75% attendance. Missing{" "}
//                         {Math.ceil(missingAttendances)} more attendances.
//                       </StyledTableCell>
//                     </StyledTableRow>
//                   )}
//                 </TableBody>
//               );
//             }
//           )}
//         </Table>
//         <div>
//           Overall Attendance Percentage:{" "}
//           {overallAttendancePercentage.toFixed(2)}%
//         </div>
//       </>
//     );
//   };

//   const renderChartSection = () => {
//     return (
//       <>
//         <PieChart width={400} height={400}>
//           <Pie
//             data={pieChartData}
//             dataKey="value"
//             nameKey="name"
//             cx="50%"
//             cy="50%"
//             outerRadius={100}
//             fill="#8884d8"
//             label
//           >
//             {pieChartData.map((entry, index) => (
//               <Cell
//                 key={`cell-${index}`}
//                 fill={entry.name === "Present" ? "#4caf50" : "#f44336"}
//               />
//             ))}
//           </Pie>
//           <Tooltip />
//           <Legend />
//         </PieChart>
//       </>
//     );
//   };

//   return (
//     <>
//       {loading ? (
//         <div>Loading...</div>
//       ) : (
//         <div>
//           {subjectAttendance &&
//           Array.isArray(subjectAttendance) &&
//           subjectAttendance.length > 0 ? (
//             <>
//               {selectedSection === "table" && renderTableSection()}
//               {selectedSection === "chart" && renderChartSection()}

//               <Paper
//                 sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
//                 elevation={3}
//               >
//                 <BottomNavigation
//                   value={selectedSection}
//                   onChange={handleSectionChange}
//                   showLabels
//                 >
//                   <BottomNavigationAction
//                     label="Table"
//                     value="table"
//                     icon={
//                       selectedSection === "table" ? (
//                         <TableChartIcon />
//                       ) : (
//                         <TableChartOutlinedIcon />
//                       )
//                     }
//                   />
//                   <BottomNavigationAction
//                     label="Chart"
//                     value="chart"
//                     icon={
//                       selectedSection === "chart" ? (
//                         <InsertChartIcon />
//                       ) : (
//                         <InsertChartOutlinedIcon />
//                       )
//                     }
//                   />
//                 </BottomNavigation>
//               </Paper>
//             </>
//           ) : (
//             <Typography variant="h6" gutterBottom component="div">
//               Currently You Have No Attendance Details
//             </Typography>
//           )}
//         </div>
//       )}
//     </>
//   );
// };

// export default ViewStdAttendance;
// new 2

// import React, { useState, useEffect } from 'react';

// // Example component for sending attendance update request
// const Attendence = ({ studentId }) => {
//   const [subjects, setSubjects] = useState([]);
//   const [selectedSubjectId, setSelectedSubjectId] = useState('');
//   const [attendanceStatus, setAttendanceStatus] = useState('Present'); // Can be 'Present' or 'Absent'
//   const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
//   const [location, setLocation] = useState({ latitude: 0, longitude: 0 }); // Store user's location

//   // Fetch the subjects from the backend (Assume the subjects are stored with their ObjectIds)
//   useEffect(() => {
//     fetch('http://localhost:2003/subjects') // API endpoint to fetch subjects
//       .then((response) => response.json())
//       .then((data) => setSubjects(data))
//       .catch((error) => console.error('Error fetching subjects:', error));
//   }, []);

//   // Handle subject selection
//   const handleSubjectChange = (event) => {
//     setSelectedSubjectId(event.target.value); // Update the selected subject's ObjectId
//   };

//   // Handle the form submit to send the attendance data
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     // First check for geolocation permission and get the teacher's location
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });

//           // Send attendance data along with geolocation
//           fetch(`http://localhost:2003/atloc/${studentId}`, { // Send studentId in the URL params
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               subName: selectedSubjectId, // Subject's ObjectId
//               status: attendanceStatus,
//               date: date,
//               latitude: position.coords.latitude,
//               longitude: position.coords.longitude,
//             }),
//           })
//             .then((response) => response.json())
//             .then((data) => {
//               console.log('Attendance updated:', data);
//               alert('Attendance updated successfully');
//             })
//             .catch((error) => {
//               console.error('Error updating attendance:', error);
//             });
//         },
//         (error) => {
//           console.error('Error fetching geolocation:', error);
//         }
//       );
//     }
//   };

//   return (
//     <div>
//       <h2>Update Attendance</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="subject">Subject: </label>
//           <select
//             id="subject"
//             value={selectedSubjectId}
//             onChange={handleSubjectChange}
//           >
//             <option value="">Select a Subject</option>
//             {subjects.map((subject) => (
//               <option key={subject._id} value={subject._id}>
//                 {subject.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label htmlFor="status">Attendance Status: </label>
//           <select
//             id="status"
//             value={attendanceStatus}
//             onChange={(e) => setAttendanceStatus(e.target.value)}
//           >
//             <option value="Present">Present</option>
//             <option value="Absent">Absent</option>
//           </select>
//         </div>
//         <div>
//           <button type="submit">Update Attendance</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Attendence;

//new ########

// import React, { useState, useEffect } from 'react';

// // Example component for sending attendance update request
// const Attendence = ({ studentId }) => {
//   const [subjects, setSubjects] = useState([]);
//   const [selectedSubjectId, setSelectedSubjectId] = useState('');
//   const [attendanceStatus, setAttendanceStatus] = useState('Present'); // Can be 'Present' or 'Absent'
//   const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
//   const [location, setLocation] = useState({ latitude: 0, longitude: 0 }); // Store user's location

//   // Fetch the subjects from the backend (using the same URL as in StudentSubjects component)
//   useEffect(() => {
//     fetch('http://localhost:2003/subjects') // API endpoint to fetch subjects
//       .then((response) => response.json())
//       .then((data) => setSubjects(data))  // Assuming the response is an array of subjects
//       .catch((error) => console.error('Error fetching subjects:', error));
//   }, []);

//   // Handle subject selection
//   const handleSubjectChange = (event) => {
//     setSelectedSubjectId(event.target.value); // Update the selected subject's ObjectId
//   };

//   // Handle the form submit to send the attendance data
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     // First check for geolocation permission and get the teacher's location
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });

//           // Send attendance data along with geolocation
//           fetch(`http://localhost:2003/atloc/${studentId}`, { // Send studentId in the URL params
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               subName: selectedSubjectId, // Subject's ObjectId
//               status: attendanceStatus,
//               date: date,
//               latitude: position.coords.latitude,
//               longitude: position.coords.longitude,
//             }),
//           })
//             .then((response) => response.json())
//             .then((data) => {
//               console.log('Attendance updated:', data);
//               alert('Attendance updated successfully');
//             })
//             .catch((error) => {
//               console.error('Error updating attendance:', error);
//             });
//         },
//         (error) => {
//           console.error('Error fetching geolocation:', error);
//         }
//       );
//     }
//   };

//   return (
//     <div>
//       <h2>Update Attendance</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="subject">Subject: </label>
//           <select
//             id="subject"
//             value={selectedSubjectId}
//             onChange={handleSubjectChange}
//           >
//             <option value="">Select a Subject</option>
//             {subjects.map((subject) => (
//               <option key={subject._id} value={subject._id}>
//                 {subject.subName}  {/* Assuming 'subName' is the display name of the subject */}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label htmlFor="status">Attendance Status: </label>
//           <select
//             id="status"
//             value={attendanceStatus}
//             onChange={(e) => setAttendanceStatus(e.target.value)}
//           >
//             <option value="Present">Present</option>
//             <option value="Absent">Absent</option>
//           </select>
//         </div>
//         <div>
//           <button type="submit">Update Attendance</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Attendence;


//new latest @
// import React, { useState, useEffect } from 'react';

// const Attendence = ({ studentId }) => {
//   const [subjects, setSubjects] = useState([]);
//   const [selectedSubjectId, setSelectedSubjectId] = useState('');
//   const [attendanceStatus, setAttendanceStatus] = useState('Present'); // Can be 'Present' or 'Absent'
//   const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
//   const [location, setLocation] = useState({ latitude: 0, longitude: 0 }); // Store user's location

//   // Fetch the subjects from the backend specific to the student
//   useEffect(() => {
//     fetch(`http://localhost:2003/student/${studentId}/subjects`) // Fetch subjects for a specific student
//       .then((response) => response.json())
//       .then((data) => {
//         // Check if the response is an array
//         if (Array.isArray(data)) {
//           setSubjects(data); // Set subjects only if it's an array
//         } else {
//           console.error('Subjects data is not an array:', data);
//         }
//       })
//       .catch((error) => {
//         console.error('Error fetching subjects:', error);
//       });
//   }, [studentId]);

//   // Handle subject selection
//   const handleSubjectChange = (event) => {
//     setSelectedSubjectId(event.target.value); // Update the selected subject's ObjectId
//   };

//   // Handle the form submit to send the attendance data
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     // First check for geolocation permission and get the teacher's location
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });

//           // Send attendance data along with geolocation
//           fetch(`http://localhost:2003/atloc/${studentId}`, { // Send studentId in the URL params
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               subName: selectedSubjectId, // Subject's ObjectId
//               status: attendanceStatus,
//               date: date,
//               latitude: position.coords.latitude,
//               longitude: position.coords.longitude,
//             }),
//           })
//             .then((response) => response.json())
//             .then((data) => {
//               console.log('Attendance updated:', data);
//               alert('Attendance updated successfully');
//             })
//             .catch((error) => {
//               console.error('Error updating attendance:', error);
//             });
//         },
//         (error) => {
//           console.error('Error fetching geolocation:', error);
//         }
//       );
//     }
//   };

//   return (
//     <div>
//       <h2>Update Attendance</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="subject">Subject: </label>
//           <select
//             id="subject"
//             value={selectedSubjectId}
//             onChange={handleSubjectChange}
//           >
//             <option value="">Select a Subject</option>
//             {Array.isArray(subjects) && subjects.length > 0 ? (
//               subjects.map((subject) => (
//                 <option key={subject.subId} value={subject.subId}>
//                   {subject.subName}  {/* Display subject name */}
//                 </option>
//               ))
//             ) : (
//               <option value="">No subjects available</option>
//             )}
//           </select>
//         </div>
//         <div>
//           <label htmlFor="status">Attendance Status: </label>
//           <select
//             id="status"
//             value={attendanceStatus}
//             onChange={(e) => setAttendanceStatus(e.target.value)}
//           >
//             <option value="Present">Present</option>
//             <option value="Absent">Absent</option>
//           </select>
//         </div>
//         <div>
//           <button type="submit">Update Attendance</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Attendence;


//new 7

import React, { useState, useEffect } from 'react';

import { getUserDetails } from "../../redux/userRelated/userHandle";
import { useDispatch, useSelector } from "react-redux";

const Attendence = ({ studentId }) => {

  const { userDetails, currentUser, response } = useSelector(
    (state) => state.user
  );

  console.log(userDetails, currentUser)

  studentId = currentUser._id;

  const [studentDetails, setStudentDetails] = useState(null); // To store student data
  const [subjects, setSubjects] = useState([]); // To store subjects
  const [selectedSubjectId, setSelectedSubjectId] = useState(''); // To store selected subject
  const [attendanceStatus, setAttendanceStatus] = useState('Present'); // Attendance status (Present/Absent)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 }); // To store geolocation data
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle errors

  // Fetch student details and subjects
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        // Fetch student details/student/:studentId/subjects
        console.log('Student ID:', studentId);
        const response = await fetch(`http://localhost:2003/student/${studentId}/subjects`);
        const data = await response.json();

       
        console.log("subjects", data);
        if (data) {
          setStudentDetails(data);
          const fetchedSubjects = await Promise.all(
            data.map(async (sub) => {
              const response = await fetch(`http://localhost:2003/Subject/${sub.subId}`);
              return await response.json(); // Parse the JSON response
            })
          );
          setSubjects(fetchedSubjects || []); // Assuming subjects are part of the student data
        }
      } catch (err) {
        setError('Failed to fetch student details');
        console.error('Error fetching student details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [studentId]);

  // Handle subject selection
  const handleSubjectChange = (event) => {
    setSelectedSubjectId(event.target.value);
  };

  // Handle form submission to update attendance
  const handleSubmit = async (event) => {
    event.preventDefault();

    // First check for geolocation permission and get the teacher's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
console.log("user data: ", selectedSubjectId, attendanceStatus, date, position.coords.latitude, position.coords.longitude)
          // Send attendance data along with geolocation
          fetch(`http://localhost:2003/atloc/${studentId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              subName: selectedSubjectId, // Subject's ObjectId
              status: attendanceStatus,
              date: date,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log('Attendance updated:', data);
              alert('Attendance updated successfully');
            })
            .catch((error) => {
              console.error('Error updating attendance:', error);
              alert('Error updating attendance');
            });
        },
        (error) => {
          console.error('Error fetching geolocation:', error);
          alert('Geolocation access denied or error occurred');
        }
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Update Attendance</h2>
      {/* Display Student Info */}
      {studentDetails && (
        <div>
          <h3>{studentDetails.name}</h3>
          <p>Roll Number: {studentDetails.rollNum}</p>
          <p>Class: {studentDetails.sclassName?.className || 'N/A'}</p>
        </div>
      )}
      
      {/* Attendance Form */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="subject">Subject: </label>
          <select
            id="subject"
            value={selectedSubjectId}
            onChange={handleSubjectChange}
          >
            <option value="">Select a Subject</option>
            {Array.isArray(subjects) && subjects.length > 0 ? (
              subjects.map((subject) => (
                <option key={subject.subId} value={subject.subId}>
                  {subject.subName} {/* Display subject name */}
                </option>
              ))
            ) : (
              <option value="">No subjects available</option>
            )}
          </select>
        </div>

        <div>
          <label htmlFor="status">Attendance Status: </label>
          <select
            id="status"
            value={attendanceStatus}
            onChange={(e) => setAttendanceStatus(e.target.value)}
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        <div>
          <button type="submit">Update Attendance</button>
        </div>
      </form>
    </div>
  );
};

export default Attendence;


// new 8 
// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { getSubjectList } from "../../redux/sclassRelated/sclassHandle"; // Fetch subjects
// import { getUserDetails } from "../../redux/userRelated/userHandle"; // Fetch user details

// const Attendance = ({ studentId }) => {
//   const dispatch = useDispatch();

//   // Redux states
//   const { userDetails } = useSelector((state) => state.user);
//   const { subjectList } = useSelector((state) => state.sclass);

//   // Local states
//   const [selectedSubjectId, setSelectedSubjectId] = useState(""); // Selected subject
//   const [attendanceStatus, setAttendanceStatus] = useState("Present"); // Attendance status
//   const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today's date
//   const [location, setLocation] = useState({ latitude: 0, longitude: 0 }); // Geolocation

//   // Fetch user and subject details on mount
//   useEffect(() => {
//     if (studentId) {
//       dispatch(getUserDetails(studentId)); // Fetch user details
//       dispatch(getSubjectList()); // Fetch subject list
//     }
//   }, [dispatch, studentId]);

//   // Handle subject selection
//   const handleSubjectChange = (event) => {
//     setSelectedSubjectId(event.target.value);
//   };

//   // Handle form submission
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     // Check for geolocation access
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });

//           // Send attendance data to the backend
//           fetch(`http://localhost:2003/atloc/${studentId}`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               subjectId: selectedSubjectId,
//               status: attendanceStatus,
//               date,
//               latitude: position.coords.latitude,
//               longitude: position.coords.longitude,
//             }),
//           })
//             .then((response) => response.json())
//             .then((data) => {
//               console.log("Attendance updated successfully:", data);
//               alert("Attendance updated successfully!");
//             })
//             .catch((error) => {
//               console.error("Error updating attendance:", error);
//               alert("Failed to update attendance!");
//             });
//         },
//         (error) => {
//           alert("Geolocation access denied or error occurred");
//           console.error("Geolocation error:", error);
//         }
//       );
//     }
//   };

//   return (
//     <div>
//       <h2>Update Attendance</h2>

//       {/* Student Info */}
//       {userDetails && (
//         <div>
//           <h3>{userDetails.name}</h3>
//           <p>Roll Number: {userDetails.rollNum}</p>
//           <p>Class: {userDetails.sclassName?.className || "N/A"}</p>
//         </div>
//       )}

//       {/* Attendance Form */}
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="subject">Subject: </label>
//           <select
//             id="subject"
//             value={selectedSubjectId}
//             onChange={handleSubjectChange}
//           >
//             <option value="">Select a Subject</option>
//             {subjectList?.map((subject) => (
//               <option key={subject.subId} value={subject.subId}>
//                 {subject.subName}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label htmlFor="status">Attendance Status: </label>
//           <select
//             id="status"
//             value={attendanceStatus}
//             onChange={(e) => setAttendanceStatus(e.target.value)}
//           >
//             <option value="Present">Present</option>
//             <option value="Absent">Absent</option>
//           </select>
//         </div>

//         <div>
//           <label htmlFor="date">Date: </label>
//           <input
//             type="date"
//             id="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//           />
//         </div>

//         <button type="submit">Update Attendance</button>
//       </form>
//     </div>
//   );
// };

// export default Attendance;
