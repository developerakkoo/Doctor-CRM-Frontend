import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import navigation
import axiosInstance from '../../axiosInstance';

const MedicineManager = () => {
    const navigate = useNavigate(); // ✅ Hook for navigation

    const [medicines, setMedicines] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        price: '',
        quantity: '',
        expiryDate: '',
    });
    const [editingMedicineId, setEditingMedicineId] = useState(null);

    const fetchMedicines = async () => {
        try {
            const response = await axiosInstance.get("/medicines");
            setMedicines(response.data.medicines);
        } catch (error) {
            console.error("Error fetching medicines", error);
        }
    };

    useEffect(() => {
        fetchMedicines();
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleAddOrUpdateMedicine = async () => {
        try {
            if (editingMedicineId) {
                await axiosInstance.put(`/medicines/${editingMedicineId}`, formData);
            } else {
                await axiosInstance.post('/medicines', formData);
            }

            setFormData({
                name: '',
                brand: '',
                price: '',
                quantity: '',
                expiryDate: '',
            });
            setEditingMedicineId(null);
            fetchMedicines();
        } catch (error) {
            console.error('Error saving medicine', error);
            alert('Failed to save medicine. Check if you are logged in.');
        }
    };

    const handleEditMedicine = (medicine) => {
        setFormData({
            name: medicine.name,
            brand: medicine.brand,
            price: medicine.price,
            quantity: medicine.quantity,
            expiryDate: medicine.expiryDate?.split('T')[0],
        });
        setEditingMedicineId(medicine._id);
    };

    const handleCancelEdit = () => {
        setEditingMedicineId(null);
        setFormData({
            name: '',
            brand: '',
            price: '',
            quantity: '',
            expiryDate: '',
        });
    };

    const handleDeleteMedicine = async (id) => {
        try {
            await axiosInstance.delete(`/medicines/${id}`);
            fetchMedicines();
        } catch (error) {
            console.error('Error deleting medicine', error);
        }
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center flex justify-center items-center px-4 py-8"
            style={{
                backgroundImage: `url('https://plus.unsplash.com/premium_photo-1672759455907-bdaef741cd88?q=80&w=1416&auto=format&fit=crop')`,
            }}
        >
            <div className="bg-opacity-20 backdrop-blur-md rounded-2xl p-8 w-full max-w-4xl shadow-xl relative">

                {/* ✅ Go to Dashboard Button */}
                <button
                    onClick={() => navigate('/medical-owner/dashboard')}
                    className="absolute top-4 right-4 bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-lg"
                >
                    Go to Dashboard
                </button>

                <h2 className="text-2xl font-bold mb-6 text-center text-white">
                    {editingMedicineId ? 'Edit Medicine' : 'Add Medicine'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {['name', 'brand', 'price', 'quantity', 'expiryDate'].map((field) => (
                        <input
                            key={field}
                            type={
                                field === 'price' || field === 'quantity'
                                    ? 'number'
                                    : field === 'expiryDate'
                                    ? 'date'
                                    : 'text'
                            }
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            className="p-3 rounded-xl bg-white bg-opacity-60 text-black placeholder-black"
                            required
                        />
                    ))}
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleAddOrUpdateMedicine}
                        className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
                    >
                        {editingMedicineId ? 'Update Medicine' : 'Add Medicine'}
                    </button>
                    {editingMedicineId && (
                        <button
                            onClick={handleCancelEdit}
                            className="py-3 px-6 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 transition"
                        >
                            Cancel
                        </button>
                    )}
                </div>

                <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Medicine List</h3>
                <div className="overflow-x-auto bg-white bg-opacity-40 backdrop-blur-md rounded-xl p-4 max-h-[300px] overflow-y-auto">
                    <div className="max-h-[500px] overflow-y-auto rounded-lg bg-white/5 backdrop-blur p-4">
                        <table className="w-full text-black table-auto">
                            <thead className="bg-gray-200/30 text-black">
                                <tr>
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2 text-left">Brand</th>
                                    <th className="px-4 py-2 text-left">Price</th>
                                    <th className="px-4 py-2 text-left">Quantity</th>
                                    <th className="px-4 py-2 text-left">Expiry</th>
                                    <th className="px-4 py-2 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-500/20">
                                {medicines.map((medicine) => (
                                    <tr key={medicine._id}>
                                        <td className="px-4 py-2">{medicine.name}</td>
                                        <td className="px-4 py-2">{medicine.brand}</td>
                                        <td className="px-4 py-2">₹{medicine.price}</td>
                                        <td className="px-4 py-2">{medicine.quantity}</td>
                                        <td className="px-4 py-2">{medicine.expiryDate?.slice(0, 10)}</td>
                                        <td className="px-4 py-2 space-x-2 text-center">
                                            <button
                                                onClick={() => handleEditMedicine(medicine)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteMedicine(medicine._id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MedicineManager;
