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
import { Search, XCircle } from "lucide-react";

export default function Manage() {
  const [employees, setEmployees] = useState<IUser[]>([]);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<IUser | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data: IGetAllUsersResponse = await getAllUsersExceptAdmin();
      setEmployees(data.users);
    } catch {
      errorToast("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const addUsers = async (name: string, email: string, password: string) => {
    await registerUser(name, email, password);
  };

  const deleteUsers = async (
    _id: string,
    email: string,
    role: "user" | "admin",
  ) => {
    const data: IDeleteUserResponse = await deleteUser(_id, email, role);
    return data;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addEmployee = async () => {
    if (!name || !email || !password) {
      errorToast("Please fill all fields");
      return;
    }

    try {
      await addUsers(name, email, password);
      await fetchUsers();
    } catch (err: any) {
      errorToast(err?.response?.data?.message || "Failed to add employee");
    } finally {
      setOpen(false);
      setName("");
      setEmail("");
      setPassword("");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteUsers(
        deleteTarget._id,
        deleteTarget.email,
        deleteTarget.role,
      );
      await fetchUsers();
    } catch {
      errorToast("Failed to delete employee");
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredEmployees = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Employees</h1>

      {/* SEARCH + ADD */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />

          <Input
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Employee</Button>
          </DialogTrigger>

          <DialogContent className="max-w-md rounded-xl">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4">
              <Input
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button onClick={addEmployee}>Create Account</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* ========== MOBILE VIEW ========== */}
      <div className="block md:hidden space-y-3">
        {loading ? (
          <>
            <EmployeeCardSkeleton />
            <EmployeeCardSkeleton />
            <EmployeeCardSkeleton />
          </>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No employees found
          </div>
        ) : (
          filteredEmployees.map((emp) => (
            <Card key={emp._id} className="shadow-sm">
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center text-lg font-bold">
                    {emp.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="font-semibold">{emp.name}</p>
                    <p className="text-sm text-muted-foreground">{emp.email}</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-muted">
                      {emp.role.toUpperCase()}
                    </span>
                  </div>
                </div>

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setDeleteTarget(emp)}
                >
                  Remove Employee
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* EMPLOYEE LIST */}
      <Card className="hidden md:block shadow-sm">
        <CardHeader>
          <CardTitle>Employees</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              <div className="h-12 w-full bg-muted animate-pulse rounded" />
              <div className="h-12 w-full bg-muted animate-pulse rounded" />
              <div className="h-12 w-full bg-muted animate-pulse rounded" />
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg font-semibold">No employees found</p>
              <p className="text-sm">
                Try changing search or add a new team member.
              </p>
            </div>
          ) : (
            filteredEmployees.map((emp) => (
              <div
                key={emp._id}
                className="flex items-center justify-between p-4 rounded-xl border bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center text-lg font-bold">
                    {emp.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="font-semibold">{emp.name}</p>
                    <p className="text-sm text-gray-500">{emp.email}</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                      {emp.role.toUpperCase()}
                    </span>
                  </div>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteTarget(emp)}
                >
                  Remove
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* DELETE CONFIRMATION */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <strong>{deleteTarget?.name}</strong>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ===== ERROR TOAST ===== */

function errorToast(message: string) {
  toast.custom((t: any) => (
    <div
      className={`${
        t.visible ? "animate-in fade-in" : "animate-out fade-out"
      } bg-red-50 border border-red-300 text-red-800 rounded-xl shadow-md p-4 flex gap-3`}
    >
      <XCircle className="w-6 h-6 text-red-600" />
      <div>
        <p className="font-semibold">Error</p>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  ));
}

function EmployeeCardSkeleton() {
  return (
    <Card className="shadow-sm">
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            <div className="h-3 w-24 bg-muted rounded animate-pulse" />
          </div>
        </div>

        <div className="h-9 w-full bg-muted rounded animate-pulse" />
      </CardContent>
    </Card>
  );
}
