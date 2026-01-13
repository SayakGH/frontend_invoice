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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteUser, getAllUsersExceptAdmin, registerUser } from "@/api/users";
import type {
  IDeleteUserResponse,
  IGetAllUsersResponse,
  IUser,
} from "@/types/userType";
import { toast } from "sonner";

export default function Manage() {
  const [employees, setEmployees] = useState<IUser[]>([]);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<IUser | null>(null);

  const fetchUsers = async () => {
    const data: IGetAllUsersResponse = await getAllUsersExceptAdmin();
    setEmployees(data.users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addEmployee = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in name, email and password");
      return;
    }

    try {
      await registerUser(name, email, password);
      toast.success("Employee added");
      await fetchUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add employee");
    } finally {
      setOpen(false);
      setName("");
      setEmail("");
      setPassword("");
    }
  };

  const confirmDelete = (emp: IUser) => {
    setEmployeeToDelete(emp);
    setDeleteOpen(true);
  };

  const deleteEmployee = async () => {
    if (!employeeToDelete) return;

    try {
      const res: IDeleteUserResponse = await deleteUser(
        employeeToDelete._id,
        employeeToDelete.email,
        employeeToDelete.role
      );

      if (res.success === false) {
        toast.error(res.message);
      } else {
        toast.success("Employee deleted");
      }

      await fetchUsers();
    } catch (err) {
      toast.error("Failed to delete employee");
    } finally {
      setDeleteOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Employees</h1>

      {/* Search + Add */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Input
          placeholder="Search employee by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-1/2"
        />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Employee</Button>
          </DialogTrigger>

          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button onClick={addEmployee}>Save Employee</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Employee List */}
      <Card>
        <CardHeader>
          <CardTitle>Employees</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {filteredEmployees.length === 0 && (
            <p className="text-muted-foreground">No employees found</p>
          )}

          {filteredEmployees.map((emp) => (
            <div
              key={emp._id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between border rounded-lg p-4 bg-white"
            >
              <div>
                <p className="font-semibold">{emp.name}</p>
                <p className="text-sm text-muted-foreground">{emp.email}</p>
              </div>

              <Button variant="destructive" onClick={() => confirmDelete(emp)}>
                Delete
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{employeeToDelete?.name}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={deleteEmployee}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
