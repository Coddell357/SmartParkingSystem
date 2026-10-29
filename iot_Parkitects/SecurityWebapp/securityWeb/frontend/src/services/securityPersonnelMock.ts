
export type SecurityPerson = {
  userId: number;
  userNumber: string;
  name: string;
  email: string;
  employeeNumber: string;
  assignedShift: string;
};

// Temporary records for testing the CRUD screens.
let personnel: SecurityPerson[] = [
  {
    userId: 1,
    userNumber: "USR001",
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    employeeNumber: "SEC001",
    assignedShift: "Day",
  },
  {
    userId: 2,
    userNumber: "USR002",
    name: "Jamie Smith",
    email: "jamie.smith@example.com",
    employeeNumber: "SEC002",
    assignedShift: "Night",
  },
  {
    userId: 3,
    userNumber: "USR003",
    name: "Taylor Brown",
    email: "taylor.brown@example.com",
    employeeNumber: "SEC003",
    assignedShift: "Rotating",
  },
];

export function getMockPersonnel(): SecurityPerson[] {
  return [...personnel];
}

export function getMockPerson(id: number): SecurityPerson | undefined {
  return personnel.find((person) => person.userId === id);
}

export function updateMockPerson(updatedPerson: SecurityPerson): void {
  personnel = personnel.map((person) =>
    person.userId === updatedPerson.userId ? updatedPerson : person
  );
}

export function deleteMockPerson(id: number): void {
  personnel = personnel.filter((person) => person.userId !== id);
}
