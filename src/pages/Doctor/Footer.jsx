import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 py-4 text-center mt-auto">
      <p className="text-sm">
        © {new Date().getFullYear()} MedLeads. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
