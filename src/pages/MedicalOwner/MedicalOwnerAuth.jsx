// src/pages/MedicalOwner/MedicalOwnerAuth.jsx

import React, { useState } from 'react';
import MedicalOwnerLogin from './MedicalOwnerLogin';
import MedicalOwnerRegister from './MedicalOwnerRegister';

const MedicalOwnerAuth = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1672759455907-bdaef741cd88?q=80&w=1416&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      <div className="bg-white/10 backdrop-blur-md shadow-lg rounded-2xl p-8 w-full max-w-md text-white">
        {isRegistering ? (
          <MedicalOwnerRegister onSwitch={toggleForm} />
        ) : (
          <MedicalOwnerLogin onSwitch={toggleForm} />
        )}
      </div>
    </div>
  );
};

export default MedicalOwnerAuth;
