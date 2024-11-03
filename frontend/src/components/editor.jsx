import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import {
    Box,
    Button,
    Container,
    Typography,
    Paper,
    Alert
} from '@mui/material';

const FactorialCompiler = () => {
    const [code, setCode] = useState(`// Write your factorial function here\n\nfunction factorial(n) {\n    // Your code goes here\n}`);
    const [output, setOutput] = useState('');
    const [feedback, setFeedback] = useState('');
    
    // Define the expected answer for factorial(5)
    const expectedAnswer = "120"; // Expected output for factorial(5)

    const handleRunCode = () => {
        try {
            // Create a function to execute the code and capture console.log output
            const func = new Function(code + `\nconsole.log(factorial(5));`); // Call the factorial function
            // Redirect console.log to capture output
            const oldLog = console.log;
            let outputArray = [];
            console.log = (...args) => {
                outputArray.push(args.join(' ')); // Capture console.log arguments
            };

            func(); // Execute the user code

            console.log = oldLog; // Restore the original console.log
            const resultOutput = outputArray.length > 0 ? outputArray.join('\n') : 'No output'; // Set output
            setOutput(resultOutput);
            
            // Check if the output matches the expected answer
            if (resultOutput.trim() === expectedAnswer) {
                setFeedback("Correct! Your output matches the expected answer.");
            } else {
                setFeedback("Incorrect. Please try again.");
            }
        } catch (error) {
            setOutput(`Error: ${error.message}`); // Catch any errors during execution
            setFeedback(""); // Clear feedback on error
        }
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" align="center" gutterBottom>
                JavaScript Factorial Problem
            </Typography>
            <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography variant="h6" gutterBottom>
                    Question: Write a function factorial(n) that returns the factorial of n. Example: factorial(5) should return 120.
                </Typography>
                <Editor
                    height="400px"
                    defaultLanguage="javascript"
                    theme='vs-dark'
                    defaultValue={code}
                    onChange={(value) => setCode(value)} // Update code state on change
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleRunCode}
                    style={{ marginTop: '20px' }}
                >
                    Run Code
                </Button>
                <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                    Output:
                </Typography>
                <Paper elevation={1} style={{ padding: '10px', whiteSpace: 'pre-wrap' }}>
                    {output}
                </Paper>
                {feedback && <Alert severity={feedback.includes("Correct") ? "success" : "error"} style={{ marginTop: '20px' }}>{feedback}</Alert>}
            </Paper>
        </Container>
    );
};

export default FactorialCompiler;
