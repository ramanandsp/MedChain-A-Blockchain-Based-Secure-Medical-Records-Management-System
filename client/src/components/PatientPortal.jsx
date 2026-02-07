import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ExternalLink, Loader, AlertCircle, Calendar, User } from 'lucide-react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI, PINATA_GATEWAY } from "../config";
import { shortenAddress, formatTimestamp } from '../utils/format';

export default function PatientPortal({ account }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (account) {
      fetchRecords();
    }
  }, [account]);

  const fetchRecords = async () => {
    setLoading(true);
    setError('');

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const fetchedRecords = await contract.getRecords(account);

      // Normalize structure in case data contains nested arrays or objects
      const parsedRecords = fetchedRecords.map(record => ({
        cid: record.ipfsHash || record.cid,
        recordType: record.recordType,
        note: record.note,
        addedBy: record.addedBy,
        timestamp: Number(record.timestamp),
      }));

      setRecords(parsedRecords);
    } catch (err) {
      console.error('Error fetching records:', err);
      setError('Failed to fetch medical records. Please try again.');
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
        <FileText size={48} className="portal-icon" />
        <h1>My Medical Records</h1>
        <p>View your secure, decentralized medical history</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <Loader className="spinner-large" size={48} />
          <p>Loading your medical records...</p>
        </div>
      ) : error ? (
        <motion.div
          className="error-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <AlertCircle size={48} />
          <p>{error}</p>
          <button className="btn-secondary" onClick={fetchRecords}>
            Try Again
          </button>
        </motion.div>
      ) : records.length === 0 ? (
        <motion.div
          className="empty-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <FileText size={64} className="empty-icon" />
          <h2>No Records Found</h2>
          <p>You don't have any medical records yet.</p>
        </motion.div>
      ) : (
        <div className="records-grid">
          <AnimatePresence>
            {records.map((record, index) => (
              <motion.div
                key={index}
                className="record-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
              >
                <div className="record-header">
                  <div className="record-type-badge">
                    <FileText size={20} />
                    <span>{record.recordType}</span>
                  </div>
                  <div className="record-date">
                    <Calendar size={16} />
                    <span>{formatTimestamp(record.timestamp)}</span>
                  </div>
                </div>

                <div className="record-content">
                  <div className="record-note">
                    <h3>Note</h3>
                    <p>{record.note}</p>
                  </div>

                  <div className="record-meta">
                    <div className="meta-item">
                      <User size={16} />
                      <span>Added by: {shortenAddress(record.addedBy)}</span>
                    </div>
                  </div>
                </div>

                {/* ✅ Fixed IPFS link handling */}
                <motion.a
                  href={
                    record.cid?.startsWith("http")
                      ? record.cid
                      : `${PINATA_GATEWAY.replace(/\/$/, "")}/ipfs/${record.cid}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-view"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ExternalLink size={18} />
                  View Document
                </motion.a>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
