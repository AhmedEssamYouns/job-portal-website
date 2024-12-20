import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { checkLogin, fetchUserById } from "../services/users";

const AdminRoute = () => {
  const [isAdmin, setIsAdmin] = useState(null); // Explicitly track admin status
  const [loading, setLoading] = useState(true);

  const CurrentUser = checkLogin();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
    
        if (!CurrentUser) throw new Error("User not logged in");
        
        const userData = await fetchUserById(CurrentUser.id); // Fetch user data
        setIsAdmin(userData?.isAdmin || false); // Check if user is an admin
      } catch (error) {
        console.error("Error verifying admin status:", error.message);
        setIsAdmin(false); // Explicitly set isAdmin to false on error
      } finally {
        setLoading(false); // End loading state
      }
    };

    checkAdminStatus();
  }, []);

  // Show loading spinner while checking admin status
  if (loading) return <div>Loading...</div>;

  // If not admin, redirect to the SignIn page
  return isAdmin ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default AdminRoute;
