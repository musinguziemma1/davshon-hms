"use client";
import { formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Printer, FlaskConical } from "lucide-react";

export function LabReportView({ test }: { test: any }) {
  const { result } = test;
  const interpretationColors = {
    normal: "bg-green-50 border-green-200 text-green-800",
    abnormal: "bg-yellow-50 border-yellow-200 text-yellow-800",
    critical: "bg-red-50 border-red-200 text-red-800",
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end no-print">
        <button onClick={() => window.print()} className="btn-secondary text-sm flex items-center gap-2">
          <Printer className="w-4 h-4" /> Print Report
        </button>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <FlaskConical className="w-6 h-6 opacity-80" />
          <div>
            <h2 className="font-bold text-lg">DavShon HMS — Laboratory Report</h2>
            <p className="text-blue-200 text-xs">Confidential Medical Record</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm mt-3">
          <div><p className="text-blue-200 text-xs">Test ID</p><p className="font-mono font-bold">{test.testId}</p></div>
          <div><p className="text-blue-200 text-xs">Test Name</p><p className="font-semibold">{test.testName} ({test.testCode})</p></div>
          <div><p className="text-blue-200 text-xs">Patient</p><p>{test.patient.firstName} {test.patient.lastName} · {test.patient.patientId}</p></div>
          <div><p className="text-blue-200 text-xs">Ordered By</p><p>{test.doctor.name}</p></div>
        </div>
      </div>

      {/* Interpretation Banner */}
      {result && (
        <div className={`border rounded-xl p-4 ${interpretationColors[result.interpretation as keyof typeof interpretationColors]}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Interpretation</p>
              <p className="text-xl font-bold capitalize mt-0.5">{result.interpretation}</p>
            </div>
            {result.value && (
              <div className="text-right">
                <p className="text-xs opacity-70">Result Value</p>
                <p className="text-2xl font-bold">{result.value} <span className="text-sm font-normal">{result.unit}</span></p>
              </div>
            )}
          </div>
          {result.normalRange && <p className="text-xs mt-2 opacity-70">Normal Range: {result.normalRange}</p>}
        </div>
      )}

      {/* Findings */}
      {result && (
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs font-semibold uppercase text-gray-500 mb-2">Findings</p>
          <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">{result.findings}</p>
        </div>
      )}

      {result?.notes && (
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-xs font-semibold uppercase text-blue-600 mb-1">Notes</p>
          <p className="text-sm text-gray-700">{result.notes}</p>
        </div>
      )}

      <div className="flex justify-between text-xs text-gray-400 border-t pt-3">
        <span>Sample: {test.sampleType}</span>
        <span>Priority: <span className="capitalize font-medium">{test.priority}</span></span>
        {result && <span>Reported: {formatDateTime(result.reportedAt)}</span>}
      </div>
    </div>
  );
}
