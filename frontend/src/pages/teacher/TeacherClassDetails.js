import { useEffect , useState} from "react";
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { getClassStudents } from "../../redux/sclassRelated/sclassHandle";
import { Paper, Box, Typography, ButtonGroup, Button, Popper, Grow, ClickAwayListener, MenuList, MenuItem } from '@mui/material';
import { BlackButton, BlueButton} from "../../components/buttonStyles";
import TableTemplate from "../../components/TableTemplate";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import io from 'socket.io-client';

const socket = io('http://localhost:2003');
const TeacherClassDetails = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [teacherLocation, setTeacherLocation] = useState(null);

    const handleTakeAttendance = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setTeacherLocation({ latitude, longitude });

                    // Send teacher's location to backend
                    fetch('http://localhost:2003/api/teacher-location', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ latitude, longitude }),
                    }).then(response => response.json())
                      .then(data => console.log(data.message));
                },
                (error) => {
                    console.error("Error getting teacher's location:", error.message);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    const { sclassStudents, loading, error, getresponse } = useSelector((state) => state.sclass);

    const { currentUser } = useSelector((state) => state.user);
    const classID = currentUser.teachSclass?._id
    const subjectID = currentUser.teachSubject?._id

    useEffect(() => {
        dispatch(getClassStudents(classID));
    }, [dispatch, classID])

    if (error) {
        console.log(error)
    }

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
    ]

    const studentRows = sclassStudents.map((student) => {
        return {
            name: student.name,
            rollNum: student.rollNum,
            id: student._id,
        };
    });

    const StudentsButtonHaver = ({ row }) => {
        const options = ['Take Attendance', 'Provide Marks'];

        const [open, setOpen] = React.useState(false);
        const anchorRef = React.useRef(null);
        const [selectedIndex, setSelectedIndex] = React.useState(0);

        const handleClick = () => {
            console.info(`You clicked ${options[selectedIndex]}`);
            if (selectedIndex === 0) {
                handleAttendance();
            } else if (selectedIndex === 1) {
                handleMarks();
            }
        };

        const handleAttendance = () => {
            navigate(`/Teacher/class/student/attendance/${row.id}/${subjectID}`)
        }
        const handleMarks = () => {
            navigate(`/Teacher/class/student/marks/${row.id}/${subjectID}`)
        };

        const handleMenuItemClick = (event, index) => {
            setSelectedIndex(index);
            setOpen(false);
        };

        const handleToggle = () => {
            setOpen((prevOpen) => !prevOpen);
        };

        const handleClose = (event) => {
            if (anchorRef.current && anchorRef.current.contains(event.target)) {
                return;
            }

            setOpen(false);
        };
        return (
            <>
                <BlueButton
                    variant="contained"
                    onClick={() =>
                        navigate("/Teacher/class/student/" + row.id)
                    }
                >
                    View
                </BlueButton>
                <React.Fragment>
                    <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
                        <Button onClick={handleClick}>{options[selectedIndex]}</Button>
                        <BlackButton
                            size="small"
                            aria-controls={open ? 'split-button-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-label="select merge strategy"
                            aria-haspopup="menu"
                            onClick={handleToggle}
                        >
                            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </BlackButton>
                    </ButtonGroup>
                    <Popper
                        sx={{
                            zIndex: 1,
                        }}
                        open={open}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        transition
                        disablePortal
                    >
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin:
                                        placement === 'bottom' ? 'center top' : 'center bottom',
                                }}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList id="split-button-menu" autoFocusItem>
                                            {options.map((option, index) => (
                                                <MenuItem
                                                    key={option}
                                                    disabled={index === 2}
                                                    selected={index === selectedIndex}
                                                    onClick={(event) => handleMenuItemClick(event, index)}
                                                >
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </React.Fragment>
            </>
        );
    };

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <Typography variant="h4" align="center" gutterBottom>
                        Class Details
                    </Typography>
                    {getresponse ? (
                        <>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                                No Students Found
                            </Box>
                        </>
                    ) : (
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <Typography variant="h5" gutterBottom>
                                Students List:
                            </Typography>

                            {Array.isArray(sclassStudents) && sclassStudents.length > 0 &&
                                <TableTemplate buttonHaver={StudentsButtonHaver} columns={studentColumns} rows={studentRows} />
                            }
                        <button onClick={handleTakeAttendance}>Take Attendance</button>
                        
                        </Paper>
                    )}
                </>
            )}
        </>
    );
};

export default TeacherClassDetails;
//new implementation 
// import { useEffect, useState } from "react";
// import * as React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { getClassStudents } from "../../redux/sclassRelated/sclassHandle";
// import { Paper, Box, Typography, IconButton, Grid, Button } from '@mui/material';
// import { Person, PersonOutlined } from '@mui/icons-material';
// import { PieChart, Pie, Cell, Legend } from 'recharts';
// import * as XLSX from 'xlsx';
// import { BlueButton } from "../../components/buttonStyles";

