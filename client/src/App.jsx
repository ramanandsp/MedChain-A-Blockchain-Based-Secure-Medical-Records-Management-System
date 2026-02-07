import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import Navbar from './components/Navbar';
import AdminPortal from './components/AdminPortal';
import DoctorPortal from './components/DoctorPortal';
import PatientPortal from './components/PatientPortal';
import { CONTRACT_ADDRESS, CONTRACT_ABI, ADMIN_ADDRESS } from './config';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkWalletConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  useEffect(() => {
    if (account) {
      detectRole();
    } else {
      setRole(null);
    }
  }, [account]);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts'
        });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      setAccount(null);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask to use this application!');
      return;
    }

    setLoading(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      setAccount(accounts[0]);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const detectRole = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const adminAddress = await contract.admin();

      if (account.toLowerCase() === adminAddress.toLowerCase()) {
        setRole('admin');
        return;
      }

      const isDoctor = await contract.doctors(account);
      if (isDoctor) {
        setRole('doctor');
        return;
      }

      setRole('patient');
    } catch (error) {
      console.error('Error detecting role:', error);
      setRole('patient');
    }
  };

  return (
    <Router>
      <div className="app">
        <Navbar account={account} role={role} onConnect={connectWallet} />

        <main className="main-content">
          {!account ? (
            <motion.div
              className="welcome-screen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Activity size={80} className="welcome-icon" />
              <h1>Welcome to MedChain v2</h1>
              <p>Secure, decentralized medical records on the blockchain</p>
              <motion.button
                className="btn-connect-large"
                onClick={connectWallet}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? 'Connecting...' : 'Connect MetaMask to Get Started'}
              </motion.button>
              <div className="features">
                <div className="feature">
                  <h3>Secure</h3>
                  <p>Your data is encrypted and stored on IPFS</p>
                </div>
                <div className="feature">
                  <h3>Decentralized</h3>
                  <p>No single point of failure or control</p>
                </div>
                <div className="feature">
                  <h3>Transparent</h3>
                  <p>All records are verifiable on the blockchain</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <Routes>
              <Route
                path="/"
                element={
                  role === 'admin' ? <Navigate to="/admin" /> :
                  role === 'doctor' ? <Navigate to="/doctor" /> :
                  role === 'patient' ? <Navigate to="/patient" /> :
                  <div className="loading-container">Loading...</div>
                }
              />
              <Route
                path="/admin"
                element={role === 'admin' ? <AdminPortal /> : <Navigate to="/" />}
              />
              <Route
                path="/doctor"
                element={role === 'doctor' ? <DoctorPortal /> : <Navigate to="/" />}
              />
              <Route
                path="/patient"
                element={role === 'patient' ? <PatientPortal account={account} /> : <Navigate to="/" />}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          )}
        </main>
      </div>
    </Router>
  );
}

export default App;
