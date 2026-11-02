import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export interface SecurityPerson {
  userId: number;
  userNumber: string;
  name: string;
  email: string;
  employeeNumber: string;
  assignedShift: string;
}

export const SecurityList: React.FC = () => {
  const [personnel, setPersonnel] = useState<SecurityPerson[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all security personnel on component mount
  useEffect(() => {
    fetchPersonnel();
  }, []);

  const fetchPersonnel = async () => {
    try {
      const response = await fetch(`${API_URL}/SecurityPersonnel`);
      if (!response.ok) throw new Error("Failed to fetch security personnel.");
      const data = await response.json();
      setPersonnel(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (person: SecurityPerson) => {
    const confirmed = window.confirm(
      `Delete ${person.name} from the security personnel list?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/SecurityPersonnel/${person.userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail || "Failed to delete personnel.");
      }

      // Remove the deleted person from the local state
      setPersonnel((prev) => prev.filter((p) => p.userId !== person.userId));
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <section className="page is-active">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Personnel management</p>
          <h1>Security Personnel</h1>
          <p>View and manage registered security officers.</p>
        </div>

        <div className="heading-actions">
          <button
            className="button secondary"
            type="button"
            onClick={() => navigate("/register")}
          >
            Back to Registration
          </button>
        </div>
      </div>

      <article className="panel">
        <div className="panel-heading">
          <div>
            <p className="panel-kicker">Personnel records</p>
            <h2>Registered Security</h2>
          </div>
        </div>

        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <p>Loading security personnel...</p>
        ) : personnel.length === 0 ? (
          <p>No security personnel records found.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>User Number</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Employee Number</th>
                  <th>Shift</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {personnel.map((person) => (
                  <tr key={person.userId}>
                    <td>{person.userNumber}</td>
                    <td>{person.name}</td>
                    <td>{person.email}</td>
                    <td>{person.employeeNumber}</td>
                    <td>{person.assignedShift}</td>
                    <td>
                      <div className="heading-actions">
                        <button
                          className="button secondary"
                          type="button"
                          onClick={() =>
                            navigate(`/security-list/${person.userId}/edit`)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="button secondary"
                          type="button"
                          onClick={() => handleDelete(person)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
};

export default SecurityList;