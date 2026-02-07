import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, User, UserCog, Shield, Brain } from 'lucide-react';
import ConnectWallet from './ConnectWallet';

export default function Navbar({ account, role, onConnect }) {
  const location = useLocation();

  const getRoleInfo = () => {
    switch (role) {
      case 'admin':
        return { icon: <Shield size={18} />, label: 'Admin', color: '#ff6b6b' };
      case 'doctor':
        return { icon: <UserCog size={18} />, label: 'Doctor', color: '#4ecdc4' };
      case 'patient':
        return { icon: <User size={18} />, label: 'Patient', color: '#45b7d1' };
      default:
        return null;
    }
  };

  const roleInfo = getRoleInfo();

  // Open your AI companion (MedChain AI Friend) app
  const openAIFriend = () => {
    window.open('http://localhost:5173', '_blank');
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="navbar-container">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <Activity size={32} />
          <span>MedChain v2</span>
        </Link>

        {/* Role Info */}
        <div className="navbar-center">
          {account && roleInfo && (
            <motion.div
              className="role-badge"
              style={{ borderColor: roleInfo.color }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {roleInfo.icon}
              <span style={{ color: roleInfo.color }}>{roleInfo.label}</span>
            </motion.div>
          )}
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {account && (
            <div className="nav-links">
              {role === 'admin' && (
                <Link
                  to="/admin"
                  className={location.pathname === '/admin' ? 'active' : ''}
                >
                  Admin Portal
                </Link>
              )}
              {role === 'doctor' && (
                <Link
                  to="/doctor"
                  className={location.pathname === '/doctor' ? 'active' : ''}
                >
                  Doctor Portal
                </Link>
              )}
              {role === 'patient' && (
                <Link
                  to="/patient"
                  className={location.pathname === '/patient' ? 'active' : ''}
                >
                  My Records
                </Link>
              )}

              {/* 🧠 New Green Health Insights Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openAIFriend}
                className="btn-health-insights"
              >
                <Brain size={18} />
                AI Friend
              </motion.button>
            </div>
          )}
          <ConnectWallet account={account} onConnect={onConnect} />
        </div>
      </div>
    </motion.nav>
  );
}
