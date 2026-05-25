const API_KEY = 'AIzaSyBi18p8MhlmGuPBjSTZ0EkykNvMRgjUSZE';

export async function chatWithAi(messages) {
  try {
    // Map OpenAI message format to Gemini format
    let systemPrompt = "You are an intelligent, concise, and helpful study assistant. Keep answers under 3 sentences.";
    let geminiHistory = [];
    
    for (const msg of messages) {
      if (msg.role === 'system') {
        systemPrompt += "\n" + msg.content;
      } else {
        geminiHistory.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      }
    }

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{text: systemPrompt}] },
        contents: geminiHistory
      })
    });
    
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("AI Chat Error:", error);
    return `Connection Error: ${error.message}. Please check your Gemini API key.`;
  }
}

export async function generateMilestones(skillName) {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{text: "You are an expert curriculum designer."}] },
        contents: [
          {
            role: "user",
            parts: [{ text: `Generate exactly 10 distinct, sequential milestones to learn the skill "${skillName}". Start from absolute beginner to advanced. Return ONLY a JSON array of strings. Do not use markdown backticks. Example: ["Installed tools", "Learned basics", "Built project", "Learned advanced", "Mastery", "Optimization", "Architecture", "Mentorship", "Innovation", "Legacy"]` }]
          }
        ]
      })
    });
    
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    
    const text = data.candidates[0].content.parts[0].text.trim();
    let parsed;
    try {
      const clean = text.replace(/```json/g, '').replace(/```/g, '');
      parsed = JSON.parse(clean);
    } catch(e) {
      parsed = [
        "Started learning " + skillName,
        "Understood fundamental concepts",
        "Completed first guided project",
        "Built something independently",
        "Capable of teaching others",
        "Deep advanced concepts",
        "Architecture and Design",
        "Optimization and Performance",
        "Mentorship and Leadership",
        "Industry-level Innovation"
      ];
    }
    
    return parsed.slice(0, 10).map((tx, i) => ({
      tx: tx,
      lv: i + 1,
      done: i === 0
    }));
  } catch (error) {
    console.error("AI Milestone Error:", error);
    return [
      { tx: `Error: ${error.message}`, lv: 1, done: true },
      { tx: 'Understand basic concepts', lv: 2, done: false },
      { tx: 'Built a small project', lv: 3, done: false },
      { tx: 'Learned advanced topics', lv: 4, done: false },
      { tx: 'Mastered the skill', lv: 5, done: false },
    ];
  }
}

export async function generateWeeklyPlan(skillName, goal) {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{text: "You are an expert productivity coach."}] },
        contents: [
          {
            role: "user",
            parts: [{ text: `Create a specific, actionable 3-day study plan (Monday, Wednesday, Friday) for learning the skill "${skillName}" to achieve the goal: "${goal}". Return ONLY a JSON array of 3 strings representing the tasks for each day. Do not use markdown. Example: ["Read chapter 1 on syntax", "Build a hello world app", "Debug the app and read docs"]` }]
          }
        ]
      })
    });
    
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    
    const text = data.candidates[0].content.parts[0].text.trim();
    let parsed;
    try {
      const clean = text.replace(/```json/g, '').replace(/```/g, '');
      parsed = JSON.parse(clean);
    } catch(e) {
      parsed = [
        `Research basics for ${goal}`,
        `Practice implementation`,
        `Review and summarize`
      ];
    }
    
    return parsed.slice(0, 3);
  } catch (error) {
    console.error("AI Weekly Plan Error:", error);
    return [
      `Error: ${error.message}`,
      'Check your API key',
      'Try again later'
    ];
  }
}
