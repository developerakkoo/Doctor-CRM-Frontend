import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Doctor/Dashboard";
import DoctorAuth from "./pages/Doctor/DoctorAuth";
import AddLead from "./pages/Doctor/AddLead";
import AllLeads from "./pages/Doctor/AllLeads";
import DoctorLayout from "./layouts/DoctorLayout";
import Footer from "../src/pages/Doctor/Footer";
import Appointment from "./pages/Appointments/DoctorAppointments/Appointment";
import Settings from "./pages/Doctor/Settings";
import Analytics from "./pages/Doctor/Analytics";

import PatientDashboard from "./pages/Patient/PatientDashboard";
import BookAppointment from "./pages/Patient/BookAppointment";
import Medication from "./pages/Patient/Medication";

import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <Router>
      {/* Toast notifications container */}
      <Toaster position="top-right" reverseOrder={false} />

      <main className="flex-grow">
        <Routes>
          {/* Auth Page */}
          <Route path="/" element={<DoctorAuth />} />

          {/* ✅ Appointments Route inside Doctor Layout */}
          <Route
            path="/appointments"
            element={
              <DoctorLayout>
                <Appointment />
              </DoctorLayout>
            }
          />

          {/* Doctor Pages with Layout */}
          <Route
            path="/doctor/dashboard"
            element={
              <DoctorLayout>
                <Dashboard />
              </DoctorLayout>
            }
          />

          <Route
            path="/add-lead"
            element={
              <DoctorLayout>
                <AddLead />
              </DoctorLayout>
            }
          />

          <Route
            path="/all-leads"
            element={
              <DoctorLayout>
                <AllLeads />
              </DoctorLayout>
            }
          />

          <Route
            path="/settings"
            element={
              <DoctorLayout>
                <Settings />
              </DoctorLayout>
            }
          />

          <Route
            path="/analytics"
            element={
              <DoctorLayout>
                <Analytics />
              </DoctorLayout>
            }
          />


          {/* Patient Dashboard */}
          <Route path="/pdashboard" element={<PatientDashboard />} />
          <Route path="/patient/appointment" element={<BookAppointment />} />

          <Route
            path="/medication"
            element={
              <DoctorLayout>
                <Medication />
              </DoctorLayout>
            }
          />
        </Routes>
      </main>

      {/* Sticky Footer */}
      <Footer />
    </Router>
  );
};

export default App;
