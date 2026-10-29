
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteMockPerson,
  getMockPersonnel,
  type SecurityPerson,
} from "../services/securityPersonnelMock";

export const SecurityList: React.FC = () => {
  const [personnel, setPersonnel] = useState<SecurityPerson[]>(
    () => getMockPersonnel()
  );
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleDelete = (person: SecurityPerson) => {
    const confirmed = window.confirm(
      `Delete ${person.name} from the security personnel list?`
    );

    if (!confirmed) return;

    deleteMockPerson(person.userId);
    setPersonnel(getMockPersonnel());
    setError("");
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

        {personnel.length === 0 ? (
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
                            navigate(
                              `/security-list/${person.userId}/edit`
                            )
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
