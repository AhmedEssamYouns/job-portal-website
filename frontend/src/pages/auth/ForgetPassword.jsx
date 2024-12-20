import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  useMediaQuery,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { forgotPassword, verifyResetCode, resetPassword } from "../../services/users"; // Import the new API functions

const ForgetPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: Array(6).fill(""),
    newPassword: "",
    confirmPassword: "", // Add state for confirm password
  });
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState(""); // Add state for storing the reset token
  const [codeVerified, setCodeVerified] = useState(false); // State for tracking code verification
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSnackbarMessage("");
    setLoading(true);

    try {
      if (!formData.email) {
        throw new Error("Email is required.");
      }

      // Call the forgotPassword API
      const response = await forgotPassword(formData.email);

      // On success, update the UI to show code confirmation
      setEmailVerified(true);
      setCodeSent(true);
      setSnackbarMessage(response.message);
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error sending email:", error.message);
      setError(error.message);
      setSnackbarMessage(error.message);
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSnackbarMessage("");
    setLoading(true);

    try {
      const code = formData.verificationCode.join(""); // Combine code into a string
      if (!code) {
        throw new Error("Verification code is required.");
      }

      // Call the verifyResetCode API
      const response = await verifyResetCode(formData.email, code);
      setResetToken(response.token); // Store the token on successful verification
      setCodeVerified(true); // Mark the code as verified
      setSnackbarMessage(response.message);
      setOpenSnackbar(true);
    } catch (error) {
      setError(error.message);
      setSnackbarMessage(error.message);
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };
  console.log("Reset token:", resetToken);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSnackbarMessage("");
    setLoading(true);
  
    try {
      if (!formData.newPassword) {
        throw new Error("New password is required.");
      }
      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error("Passwords do not match.");
      }
  
      // Call the resetPassword API
      const response = await resetPassword(formData.newPassword, resetToken);
      setSnackbarMessage(response.message);
      alert(response.message); // Show the alert with the response message
  
      // After the alert is closed, navigate to the signin page
      navigate("/signin");
    } catch (error) {
      setError(error.message);
      setSnackbarMessage(error.message);
      alert(error.message); // Show the error message in an alert
    } finally {
      setLoading(false);
    }
  };


  const handleCodeChange = (e, index) => {
    const newVerificationCode = [...formData.verificationCode];
    newVerificationCode[index] = e.target.value;
    setFormData({ ...formData, verificationCode: newVerificationCode });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Grid container sx={{ height: isMobile ? "auto" : "80vh" }}>
      {!isMobile && (
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src="https://cdni.iconscout.com/illustration/premium/thumb/password-reset-8694031-6983270.png"
            alt="Illustrative image"
            sx={{
              width: "70%",
              height: "auto",
              maxWidth: "80%",
              objectFit: "contain",
            }}
          />
        </Grid>
      )}

      <Grid
        item
        xs={12}
        sm={6}
        display="flex"
        flexDirection="column"
        sx={{
          background:
            "linear-gradient(135deg, rgba(25, 118, 210, 0.5), rgba(66, 165, 245, 0.5))",
          borderBottomLeftRadius: "100px",
          justifyContent: "center",
          height: "auto",
          borderRadius: "0px",
          margin: "0px",
          [theme.breakpoints.down("sm")]: {
            borderBottomRightRadius: "100px",
            borderTopLeftRadius: "100px",
            borderTopRightRadius: "100px",
            marginTop: "20px",
            marginRight: "10px",
            marginLeft: "10px",
            height: "75vh",
          },
        }}
        padding={2}
        gap={5}
        alignItems="center"
      >
        <Box textAlign="center">
          <Typography variant="h6">
            Reset your password to regain access to your account.
          </Typography>
        </Box>

        <Card sx={{ width: "90%", maxWidth: 400, borderRadius: 10, boxShadow: 5 }}>
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom>
              {emailVerified ? (codeVerified ? "Reset Password" : "Confirm Code") : "Verify Email"}
            </Typography>

            {!emailVerified ? (
              <form onSubmit={handleEmailSubmit}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Verify Email"
                  )}
                </Button>
              </form>
            ) : (
              <>
                {codeVerified ? (
                  <form onSubmit={handlePasswordSubmit}>
                    <TextField
                      label="New Password"
                      name="newPassword"
                      type="password"
                      required
                      value={formData.newPassword}
                      onChange={handleChange}
                      fullWidth
                      sx={{ marginTop: 2 }}
                    />
                    <TextField
                      label="Confirm New Password"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      fullWidth
                      sx={{ marginTop: 2 }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ marginTop: 2 }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Reset Password"
                      )}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleCodeSubmit}>
                    <Typography variant="body1" align="center" gutterBottom>
                      A verification code has been sent to your email. Please enter it below.
                    </Typography>
                    <Grid container spacing={1} justifyContent="center">
                      {formData.verificationCode.map((code, index) => (
                        <Grid
                          item
                          key={index}
                          xs={2}
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <TextField
                            value={code}
                            onChange={(e) => handleCodeChange(e, index)}
                            inputProps={{
                              maxLength: 1,
                              style: { textAlign: "center", fontSize: "18px" },
                            }}
                            required
                            variant="outlined"
                            fullWidth
                          />
                        </Grid>
                      ))}
                    </Grid>

                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ marginTop: 2 }}
                    >
                      Confirm Code
                    </Button>
                  </form>
                )}
              </>
            )}

            {error && (
              <Alert severity="error" sx={{ marginTop: 2 }}>
                {error}
              </Alert>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default ForgetPassword;
