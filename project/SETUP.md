# Setup Guide for MedChain AI Friend

## Quick Start

The application is ready to run! Follow these steps to get started:

## 1. Install Dependencies

```bash
npm install
```

## 2. OpenAI API Configuration

The AI features require an OpenAI API key. The Edge Functions deployed to Supabase will automatically have access to the configured API key.

### Getting Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (you won't be able to see it again!)

The OpenAI API key has been configured as a secret in your Supabase project and is automatically available to the Edge Functions.

## 3. Start Development

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## 4. Test the Application

### Create an Account
1. Click "Sign up" on the login screen
2. Enter your name, email, and password
3. You'll be automatically logged in

### Complete Your Profile
1. Fill in your age, gender, height, and weight
2. Optionally add your MedChain wallet address
3. Set your health goals
4. Click "Save Profile"

### Upload a Health Report (Testing)
1. Go to the "Reports" tab
2. Click to upload a PDF
3. For testing, you can use any PDF file
4. The system will analyze it with AI

**Note:** The current implementation uses a simulated PDF text extraction. In production, you'd integrate a proper PDF parsing library like `pdf-parse` or `pdfjs-dist`.

### Chat with AI
1. Navigate to the "AI Coach" tab
2. Try asking:
   - "What should I eat for better heart health?"
   - "Create a weekly exercise plan for me"
   - "How can I improve my sleep?"

## Database Structure

The database is already set up with:
- **profiles** - User health profiles
- **health_reports** - Uploaded medical reports
- **chat_conversations** - AI chat history
- **health_recommendations** - Personalized health plans

All tables have Row Level Security enabled for data protection.

## Edge Functions Deployed

Two Edge Functions are live:

1. **analyze-health-report** - Analyzes PDFs with GPT-4
2. **ai-health-chat** - Powers the AI health coach

Both functions are secured with JWT authentication and CORS enabled.

## Storage Bucket

A storage bucket `health-reports` has been created with policies that allow users to:
- Upload files to their own folder
- View only their own files

## Environment Variables

The `.env` file is pre-configured with:
```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Troubleshooting

### "Failed to analyze report"
- Ensure the OpenAI API key is properly configured
- Check that you have API credits available
- Verify the Edge Functions are deployed

### "Authentication error"
- Clear browser cache and cookies
- Try signing out and back in
- Check that Supabase environment variables are correct

### File upload fails
- Ensure file is under 10MB
- Only PDF files are accepted
- Check storage bucket permissions

## Production Deployment

To deploy this application:

1. **Frontend** - Deploy to Vercel, Netlify, or any static host
   ```bash
   npm run build
   ```

2. **Environment Variables** - Set in your hosting platform:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

3. **Domain Configuration** - Update CORS settings if needed

## Next Steps

1. Integrate real PDF parsing library for production use
2. Add email verification for new users
3. Implement health metric tracking over time
4. Connect to MedChain smart contracts
5. Add data export functionality

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify all environment variables are set
3. Ensure dependencies are installed
4. Check Supabase dashboard for database/auth issues

---

**Happy building! Your AI health assistant is ready to go.** 🏥💚