// const TeacherClassDetails = () => {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const { sclassStudents, loading, error, getresponse } = useSelector((state) => state.sclass);
//     const { currentUser } = useSelector((state) => state.user);
//     const classID = currentUser.teachSclass?._id;
//     const subjectID = currentUser.teachSubject?._id;

//     const [attendance, setAttendance] = useState({});

//     useEffect(() => {
//         dispatch(getClassStudents(classID));
//     }, [dispatch, classID]);

//     const handleAttendanceToggle = (studentId) => {
//         setAttendance((prev) => ({
//             ...prev,
//             [studentId]: {
//                 marked: !prev[studentId]?.marked,
//                 date: new Date().toLocaleDateString(),
//             }
//         }));
//     };

//     const getAttendanceIcon = (studentId) => {
//         const isPresent = attendance[studentId]?.marked;
//         return (
//             <IconButton
//                 onClick={() => handleAttendanceToggle(studentId)}
//                 sx={{
//                     fontSize: 80, // Larger icon
//                     color: isPresent ? "green" : "gray",
//                 }}
//             >
//                 {isPresent ? <Person /> : <PersonOutlined />}
//             </IconButton>
//         );
//     };

//     const presentStudents = sclassStudents.filter(student => attendance[student._id]?.marked);
//     const absentStudents = sclassStudents.filter(student => !attendance[student._id]?.marked);

//     const attendanceData = [
//         { name: 'Present', value: presentStudents.length },
//         { name: 'Absent', value: absentStudents.length }
//     ];

//     const COLORS = ["#0088FE", "#FF8042"];

//     // Export the full attendance list to Excel
//     const handleExportFullAttendanceToExcel = () => {
//         const studentsList = sclassStudents.map(student => ({
//             "Name": student.name,
//             "Roll Number": student.rollNum,
//             "Status": attendance[student._id]?.marked ? "Present" : "Absent",
//         }));

//         // Create a new worksheet and add data
//         const worksheet = XLSX.utils.json_to_sheet(studentsList);
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Full Class Attendance");

//         // Write to an Excel file
//         XLSX.writeFile(workbook, "full_class_attendance.xlsx");
//     };

//     return (
//         <>
//             {loading ? (
//                 <div>Loading...</div>
//             ) : (
//                 <>
//                     <Typography variant="h4" align="center" gutterBottom>
//                         Class Details
//                     </Typography>
//                     {getresponse ? (
//                         <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
//                             No Students Found
//                         </Box>
//                     ) : (
//                         <Paper sx={{ width: '100%', overflow: 'hidden', padding: 3 }}>
//                             <Typography variant="h5" gutterBottom>
//                                 Students List:
//                             </Typography>
//                             <Grid container spacing={4}>
//                                 {Array.isArray(sclassStudents) && sclassStudents.length > 0 && sclassStudents.map((student) => (
//                                     <Grid item xs={12} sm={6} md={4} lg={3} key={student._id} textAlign="center">
//                                         {getAttendanceIcon(student._id)}
//                                         <Typography variant="body1">{student.name}</Typography>
//                                         <Typography variant="body2">Roll Number: {student.rollNum}</Typography>
//                                         <BlueButton
//                                             variant="contained"
//                                             onClick={() => navigate(`/Teacher/class/student/${student._id}`)}
//                                             sx={{ marginTop: 1 }}
//                                         >
//                                             View
//                                         </BlueButton>
//                                     </Grid>
//                                 ))}
//                             </Grid>

//                             <Box sx={{ marginTop: 4, textAlign: 'center' }}>
//                                 <Typography variant="h6">Attendance Summary</Typography>
//                                 <PieChart width={300} height={300}>
//                                     <Pie
//                                         data={attendanceData}
//                                         cx="50%"
//                                         cy="50%"
//                                         innerRadius={60}
//                                         outerRadius={100}
//                                         fill="#8884d8"
//                                         paddingAngle={5}
//                                         dataKey="value"
//                                         label
//                                     >
//                                         {attendanceData.map((entry, index) => (
//                                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                                         ))}
//                                     </Pie>
//                                     <Legend />
//                                 </PieChart>
//                             </Box>

//                             <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 4 }}>
//                                 <Button variant="contained" color="primary" onClick={handleExportFullAttendanceToExcel}>
//                                     Export Full Class Attendance to Excel
//                                 </Button>
//                             </Box>
//                         </Paper>
//                     )}
//                 </>
//             )}
//         </>
//     );
// };

// export default TeacherClassDetails;
// import { useEffect, useState } from "react";
// import * as React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { getClassStudents } from "../../redux/sclassRelated/sclassHandle";
// import {
//   Paper,
//   Box,
//   Typography,
//   IconButton,
//   Grid,
//   Button,
// } from "@mui/material";
// import { Person, PersonOutlined } from "@mui/icons-material";
// import { PieChart, Pie, Cell, Legend } from "recharts";
// import * as XLSX from "xlsx";
// import { BlueButton } from "../../components/buttonStyles";

