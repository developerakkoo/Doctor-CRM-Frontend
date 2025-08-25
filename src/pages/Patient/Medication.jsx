import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Search, Plus, Clock, AlertTriangle, CheckCircle2, Pill } from "lucide-react";

// Mock medication data
const medications = [
  {
    id: 1,
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    status: "Active",
    prescribedDate: "2024-01-15",
    nextRefill: "2024-03-15",
    patient: "John Smith",
    condition: "Hypertension",
  },
  {
    id: 2,
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    status: "Active",
    prescribedDate: "2024-02-01",
    nextRefill: "2024-03-01",
    patient: "Sarah Johnson",
    condition: "Type 2 Diabetes",
  },
  {
    id: 3,
    name: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily",
    status: "Discontinued",
    prescribedDate: "2023-12-10",
    nextRefill: "N/A",
    patient: "Mike Davis",
    condition: "High Cholesterol",
  },
  {
    id: 4,
    name: "Omeprazole",
    dosage: "40mg",
    frequency: "Once daily",
    status: "Active",
    prescribedDate: "2024-01-20",
    nextRefill: "2024-02-28",
    patient: "Emily Wilson",
    condition: "GERD",
  },
];

const Medication = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredMedications = medications.filter((medication) => {
    const matchesSearch =
      medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medication.patient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || medication.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-500 text-white";
      case "Discontinued":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-300 text-gray-700";
    }
  };

  const activeCount = medications.filter((m) => m.status === "Active").length;
  const upcomingRefills = medications.filter(
    (m) =>
      m.status === "Active" &&
      new Date(m.nextRefill) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Medication Management</h1>
            <p className="text-gray-500">Manage patient medications and prescriptions</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Medication
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Active Medications</h3>
              <Pill className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold mt-2">{activeCount}</div>
            <p className="text-xs text-gray-500">Currently prescribed</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Upcoming Refills</h3>
              <Clock className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold mt-2">{upcomingRefills}</div>
            <p className="text-xs text-gray-500">Due within 7 days</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Total Patients</h3>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold mt-2">
              {new Set(medications.map((m) => m.patient)).size}
            </div>
            <p className="text-xs text-gray-500">On medications</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search medications or patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              {["All", "Active", "Discontinued"].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-lg border ${
                    selectedStatus === status
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Medications Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Medication</th>
                  <th className="p-3 text-left">Patient</th>
                  <th className="p-3 text-left">Dosage & Frequency</th>
                  <th className="p-3 text-left">Condition</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Next Refill</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedications.map((medication) => (
                  <tr key={medication.id} className="border-t">
                    <td className="p-3">
                      <div className="font-medium">{medication.name}</div>
                      <div className="text-sm text-gray-500">
                        Prescribed: {new Date(medication.prescribedDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-3">{medication.patient}</td>
                    <td className="p-3">
                      <div>{medication.dosage}</div>
                      <div className="text-sm text-gray-500">{medication.frequency}</div>
                    </td>
                    <td className="p-3">{medication.condition}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(medication.status)}`}>
                        {medication.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {medication.nextRefill !== "N/A" ? (
                        <div className="flex items-center gap-1">
                          {new Date(medication.nextRefill) <=
                            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                          {new Date(medication.nextRefill).toLocaleDateString()}
                        </div>
                      ) : (
                        medication.nextRefill
                      )}
                    </td>
                    <td className="p-3 flex gap-2">
                      <button className="px-3 py-1 border rounded hover:bg-gray-100">Edit</button>
                      {medication.status === "Active" && (
                        <button className="px-3 py-1 border rounded hover:bg-gray-100">Refill</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Medication;
