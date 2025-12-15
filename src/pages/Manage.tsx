import { useEffect, useState } from "react";
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
import { deleteUser, getAllUsersExceptAdmin, registerUser } from "@/api/users";
import type {
  IDeleteUserResponse,
  IGetAllUsersResponse,
  IUser,
} from "@/types/userType";
import { toast } from "sonner";
import { XCircle } from "lucide-react";

export default function Manage() {
  const [employees, setEmployees] = useState<IUser[]>([]);

  const fetchUsers = async () => {
    const data: IGetAllUsersResponse = await getAllUsersExceptAdmin();
    setEmployees(data.users);
  };

  const addUsers = async (name: string, email: string, password: string) => {
    await registerUser(name, email, password);
  };

  const deleteUsers = async (
    _id: string,
    email: string,
    role: "user" | "admin"
  ) => {
    const data: IDeleteUserResponse = await deleteUser(_id, email, role);
    return data;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);

  const addEmployee = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.custom((t: any) => (
        <div
          className={`${
            t.visible
              ? "animate-in fade-in slide-in-from-top-5"
              : "animate-out fade-out"
          } w-full max-w-sm bg-red-50 border border-red-300 text-red-800 rounded-xl shadow-md p-4 flex gap-3`}
        >
          <XCircle className="w-6 h-6 text-red-600 mt-1" />
          <div className="flex-1">
            <p className="font-semibold text-red-700">Missing fields</p>
            <p className="text-sm text-red-600">
              Please fill in name, email and password.
            </p>
          </div>
        </div>
      ));
      return;
    }

    try {
      await addUsers(name, email, password); // your API call
      await fetchUsers(); // refresh list
      // ✅ No success toast as requested
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to add employee.";

      // ❌ Custom Tailwind error toast
      toast.custom((t: any) => (
        <div
          className={`${
            t.visible
              ? "animate-in fade-in slide-in-from-top-5"
              : "animate-out fade-out"
          } w-full max-w-sm bg-red-50 border border-red-300 text-red-800 rounded-xl shadow-md p-4 flex gap-3`}
        >
          <XCircle className="w-6 h-6 text-red-600 mt-1" />
          <div className="flex-1">
            <p className="font-semibold text-red-700">Failed to add employee</p>
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        </div>
      ));
    } finally {
      // ✅ Always close the dialog, regardless of success/error
      setOpen(false);

      // Optional: clear form fields
      setName("");
      setEmail("");
      setPassword("");
    }
  };

  const deleteEmployee = async (
    id: string,
    email: string,
    role: "user" | "admin"
  ) => {
    try {
      const data: IDeleteUserResponse = await deleteUsers(id, email, role);
      if (data.success === false) {
        toast.custom((t: any) => (
          <div
            className={`${
              t.visible
                ? "animate-in fade-in slide-in-from-top-5"
                : "animate-out fade-out"
            } w-full max-w-sm bg-red-50 border border-red-300 text-red-800 rounded-xl shadow-md p-4 flex gap-3`}
          >
            <XCircle className="w-6 h-6 text-red-600 mt-1" />
            <div className="flex-1">
              <p className="font-semibold text-red-700">
                Failed to add employee
              </p>
              <p className="text-sm text-red-600">{data.message}</p>
            </div>
          </div>
        ));
      }
      await fetchUsers();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
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
        <Dialog open={open} onOpenChange={setOpen}>
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
                  key={emp._id}
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
                    onClick={() => deleteEmployee(emp._id, emp.email, emp.role)}
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
