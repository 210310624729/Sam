// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import {
//   Backdrop,
//   Box,
//   Checkbox,
//   CircularProgress,
//   CssBaseline,
//   FormControlLabel,
//   Grid,
//   IconButton,
//   InputAdornment,
//   Paper,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import styled from "styled-components";
// import bgpic from "../assets/designlogin.jpg";
// import Popup from "../components/Popup";
// import { LightPurpleButton } from "../components/buttonStyles";
// import { loginUser } from "../redux/userRelated/userHandle";

// const defaultTheme = createTheme();

// const LoginPage = ({ role }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { status, currentUser, response, error, currentRole } = useSelector(
//     (state) => state.user
//   );

//   const [toggle, setToggle] = useState(false);
//   const [guestLoader, setGuestLoader] = useState(false);
//   const [loader, setLoader] = useState(false);
//   const [showPopup, setShowPopup] = useState(false);
//   const [message, setMessage] = useState("");

//   const [emailError, setEmailError] = useState(false);
//   const [passwordError, setPasswordError] = useState(false);
//   const [rollNumberError, setRollNumberError] = useState(false);
//   const [studentNameError, setStudentNameError] = useState(false);

//   const handleSubmit = (event) => {
//     event.preventDefault();

//     if (role === "Student") {
//       const rollNum = event.target.rollNumber.value;
//       const studentName = event.target.studentName.value;
//       const password = event.target.password.value;

//       if (!rollNum || !studentName || !password) {
//         if (!rollNum) setRollNumberError(true);
//         if (!studentName) setStudentNameError(true);
//         if (!password) setPasswordError(true);
//         return;
//       }
//       const fields = { rollNum, studentName, password };
//       setLoader(true);
//       dispatch(loginUser(fields, role));
//     } else {
//       const email = event.target.email.value;
//       const password = event.target.password.value;

//       if (!email || !password) {
//         if (!email) setEmailError(true);
//         if (!password) setPasswordError(true);
//         return;
//       }

//       const fields = { email, password };
//       setLoader(true);
//       dispatch(loginUser(fields, role));
//     }
//   };

//   const handleInputChange = (event) => {
//     const { name } = event.target;
//     if (name === "email") setEmailError(false);
//     if (name === "password") setPasswordError(false);
//     if (name === "rollNumber") setRollNumberError(false);
//     if (name === "studentName") setStudentNameError(false);
//   };

//   const guestModeHandler = () => {
//     const password = "zxc";

//     if (role === "Admin") {
//       const email = "yogendra@12";
//       const fields = { email, password };
//       setGuestLoader(true);
//       dispatch(loginUser(fields, role));
//     } else if (role === "Student") {
//       const rollNum = "1";
//       const studentName = "Dipesh Awasthi";
//       const fields = { rollNum, studentName, password };
//       setGuestLoader(true);
//       dispatch(loginUser(fields, role));
//     } else if (role === "Teacher") {
//       const email = "tony@12";
//       const fields = { email, password };
//       setGuestLoader(true);
//       dispatch(loginUser(fields, role));
//     }
//   };

//   useEffect(() => {
//     if (status === "success" || currentUser !== null) {
//       if (currentRole === "Admin") {
//         navigate("/Admin/dashboard");
//       } else if (currentRole === "Student") {
//         navigate("/Student/dashboard");
//       } else if (currentRole === "Teacher") {
//         navigate("/Teacher/dashboard");
//       }
//     } else if (status === "failed") {
//       setMessage(response);
//       setShowPopup(true);
//       setLoader(false);
//     } else if (status === "error") {
//       setMessage("Network Error");
//       setShowPopup(true);
//       setLoader(false);
//       setGuestLoader(false);
//     }
//   }, [status, currentRole, navigate, error, response, currentUser]);

