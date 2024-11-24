import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { Container, Grid, Paper, Button, Typography } from "@mui/material";
import SeeNotice from "../../components/SeeNotice";
import Students from "../../assets/img1.png";
import Classes from "../../assets/img2.png";
import Teachers from "../../assets/img3.png";
import Fees from "../../assets/img4.png";
import styled from "styled-components";
import CountUp from "react-countup";
import { useSelector } from "react-redux";

const AdminHomePage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [studentsData, setStudentsData] = useState([]);
  const [message, setMessage] = useState("");

  const adminID = currentUser._id;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0]; // Get the first sheet
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet); // Convert sheet to JSON

        // Format the data to match the required structure
        const formattedData = jsonData.map((item) => ({
          Name: item["Name"], // 'Name' from Excel column
          RollNumber: item["Roll Number"], // 'Roll Number' from Excel column
          Password: item["Password"], // 'Password' from Excel column
          Class: item["Class"], // 'Class' from Excel column
        }));

        setStudentsData(formattedData);
      };
      reader.readAsBinaryString(file);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      if (studentsData.length === 0) {
        setMessage("No students data to upload.");
        return;
      }

      // Send the parsed students data to the backend
      const response = await axios.post(
        "http://localhost:2003/upload-students",
        { students: studentsData }
      );

      if (response.data.success) {
        setMessage("Students added successfully!");
      } else {
        setMessage("Failed to add students.");
      }
    } catch (error) {
      console.error("Error while uploading students:", error);
      setMessage("An error occurred while uploading students.");
    }
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3} lg={3}>
            <StyledPaper>
              <img src={Students} alt="Students" />
              <Title>Total Students</Title>
              <Data start={0} end={100} duration={2.5} />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <StyledPaper>
              <img src={Classes} alt="Classes" />
              <Title>Total Classes</Title>
              <Data start={0} end={5} duration={5} />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <StyledPaper>
              <img src={Teachers} alt="Teachers" />
              <Title>Total Teachers</Title>
              <Data start={0} end={50} duration={2.5} />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <StyledPaper>
              <img src={Fees} alt="Fees" />
              <Title>Fees Collection</Title>
              <Data start={0} end={23000} duration={2.5} prefix="$" />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <SeeNotice />
            </Paper>
          </Grid>

          {/* File Upload Section */}
          <Grid item xs={12} md={12} lg={12}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Upload Students (Excel)
              </Typography>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ mt: 2 }}
              >
                Upload Students
              </Button>
              {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

const StyledPaper = styled(Paper)`
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 200px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`;

const Title = styled.p`
  font-size: 1.25rem;
`;

const Data = styled(CountUp)`
  font-size: calc(1.3rem + 0.6vw);
  color: green;
`;

export default AdminHomePage; 
