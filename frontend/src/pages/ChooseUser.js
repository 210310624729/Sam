// import { AccountCircle, Group, School } from '@mui/icons-material';
// import {
//   Backdrop,
//   Box,
//   CircularProgress,
//   Container,
//   Grid,
//   Paper,
// } from '@mui/material';
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import styled from 'styled-components';
// import Popup from '../components/Popup';
// import { loginUser } from '../redux/userRelated/userHandle';

// const ChooseUser = ({ visitor }) => {
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const password = "zxc"

//   const { status, currentUser, currentRole } = useSelector(state => state.user);;

//   const [loader, setLoader] = useState(false)
//   const [showPopup, setShowPopup] = useState(false);
//   const [message, setMessage] = useState("");

//   const navigateHandler = (user) => {
//     if (user === "Admin") {
//       if (visitor === "guest") {
//         const email = "yogendra@12"
//         const fields = { email, password }
//         setLoader(true)
//         dispatch(loginUser(fields, user))
//       }
//       else {
//         navigate('/Adminlogin');
//       }
//     }

//     else if (user === "Student") {
//       if (visitor === "guest") {
//         const rollNum = "1"
//         const studentName = "Dipesh Awasthi"
//         const fields = { rollNum, studentName, password }
//         setLoader(true)
//         dispatch(loginUser(fields, user))
//       }
//       else {
//         navigate('/Studentlogin');
//       }
//     }

//     else if (user === "Teacher") {
//       if (visitor === "guest") {
//         const email = "tony@12"
//         const fields = { email, password }
//         setLoader(true)
//         dispatch(loginUser(fields, user))
//       }
//       else {
//         navigate('/Teacherlogin');
//       }
//     }
//   }

//   useEffect(() => {
//     if (status === 'success' || currentUser !== null) {
//       if (currentRole === 'Admin') {
//         navigate('/Admin/dashboard');
//       }
//       else if (currentRole === 'Student') {
//         navigate('/Student/dashboard');
//       } else if (currentRole === 'Teacher') {
//         navigate('/Teacher/dashboard');
//       }
//     }
//     else if (status === 'error') {
//       setLoader(false)
//       setMessage("Network Error")
//       setShowPopup(true)
//     }
//   }, [status, currentRole, navigate, currentUser]);

//   return (
//     <StyledContainer>
//       <Container>
//         <Grid container spacing={2} justifyContent="center">
//           <Grid item xs={12} sm={6} md={4}>
//             <div onClick={() => navigateHandler("Admin")}>
//               <StyledPaper elevation={3}>
//                 <Box mb={2}>
//                   <AccountCircle fontSize="large" />
//                 </Box>
//                 <StyledTypography>
//                   Admin
//                 </StyledTypography>
//                 Login as an administrator to access the dashboard to manage app data.
//               </StyledPaper>
//             </div>
//           </Grid>
//           <Grid item xs={12} sm={6} md={4}>
//             <StyledPaper elevation={3}>
//               <div onClick={() => navigateHandler("Student")}>
//                 <Box mb={2}>
//                   <School fontSize="large" />
//                 </Box>
//                 <StyledTypography>
//                   Student
//                 </StyledTypography>
//                 Login as a student to explore course materials and assignments.
//               </div>
//             </StyledPaper>
//           </Grid>
//           <Grid item xs={12} sm={6} md={4}>
//             <StyledPaper elevation={3}>
//               <div onClick={() => navigateHandler("Teacher")}>
//                 <Box mb={2}>
//                   <Group fontSize="large" />
//                 </Box>
//                 <StyledTypography>
//                   Teacher
//                 </StyledTypography>
//                 Login as a teacher to create courses, assignments, and track student progress.
//               </div>
//             </StyledPaper>
//           </Grid>
//         </Grid>
//       </Container>
//       <Backdrop
//         sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
//         open={loader}
//       >
//         <CircularProgress color="inherit" />
//         Please Wait
//       </Backdrop>
//       <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
//     </StyledContainer>
//   );
// };

// export default ChooseUser;

// const StyledContainer = styled.div`
//   background: linear-gradient(to bottom, #411d70, #19118b);
//   height: 120vh;
//   display: flex;
//   justify-content: center;
//   padding: 2rem;
// `;

