// client/src/config.js

// 🧠 Smart contract setup
export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // your deployed contract address

export const CONTRACT_ABI = [
  "function addDoctor(address _doctor) external",
  "function registerPatient(address _patient) external",
  "function addRecord(address _patient, string memory _cid, string memory _recordType, string memory _note) external",
  "function getRecords(address _patient) external view returns (tuple(string ipfsHash, string recordType, string note, address addedBy, uint256 timestamp)[] memory)",
  "function admin() external view returns (address)",
  "function doctors(address) external view returns (bool)"
];

// 👨‍⚕️ Admin and known doctors
export const ADMIN_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266".toLowerCase();

export const VALID_DOCTORS = [
  "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  "0xE7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  "0x9A676e781A523b5d0C0e43731313A708CB607508"
].map(a => a.toLowerCase());

// 🌐 IPFS + Pinata configuration (Vite version)
export const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
export const PINATA_SECRET = import.meta.env.VITE_PINATA_SECRET;
export const PINATA_GATEWAY =
  import.meta.env.VITE_PINATA_GATEWAY || "https://gateway.pinata.cloud/ipfs/";
