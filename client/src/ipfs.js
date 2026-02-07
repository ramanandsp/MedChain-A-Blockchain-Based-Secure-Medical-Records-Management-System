import axios from "axios";
import { PINATA_API_KEY, PINATA_SECRET, PINATA_GATEWAY } from "./config";


export async function uploadToIPFS(file) {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const formData = new FormData();
  formData.append("file", file);

  const headers = {
    pinata_api_key: PINATA_API_KEY,
    pinata_secret_api_key: PINATA_SECRET,
  };

  try {
    const res = await axios.post(url, formData, { headers });
    const cid = res.data.IpfsHash;
    console.log("✅ Uploaded to IPFS:", cid);
    return cid;
  } catch (err) {
    console.error("❌ IPFS upload error:", err);
    throw err;
  }
}

export const getIPFSUrl = (cid) => `${PINATA_GATEWAY}${cid}`;
