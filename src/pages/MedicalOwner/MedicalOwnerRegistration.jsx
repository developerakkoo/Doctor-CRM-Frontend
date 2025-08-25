import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MedicalOwnerRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    shopName: '',
    address: '',
    linkedDoctorId: ''
  });

  const [qrCode, setQrCode] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setQrCode('');
    setManualCode('');

    try {
      const res = await axios.post('http://localhost:9191/api/medical-owner/register', formData);
      setMessage(res.data.message);
      setQrCode(res.data.qrCode);
      setManualCode(res.data.manualCode);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-cover bg-center"
    style={{
      backgroundImage: `url('https://plus.unsplash.com/premium_photo-1672759455907-bdaef741cd88?q=80&w=1416&auto=format&fit=crop')`
    }}>
    <div className="flex bg-white/20 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden w-full max-w-4xl">
                    {/* bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-10 w-full max-w-md"> */}
      
      {/* Form Section */}
      <div className="w-full md:w-1/2 p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Register</h2>
        <p className="text-sm text-gray-600 mb-6">Create your Medical Owner account</p>

        {error && <p className="text-red-600 text-center mb-2">{error}</p>}
        {message && <p className="text-green-600 text-center mb-2">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full p-2 border rounded" type="text" name="fullName" placeholder="Full Name" required onChange={handleChange} />
          <input className="w-full p-2 border rounded" type="email" name="email" placeholder="Email" required onChange={handleChange} />
          <input className="w-full p-2 border rounded" type="password" name="password" placeholder="Password" required onChange={handleChange} />
          <input className="w-full p-2 border rounded" type="text" name="phone" placeholder="Phone" required onChange={handleChange} />
          <input className="w-full p-2 border rounded" type="text" name="shopName" placeholder="Shop Name" required onChange={handleChange} />
          <textarea className="w-full p-2 border rounded" name="address" placeholder="Address" required onChange={handleChange}></textarea>
          <input className="w-full p-2 border rounded" type="text" name="linkedDoctorId" placeholder="Linked Doctor ID" required onChange={handleChange} />

          <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">Register</button>
          <button
            type="button"
            onClick={() => navigate('/medical-owner/login')}
            className="w-full border border-black text-black py-2 rounded hover:bg-gray-100"
          >
            Login
          </button>
        </form>
      </div>

      {/* Sidebar Image & QR Code Section */}
      <div className="relative hidden md:flex md:w-1/2">
        <img
          src="https://plus.unsplash.com/premium_photo-1672759455907-bdaef741cd88?q=80&w=1416&auto=format&fit=crop"
          alt="Medical Owner"
          className="h-full w-full object-cover"
        />

        {/* QR Section - overlays on image */}
        {qrCode && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white p-4">
            <p className="text-sm mb-2">Scan with Google Authenticator:</p>
            <img src={qrCode} alt="QR Code" className="w-40 mb-2" />
            <p className="text-sm">Manual Code:</p>
            <strong className="text-lg">{manualCode}</strong>
          </div>
        )}
      </div>
    </div>
  </div>
);

};

export default MedicalOwnerRegistration;