// const StyledPaper = styled(Paper)`
//   padding: 20px;
//   text-align: center;
//   background-color: #1f1f38;
//   color:rgba(255, 255, 255, 0.6);
//   cursor:pointer;

//   &:hover {
//     background-color: #2c2c6c;
//     color:white;
//   }
// `;

// const StyledTypography = styled.h2`
//   margin-bottom: 10px;
// `;

import { AccountCircle, Group, School } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  CircularProgress,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Popup from "../components/Popup";
import { loginUser } from "../redux/userRelated/userHandle";

const ChooseUser = ({ visitor }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const password = "zxc";

  const { status, currentUser, currentRole } = useSelector(
    (state) => state.user
  );

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const navigateHandler = (user) => {
    if (user === "Admin") {
      if (visitor === "guest") {
        const email = "yogendra@12";
        const fields = { email, password };
        setLoader(true);
        dispatch(loginUser(fields, user));
      } else {
        navigate("/Adminlogin");
      }
    } else if (user === "Student") {
      if (visitor === "guest") {
        const rollNum = "1";
        const studentName = "Dipesh Awasthi";
        const fields = { rollNum, studentName, password };
        setLoader(true);
        dispatch(loginUser(fields, user));
      } else {
        navigate("/Studentlogin");
      }
    } else if (user === "Teacher") {
      if (visitor === "guest") {
        const email = "tony@12";
        const fields = { email, password };
        setLoader(true);
        dispatch(loginUser(fields, user));
      } else {
        navigate("/Teacherlogin");
      }
    }
  };

  useEffect(() => {
    if (status === "success" || currentUser !== null) {
      if (currentRole === "Admin") {
        navigate("/Admin/dashboard");
      } else if (currentRole === "Student") {
        navigate("/Student/dashboard");
      } else if (currentRole === "Teacher") {
        navigate("/Teacher/dashboard");
      }
    } else if (status === "error") {
      setLoader(false);
      setMessage("Network Error");
      setShowPopup(true);
    }
  }, [status, currentRole, navigate, currentUser]);

  return (
    <StyledContainer>
      <Container>
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <StyledDiv onClick={() => navigateHandler("Admin")}>
              <Box mb={2}>
                <AccountCircle fontSize="large" />
              </Box>
              <StyledTypography>Admin</StyledTypography>
              Login as an administrator to access the dashboard to manage app
              data.
              <Arrow className="arrow" />
            </StyledDiv>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StyledDiv onClick={() => navigateHandler("Student")}>
              <Box mb={2}>
                <School fontSize="large" />
              </Box>
              <StyledTypography>Student</StyledTypography>
              Login as a student to explore course materials and assignments.
              <Arrow className="arrow" />
            </StyledDiv>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StyledDiv onClick={() => navigateHandler("Teacher")}>
              <Box mb={2}>
                <Group fontSize="large" />
              </Box>
              <StyledTypography>Teacher</StyledTypography>
              Login as a teacher to create courses, assignments, and track
              student progress.
              <Arrow className="arrow" />
            </StyledDiv>
          </Grid>
        </Grid>
      </Container>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loader}
      >
        <CircularProgress color="inherit" />
        Please Wait
      </Backdrop>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </StyledContainer>
  );
};

export default ChooseUser;

const StyledContainer = styled.div`
  background: linear-gradient(to bottom, #4a90e2, #00509e);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const StyledDiv = styled(Paper)`
  padding: 20px;
  text-align: center;
  background-color: #f2f2f2;
  color: rgba(0, 0, 0, 0.7);
  cursor: pointer;
  width: 280px;
  height: 200px;
  position: relative;
  transition: transform 0.3s, background-color 0.3s;

  &:hover {
    background-color: #e0e0e0;
    transform: scale(1.05);
    color: black;

    .arrow {
      background-color: #00509e;
    }
  }
`;

const StyledTypography = styled.h2`
  margin-bottom: 10px;
  font-size: 1.5rem;
  color: #00509e;
`;

const Arrow = styled.div`
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  background-color: #e0e0e0;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s;

  &:after {
    content: "➔";
    color: white;
    font-size: 16px;
  }
`;
