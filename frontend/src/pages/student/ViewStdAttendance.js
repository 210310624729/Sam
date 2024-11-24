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

import React, { useState } from "react";

const GiveAttendance = () => {
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [error, setError] = useState(null);

  // Function to get location and send attendance request
  const handleGiveAttendance = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch("http://localhost:2003/atloc", { // Specify the port explicitly
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ latitude, longitude }),
            });

            const data = await response.json();

            if (response.ok) {
              setAttendanceStatus(data.status);
            } else {
              setError(data.error || "Error processing attendance.");
            }
          } catch (err) {
            setError("Error connecting to the server.");
          }
        },
        (error) => {
          setError("Error fetching location.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div>
      <h1>Give Attendance</h1>
      <button onClick={handleGiveAttendance}>Give Attendance</button>

      {attendanceStatus && (
        <p>
          Your attendance status is: <strong>{attendanceStatus}</strong>
        </p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GiveAttendance;
