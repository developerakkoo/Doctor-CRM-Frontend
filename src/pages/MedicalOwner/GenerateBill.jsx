import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GenerateBill = () => {
  const [patientId, setPatientId] = useState("");
  const [items, setItems] = useState([{ medicineId: "", quantity: 1 }]);
  const [medicines, setMedicines] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [totalAmount, setTotalAmount] = useState(0);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:9191/api/medical-owner/medicines")
      .then((res) => setMedicines(res.data))
      .catch((err) => console.error("Error fetching medicines", err));
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [items]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    if (field === "medicineId") {
      const selectedMedicine = medicines.find(
        (med) => med._id === value
      );
      updatedItems[index].price = selectedMedicine?.price || 0;
    }

    setItems(updatedItems);
  };

  const handleAddItem = () => {
    setItems([...items, { medicineId: "", quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, idx) => idx !== index);
    setItems(updatedItems);
  };

  const calculateTotal = () => {
    const total = items.reduce((acc, item) => {
      const med = medicines.find((m) => m._id === item.medicineId);
      const price = med?.price || 0;
      return acc + price * item.quantity;
    }, 0);
    setTotalAmount(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        patientId,
        items: items.map(({ medicineId, quantity }) => ({
          medicineId,
          quantity,
        })),
        totalAmount,
        paymentStatus,
      };

      const response = await axios.post(
        "http://localhost:9191/api/medical-owner/bills/generate",
        payload
      );

      setMessage(`✅ Bill Generated: ${response.data.billNo}`);
    } catch (err) {
      console.error("Bill generation failed:", err);
      setMessage("❌ Failed to generate bill.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6"
      style={{
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1672759455907-bdaef741cd88?q=80&w=1416&auto=format&fit=crop')",
      }}
    >
      <div className="max-w-4xl mx-auto bg-white/30 backdrop-blur-md p-8 rounded-xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">🧾 Generate Bill</h2>
          <button
            onClick={() => navigate("/medical-owner/dashboard")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            ⬅️ Dashboard
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-white">
          <div>
            <label className="block font-semibold mb-1">Patient ID</label>
            <input
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full p-2 rounded bg-white/20 border border-white/30 focus:outline-none"
              required
            />
          </div>

          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <select
                value={item.medicineId}
                onChange={(e) => handleItemChange(index, "medicineId", e.target.value)}
                className="p-2 bg-white/20 border border-white/30 rounded"
                required
              >
                <option value="">Select Medicine</option>
                {medicines.map((med) => (
                  <option key={med._id} value={med._id}>
                    {med.name} - ₹{med.price}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value))}
                className="p-2 bg-white/20 border border-white/30 rounded"
                required
              />

              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddItem}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            ➕ Add Medicine
          </button>

          <div>
            <label className="block font-semibold mb-1">Payment Status</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full p-2 rounded bg-white/20 border border-white/30"
              required
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>

          <div className="text-xl font-bold">
            💰 Total Amount: ₹{totalAmount}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-3 rounded font-semibold hover:bg-blue-800"
          >
            ✅ Generate Bill
          </button>
        </form>

        {message && (
          <div className="mt-4 text-white font-medium text-lg text-center">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateBill;
