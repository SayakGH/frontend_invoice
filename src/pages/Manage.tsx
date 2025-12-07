import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Manage() {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@example.com",
      password: "1234",
    },
    {
      id: 2,
      name: "Priya Verma",
      email: "priya@example.com",
      password: "abcd",
    },
  ]);

  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const addEmployee = () => {
    if (!name.trim() || !email.trim() || !password.trim()) return;

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
    };

    setEmployees([...employees, newUser]);
    setName("");
    setEmail("");
    setPassword("");
  };

  const deleteEmployee = (id: number) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Employees</h1>

      {/* TOP BAR: Search + Add Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search Bar */}
        <div className="w-full md:w-1/2">
          <Input
            placeholder="Search employee by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Add Employee Button (opens modal) */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto">Add Employee</Button>
          </DialogTrigger>

          <DialogContent className="max-w-sm w-[90%]">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold">Full Name</label>
                <Input
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Email</label>
                <Input
                  placeholder="Enter email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Password</label>
                <Input
                  placeholder="Enter password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                />
              </div>

              <Button className="w-full mt-2" onClick={addEmployee}>
                Save Employee
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* EMPLOYEE LIST */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Employees</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {filteredEmployees.length === 0 && (
              <p className="text-gray-500 text-sm">No employees found.</p>
            )}

            <div className="space-y-4">
              {filteredEmployees.map((emp) => (
                <div
                  key={emp.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg bg-white gap-2"
                >
                  {/* Employee Info */}
                  <div className="flex flex-col">
                    <p className="font-semibold text-lg">{emp.name}</p>
                    <p className="text-gray-600 text-sm">{emp.email}</p>
                  </div>

                  {/* Delete Button */}
                  <Button
                    variant="destructive"
                    className="w-full sm:w-auto"
                    onClick={() => deleteEmployee(emp.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
