import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { shortenAddress } from '../utils/format';

export default function ConnectWallet({ account, onConnect }) {
  return (
    <div className="connect-wallet">
      {!account ? (
        <motion.button
          className="btn-connect"
          onClick={onConnect}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Wallet size={20} />
          Connect MetaMask
        </motion.button>
      ) : (
        <motion.div
          className="wallet-info"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="wallet-badge">
            <Wallet size={16} />
            <span>{shortenAddress(account)}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
