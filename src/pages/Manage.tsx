// src/pages/Manage.tsx
export default function Manage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Settings</h1>

      <div className="space-y-3">
        <div className="p-4 border rounded-lg bg-white">
          <p className="font-semibold">User Management</p>
          <p className="text-gray-600 text-sm">
            Add, remove, or edit user roles.
          </p>
        </div>

        <div className="p-4 border rounded-lg bg-white">
          <p className="font-semibold">System Preferences</p>
          <p className="text-gray-600 text-sm">
            Configure system-wide settings.
          </p>
        </div>

        <div className="p-4 border rounded-lg bg-white">
          <p className="font-semibold">Security Controls</p>
          <p className="text-gray-600 text-sm">
            Two-factor auth, sessions, risk alerts.
          </p>
        </div>
      </div>
    </div>
  );
}
