import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MedicalOwnerProfile = () => {
  const [ownerData, setOwnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const token = localStorage.getItem('medicalOwnerToken');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:9191/api/medical-owner/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOwnerData(res.data);
        setFormData(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      await axios.put('http://localhost:9191/api/medical-owner/update-profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOwnerData(formData);
      setEditMode(false);
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  };

  if (loading) return <p className="text-white text-center mt-10">Loading profile...</p>;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url('https://plus.unsplash.com/premium_photo-1672759455907-bdaef741cd88?q=80&w=1416&auto=format&fit=crop')`,
      }}
    >
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-md text-white w-full max-w-3xl mx-auto">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold">Profile Summary</h2>
          <button
            onClick={() => navigate('/medical-owner/dashboard')}
            className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg text-sm"
          >
            Go to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} disabled={!editMode} />
          <InputField label="Email" name="email" value={formData.email} onChange={handleChange} disabled />
          <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} disabled={!editMode} />
          <InputField label="Shop Name" name="shopName" value={formData.shopName} onChange={handleChange} disabled={!editMode} />
          <InputField label="Address" name="address" value={formData.address} onChange={handleChange} disabled={!editMode} />
        </div>

        <div className="mt-6 flex justify-end gap-4">
          {editMode ? (
            <>
              <button onClick={handleSave} className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600">
                Save
              </button>
              <button onClick={() => setEditMode(false)} className="bg-gray-500 px-4 py-2 rounded-lg hover:bg-gray-600">
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setEditMode(true)} className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600">
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, disabled }) => (
  <div>
    <label className="block text-sm mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-4 py-2 rounded-lg text-black ${disabled ? 'bg-gray-200' : 'bg-white'}`}
    />
  </div>
);

export default MedicalOwnerProfile;
