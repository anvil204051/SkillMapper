import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { career, difficulty } = await req.json();
  // Updated prompt for Smart Suggestions card format and roadmap steps
  const prompt = `Respond ONLY with a valid JSON object as described below, and nothing else. Do not include any explanations, markdown, or extra text. I want you to recommend a special skill to master for someone who wants to become a ${career} at a ${difficulty} level, AND generate a personalized learning roadmap for this user. The response should be a JSON object with two fields: 'suggestion' and 'roadmapSteps'.

'suggestion' should be an object with two fields: 'skill' and 'next'.

'skill' should be an object with:
- name: the skill name (string)
- match: a percentage match (string, e.g. '92% match')
- description: a short description of the skill (string)
- context: a sentence about why this skill is recommended, based on the user's progress or background (string)
- tags: an array of 2-4 relevant tags (array of strings)

'next' should be an object with:
- name: the next recommended skill (string)
- description: a short description of why this is the next step (string)
- context: a sentence about when to move to this next skill (string)

'roadmapSteps' should be an array of 3-6 steps, each with:
- title: the step title (string)
- bullets: an array of 2-4 key learning objectives for this step (array of strings)
- resources: an array of 2-3 recommended resources for this step, each with: title (string), type ("video" | "article" | "course" | "book"), link (string), and provider (string)
- IMPORTANT: For every step, the resources array MUST include at least one resource of type "video".
- IMPORTANT: ALL resource links (video, course, article, or book) MUST be real, valid, and accessible URLs that open to actual, reputable resources (e.g., YouTube, Coursera, freeCodeCamp, MDN, etc.). DO NOT use any placeholders, made-up, fake, or broken links. Any response with such links will be rejected. Double-check that every link works and leads to a real resource before including it.

Example format:
{
  "suggestion": {
    "skill": {
      "name": "TypeScript Advanced Patterns",
      "match": "92% match",
      "description": "Learn advanced TypeScript patterns like conditional types, mapped types, and template literal types.",
      "context": "Based on your React progress and GitHub activity with JavaScript",
      "tags": ["typescript", "advanced", "patterns"]
    },
    "next": {
      "name": "Machine Learning Fundamentals",
      "description": "Perfect next step after completing your data analysis foundations.",
      "context": "After you finish the current skill, move to this."
    }
  },
  "roadmapSteps": [
    {
      "title": "Learn the Basics of HTML, CSS, and JavaScript",
      "bullets": [
        "Understand HTML structure and basic tags",
        "Style web pages using CSS for layouts and design",
        "Add interactivity with basic JavaScript"
      ],
      "resources": [
        { "title": "HTML & CSS for Beginners (FreeCodeCamp)", "type": "video", "link": "https://www.youtube.com/watch?v=some-valid-link", "provider": "FreeCodeCamp" },
        { "title": "JavaScript Crash Course (Traversy Media)", "type": "video", "link": "https://www.youtube.com/watch?v=another-valid-link", "provider": "Traversy Media" },
        { "title": "MDN Web Docs - HTML Basics", "type": "article", "link": "https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML", "provider": "MDN" }
      ]
    },
    // ...more steps
  ]
}`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'openai/chatgpt-4o-latest',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1800,
    }),
  });

  const data = await response.json();
  console.log('SMART SUGGESTIONS + ROADMAP AI RESPONSE:', JSON.stringify(data, null, 2));
  let suggestion = null;
  let roadmapSteps = null;
  try {
    let content = data.choices[0].message.content;
    content = content.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(content);
    suggestion = parsed.suggestion || null;
    roadmapSteps = parsed.roadmapSteps || null;
  } catch (e) {
    suggestion = null;
    roadmapSteps = null;
  }
  return NextResponse.json({ suggestion, roadmapSteps });
} 