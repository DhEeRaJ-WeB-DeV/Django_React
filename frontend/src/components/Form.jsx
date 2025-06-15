import { useState } from "react"; // Import useState for managing component state
import api from "../api"; // Import custom Axios instance for API calls
import { useNavigate } from "react-router-dom"; // Import useNavigate to programmatically navigate
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"; // Import constants for storing token keys
import "../styles/Form.css"; // Import CSS for styling the form
import LoadingIndicator from "./Loadingindiactor";


// Form component to handle both Login and Registration
function Form({ route, method }) {
    // State variables to hold the form input values and loading status
    const [username, setUsername] = useState(""); // To track the username input
    const [password, setPassword] = useState(""); // To track the password input
    const [loading, setLoading] = useState(false); // To track if the form is submitting/loading
    const navigate = useNavigate(); // Hook for programmatic navigation

    // Determine if the form is for Login or Register based on the `method` prop
    const name = method === "login" ? "Login" : "Register";

    // Handle the form submission
    const handleSubmit = async (e) => {
        setLoading(true); // Set loading to true to display the loading indicator
        e.preventDefault(); // Prevent the default form submission behavior

        try {
            // Send the username and password to the API endpoint (route) via POST request
            const res = await api.post(route, { username, password });

            if (method === "login") {
                // If the method is "login", save the access and refresh tokens to localStorage
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/"); // Redirect to the home page after successful login
            } else {
                // If the method is "register", redirect to the login page after registration
                navigate("/login");
            }
        } catch (error) {
            // Handle errors, e.g., display an alert with the error message
            alert(error);
        } finally {
            // Always set loading back to false after the API call
            setLoading(false);
        }
    };

    // Render the form
    return (
        <form onSubmit={handleSubmit} className="form-container">
            {/* Display the form title based on the form's purpose */}
            <h1>{name}</h1>

            {/* Username input field */}
            <input
                className="form-input"
                type="text"
                value={username} // Bind the state variable to the input field
                onChange={(e) => setUsername(e.target.value)} // Update the state on change
                placeholder="Username" // Placeholder text for the input
            />

            {/* Password input field */}
            <input
                className="form-input"
                type="password"
                value={password} // Bind the state variable to the input field
                onChange={(e) => setPassword(e.target.value)} // Update the state on change
                placeholder="Password" // Placeholder text for the input
            />

            
            {loading && <LoadingIndicator />}

            {/* Submit button */}
            <button className="form-button" type="submit">
                {name} {/* Button label changes based on form purpose */}
            </button>
        </form>
    );
}

export default Form; // Export the Form component
