# MedChain v2 - Decentralized Medical Records DApp

A fully decentralized medical record management system built on Ethereum, IPFS, and React.

## Features

- **Admin Portal**: Add authorized doctors to the network
- **Doctor Portal**: Register patients and upload encrypted medical records to IPFS
- **Patient Portal**: View personal medical records with full transparency
- **Web3 Integration**: MetaMask wallet connection with automatic role detection
- **IPFS Storage**: Decentralized file storage for medical documents
- **Beautiful UI**: Modern glassmorphic design with smooth animations

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure the contract:
   - Open `src/config.js`
   - Replace `CONTRACT_ADDRESS` with your deployed MedChainV2 contract address
   - Update `ADMIN_ADDRESS` with the admin wallet address
   - Paste the contract ABI in `CONTRACT_ABI`

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Configuration

Edit `src/config.js` with your contract details:

```javascript
export const CONTRACT_ADDRESS = "0xYourContractAddress";
export const CONTRACT_ABI = [ /* Your ABI */ ];
export const ADMIN_ADDRESS = "0xYourAdminAddress";
```

## Technologies

- React 18
- Vite
- ethers.js v6
- ipfs-http-client
- react-router-dom
- framer-motion
- lucide-react

## Usage

1. **Connect Wallet**: Click "Connect MetaMask" to authenticate
2. **Role Detection**: The app automatically detects if you're an admin, doctor, or patient
3. **Navigate**: Use the navigation bar to access your portal
4. **Upload Records**: (Doctors) Upload medical files that are stored on IPFS
5. **View Records**: (Patients) Access and view your medical history

## Security

- All medical records are stored on IPFS (decentralized)
- Smart contract enforces role-based access control
- MetaMask provides secure transaction signing
- No centralized backend or database

## License

MIT
