# MedChain v2 - Project Structure

```
client/
│
├── index.html                    # Main HTML entry point
├── package.json                  # Dependencies and npm scripts
├── vite.config.js               # Vite bundler configuration
│
├── README.md                     # Project overview
├── SETUP_GUIDE.md               # Detailed setup instructions
├── PROJECT_STRUCTURE.md         # This file
│
├── src/
│   ├── index.jsx                # React app entry point
│   ├── App.jsx                  # Main app component with routing
│   ├── App.css                  # Global styles (glassmorphic theme)
│   │
│   ├── config.js                # ⚠️ CONFIGURE THIS - Contract address & ABI
│   ├── ipfs.js                  # IPFS client configuration
│   │
│   ├── components/              # React components (role-based portals)
│   │   ├── Navbar.jsx           # Navigation with wallet connection
│   │   ├── ConnectWallet.jsx    # MetaMask connection component
│   │   ├── AdminPortal.jsx      # Admin interface (add doctors)
│   │   ├── DoctorPortal.jsx     # Doctor interface (register patients, upload records)
│   │   └── PatientPortal.jsx    # Patient interface (view medical records)
│   │
│   └── utils/
│       └── format.js            # Utility functions (address shortening, timestamps)
│
└── public/                       # Static assets (empty by default)
```

## Key Files to Configure

### 1. src/config.js
**MUST UPDATE** before running the app:
- `CONTRACT_ADDRESS`: Your deployed MedChainV2 contract address
- `CONTRACT_ABI`: Your contract ABI (from deployment or Etherscan)
- `ADMIN_ADDRESS`: Wallet address of the admin (contract deployer)

### 2. src/ipfs.js
Configure IPFS node if not using Infura's public gateway:
- Default: `https://ipfs.infura.io:5001/api/v0`
- Can change to local node or custom IPFS service

## Component Hierarchy

```
App.jsx
├── Router
    ├── Navbar
    │   └── ConnectWallet
    │
    └── Routes
        ├── / (Welcome Screen)
        ├── /admin → AdminPortal
        ├── /doctor → DoctorPortal
        └── /patient → PatientPortal
```

## Key Features by Component

### App.jsx
- MetaMask connection management
- Role detection (Admin/Doctor/Patient)
- Account change handling
- Route protection based on role

### Navbar.jsx
- Displays current role badge
- Navigation links based on user role
- Wallet connection status

### AdminPortal.jsx
- Add doctor addresses to the network
- Transaction handling with loading states
- Success/error notifications

### DoctorPortal.jsx
- **Tab 1**: Register new patients
- **Tab 2**: Upload medical records to IPFS + blockchain
- File upload (PDF/images)
- Form validation

### PatientPortal.jsx
- Fetch and display all patient records
- Beautiful card-based layout
- View documents on IPFS gateway
- Record metadata (type, date, added by)

### ConnectWallet.jsx
- MetaMask connection button
- Display connected wallet address (shortened)
- Wallet change detection

## Styling Architecture

### Design System
- **Theme**: Dark gradient background (blue-teal)
- **Style**: Glassmorphism with backdrop blur
- **Colors**:
  - Primary: `#4ecdc4` (teal)
  - Secondary: `#45b7d1` (light blue)
  - Admin: `#ff6b6b` (red)
  - Background: `linear-gradient(135deg, #0f2027, #203a43, #2c5364)`

### CSS Organization (App.css)
- Global styles and resets
- Navbar styles
- Portal container styles
- Form components
- Glass card effects
- Button styles with gradients
- Responsive breakpoints (mobile, tablet, desktop)
- Animation keyframes

### Responsive Design
- **Desktop**: Full layout with sidebar navigation
- **Tablet**: Stacked navigation, reduced padding
- **Mobile**: Single column, simplified navigation

## Data Flow

### Wallet Connection
1. User clicks "Connect MetaMask"
2. MetaMask prompts for approval
3. Account saved to state
4. Role detection triggered

### Role Detection
1. Check if account === admin address → Admin
2. Query `doctors[account]` from contract → Doctor
3. Otherwise → Patient

### Upload Record (Doctor)
1. Select file from device
2. Upload to IPFS → get CID
3. Call `addRecord(patient, cid, type, note)` on contract
4. Transaction confirmed → success message

### View Records (Patient)
1. Call `getRecords(account)` on contract
2. Receive array of record structs
3. Display in card grid
4. Link to IPFS gateway for document viewing

## Smart Contract Integration

### Functions Used
- `admin()` → Returns admin address
- `doctors(address)` → Returns true if address is a doctor
- `addDoctor(address)` → Admin adds a doctor
- `registerPatient(address)` → Doctor registers a patient
- `addRecord(address, string, string, string)` → Doctor adds medical record
- `getRecords(address)` → Returns array of patient records

### Record Structure
```solidity
struct Record {
    string cid;           // IPFS content identifier
    string recordType;    // Lab Report, X-Ray, etc.
    string note;          // Description
    address addedBy;      // Doctor who uploaded
    uint256 timestamp;    // Block timestamp
}
```

## Development Workflow

### 1. Install & Configure
```bash
npm install
# Edit src/config.js with your contract details
```

### 2. Development
```bash
npm run dev
# Open http://localhost:3000
# Changes hot-reload automatically
```

### 3. Build & Deploy
```bash
npm run build
# Upload dist/ to hosting service
```

## Technology Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| ethers.js v6 | Ethereum interaction |
| ipfs-http-client | IPFS file upload |
| react-router-dom | Client-side routing |
| framer-motion | Animations |
| lucide-react | Icon library |

## Security Features

- ✅ Role-based access control (contract-enforced)
- ✅ MetaMask signature verification
- ✅ No private keys stored in app
- ✅ IPFS for decentralized storage
- ✅ Transaction confirmation required
- ✅ Input validation on all forms

## Common Modifications

### Change IPFS Gateway
Edit `src/config.js`:
```javascript
export const IPFS_GATEWAY = "https://your-gateway.com/ipfs/";
```

### Add New Record Types
Edit `DoctorPortal.jsx` → recordType select options

### Customize Theme Colors
Edit `src/App.css` → update gradient values and color variables

### Add More Wallet Support
Extend `App.jsx` to support WalletConnect, Coinbase Wallet, etc.

## Performance Optimization

- ✅ Code splitting with dynamic imports
- ✅ Lazy loading for routes
- ✅ Optimized production build
- ✅ CSS minification
- ✅ Tree shaking for unused code

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Brave
- Safari (with MetaMask extension)

**Requirements:**
- MetaMask installed
- JavaScript enabled
- Modern browser (ES2020+)
