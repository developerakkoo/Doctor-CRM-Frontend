// import React, { useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { useSearchParams } from 'react-router-dom';
// import axios from 'axios';

// const ResetPassword = () => {
//   const [searchParams] = useSearchParams();
//   const token = searchParams.get('token');
//   const location = useLocation();
//   // const token = new URLSearchParams(location.search).get('token');

//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const handleReset = async (e) => {
//     e.preventDefault();

//     if (!newPassword || !confirmPassword) {
//       return setError('All fields are required.');
//     }

//     if (newPassword !== confirmPassword) {
//       return setError('Passwords do not match.');
//     }

//     try {
//       const res = await axios.post(http://localhost:9191/api/v1/doctors/reset-password/${token},
//         { newPassword }
//       );

//       setMessage(res.data.message || 'Password reset successfully!');

//       setError('');
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || 'Something went wrong.');
//     }
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: '0 auto', padding: '2rem' }}>
//       <h2>Reset Password</h2>

//       {message && <p style={{ color: 'green' }}>{message}</p>}
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       <form onSubmit={handleReset}>
//         <div>
//           <label>New Password:</label>
//           <div style={{ display: 'flex', alignItems: 'center' }}>
//             <input
//               type={showPassword ? 'text' : 'password'}
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               required
//               style={{ flex: 1, padding: '0.5rem' }}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               style={{ marginLeft: '0.5rem' }}
//             >
//               {showPassword ? 'Hide' : 'Show'}
//             </button>
//           </div>
//         </div>

//         <div style={{ marginTop: '1rem' }}>
//           <label>Confirm Password:</label>
//           <div style={{ display: 'flex', alignItems: 'center' }}>
//             <input
//               type={showConfirmPassword ? 'text' : 'password'}
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//               style={{ flex: 1, padding: '0.5rem' }}
//             />
//             <button
//               type="button"
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               style={{ marginLeft: '0.5rem' }}
//             >
//               {showConfirmPassword ? 'Hide' : 'Show'}
//             </button>
//           </div>
//         </div>

//         <button
//           type="submit"
//           style={{ marginTop: '1.5rem', padding: '0.5rem 1rem', width: '100%' }}
//         >
//           Reset Password
//         </button>
//       </form>
//     </div>
//   );
// }; 

// export default ResetPassword;