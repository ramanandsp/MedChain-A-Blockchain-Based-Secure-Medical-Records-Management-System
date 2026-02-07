import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Upload, Loader, CheckCircle, XCircle, FileText } from 'lucide-react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI, PINATA_GATEWAY } from '../config';
import { uploadToIPFS } from '../ipfs';

export default function DoctorPortal() {
  const [activeTab, setActiveTab] = useState('register');
  const [patientAddress, setPatientAddress] = useState('');
  const [recordData, setRecordData] = useState({
    patientAddress: '',
    recordType: '',
    note: '',
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleRegisterPatient = async (e) => {
    e.preventDefault();

    if (!ethers.isAddress(patientAddress)) {
      setMessage({ type: 'error', text: 'Invalid Ethereum address' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.registerPatient(patientAddress);
      await tx.wait();

      setMessage({ type: 'success', text: `Patient ${patientAddress} registered successfully!` });
      setPatientAddress('');
    } catch (error) {
      console.error('Error registering patient:', error);
      setMessage({
        type: 'error',
        text: error.reason || 'Failed to register patient'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadRecord = async (e) => {
    e.preventDefault();

    if (!ethers.isAddress(recordData.patientAddress)) {
      setMessage({ type: 'error', text: 'Invalid patient address' });
      return;
    }

    if (!recordData.file) {
      setMessage({ type: 'error', text: 'Please select a file to upload' });
      return;
    }

    setLoading(true);
    setMessage({ type: 'info', text: 'Uploading file to IPFS (Pinata)...' });

    try {
      // 1️⃣ Upload file to Pinata
      const cid = await uploadToIPFS(recordData.file);
      const url = `${PINATA_GATEWAY}${cid}`;
      console.log("✅ Uploaded to IPFS:", url);

      // 2️⃣ Store record on blockchain
      setMessage({ type: 'info', text: 'Adding record to blockchain...' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.addRecord(
        recordData.patientAddress,
        cid,
        recordData.recordType,
        recordData.note
      );
      await tx.wait();

      setMessage({ type: 'success', text: `✅ Medical record uploaded! View at ${url}` });
      console.log("File accessible at:", url);

      // Reset form
      setRecordData({ patientAddress: '', recordType: '', note: '', file: null });
      e.target.reset();
    } catch (error) {
      console.error('❌ Error uploading record:', error);
      setMessage({
        type: 'error',
        text: error.reason || 'Failed to upload record to blockchain',
      });
    } finally {
      setLoading(false);
    }
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRecordData({ ...recordData, file });
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
        <FileText size={48} className="portal-icon" />
        <h1>Doctor Portal</h1>
        <p>Register patients and manage medical records</p>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('register');
            setMessage({ type: '', text: '' });
          }}
        >
          <UserPlus size={20} />
          Register Patient
        </button>
        <button
          className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('upload');
            setMessage({ type: '', text: '' });
          }}
        >
          <Upload size={20} />
          Upload Record
        </button>
      </div>

      <div className="glass-card">
        {activeTab === 'register' ? (
          <form onSubmit={handleRegisterPatient}>
            <div className="form-group">
              <label htmlFor="patientAddress">Patient Wallet Address</label>
              <input
                type="text"
                id="patientAddress"
                value={patientAddress}
                onChange={(e) => setPatientAddress(e.target.value)}
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
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Register Patient
                </>
              )}
            </motion.button>
          </form>
        ) : (
          <form onSubmit={handleUploadRecord}>
            <div className="form-group">
              <label htmlFor="recordPatientAddress">Patient Wallet Address</label>
              <input
                type="text"
                id="recordPatientAddress"
                value={recordData.patientAddress}
                onChange={(e) => setRecordData({ ...recordData, patientAddress: e.target.value })}
                placeholder="0x..."
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="recordType">Record Type</label>
              <select
                id="recordType"
                value={recordData.recordType}
                onChange={(e) => setRecordData({ ...recordData, recordType: e.target.value })}
                required
                disabled={loading}
              >
                <option value="">Select record type</option>
                <option value="Lab Report">Lab Report</option>
                <option value="X-Ray">X-Ray</option>
                <option value="MRI Scan">MRI Scan</option>
                <option value="CT Scan">CT Scan</option>
                <option value="Prescription">Prescription</option>
                <option value="Diagnosis">Diagnosis</option>
                <option value="Treatment Plan">Treatment Plan</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="note">Note / Description</label>
              <textarea
                id="note"
                value={recordData.note}
                onChange={(e) => setRecordData({ ...recordData, note: e.target.value })}
                placeholder="Add notes about this medical record..."
                rows="3"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="file">Upload File (PDF/Image)</label>
              <input
                type="file"
                id="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
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
                {message.type === 'success' ? (
                  <CheckCircle size={20} />
                ) : message.type === 'info' ? (
                  <Loader className="spinner" size={20} />
                ) : (
                  <XCircle size={20} />
                )}
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
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Upload Record
                </>
              )}
            </motion.button>
          </form>
        )}
      </div>
    </motion.div>
  );
}
