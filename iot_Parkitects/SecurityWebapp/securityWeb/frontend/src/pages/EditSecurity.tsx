
import "../App.css";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getMockPerson,
  updateMockPerson,
  type SecurityPerson,
} from "../services/securityPersonnelMock";

export const EditSecurity: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<SecurityPerson | null>(() => {
    const person = getMockPerson(Number(id));
    return person ? { ...person } : null;
  });

  const [error, setError] = useState("");

  if (!form) {
    return (
      <section className="page is-active">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Personnel management</p>
            <h1>Security Officer Not Found</h1>
            <p>This security personnel record could not be found.</p>
          </div>

          <div className="heading-actions">
            <button
              className="button secondary"
              type="button"
              onClick={() => navigate("/security-list")}
            >
              Back to Security List
            </button>
          </div>
        </div>
      </section>
    );
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });

    setError("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (
      !form.userNumber.trim() ||
      !form.name.trim() ||
      !form.email.trim() ||
      !form.employeeNumber.trim() ||
      !form.assignedShift
    ) {
      setError("Please complete all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    updateMockPerson({
      ...form,
      userNumber: form.userNumber.trim(),
      name: form.name.trim(),
      email: form.email.trim(),
      employeeNumber: form.employeeNumber.trim(),
    });

    navigate("/security-list");
  };

  return (
    <section className="page is-active" aria-labelledby="editSecurityTitle">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Personnel management</p>
          <h1 id="editSecurityTitle">Edit Security</h1>
          <p>
            Update the details of a security officer registered
            in the Parkitects security system.
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

      <article className="panel">
        <div className="panel-heading">
          <div>
            <p className="panel-kicker">Personnel management</p>
            <h2>Security personnel details</h2>
          </div>

          <span className="status success">Edit record</span>
        </div>

        <form onSubmit={handleSubmit} className="security-register-form">
          <div className="register-form-grid">
            <div className="register-field">
              <label htmlFor="userNumber">User number</label>
              <input
                id="userNumber"
                name="userNumber"
                type="text"
                value={form.userNumber}
                onChange={handleChange}
                placeholder="Enter user number"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="employeeNumber">Employee number</label>
              <input
                id="employeeNumber"
                name="employeeNumber"
                type="text"
                value={form.employeeNumber}
                onChange={handleChange}
                placeholder="Enter employee number"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="assignedShift">Assigned shift</label>
              <select
                id="assignedShift"
                name="assignedShift"
                value={form.assignedShift}
                onChange={handleChange}
                required
              >
                <option value="Day">Day</option>
                <option value="Night">Night</option>
                <option value="Rotating">Rotating</option>
              </select>
            </div>
          </div>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <div className="register-form-actions">
            <button
              className="button secondary"
              type="button"
              onClick={() => navigate("/security-list")}
            >
              Cancel
            </button>

            <button className="button primary" type="submit">
              Save Changes
            </button>
          </div>
        </form>
      </article>
    </section>
  );
};

export default EditSecurity;
