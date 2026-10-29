//(rudderz243,2026)
//(Vincent,2016)

import React, { useState } from "react";
import parkitechlogo from "../assets/parkitechlogo.png";
import { useNavigate } from "react-router-dom";

// Firebase imports for authentication
/*Firebase, 2026*/
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

export const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState<"admin" | "security">(
    "security"
  );

  const navigate = useNavigate();

  // Handles login and authentication.
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");

    // Check that both fields have been completed.
    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }

    try {
      // Verify the user's credentials with Firebase.
      await signInWithEmailAndPassword(auth, username.trim(), password);

      // Store the selected role for dashboard navigation.
      sessionStorage.setItem("userRole", selectedRole);

      // Navigate to the dashboard after successful login.
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <main className="login-page">
      <div className="login-card">
        {/* Logo */}
        <div className="login-brand">
          <div className="login-brand-mark">
            <img src={parkitechlogo} alt="Parkitech" />
          </div>

          <div>
            <strong>Parkitech</strong>
            <span>Security Dashboard</span>
          </div>
        </div>

        {/* Heading */}
        <div className="login-heading">
          <h1>Log In</h1>
          <p>Sign in to access the parking dashboard</p>
        </div>

        <hr />

        {/* Login form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Role selection */}
<div className="login-field">
  <label>Login as</label>

  <div className="role-selection">
    <button
      type="button"
      className="login-button"
      style={{
        opacity: selectedRole === "admin" ? 1 : 0.6,
        marginBottom: 0,
      }}
      onClick={() => setSelectedRole("admin")}
    >
      Admin
    </button>

    <button
      type="button"
      className="login-button"
      style={{
        opacity: selectedRole === "security" ? 1 : 0.6,
        marginBottom: 0,
      }}
      onClick={() => setSelectedRole("security")}
    >
      Security
    </button>
  </div>
</div>
          {/* Username */}
          <div className="login-field">
            <label htmlFor="username">
              User Name
              {username && (
                <i
                  className="fa fa-check login-check"
                  aria-hidden="true"
                />
              )}
            </label>

            <input
              id="username"
              className="login-input"
              type="email"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div className="login-field">
            <label htmlFor="password">
              Password
              {password && (
                <i
                  className="fa fa-check login-check"
                  aria-hidden="true"
                />
              )}
            </label>

            <div className="password-input-container">
              <input
                id="password"
                className="login-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                placeholder="Enter your password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onMouseDown={() => setShowPassword(true)}
                onMouseUp={() => setShowPassword(false)}
                onMouseLeave={() => setShowPassword(false)}
                onTouchStart={() => setShowPassword(true)}
                onTouchEnd={() => setShowPassword(false)}
                aria-label="Hold to show password"
              >
                <i className="fa fa-eye" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <hr />

          {/* Login button */}
          <button
            className="login-button"
            type="submit"
            disabled={!username.trim() || !password}
          >
            LOGIN
          </button>
        </form>

        <p className="login-footer">Parkitech Security System</p>
      </div>
    </main>
  );
};

export default Login;

/* References
Firebase, 2026. Get Started with Firebase Authentication in React Native.
[source code] Available: https://firebase.google.com/docs/auth/web/start
[Accessed 30 August 2026].

Rudderz243, 2026. Frontend tsx.
[source code] Available: https://github.com/rudderz243/insy7314-library/blob/master/frontend/src/pages/BookPage.tsx
[Accessed 12 August 2026].

Vincent, M., 2016. Login / Sign Up - React - Daily UI #001.
[source code] Available: https://codepen.io/matthewvincent/pen/JXOKbY
[Accessed 12 August 2026].
*/
