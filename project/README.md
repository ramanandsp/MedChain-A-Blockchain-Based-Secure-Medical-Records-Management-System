# MedChain AI Friend 🏥💚

An AI-powered personal health assistant that integrates with MedChain's decentralized medical record system. Upload health reports, get AI-driven insights, personalized recommendations, and chat with your AI health coach.

## Features

### Core Capabilities
- **Secure Authentication** - Email/password authentication powered by Supabase
- **Profile Management** - Complete health profile with age, gender, height, weight, and health goals
- **MedChain Integration** - Store wallet address to link with MedChain DApp
- **PDF Upload & Analysis** - Upload medical reports and get AI-powered analysis
- **AI Health Insights** - Automatic extraction of health metrics and risk assessment
- **Personalized Recommendations** - AI-generated plans for diet, exercise, lifestyle, and preventive care
- **AI Health Coach** - Chat with GPT-powered assistant for continuous health guidance

### Design Highlights
- Modern glassmorphism UI with emerald & cyan gradients
- Responsive design that works on mobile, tablet, and desktop
- Smooth animations and transitions
- Apple Health inspired aesthetic
- Clean, intuitive navigation

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons

### Backend & Database
- **Supabase** - Complete backend platform
  - PostgreSQL database with Row Level Security (RLS)
  - Authentication & user management
  - File storage for health reports
  - Edge Functions for AI processing

### AI & Analysis
- **OpenAI GPT-4** - Health report analysis and chat
- Edge Functions for secure API key management
- Contextual AI responses based on user profile and health history

## Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── AuthForm.tsx     # Login/signup with glassmorphism design
│   │   ├── Dashboard.tsx    # Main app container with tabs
│   │   ├── ProfileSetup.tsx # User profile management
│   │   ├── HealthReports.tsx # PDF upload and report list
│   │   ├── HealthInsights.tsx # AI insights and recommendations
│   │   └── AIChat.tsx       # Chat interface with AI coach
│   ├── contexts/
│   │   └── AuthContext.tsx  # Authentication state management
│   ├── hooks/
│   │   └── useProfile.ts    # Profile data hook
│   ├── lib/
│   │   └── supabase.ts      # Supabase client & types
│   ├── App.tsx              # Root component
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles & animations
├── supabase/
│   ├── functions/           # Edge Functions
│   │   ├── analyze-health-report/  # PDF analysis with GPT
│   │   └── ai-health-chat/         # Chat with AI coach
│   └── migrations/          # Database schema
└── .env                     # Environment variables
```

## Database Schema

### Tables
1. **profiles** - Extended user information (age, gender, health goals, wallet address)
2. **health_reports** - Uploaded PDFs with AI analysis
3. **chat_conversations** - Chat history with AI coach
4. **health_recommendations** - Personalized recommendations by category

### Security
- All tables have Row Level Security (RLS) enabled
- Users can only access their own data
- Authenticated-only access to all endpoints

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Supabase account (database is pre-configured)
- OpenAI API key

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment variables are pre-configured** in `.env`:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Public anon key

3. **Configure OpenAI API Key:**
   The Edge Functions require an OpenAI API key. You'll need to add this as a secret in your Supabase project.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## Usage Guide

### 1. Sign Up / Sign In
- Create an account with email and password
- Provide your full name during registration

### 2. Complete Your Profile
- Enter age, gender, height, weight
- Add your MedChain wallet address (optional)
- Set health goals and preferences

### 3. Upload Health Reports
- Navigate to the "Reports" tab
- Click to upload PDF medical reports
- AI automatically analyzes the report and extracts:
  - Key health metrics
  - Risk factors
  - Health insights
  - Personalized recommendations

### 4. View Health Insights
- Check the "Health Insights" dashboard
- See extracted metrics with status indicators
- Review AI-generated recommendations for:
  - **Nutrition** - Foods to eat and avoid
  - **Exercise** - Personalized workout plans
  - **Lifestyle** - Sleep, hydration, stress tips
  - **Prevention** - Long-term health monitoring

### 5. Chat with AI Health Coach
- Ask questions about your health reports
- Get personalized advice based on your profile
- Request custom meal plans or exercise routines
- The AI remembers context from your health data

## Edge Functions

### analyze-health-report
- Extracts text from uploaded PDFs
- Sends to OpenAI GPT for analysis
- Stores structured insights in database
- Generates category-based recommendations

### ai-health-chat
- Contextual chat with GPT
- Uses profile data and recent reports for personalization
- Saves conversation history
- Provides friendly, actionable health advice

## Security Features

- **Authentication** - Supabase Auth with email verification
- **RLS Policies** - Database-level access control
- **Secure Storage** - User-isolated file storage
- **API Key Protection** - Edge Functions hide OpenAI keys from client
- **Input Validation** - File size limits and type checking

## Future Enhancements

- Direct blockchain integration with MedChain smart contracts
- Graph-based health metric tracking over time
- Email/push notifications for health insights
- Multi-language support
- Telemedicine integration
- Wearable device data import

## License

This project is built for educational and demonstration purposes.

## Credits

Built with:
- React & TypeScript
- Supabase (Database, Auth, Storage, Edge Functions)
- OpenAI GPT-4
- Tailwind CSS
- Lucide Icons

---

**Note:** This application is for demonstration purposes. Always consult qualified healthcare professionals for medical advice.
