import React, { useState } from "react";
import Navbar from "../Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./Login";
import Registration from "./Registration";
import ForgotPassword from "./ForgotPassword";

const DoctorAuth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [forgotPasswordStep, setForgotPasswordStep] = useState(null);
  const [forgotEmail, setForgotEmail] = useState("");

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 px-4">
        <ToastContainer
          position="top-right"
          autoClose={2000}
          toastClassName={() =>
            "relative flex p-3 rounded-2xl justify-between items-center bg-white shadow-lg text-gray-900"
          }
        />

        <div
          className={`w-full ${
            activeTab === "login" ? "max-w-md" : "max-w-5xl"
          } bg-white p-8 rounded-2xl shadow-lg mt-20`}
        >
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
            {forgotPasswordStep === "request"
              ? "Forgot Password"
              : forgotPasswordStep === "reset"
              ? "Reset Password"
              : activeTab === "login"
              ? "Doctor Login"
              : "Doctor Registration"}
          </h2>

          {forgotPasswordStep ? (
            <ForgotPassword
              step={forgotPasswordStep}
              setStep={setForgotPasswordStep}
              forgotEmail={forgotEmail}
              setForgotEmail={setForgotEmail}
              setActiveTab={setActiveTab}
            />
          ) : activeTab === "login" ? (
            <Login
              setForgotPasswordStep={setForgotPasswordStep}
              setActiveTab={setActiveTab}
            />
          ) : (
            <Registration setActiveTab={setActiveTab} />
          )}

          {!forgotPasswordStep && (
            <p className="mt-6 text-center text-gray-600">
              {activeTab === "login"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <button
                className="text-blue-600 font-semibold hover:underline"
                onClick={() =>
                  setActiveTab(activeTab === "login" ? "register" : "login")
                }
              >
                {activeTab === "login" ? "Register" : "Login"}
              </button>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default DoctorAuth;
