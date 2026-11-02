import "../App.css";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { SecurityPerson } from "./SecurityList"; // Re-use interface from SecurityList

const API_URL = import.meta.env.VITE_API_URL;

export const EditSecurity: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<SecurityPerson | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch the specific security personnel record when the page loads
  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const response = await fetch(`${API_URL}/SecurityPersonnel/${id}`);
        if (!response.ok) throw new Error("Security officer not found.");
        const data = await response.json();
        setForm(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPerson();
  }, [id]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (form) {
      setForm({
        ...form,
        [event.target.name]: event.target.value,
      });
      setError("");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (
      !form?.userNumber.trim() ||
      !form?.name.trim() ||
      !form?.email.trim() ||
      !form?.employeeNumber.trim() ||
      !form?.assignedShift
    ) {
      setError("Please complete all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      // Sends PUT request matching your UpdateSecurityPersonnelDto
      const response = await fetch(`${API_URL}/SecurityPersonnel/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          userNumber: form.userNumber.trim(),
          employeeNumber: form.employeeNumber.trim(),
          assignedShift: form.assignedShift.trim(),
        }),
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail || "Failed to update security personnel.");
      }

      navigate("/security-list");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p style={{ padding: "2rem" }}>Loading personnel data...</p>;

  if (!form && !loading) {
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

  return (
    <section className="page is-active" aria-labelledby="editSecurityTitle">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Personnel management</p>
          <h1 id="editSecurityTitle">Edit Security</h1>
          <p>
            Update the details of a security officer registered in the Parkitects
            security system.
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
                value={form?.userNumber}
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
                value={form?.name}
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
                value={form?.email}
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
                value={form?.employeeNumber}
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
                value={form?.assignedShift}
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