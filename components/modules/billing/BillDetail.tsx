"use client";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Printer } from "lucide-react";

export function BillDetail({ bill }: { bill: any }) {
  const handlePrint = () => window.print();

  return (
    <div className="space-y-4">
      {/* Print button */}
      <div className="flex justify-end no-print">
        <button onClick={handlePrint} className="btn-secondary text-sm flex items-center gap-2">
          <Printer className="w-4 h-4" /> Print Invoice
        </button>
      </div>

      {/* Invoice Header */}
      <div className="bg-blue-600 text-white rounded-xl p-5">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">DavShon HMS</h2>
            <p className="text-blue-200 text-sm">Hospital Management System</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold font-mono">{bill.billId}</p>
            <p className="text-blue-200 text-xs">Invoice</p>
          </div>
        </div>
      </div>

      {/* Patient Info */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
        <div>
          <p className="text-xs text-gray-500 mb-1">Billed To</p>
          <p className="font-semibold text-gray-900">{bill.patient.firstName} {bill.patient.lastName}</p>
          <p className="text-xs text-gray-400">{bill.patient.patientId}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-1">Status</p>
          <Badge label={bill.paymentStatus} variant="status" />
          {bill.paymentMethod && <p className="text-xs text-gray-400 mt-1">via {bill.paymentMethod}</p>}
        </div>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {["Description", "Category", "Qty", "Unit Price", "Total"].map((h) => <th key={h} className="table-header">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {bill.items?.map((item: any) => (
              <tr key={item.id} className="bg-white">
                <td className="table-cell font-medium">{item.description}</td>
                <td className="table-cell"><span className="text-xs capitalize bg-gray-100 px-2 py-0.5 rounded">{item.category}</span></td>
                <td className="table-cell text-center">{item.quantity}</td>
                <td className="table-cell">{formatCurrency(item.unitPrice)}</td>
                <td className="table-cell font-semibold">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="ml-auto w-64 space-y-2 text-sm">
        {[["Subtotal", formatCurrency(bill.subtotal)], ["Tax (10%)", formatCurrency(bill.tax)], ["Discount", `-${formatCurrency(bill.discount)}`]].map(([l, v]) => (
          <div key={l} className="flex justify-between"><span className="text-gray-500">{l}</span><span>{v}</span></div>
        ))}
        <div className="flex justify-between font-bold text-base border-t pt-2">
          <span>Total</span><span className="text-blue-600">{formatCurrency(bill.total)}</span>
        </div>
        <div className="flex justify-between text-green-600 font-medium">
          <span>Paid</span><span>{formatCurrency(bill.paidAmount)}</span>
        </div>
        {bill.paymentStatus !== "paid" && (
          <div className="flex justify-between text-orange-600 font-semibold">
            <span>Balance Due</span><span>{formatCurrency(bill.total - bill.paidAmount)}</span>
          </div>
        )}
      </div>

      {bill.notes && (
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3">
          <p className="text-xs font-semibold text-yellow-700 mb-1">Notes</p>
          <p className="text-sm text-gray-700">{bill.notes}</p>
        </div>
      )}
    </div>
  );
}
