# MedChain v2 - Quick Start Guide

Get your decentralized medical records DApp running in 5 minutes!

## Prerequisites

✅ Node.js installed (v18+)
✅ MetaMask browser extension
✅ Deployed MedChainV2 smart contract

## Step 1: Install Dependencies

```bash
cd client
npm install
```

## Step 2: Configure Your Contract

Open `src/config.js` and update these three values:

```javascript
export const CONTRACT_ADDRESS = "0xYourDeployedContractAddress";
export const ADMIN_ADDRESS = "0xYourAdminWalletAddress";

export const CONTRACT_ABI = [
  // Paste your complete MedChainV2 ABI here
];
```

### Where to Find These:

**CONTRACT_ADDRESS:**
Copy from your deployment output or Etherscan transaction

**ADMIN_ADDRESS:**
The wallet address that deployed the contract

**CONTRACT_ABI:**
- **Hardhat:** `artifacts/contracts/MedChainV2.sol/MedChainV2.json`
- **Etherscan:** Contract → Contract ABI section

## Step 3: Run the App

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Step 4: Connect Your Wallet

1. Click "Connect MetaMask"
2. Approve the connection
3. Make sure you're on the same network as your deployed contract

## Step 5: Test the App

### As Admin:
1. Navigate to Admin Portal
2. Add a doctor wallet address
3. Confirm transaction in MetaMask

### As Doctor:
1. Switch to a doctor wallet in MetaMask
2. Navigate to Doctor Portal
3. Register a patient address
4. Upload a test medical record (PDF/image)

### As Patient:
1. Switch to a patient wallet
2. Navigate to Patient Portal
3. View your medical records

## Common Issues

**"Transaction failed"**
→ Make sure you're on the correct network
→ Ensure you have enough ETH for gas

**"Records not showing"**
→ Wait for transaction confirmation
→ Refresh the page

**"MetaMask not connecting"**
→ Refresh the page
→ Check MetaMask is unlocked

## Next Steps

- Read `SETUP_GUIDE.md` for detailed configuration
- Check `PROJECT_STRUCTURE.md` to understand the codebase
- Follow `DEPLOYMENT_CHECKLIST.md` when ready to deploy

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder, ready to deploy!

## Need Help?

- Check console errors (F12 → Console)
- Verify contract address in config.js
- Ensure you're on the correct network
- Confirm you have test ETH for transactions

## Quick Reference

| Role | Can Do | Access |
|------|--------|--------|
| Admin | Add doctors | Admin Portal |
| Doctor | Register patients, upload records | Doctor Portal |
| Patient | View own records | Patient Portal |

**Ready to revolutionize medical records! 🏥⛓️**
