import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { message, conversationHistory } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'No message provided' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const { data: recentReports } = await supabase
      .from('health_reports')
      .select('ai_analysis')
      .eq('user_id', user.id)
      .order('uploaded_at', { ascending: false })
      .limit(1);

    let contextInfo = '';
    if (profile) {
      contextInfo += `User Profile: ${profile.full_name}, Age: ${profile.age || 'N/A'}, Gender: ${profile.gender || 'N/A'}. `;
      if (profile.health_goals) {
        contextInfo += `Health Goals: ${profile.health_goals}. `;
      }
    }

    if (recentReports && recentReports.length > 0 && recentReports[0].ai_analysis) {
      contextInfo += `Recent Health Report Analysis: ${JSON.stringify(recentReports[0].ai_analysis)}. `;
    }

    const systemPrompt = `You are a friendly, knowledgeable AI health coach for MedChain AI Friend. Your role is to:
- Provide personalized health guidance based on the user's medical reports and profile
- Answer questions about health metrics, test results, and general wellness
- Recommend diet, exercise, and lifestyle improvements
- Be supportive, encouraging, and empathetic
- Always remind users to consult healthcare professionals for serious concerns

${contextInfo ? `Context about this user: ${contextInfo}` : ''}

Important: Keep responses conversational, friendly, and concise. Use simple language and provide actionable advice.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []),
      { role: 'user', content: message }
    ];

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      console.error('OpenAI API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to get AI response' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const openaiData = await openaiResponse.json();
    const aiResponse = openaiData.choices[0].message.content;

    await supabase.from('chat_conversations').insert([
      { user_id: user.id, message: message, role: 'user' },
      { user_id: user.id, message: aiResponse, role: 'assistant' }
    ]);

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in ai-health-chat:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});