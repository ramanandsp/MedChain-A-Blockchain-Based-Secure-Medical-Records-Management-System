# MedChain v2 - Deployment Checklist

## Pre-Deployment Checklist

### 1. Smart Contract Setup ✓
- [ ] MedChainV2.sol contract deployed to network (testnet or mainnet)
- [ ] Contract address recorded
- [ ] Contract verified on block explorer (Etherscan)
- [ ] Admin wallet address identified
- [ ] Contract ABI exported

### 2. Configuration ✓
- [ ] Update `src/config.js` with actual contract address
- [ ] Paste complete contract ABI in `src/config.js`
- [ ] Update admin address in `src/config.js`
- [ ] Configure IPFS gateway if using custom node
- [ ] Test IPFS upload functionality

### 3. Testing ✓
- [ ] Test MetaMask connection
- [ ] Test admin portal (add doctor)
- [ ] Test doctor portal (register patient)
- [ ] Test doctor portal (upload record)
- [ ] Test patient portal (view records)
- [ ] Test wallet switching
- [ ] Test on multiple browsers
- [ ] Test responsive design (mobile/tablet)

### 4. Security Review ✓
- [ ] No private keys in code
- [ ] No API keys exposed in client code
- [ ] Input validation on all forms
- [ ] Error handling implemented
- [ ] Contract role verification working
- [ ] HTTPS enforced (for production)
- [ ] CORS properly configured

### 5. Build Verification ✓
- [ ] Run `npm run build` successfully
- [ ] Check build output for errors
- [ ] Test production build locally with `npm run preview`
- [ ] Verify all assets load correctly
- [ ] Check console for errors

## Deployment Options

### Option 1: Vercel (Recommended)

**Steps:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd client
vercel

# Follow prompts to link project
```

**Post-Deployment:**
- [ ] Verify deployment URL
- [ ] Test all functionality on live site
- [ ] Set custom domain (optional)
- [ ] Enable analytics (optional)

**Pros:** Free tier, automatic SSL, CDN, easy deployments
**Cons:** None for this use case

---

### Option 2: Netlify

**Steps:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
cd client
npm run build
netlify deploy --prod

# Drag & drop dist/ folder to Netlify dashboard
```

**Post-Deployment:**
- [ ] Configure redirects for SPA (add `_redirects` file)
- [ ] Verify deployment URL
- [ ] Test all functionality
- [ ] Set custom domain (optional)

**Pros:** Free tier, easy CI/CD, form handling
**Cons:** Requires redirect configuration for SPA

**Add `_redirects` file in `public/`:**
```
/*    /index.html   200
```

---

### Option 3: IPFS (Fully Decentralized)

**Steps:**
```bash
# Install IPFS
# See: https://docs.ipfs.tech/install/

# Build project
cd client
npm run build

# Add to IPFS
ipfs add -r dist/

# Pin to keep online
ipfs pin add <CID>

# Access via gateway
# https://ipfs.io/ipfs/<CID>
```

**Post-Deployment:**
- [ ] Pin on multiple IPFS nodes (Pinata, Infura)
- [ ] Set up DNSLink for custom domain (optional)
- [ ] Share IPFS gateway URL

**Pros:** Fully decentralized, censorship-resistant
**Cons:** Slower than traditional hosting, requires pinning

---

### Option 4: GitHub Pages

**Steps:**
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

**Update `vite.config.js`:**
```javascript
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
});
```

**Post-Deployment:**
- [ ] Enable GitHub Pages in repo settings
- [ ] Verify deployment URL
- [ ] Test all functionality

**Pros:** Free, integrated with GitHub
**Cons:** Public repos only (free tier), requires base path configuration

---

### Option 5: Traditional Web Hosting (cPanel, etc.)

**Steps:**
```bash
# Build project
cd client
npm run build

# Upload dist/ folder contents via FTP/SFTP
# To your web server's public_html or www folder
```

**Server Requirements:**
- [ ] Static file serving enabled
- [ ] Support for SPA (URL rewriting)
- [ ] HTTPS certificate installed

**Post-Deployment:**
- [ ] Configure .htaccess for SPA routing (Apache)
- [ ] Verify all routes work
- [ ] Test MetaMask connection

**Apache .htaccess:**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## Post-Deployment Testing

### Functional Tests
- [ ] Connect wallet on live site
- [ ] Verify correct network detected
- [ ] Test admin portal functions
- [ ] Test doctor portal functions
- [ ] Test patient portal functions
- [ ] Upload test medical record
- [ ] View uploaded record on IPFS
- [ ] Test on mobile device
- [ ] Test on different browsers

