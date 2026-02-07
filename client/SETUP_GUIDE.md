# MedChain v2 Setup Guide

## Prerequisites

Before you begin, ensure you have:

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **MetaMask** browser extension - [Install](https://metamask.io/)
3. **MedChainV2 Smart Contract** deployed on Ethereum (testnet or mainnet)
4. **Contract ABI** from your deployed smart contract

## Quick Start

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Configure Your Contract

Open `src/config.js` and update with your deployed contract details:

```javascript
export const CONTRACT_ADDRESS = "0xYourActualContractAddress";

export const CONTRACT_ABI = [
  // Paste your complete MedChainV2 contract ABI here
  // Get this from your deployment output or Etherscan
];

export const ADMIN_ADDRESS = "0xYourAdminWalletAddress";
```

#### Where to Find Your Contract ABI:

**Option 1: From Hardhat/Truffle Deployment**
- Located in `artifacts/contracts/MedChainV2.sol/MedChainV2.json`
- Copy the `abi` array from this file

**Option 2: From Etherscan**
- Go to your contract on Etherscan
- Click the "Contract" tab
- Scroll to "Contract ABI"
- Copy the ABI JSON

**Option 3: Minimal ABI (included by default)**
The config file includes a minimal ABI with the essential functions. For full functionality, replace it with your complete contract ABI.

### 3. Run the Application

**Development Mode:**
```bash
npm run dev
```
The app will open at `http://localhost:3000`

**Production Build:**
```bash
npm run build
npm run preview
```

### 4. Connect Your Wallet

1. Open the application in your browser
2. Click "Connect MetaMask"
3. Approve the connection in MetaMask
4. The app will automatically detect your role (Admin/Doctor/Patient)

## Role-Based Access

### Admin
- **Who**: The wallet address that deployed the contract
- **Can**: Add new doctors to the network
- **Access**: Admin Portal

### Doctor
- **Who**: Wallet addresses added by the admin
- **Can**: Register patients and upload medical records
- **Access**: Doctor Portal

### Patient
- **Who**: Anyone registered by a doctor
- **Can**: View their own medical records
- **Access**: Patient Portal

## IPFS Configuration

The application uses Infura's IPFS service by default. The configuration is in `src/ipfs.js`:

```javascript
export const ipfs = create({
  url: "https://ipfs.infura.io:5001/api/v0"
});
```

### Using Your Own IPFS Node

If you want to use your own IPFS node or a different service:

1. **Local IPFS Node**:
```javascript
export const ipfs = create({
  url: "http://localhost:5001/api/v0"
});
```

2. **Infura with Authentication**:
```javascript
import { create } from 'ipfs-http-client';

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

export const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth
  }
});
```

3. **Pinata**:
Replace the IPFS upload logic to use Pinata's API

## Network Configuration

### Using Ethereum Testnet (Recommended for Testing)

1. **Switch MetaMask to Sepolia Testnet**
   - Open MetaMask
   - Click network dropdown
   - Select "Sepolia Test Network"

2. **Get Test ETH**
   - Visit a Sepolia faucet: https://sepoliafaucet.com/
   - Enter your wallet address
   - Receive test ETH for transactions

### Using Ethereum Mainnet

⚠️ **WARNING**: Mainnet transactions cost real ETH. Only use mainnet for production deployments.

Ensure:
- Your contract is thoroughly audited
- You have sufficient ETH for gas fees
- All security considerations are addressed

## Common Issues & Solutions

### Issue: "Could not resolve entry module"
**Solution**: Ensure `index.html` is in the client root directory, not in `public/`

### Issue: MetaMask not connecting
**Solution**:
- Refresh the page
- Make sure MetaMask is unlocked
- Check that you're on the correct network
- Clear browser cache

### Issue: "Failed to add doctor" or "Failed to register patient"
**Solution**:
- Verify you're using the correct wallet for your role
- Ensure you have enough ETH for gas fees
- Check that CONTRACT_ADDRESS is correct
- Confirm you're on the same network as the contract

### Issue: Records not showing up
**Solution**:
- Wait for transaction confirmation (check Etherscan)
- Refresh the page
- Verify the patient was registered by a doctor
- Check browser console for errors

### Issue: IPFS upload failing
**Solution**:
- Check your internet connection
- Verify IPFS configuration in `src/ipfs.js`
- Try using a different IPFS gateway
- Ensure file size is reasonable (<50MB recommended)

### Issue: "Cannot read properties of undefined"
**Solution**:
- Ensure CONTRACT_ABI is properly formatted (should be a JSON array)
- Check that all required contract functions are in the ABI
- Verify the contract is deployed on the current network

## File Structure

```
client/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── AdminPortal.jsx
│   │   ├── ConnectWallet.jsx
│   │   ├── DoctorPortal.jsx
│   │   ├── Navbar.jsx
│   │   └── PatientPortal.jsx
│   ├── utils/          # Utility functions
│   │   └── format.js
│   ├── App.jsx         # Main application component
│   ├── App.css         # Global styles
│   ├── config.js       # ⚠️ Configuration file (update this!)
│   ├── ipfs.js         # IPFS client configuration
│   └── index.jsx       # Application entry point
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
└── vite.config.js      # Vite configuration
```

## Development Tips

### Hot Reload
Changes to any `.jsx` or `.css` file will automatically reload in the browser during development mode.

### Testing Different Roles
To test different roles, use multiple MetaMask accounts:
1. Create test accounts in MetaMask
2. Switch between accounts to test Admin/Doctor/Patient views
3. Use the Admin account to add Doctor accounts
4. Use Doctor accounts to register Patient accounts

### Debugging
- Open browser DevTools (F12)
- Check Console tab for errors
- Use React DevTools extension for component inspection
- Monitor Network tab for transaction status

## Production Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Deploy to Hosting Service

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**IPFS (Fully Decentralized):**
```bash
npm run build
ipfs add -r dist/
```

### Environment Variables (Optional)

For production deployments, you can use environment variables instead of hardcoding in `config.js`:

1. Create `.env` file:
```
VITE_CONTRACT_ADDRESS=0x...
VITE_ADMIN_ADDRESS=0x...
```

2. Update `config.js`:
```javascript
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
export const ADMIN_ADDRESS = import.meta.env.VITE_ADMIN_ADDRESS;
```

## Security Considerations

1. **Never Commit Private Keys**: The app uses MetaMask, so private keys stay secure
2. **Audit Your Contract**: Have your smart contract professionally audited
3. **IPFS Data**: Remember that IPFS data is public by default - encrypt sensitive data before upload
4. **Role Verification**: The smart contract enforces role-based access, but always verify in the UI too
5. **Gas Optimization**: Consider batching operations to save on gas fees

## Support & Resources

- **Smart Contract**: Ensure you have MedChainV2.sol deployed
- **Ethereum Documentation**: https://ethereum.org/developers
- **ethers.js Documentation**: https://docs.ethers.org/
- **IPFS Documentation**: https://docs.ipfs.tech/
- **React Documentation**: https://react.dev/

## License

MIT License - See LICENSE file for details
