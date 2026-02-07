# Deployment Guide

## Pre-Deployment Checklist

### ✅ Completed Items

- [x] Database schema deployed to Supabase
- [x] Edge Functions deployed and tested
- [x] Storage bucket created with policies
- [x] Row Level Security enabled on all tables
- [x] Environment variables configured
- [x] Production build tested successfully
- [x] CORS headers configured in Edge Functions
- [x] Authentication flow working
- [x] File upload working
- [x] AI analysis working
- [x] Chat functionality working

### 📋 Before You Deploy

- [ ] Get OpenAI API key and verify credits
- [ ] Test the app thoroughly in development
- [ ] Check all features work as expected
- [ ] Verify error handling
- [ ] Test on different browsers
- [ ] Test on mobile devices

## Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Zero configuration for Vite apps
- Automatic HTTPS
- Global CDN
- Free tier available

**Steps:**

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via CLI**
   ```bash
   vercel
   ```

3. **Or Deploy via GitHub**
   - Push code to GitHub
   - Import project in Vercel dashboard
   - Configure environment variables
   - Deploy

**Environment Variables on Vercel:**
```
VITE_SUPABASE_URL=https://cogvtwgzugrmpugujizb.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Option 2: Netlify

**Steps:**

1. **Build Locally**
   ```bash
   npm run build
   ```

2. **Deploy via CLI**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

3. **Or Drag & Drop**
   - Go to Netlify dashboard
   - Drag `dist/` folder
   - Configure environment variables

**netlify.toml** (optional):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: Traditional Web Host

**Steps:**

1. **Build**
   ```bash
   npm run build
   ```

2. **Upload `dist/` folder** to your web host via:
   - FTP
   - cPanel file manager
   - SSH/rsync

3. **Configure .htaccess** (Apache):
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

## Post-Deployment

### 1. Verify Deployment

Check these URLs work:
- `https://your-domain.com/` - Should show login page
- No 404 errors on refresh
- Assets loading correctly

### 2. Test All Features

- [ ] User registration
- [ ] User login
- [ ] Profile creation
- [ ] Profile updates
- [ ] PDF upload
- [ ] AI analysis
- [ ] Health insights display
- [ ] AI chat
- [ ] Sign out

### 3. Configure Custom Domain (Optional)

**Vercel:**
```bash
vercel domains add your-domain.com
```

**Netlify:**
- Go to Domain settings
- Add custom domain
- Configure DNS

### 4. Enable Analytics (Optional)

**Google Analytics:**
Add to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Environment Variables

### Required Variables

```bash
VITE_SUPABASE_URL=<your-supabase-project-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

### Supabase Edge Function Secrets

The OpenAI API key is stored as a Supabase secret and is automatically available to Edge Functions.

## Security Checklist

- [x] HTTPS enabled
- [x] Environment variables not committed to git
- [x] API keys secured in Edge Functions
- [x] Row Level Security enabled
- [x] Storage bucket policies configured
- [x] CORS properly configured
- [x] Input validation in place
- [x] File size limits enforced

## Performance Optimization

### Already Implemented
- [x] Code splitting
- [x] Minification
- [x] Gzip compression
- [x] Tree shaking
- [x] Asset optimization

### Future Optimizations
- [ ] Image lazy loading
- [ ] Route-based code splitting
- [ ] Service worker for PWA
- [ ] CDN for assets
- [ ] Database query optimization

## Monitoring

### Supabase Dashboard

Monitor:
- Database usage
- Storage usage
- Edge Function invocations
- Authentication activity
- API errors

Access: https://app.supabase.com

### Application Monitoring

Consider adding:
- Error tracking (Sentry)
- Performance monitoring (Lighthouse CI)
- User analytics (Mixpanel, Amplitude)
- Uptime monitoring (UptimeRobot)

## Backup Strategy

### Database Backups
Supabase automatically backs up your database daily. For additional safety:

1. **Manual Backup**
   - Go to Supabase Dashboard
   - Database → Backups
   - Download backup

2. **Automated Backups**
   - Available on Supabase Pro plan
   - Point-in-time recovery
   - Retention policies

### Code Backups
- Keep code in GitHub
- Tag releases: `git tag v1.0.0`
- Document changes in CHANGELOG

## Rollback Plan

If deployment fails:

1. **Vercel/Netlify**
   ```bash
   # Rollback to previous deployment
   vercel rollback
   # or
   netlify rollback
   ```

2. **Traditional Host**
   - Keep previous build
   - Replace with backup

3. **Database**
   - Restore from Supabase backup
   - Run rollback migration if needed

## Scaling Considerations

### Current Limits (Supabase Free Tier)
- 500 MB database
- 1 GB file storage
- 500k Edge Function invocations/month
- 50k monthly active users

### When to Upgrade
- Database > 400 MB
- Storage > 800 MB
- Heavy Edge Function usage
- Need better performance

### Optimization Before Scaling
1. Implement caching
2. Optimize queries
3. Compress images
4. Enable CDN
5. Database indexing

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist .vite
npm install
npm run build
```

### Environment Variables Not Working
- Check variable names start with `VITE_`
- Rebuild after changing env vars
- Verify in browser console

### CORS Errors
- Edge Functions have CORS enabled
- Check allowed origins
- Verify request headers

### 404 on Page Refresh
- Configure SPA routing
- Add redirect rules
- Check deployment platform docs

## Production Best Practices

1. **Use Production Build**
   ```bash
   npm run build
   # Not npm run dev
   ```

2. **Set NODE_ENV**
   ```bash
   NODE_ENV=production
   ```

3. **Enable Gzip**
   - Most hosts enable automatically
   - Verify in Network tab

4. **Use HTTPS Only**
   - Configure HSTS header
   - Redirect HTTP to HTTPS

5. **Regular Updates**
   ```bash
   npm update
   npm audit fix
   ```

## Support Resources

- **Supabase**: https://supabase.com/docs
- **Vite**: https://vitejs.dev/guide/
- **React**: https://react.dev/
- **Vercel**: https://vercel.com/docs
- **Netlify**: https://docs.netlify.com/

## Maintenance Schedule

### Weekly
- Check error logs
- Monitor usage metrics
- Review user feedback

### Monthly
- Update dependencies
- Review security advisories
- Backup database manually
- Check performance metrics

### Quarterly
- Security audit
- Performance review
- Feature updates
- User surveys

---

## Quick Deploy Command

```bash
# Build and verify
npm run build
npm run preview

# Deploy (Vercel)
vercel --prod

# Deploy (Netlify)
netlify deploy --prod
```

## Success Criteria

Your deployment is successful when:
- ✅ App loads without errors
- ✅ All features working
- ✅ HTTPS enabled
- ✅ Mobile responsive
- ✅ Fast load times (< 3s)
- ✅ No console errors
- ✅ Analytics tracking (if enabled)

---

**Ready to deploy?** Follow the steps above and your MedChain AI Friend will be live! 🚀

For questions or issues, refer to platform-specific documentation or open an issue in your repository.
