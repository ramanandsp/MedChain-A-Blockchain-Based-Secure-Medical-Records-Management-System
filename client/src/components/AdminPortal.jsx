import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Loader, CheckCircle, XCircle } from 'lucide-react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config';

export default function AdminPortal() {
  const [doctorAddress, setDoctorAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleAddDoctor = async (e) => {
    e.preventDefault();

    if (!ethers.isAddress(doctorAddress)) {
      setMessage({ type: 'error', text: 'Invalid Ethereum address' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.addDoctor(doctorAddress);
      await tx.wait();

      setMessage({ type: 'success', text: `Doctor ${doctorAddress} added successfully!` });
      setDoctorAddress('');
    } catch (error) {
      console.error('Error adding doctor:', error);
      setMessage({
        type: 'error',
        text: error.reason || 'Failed to add doctor. Make sure you are the admin.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="portal-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="portal-header">
        <UserPlus size={48} className="portal-icon" />
        <h1>Admin Portal</h1>
        <p>Add authorized doctors to the MedChain network</p>
      </div>

      <div className="glass-card">
        <form onSubmit={handleAddDoctor}>
          <div className="form-group">
            <label htmlFor="doctorAddress">Doctor Wallet Address</label>
            <input
              type="text"
              id="doctorAddress"
              value={doctorAddress}
              onChange={(e) => setDoctorAddress(e.target.value)}
              placeholder="0x..."
              required
              disabled={loading}
            />
          </div>

          {message.text && (
            <motion.div
              className={`message ${message.type}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
              <span>{message.text}</span>
            </motion.div>
          )}

          <motion.button
            type="submit"
            className="btn-primary"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <Loader className="spinner" size={20} />
                Adding Doctor...
              </>
            ) : (
              <>
                <UserPlus size={20} />
                Add Doctor
              </>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
