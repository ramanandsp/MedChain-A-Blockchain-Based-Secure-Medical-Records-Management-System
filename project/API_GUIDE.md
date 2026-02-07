# API Integration Guide

## Overview

MedChain AI Friend uses Supabase Edge Functions to securely integrate with OpenAI's GPT API. This guide explains how the APIs work and how to use them.

## Authentication

All API calls require authentication. The app automatically handles this using Supabase Auth tokens.

## Edge Functions

### 1. Analyze Health Report

**Endpoint:** `/functions/v1/analyze-health-report`

**Purpose:** Analyzes uploaded health reports using GPT-4 to extract metrics and generate recommendations.

**Request:**
```json
{
  "extractedText": "Blood Pressure: 120/80 mmHg\nCholesterol: 180 mg/dL...",
  "reportId": "uuid-of-report"
}
```

**Response:**
```json
{
  "analysis": {
    "metrics": {
      "Blood Pressure": {
        "value": "120/80",
        "unit": "mmHg",
        "status": "normal"
      },
      "Cholesterol": {
        "value": "180",
        "unit": "mg/dL",
        "status": "normal"
      }
    },
    "risk_factors": [
      "Slightly elevated LDL cholesterol"
    ],
    "insights": "Your health metrics show generally good cardiovascular health...",
    "recommendations": {
      "diet": {
        "title": "Heart-Healthy Nutrition",
        "items": [
          "Increase omega-3 rich foods like salmon and walnuts",
          "Reduce saturated fat intake",
          "Add more fiber from whole grains"
        ]
      },
      "exercise": {
        "title": "Cardiovascular Fitness Plan",
        "items": [
          "30 minutes of moderate cardio 5x per week",
          "Include strength training 2x per week",
          "Daily walking for 10,000 steps"
        ]
      },
      "lifestyle": {
        "title": "Healthy Habits",
        "items": [
          "Maintain 7-8 hours of sleep",
          "Stay hydrated with 8 glasses of water daily",
          "Practice stress reduction techniques"
        ]
      },
      "preventive": {
        "title": "Long-term Health",
        "items": [
          "Regular health screenings every 6 months",
          "Monitor blood pressure weekly",
          "Annual comprehensive health check"
        ]
      }
    }
  },
  "reportId": "uuid-of-report"
}
```

**Usage in Code:**
```typescript
const { data: { session } } = await supabase.auth.getSession();

const response = await fetch(
  `${SUPABASE_URL}/functions/v1/analyze-health-report`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      extractedText: pdfText,
      reportId: reportId,
    }),
  }
);

const { analysis } = await response.json();
```

### 2. AI Health Chat

**Endpoint:** `/functions/v1/ai-health-chat`

**Purpose:** Provides conversational health guidance using GPT-4 with context from user profile and health reports.

**Request:**
```json
{
  "message": "What should I eat for better heart health?",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": "Hi! I'm your AI health coach. How can I help you today?"
    }
  ]
}
```

**Response:**
```json
{
  "response": "Based on your recent health report showing slightly elevated cholesterol, I recommend focusing on heart-healthy foods like:\n\n- Fatty fish (salmon, mackerel) 2-3x per week\n- Nuts and seeds, especially walnuts\n- Olive oil instead of butter\n- Plenty of vegetables and fruits\n- Whole grains like oatmeal\n\nAvoid or limit:\n- Processed meats\n- Trans fats\n- Excessive red meat\n\nWould you like me to create a specific meal plan for you?"
}
```

**Context Provided to AI:**
- User profile (age, gender, health goals)
- Recent health report analysis
- Previous conversation messages

**Usage in Code:**
```typescript
const { data: { session } } = await supabase.auth.getSession();

const response = await fetch(
  `${SUPABASE_URL}/functions/v1/ai-health-chat`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: userMessage,
      conversationHistory: previousMessages,
    }),
  }
);

const { response: aiResponse } = await response.json();
```

## Database Operations

### Supabase Client

All database operations use the Supabase client with automatic authentication:

```typescript
import { supabase } from './lib/supabase';

const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();
```

### Common Operations

**Get User Profile:**
```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .maybeSingle();
```

**Upload Health Report:**
```typescript
const { data, error } = await supabase
  .from('health_reports')
  .insert({
    user_id: userId,
    file_name: fileName,
    file_path: filePath,
  })
  .select()
  .single();
```

**Get Recommendations:**
```typescript
const { data: recommendations } = await supabase
  .from('health_recommendations')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .limit(4);
```

**Save Chat Message:**
```typescript
await supabase
  .from('chat_conversations')
  .insert([
    { user_id: userId, message: userMsg, role: 'user' },
    { user_id: userId, message: aiMsg, role: 'assistant' }
  ]);
```

## File Storage

**Upload Health Report PDF:**
```typescript
const fileName = `${userId}/${Date.now()}_${file.name}`;

const { error } = await supabase.storage
  .from('health-reports')
  .upload(fileName, file);
```

**Get File URL:**
```typescript
const { data } = supabase.storage
  .from('health-reports')
  .getPublicUrl(fileName);
```

## Error Handling

All API calls should include proper error handling:

```typescript
try {
  const response = await fetch(apiUrl, options);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data;
} catch (error) {
  console.error('API error:', error);
  // Show user-friendly error message
}
```

## Rate Limiting

OpenAI API has rate limits. Consider implementing:
- Loading states during API calls
- Retry logic with exponential backoff
- User feedback for long operations

## Security Best Practices

1. **Never expose API keys** - Always use Edge Functions
2. **Validate input** - Check file types and sizes
3. **Use RLS policies** - Database automatically filters by user
4. **Sanitize output** - Don't trust AI-generated content blindly
5. **Implement CORS** - Already configured in Edge Functions

## Testing APIs

Use the browser console or tools like Postman:

```javascript
// Get your session token from DevTools
const token = 'your-session-token';

fetch('https://your-project.supabase.co/functions/v1/ai-health-chat', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'Hello, AI!',
    conversationHistory: []
  })
})
.then(r => r.json())
.then(console.log);
```

## Monitoring

Check your Supabase dashboard for:
- Edge Function logs
- Database query performance
- Storage usage
- Authentication metrics

---

For more details, see the [Supabase Documentation](https://supabase.com/docs) and [OpenAI API Reference](https://platform.openai.com/docs/api-reference).
