import { Navigate } from "react-router-dom";  // Import Navigate to redirect users if not authorized
import { jwtDecode } from "jwt-decode";  // Import jwtDecode to decode the JWT token and check its expiration
import api from "../api";  // Import the configured API instance for making requests
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";  // Import constants for token keys
import { useState, useEffect } from "react";  // Import React hooks for managing state and side effects

// ProtectedRoute component to ensure users are authenticated before accessing protected routes
const ProtectedRoute = ({ children }) =>{
    const [isAuthorized, setIsAuthorized] = useState(null);  // State to track authorization status

    // useEffect hook runs the auth function on initial render to check if user is authorized
    useEffect(() => {
        auth().catch(() => setIsAuthorized(false));  // If auth fails, mark as not authorized
    }, []);

    // Function to refresh the access token using the refresh token
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);  // Get the refresh token from localStorage
        try {
            const res = await api.post("/api/token/refresh/", {  // Make a request to the refresh endpoint
                refresh: refreshToken,
            });

            // If the response is successful, store the new access token and authorize the user
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);  // Save new access token to localStorage
                setIsAuthorized(true);  // Mark user as authorized
            } else {
                setIsAuthorized(false);  // Mark user as unauthorized if refresh fails
            }
        } catch (error) {
            console.log(error);  // Log any errors that occur during token refresh
            setIsAuthorized(false);  // Mark user as unauthorized if error occurs
        }
    };

    // Function to check if the user is authenticated based on token expiration
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);  // Get the access token from localStorage
        if (!token) {
            setIsAuthorized(false);  // If no access token, mark user as unauthorized
            return;
        }

        const decoded = jwtDecode(token);  // Decode the token to get its expiration date
        const tokenExpiration = decoded.exp;  // Get expiration time from the decoded token
        const now = Date.now() / 1000;  // Get current time in seconds

        // If token is expired, attempt to refresh it
        if (tokenExpiration < now) {
            await refreshToken();  // Refresh the token if expired
        } else {
            setIsAuthorized(true);  // If token is valid, mark user as authorized
        }
    };

    // If authorization status is still being determined, show loading indicator
    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    // If the user is authorized, render the protected content (children); otherwise, redirect to login page
    return isAuthorized ? children : <Navigate to="/login" />;  // Redirect to login page if not authorized
}

export default ProtectedRoute;  // Export ProtectedRoute component for use in other parts of the app