### Performance Tests
- [ ] Check page load speed
- [ ] Verify images/assets load
- [ ] Test IPFS upload speed
- [ ] Monitor blockchain transaction times
- [ ] Check console for errors

### Security Tests
- [ ] Verify HTTPS enabled
- [ ] Test unauthorized access attempts
- [ ] Verify role-based restrictions work
- [ ] Check for exposed sensitive data
- [ ] Test MetaMask transaction prompts

---

## Network Configuration

### Testnet Deployment (Recommended First)

**Sepolia Testnet:**
- [ ] Contract deployed on Sepolia
- [ ] MetaMask configured for Sepolia
- [ ] Test ETH acquired from faucet
- [ ] All testing completed
- [ ] No bugs found

**Get Test ETH:**
- https://sepoliafaucet.com/
- https://faucet.quicknode.com/ethereum/sepolia

**Block Explorer:**
- https://sepolia.etherscan.io/

### Mainnet Deployment

⚠️ **ONLY after thorough testing on testnet!**

**Pre-Mainnet Checklist:**
- [ ] Contract audited by professional
- [ ] All testnet tests passed
- [ ] Security review completed
- [ ] Gas optimization done
- [ ] User documentation ready
- [ ] Support channel established
- [ ] Sufficient ETH for deployment

**Mainnet Deployment:**
- [ ] Deploy contract to mainnet
- [ ] Verify contract on Etherscan
- [ ] Update client with mainnet contract address
- [ ] Update IPFS configuration
- [ ] Deploy frontend
- [ ] Monitor first transactions
- [ ] Document deployment details

---

## Monitoring & Maintenance

### After Deployment
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Monitor contract events
- [ ] Check IPFS pin status regularly
- [ ] Monitor gas prices and usage
- [ ] Track user feedback
- [ ] Keep dependencies updated

### Regular Maintenance
- [ ] Weekly: Check error logs
- [ ] Monthly: Update dependencies
- [ ] Quarterly: Security audit
- [ ] As needed: Add new features

---

## Rollback Plan

If issues arise post-deployment:

1. **Quick Fix:**
   - Revert to previous deployment
   - Fix bug in local environment
   - Test thoroughly
   - Redeploy

2. **Contract Issue:**
   - Cannot modify deployed contract
   - Deploy new contract version
   - Update client configuration
   - Announce migration to users

3. **IPFS Issue:**
   - Switch to backup IPFS gateway
   - Re-pin content if necessary
   - Update gateway in config

---

## Launch Announcement

### Share Your DApp
- [ ] Update README with live URL
- [ ] Create demo video/screenshots
- [ ] Write blog post about the project
- [ ] Share on social media
- [ ] Post on Reddit (r/ethereum, r/web3)
- [ ] Submit to DApp directories
- [ ] Create user documentation

### User Support
- [ ] Create FAQ document
- [ ] Set up support channel (Discord/Telegram)
- [ ] Prepare troubleshooting guide
- [ ] Monitor user feedback
- [ ] Respond to issues promptly

---

## Success Metrics

Track these after deployment:
- [ ] Number of wallet connections
- [ ] Number of doctors added
- [ ] Number of patients registered
- [ ] Number of records uploaded
- [ ] IPFS upload success rate
- [ ] Average transaction time
- [ ] User retention rate
- [ ] Error rate

---

## Backup & Recovery

### Before Mainnet Launch
- [ ] Backup contract source code
- [ ] Backup contract ABI
- [ ] Backup deployment details
- [ ] Document admin private key location (secure!)
- [ ] Export list of added doctors
- [ ] Document IPFS CIDs of important files

### Disaster Recovery
- [ ] Contract address lost → Check Etherscan transaction history
- [ ] Admin key lost → Cannot recover (prevent this!)
- [ ] IPFS data lost → Re-pin from gateway
- [ ] Website down → Deploy to backup host

---

## Legal & Compliance

### Before Going Live
- [ ] Review local healthcare data regulations (HIPAA, GDPR)
- [ ] Add privacy policy
- [ ] Add terms of service
- [ ] Add disclaimer about medical data
- [ ] Consult with legal counsel (if handling real medical data)
- [ ] Implement data encryption for sensitive records
- [ ] Add user consent mechanisms

⚠️ **Important:** This DApp handles medical data. Ensure compliance with all applicable laws and regulations in your jurisdiction before deployment!

---

## Final Checklist

- [ ] All configuration files updated
- [ ] Contract deployed and verified
- [ ] Client built successfully
- [ ] All tests passed
- [ ] Deployment successful
- [ ] Live site tested
- [ ] Documentation complete
- [ ] Support channels ready
- [ ] Monitoring enabled
- [ ] Backup plan in place

**Ready to launch! 🚀**
