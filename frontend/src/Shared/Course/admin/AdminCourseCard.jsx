import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    CardActions,
    Box,
    IconButton,
    useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    SiHtml5,
    SiCss3,
    SiJavascript,
    SiPython,
    SiCplusplus,
    SiRuby,
    SiPhp,
    SiCsharp,
    SiSwift,
    SiTypescript,
    SiKotlin
} from 'react-icons/si';

const languageIcons = {
    javascript: { icon: <SiJavascript />, color: '#F7DF1E' },
    python: { icon: <SiPython />, color: '#306998' },
    cpp: { icon: <SiCplusplus />, color: '#00599C' },
    ruby: { icon: <SiRuby />, color: '#CC342D' },
    html: { icon: <SiHtml5 />, color: '#E44D26' },
    css: { icon: <SiCss3 />, color: '#1572B6' },
    php: { icon: <SiPhp />, color: '#8993BE' },
    csharp: { icon: <SiCsharp />, color: '#239120' },
    swift: { icon: <SiSwift />, color: '#F05138' },
    typescript: { icon: <SiTypescript />, color: '#007ACC' },
    kotlin: { icon: <SiKotlin />, color: '#F18E33' },
};

const placeholderIconUrl = 'https://assets.xcelpros.com/wp-content/uploads/2023/04/28141538/icm-icon-code.png';

const AdminCourseCard = ({ course, onEdit, onDelete }) => {
    const theme = useTheme();

    const handleDeleteClick = () => {
        const confirmation = window.confirm('Are you sure you want to delete this course?');
        if (confirmation) {
            onDelete(course._id); // Call the onDelete function passed as prop
        } else {
            console.log('Course deletion cancelled');
        }
    };

    return (
        <Card
            sx={{
                width: '100%',
                maxWidth: '400px',
                height: '200px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: 3,
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                overflow: 'visible',
                marginBottom: 2
            }}
        >
            <CardContent sx={{ flexGrow: 1, paddingTop: '5px' }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: '10px',
                    }}
                >
                    {languageIcons[course.language.toLowerCase()] ? (
                        <Box
                            sx={{
                                color: languageIcons[course.language.toLowerCase()].color,
                                fontSize: '1.8rem', // Smaller icon size
                                marginRight: '10px',
                            }}
                        >
                            {languageIcons[course.language.toLowerCase()].icon}
                        </Box>
                    ) : (
                        <img
                            src={placeholderIconUrl}
                            alt="Programming Icon"
                            style={{ width: '1.8rem', height: '1.8rem', marginRight: '10px' }} // Adjusted size
                        />
                    )}
                    <Typography variant="h8" component="div" width={'200px'} sx={{ fontWeight: 'bold' }}>
                        {course.title}
                    </Typography>
                    <CardActions sx={{ justifyContent: 'flex-end', background: theme.palette.action.focus, marginLeft: 1, borderRadius: 20 }}>
                        <IconButton onClick={() => onEdit(course)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={handleDeleteClick} color="error">
                            <DeleteIcon />
                        </IconButton>
                    </CardActions>
                </Box>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 1,
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        WebkitLineClamp: 3, // Limits to 3 lines
                        textOverflow: 'ellipsis', // Add ellipsis
                    }}
                >
                    {course.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <strong>Language:</strong> {course.language}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default AdminCourseCard;
