import React from "react";
import { useParams } from "react-router-dom"; // Assuming React Router is used
import CoursesList from "../../shared/Course/client/CoursesList";
import { Container } from "@mui/material";

const MyCourse = () => {
    const { fetchType } = useParams(); 

    return (
        <Container maxWidth="lg" sx={{ marginTop: '20px' }}>
            <CoursesList showPlaceholder fetchType={fetchType} />
        </Container>
    );
};

export default MyCourse;
