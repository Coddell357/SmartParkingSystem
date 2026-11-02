import "../App.css";
import React, { useState } from "react";
//import parkitechlogo from "../assets/parkitechlogo.png";
import { useNavigate } from "react-router-dom";

// Firebase imports for authentication
/* Firebase, 2026 */
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../config/firebase";

const API_URL = import.meta.env.VITE_API_URL;

export const Register: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [userNumber, setUserNumber] = useState("");
const [employeeNumber, setEmployeeNumber] = useState("");
const [assignedShift, setAssignedShift] = useState("Day");
  const [password, setPassword] = useState("");
  
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Password requirements 
  const passwordRequirements = {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>[\]\\/'`~;_+=-]/.test(password),
  };

  // Password is valid only when ALL requirements are met 
  const isPasswordValid =
    passwordRequirements.minLength &&
    passwordRequirements.uppercase &&
    passwordRequirements.lowercase &&
    passwordRequirements.number &&
    passwordRequirements.special;

  // Confirm password is valid only when it matches the password 
  const isConfirmPasswordValid =
    confirmPassword.length > 0 &&
    password === confirmPassword &&
    isPasswordValid;

  // Handles registration and authentication
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (
  !fullName.trim() ||
  !username.trim() ||
  !userNumber.trim() ||
  !employeeNumber.trim() ||
  !assignedShift ||
  !password ||
  !confirmPassword
) {
  setError("Please complete all fields.");
  return;
}
    // Check password requirements 
    if (!isPasswordValid) {
      setError("Password does not meet all the required security requirements.");
      return;
    }

    // Check that passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      /* Firebase, 2026 */
      // Creates a new Firebase user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        username,
        password
      );

      const user = userCredential.user;
      //Saves the user's name to their firebase account
      await updateProfile(user, {
        displayName: fullName.trim(),
      });

      const response = await fetch(`${API_URL}/SecurityPersonnel`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    firebaseUid: user.uid,
    userNumber: userNumber.trim(),
    name: fullName.trim(),
    email: username.trim(),
    employeeNumber: employeeNumber.trim(),
    assignedShift,
  }),
});

if (!response.ok) {
  const detail = await response.text();
  throw new Error(detail || "Failed to save security personnel.");
}

      console.log("Registration successful:", user);

      // Navigate to dashboard after successful registration
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Registration error:", error);

      // Firebase error handling
      if (error.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak. Please choose a stronger password.");
      } else {
        setError(error.message || "Registration failed. Please try again.");
      }
    }
  };

  
return (
  <section
    className="page is-active"
    aria-labelledby="registerTitle"
  >
    {/* Page heading */}
    
<div className="page-heading">
  <div>
    <p className="eyebrow">Personnel management</p>
    <h1 id="registerTitle">Register Security</h1>
    <p>
      Create an account for a security officer to access
      the Parkitects security system.
    </p>
  </div>

  <div className="heading-actions">
    <button
      className="button secondary"
      type="button"
      onClick={() => navigate("/security-list")}
    >
      View Security List
    </button>
  </div>
</div>


    {/* Registration form */}
    <article className="panel">
      <div className="panel-heading">
        <div>
          <p className="panel-kicker">New personnel</p>
          <h2>Security personnel details</h2>
        </div>

        <span className="status success">Registration</span>
      </div>

      <form onSubmit={handleSubmit} className="security-register-form">
        <div className="register-form-grid">
          {/* Full name */}
          <div className="register-field">
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              autoComplete="name"
              placeholder="Enter full name"
              required
            />
          </div>

          {/* Email */}
          <div className="register-field">
            <label htmlFor="username">Email address</label>
            <input
              id="username"
              type="email"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="email"
              placeholder="Enter email address"
              required
            />
          </div>

          
{/* User number */}
<div className="register-field">
  <label htmlFor="userNumber">User number</label>
  <input
    id="userNumber"
    type="text"
    value={userNumber}
    onChange={(event) => setUserNumber(event.target.value)}
    placeholder="Enter user number"
    required
  />
</div>

{/* Employee number */}
<div className="register-field">
  <label htmlFor="employeeNumber">Employee number</label>
  <input
    id="employeeNumber"
    type="text"
    value={employeeNumber}
    onChange={(event) => setEmployeeNumber(event.target.value)}
    placeholder="Enter employee number"
    required
  />
</div>

{/* Assigned shift */}
<div className="register-field">
  <label htmlFor="assignedShift">Assigned shift</label>
  <select
    id="assignedShift"
    value={assignedShift}
    onChange={(event) => setAssignedShift(event.target.value)}
    required
  >
    <option value="Day">Day</option>
    <option value="Night">Night</option>
    <option value="Rotating">Rotating</option>
  </select>
</div>


          {/* Password */}
          <div className="register-field">
            <label htmlFor="password">Password</label>
            <div className="register-password">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                className="text-button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div className="register-field">
            <label htmlFor="confirmPassword">Confirm password</label>
            <div className="register-password">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                placeholder="Re-enter password"
                required
              />
              <button
                type="button"
                className="text-button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        </div>

        {/* Password requirements */}
        <div className="register-requirements">
          <p className="panel-kicker">Password requirements</p>

          <div className="register-requirement-list">
            <span className={passwordRequirements.minLength ? "valid" : ""}>
              {passwordRequirements.minLength ? "✓" : "○"} At least 8 characters
            </span>
            <span className={passwordRequirements.uppercase ? "valid" : ""}>
              {passwordRequirements.uppercase ? "✓" : "○"} One uppercase letter
            </span>
            <span className={passwordRequirements.lowercase ? "valid" : ""}>
              {passwordRequirements.lowercase ? "✓" : "○"} One lowercase letter
            </span>
            <span className={passwordRequirements.number ? "valid" : ""}>
              {passwordRequirements.number ? "✓" : "○"} One number
            </span>
            <span className={passwordRequirements.special ? "valid" : ""}>
              {passwordRequirements.special ? "✓" : "○"} One special character
            </span>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}

        {/* Form actions */}
        <div className="register-form-actions">
          <button
            className="button secondary"
            type="button"
            onClick={() => {
              setFullName("");
              setUsername("");
              setUserNumber("");
                setEmployeeNumber("");
                setAssignedShift("Day");
              setPassword("");
              setConfirmPassword("");
              setError("");
            }}
          >
            Clear form
          </button>

          <button
            className="button primary"
            type="submit"
            disabled={
              !fullName.trim() ||
              !username.trim() ||
              !isPasswordValid ||
              !isConfirmPasswordValid
            }
          >
            Register Security
          </button>
        </div>
      </form>
    </article>
  </section>
);
}

export default Register;
/* References
Firebase, 2026. Get Started with Firebase Authentication in React Native. [source code] Available: <https://firebase.google.com/docs/auth/web/start> [Accessed 30 August. 2026].
Rudderz243, 2026. Frontend tsx. [source code] Available: <http://github.com/rudderz243/insy7314-library/blob/master/frontend/src/pages/BookPage.tsx> [Accessed 12 August. 2026].
W3Schools, 2026. onmouseup Event. (Version 2.0) [Source code] Available at: < https://www.w3schools.com/jsref/event_onmouseup.asp > [Accessed 27 August. 2026].
*/