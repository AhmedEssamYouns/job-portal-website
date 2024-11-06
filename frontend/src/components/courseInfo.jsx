import React from 'react';
import { TextField } from '@mui/material';

const CourseInfo = ({ courseData, onInputChange }) => {
    return (
        <div>
            <TextField
                fullWidth
                label="Course Title"
                name="title"
                required
                value={courseData.title}
                onChange={onInputChange}
                margin="normal"
            />
            <TextField
                fullWidth
                required
                label="Description"
                name="description"
                value={courseData.description}
                onChange={onInputChange}
                margin="normal"
            />
            <TextField
                required
                fullWidth
                label="Language"
                name="language"
                value={courseData.language}
                onChange={onInputChange}
                margin="normal"
            />
        </div>
    );
};

export default CourseInfo;
