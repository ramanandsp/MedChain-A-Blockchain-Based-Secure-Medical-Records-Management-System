import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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
    const { extractedText, reportId } = await req.json();

    if (!extractedText) {
      return new Response(
        JSON.stringify({ error: 'No text provided' }),
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

    const prompt = `You are a medical AI assistant analyzing a health report. Extract key medical metrics and provide personalized health insights.

Health Report Text:
${extractedText}

Please analyze this health report and provide:
1. Key Metrics: Extract all important health metrics (blood pressure, cholesterol, glucose, etc.) with their values and units
2. Risk Assessment: Identify any values outside normal ranges
3. Health Insights: Brief interpretation of what these results mean
4. Recommendations: Provide 4 categories of recommendations:
   - Diet: Specific foods to eat and avoid
   - Exercise: Weekly exercise plan with specific activities
   - Lifestyle: Sleep, hydration, stress management tips
   - Preventive: Long-term health monitoring and preventive measures

Format your response as a JSON object with these exact keys:
{
  "metrics": { "metric_name": { "value": "string", "unit": "string", "status": "normal|high|low" } },
  "risk_factors": ["list of risk factors"],
  "insights": "brief health interpretation",
  "recommendations": {
    "diet": { "title": "string", "items": ["list of specific diet recommendations"] },
    "exercise": { "title": "string", "items": ["list of exercise recommendations"] },
    "lifestyle": { "title": "string", "items": ["list of lifestyle tips"] },
    "preventive": { "title": "string", "items": ["list of preventive measures"] }
  }
}`;

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a medical AI assistant that analyzes health reports and provides personalized recommendations. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      console.error('OpenAI API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to analyze report' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const openaiData = await openaiResponse.json();
    const analysisText = openaiData.choices[0].message.content;
    
    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', analysisText);
      return new Response(
        JSON.stringify({ error: 'Invalid AI response format' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ analysis, reportId }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in analyze-health-report:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});