// const TeacherClassDetails = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { sclassStudents, loading, error, getresponse } = useSelector(
//     (state) => state.sclass
//   );
//   const { currentUser } = useSelector((state) => state.user);
//   const classID = currentUser.teachSclass?._id;
//   const subjectID = currentUser.teachSubject?._id;

//   const [attendance, setAttendance] = useState({});

//   useEffect(() => {
//     dispatch(getClassStudents(classID));
//   }, [dispatch, classID]);

//   const handleAttendanceToggle = (studentId) => {
//     setAttendance((prev) => ({
//       ...prev,
//       [studentId]: {
//         marked: !prev[studentId]?.marked,
//         date: new Date().toLocaleDateString(),
//       },
//     }));
//   };

//   const getAttendanceIcon = (studentId) => {
//     const isPresent = attendance[studentId]?.marked;
//     return (
//       <IconButton
//         onClick={() => handleAttendanceToggle(studentId)}
//         sx={{
//           fontSize: 80, // Larger icon
//           color: isPresent ? "green" : "gray",
//         }}
//       >
//         {isPresent ? <Person /> : <PersonOutlined />}
//       </IconButton>
//     );
//   };

//   const presentStudents = sclassStudents.filter(
//     (student) => attendance[student._id]?.marked
//   );
//   const absentStudents = sclassStudents.filter(
//     (student) => !attendance[student._id]?.marked
//   );

//   const attendanceData = [
//     { name: "Present", value: presentStudents.length },
//     { name: "Absent", value: absentStudents.length },
//   ];

//   const COLORS = ["#0088FE", "#FF8042"];

//   // Function to save attendance to backend or store
//   const saveAttendance = () => {
//     const presentList = presentStudents.map((student) => ({
//       studentId: student._id,
//       status: "Present",
//       date: new Date().toLocaleDateString(),
//     }));

//     // Replace the following with your actual API call or Redux dispatch
//     console.log("Saving attendance:", presentList);
//     // Example API call or Redux dispatch here:
//     // dispatch(saveAttendanceAction(presentList));
//     alert("Attendance saved!");
//   };

//   // Export the full attendance list to Excel
//   const handleExportFullAttendanceToExcel = () => {
//     const studentsList = sclassStudents.map((student) => ({
//       Name: student.name,
//       "Roll Number": student.rollNum,
//       Status: attendance[student._id]?.marked ? "Present" : "Absent",
//     }));

//     // Create a new worksheet and add data
//     const worksheet = XLSX.utils.json_to_sheet(studentsList);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Full Class Attendance");

//     // Write to an Excel file
//     XLSX.writeFile(workbook, "full_class_attendance.xlsx");
//   };

//   return (
//     <>
//       {loading ? (
//         <div>Loading...</div>
//       ) : (
//         <>
//           <Typography variant="h4" align="center" gutterBottom>
//             Class Details
//           </Typography>
//           {getresponse ? (
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "flex-end",
//                 marginTop: "16px",
//               }}
//             >
//               No Students Found
//             </Box>
//           ) : (
//             <Paper sx={{ width: "100%", overflow: "hidden", padding: 3 }}>
//               <Typography variant="h5" gutterBottom>
//                 Students List:
//               </Typography>
//               <Grid container spacing={4}>
//                 {Array.isArray(sclassStudents) &&
//                   sclassStudents.length > 0 &&
//                   sclassStudents.map((student) => (
//                     <Grid
//                       item
//                       xs={12}
//                       sm={6}
//                       md={4}
//                       lg={3}
//                       key={student._id}
//                       textAlign="center"
//                     >
//                       {getAttendanceIcon(student._id)}
//                       <Typography variant="body1">{student.name}</Typography>
//                       <Typography variant="body2">
//                         Roll Number: {student.rollNum}
//                       </Typography>
//                       <BlueButton
//                         variant="contained"
//                         onClick={() =>
//                           navigate(`/Teacher/class/student/${student._id}`)
//                         }
//                         sx={{ marginTop: 1 }}
//                       >
//                         View
//                       </BlueButton>
//                     </Grid>
//                   ))}
//               </Grid>

//               <Box sx={{ marginTop: 4, textAlign: "center" }}>
//                 <Typography variant="h6">Attendance Summary</Typography>
//                 <PieChart width={300} height={300}>
//                   <Pie
//                     data={attendanceData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={100}
//                     fill="#8884d8"
//                     paddingAngle={5}
//                     dataKey="value"
//                     label
//                   >
//                     {attendanceData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={COLORS[index % COLORS.length]}
//                       />
//                     ))}
//                   </Pie>
//                   <Legend />
//                 </PieChart>
//               </Box>

//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "center",
//                   gap: 2,
//                   marginTop: 4,
//                 }}
//               >
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={saveAttendance}
//                 >
//                   Save Attendance
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="secondary"
//                   onClick={handleExportFullAttendanceToExcel}
//                 >
//                   Export Full Class Attendance to Excel
//                 </Button>
//               </Box>
//             </Paper>
//           )}
//         </>
//       )}
//     </>
//   );
// };

// export default TeacherClassDetails;
