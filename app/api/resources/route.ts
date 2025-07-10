import { NextRequest, NextResponse } from 'next/server';

async function checkLinkValid(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.status >= 200 && res.status < 400;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const { career, difficulty } = await req.json();
  const prompt = `Respond ONLY with a valid JSON array as described below, and nothing else. Do not include any explanations, markdown, or extra text.\nBuild me a roadmap to become a ${career} in 3 steps. I am at a ${difficulty} level. Each step should have:\n- a 'title'\n- 3 bullet points in a 'bullets' array\n- a 'resources' array with as many real, valid, accessible links as you can find (each resource: {title, type, link})\nIMPORTANT: If you cannot find a real, valid, accessible link for a resource, DO NOT include a placeholder, fake, or made-up link. Simply omit that resource from the array.\nIf you can't find a course or article, use a video, but always provide as many valid, accessible links as possible per step.\nFormat: [{"title": "...", "bullets": ["...", "...", "..."], "resources": [{"title": "...", "type": "...", "link": "..."}, ...]}, ...]\nPlease make sure that all the youtube links are accessible and valid videos to watch. Do not include any resource unless you are certain the link is real and works.`;

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
  console.log('FULL OPENAI RESPONSE:', data); // Debug log
  let steps = [];
  try {
    let content = data.choices[0].message.content;
    console.log('RAW GPT CONTENT:', content); // Debug log
    content = content.replace(/```json|```/g, '').trim();
    steps = JSON.parse(content);
    // Map 'link' to 'url' for each resource in each step
    if (Array.isArray(steps)) {
      for (const step of steps) {
        if (Array.isArray(step.resources)) {
          step.resources = step.resources.map((resource: any) => ({
            ...resource,
            url: resource.link,
            link: undefined, // Remove 'link' property
          }));
          // Validate all links in parallel
          const results = await Promise.all(
            step.resources.map(async (resource: any) => {
              const valid = await checkLinkValid(resource.url);
              return { ...resource, valid };
            })
          );
          step.resources = results.filter(r => r.valid);
        }
      }
    }
  } catch (e) {
    console.log('PARSE ERROR:', e); // Debug log
    steps = [];
  }
  console.log('FINAL STEPS:', steps); // Debug log
  return NextResponse.json({ steps });
} 