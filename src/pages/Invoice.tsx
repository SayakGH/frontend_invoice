// src/pages/Invoices.tsx
export default function Invoices() {
  const invoices = [
    { id: 1, customer: "John Doe", amount: "$120", status: "Paid" },
    { id: 2, customer: "Sarah Lin", amount: "$420", status: "Pending" },
    { id: 3, customer: "David Kim", amount: "$300", status: "Paid" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>

      <div className="space-y-3">
        {invoices.map((inv) => (
          <div key={inv.id} className="p-4 border rounded-lg bg-white">
            <p>
              <strong>Customer:</strong> {inv.customer}
            </p>
            <p>
              <strong>Amount:</strong> {inv.amount}
            </p>
            <p>
              <strong>Status:</strong> {inv.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