//   return (
//     <ThemeProvider theme={defaultTheme}>
//       <Grid container component="main" sx={{ height: "100vh" }}>
//         <CssBaseline />
//         <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
//           <Box
//             sx={{
//               my: 8,
//               mx: 4,
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//             }}
//           >
//             <Typography variant="h4" sx={{ mb: 2, color: "#2c2143" }}>
//               {role} Login
//             </Typography>
//             <Typography variant="h7">
//               Welcome back! Please enter your details
//             </Typography>
//             <Box
//               component="form"
//               noValidate
//               onSubmit={handleSubmit}
//               sx={{ mt: 2 }}
//             >
//               {role === "Student" ? (
//                 <>
//                   <TextField
//                     margin="normal"
//                     required
//                     fullWidth
//                     id="rollNumber"
//                     label="Enter your Roll Number"
//                     name="rollNumber"
//                     autoComplete="off"
//                     type="number"
//                     autoFocus
//                     error={rollNumberError}
//                     helperText={rollNumberError && "Roll Number is required"}
//                     onChange={handleInputChange}
//                   />
//                   <TextField
//                     margin="normal"
//                     required
//                     fullWidth
//                     id="studentName"
//                     label="Enter your name"
//                     name="studentName"
//                     autoComplete="name"
//                     autoFocus
//                     error={studentNameError}
//                     helperText={studentNameError && "Name is required"}
//                     onChange={handleInputChange}
//                   />
//                 </>
//               ) : (
//                 <TextField
//                   margin="normal"
//                   required
//                   fullWidth
//                   id="email"
//                   label="Enter your email"
//                   name="email"
//                   autoComplete="email"
//                   autoFocus
//                   error={emailError}
//                   helperText={emailError && "Email is required"}
//                   onChange={handleInputChange}
//                 />
//               )}
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 name="password"
//                 label="Password"
//                 type={toggle ? "text" : "password"}
//                 id="password"
//                 autoComplete="current-password"
//                 error={passwordError}
//                 helperText={passwordError && "Password is required"}
//                 onChange={handleInputChange}
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <IconButton onClick={() => setToggle(!toggle)}>
//                         {toggle ? <Visibility /> : <VisibilityOff />}
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//               <Grid
//                 container
//                 sx={{ display: "flex", justifyContent: "space-between" }}
//               >
//                 <FormControlLabel
//                   control={<Checkbox value="remember" color="primary" />}
//                   label="Remember me"
//                 />
//                 <StyledLink href="#">Forgot password?</StyledLink>
//               </Grid>
//               <LightPurpleButton
//                 type="submit"
//                 fullWidth
//                 variant="contained"
//                 sx={{ mt: 3 }}
//               >
//                 {loader ? (
//                   <CircularProgress size={24} color="inherit" />
//                 ) : (
//                   "Login"
//                 )}
//               </LightPurpleButton>
//               {/* <Button
//                                 fullWidth
//                                 onClick={guestModeHandler}
//                                 variant="outlined"
//                                 sx={{ mt: 2, mb: 3, color: "#7f56da", borderColor: "#7f56da" }}
//                             >
//                                 Login as Guest
//                             </Button> */}
//               {role === "Admin" && (
//                 <Grid container>
//                   <Grid>Don't have an account?</Grid>
//                   <Grid item sx={{ ml: 2 }}>
//                     <StyledLink to="/Adminregister">Sign up</StyledLink>
//                   </Grid>
//                 </Grid>
//               )}
//             </Box>
//           </Box>
//         </Grid>
//         <Grid
//           item
//           xs={false}
//           sm={4}
//           md={7}
//           sx={{
//             backgroundImage: `url(${bgpic})`,
//             backgroundRepeat: "no-repeat",
//             backgroundColor: (t) =>
//               t.palette.mode === "light"
//                 ? t.palette.grey[50]
//                 : t.palette.grey[900],
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//           }}
//         />
//       </Grid>
//       <Backdrop
//         sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
//         open={guestLoader}
//       >
//         <CircularProgress color="primary" />
//         Please Wait
//       </Backdrop>
//       <Popup
//         message={message}
//         setShowPopup={setShowPopup}
//         showPopup={showPopup}
//       />
//     </ThemeProvider>
//   );
// };

// export default LoginPage;

// const StyledLink = styled(Link)`
//   margin-top: 9px;
//   text-decoration: none;
//   color: #7f56da;
// `;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../redux/userRelated/userHandle";
import Popup from "../components/Popup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Backdrop,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginPage = ({ role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, currentUser, response, error, currentRole } = useSelector(
    (state) => state.user
  );

  const [toggle, setToggle] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [rollNumberError, setRollNumberError] = useState(false);
  const [studentNameError, setStudentNameError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (role === "Student") {
      const rollNum = event.target.rollNumber.value;
      const studentName = event.target.studentName.value;
      const password = event.target.password.value;

      if (!rollNum || !studentName || !password) {
        if (!rollNum) setRollNumberError(true);
        if (!studentName) setStudentNameError(true);
        if (!password) setPasswordError(true);
        return;
      }
      const fields = { rollNum, studentName, password };
      setLoader(true);
      dispatch(loginUser(fields, role));
    } else {
      const email = event.target.email.value;
      const password = event.target.password.value;

      if (!email || !password) {
        if (!email) setEmailError(true);
        if (!password) setPasswordError(true);
        return;
      }

      const fields = { email, password };
      setLoader(true);
      dispatch(loginUser(fields, role));
    }
  };

  const handleInputChange = (event) => {
    const { name } = event.target;
    if (name === "email") setEmailError(false);
    if (name === "password") setPasswordError(false);
    if (name === "rollNumber") setRollNumberError(false);
    if (name === "studentName") setStudentNameError(false);
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
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, currentRole, navigate, error, response, currentUser]);

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card p-4 shadow-lg"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h2 className="text-primary text-center mb-3">{role} Login</h2>
        <p className="text-center text-secondary">
          Welcome back! Please enter your details
        </p>
        <form noValidate onSubmit={handleSubmit}>
          {role === "Student" ? (
            <>
              <div className="mb-3">
                <label htmlFor="rollNumber" className="form-label">
                  Roll Number
                </label>
                <input
                  type="number"
                  className={`form-control ${
                    rollNumberError ? "is-invalid" : ""
                  }`}
                  id="rollNumber"
                  name="rollNumber"
                  onChange={handleInputChange}
                />
                {rollNumberError && (
                  <div className="invalid-feedback">
                    Roll Number is required
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="studentName" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    studentNameError ? "is-invalid" : ""
                  }`}
                  id="studentName"
                  name="studentName"
                  onChange={handleInputChange}
                />
                {studentNameError && (
                  <div className="invalid-feedback">Name is required</div>
                )}
              </div>
            </>
          ) : (
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className={`form-control ${emailError ? "is-invalid" : ""}`}
                id="email"
                name="email"
                onChange={handleInputChange}
              />
              {emailError && (
                <div className="invalid-feedback">Email is required</div>
              )}
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-group">
              <input
                type={toggle ? "text" : "password"}
                className={`form-control ${passwordError ? "is-invalid" : ""}`}
                id="password"
                name="password"
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setToggle(!toggle)}
              >
                {toggle ? <Visibility /> : <VisibilityOff />}
              </button>
            </div>
            {passwordError && (
              <div className="invalid-feedback">Password is required</div>
            )}
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="remember"
              value="remember"
            />
            <label className="form-check-label" htmlFor="remember">
              Remember me
            </label>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loader}
          >
            {loader ? <CircularProgress size={20} color="inherit" /> : "Login"}
          </button>
        </form>
      </div>
      <Backdrop sx={{ color: "#fff", zIndex: 1301 }} open={loader}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </div>
  );
};

export default LoginPage;

