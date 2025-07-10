"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, BadgeCheck, Lightbulb } from "lucide-react";
import { useState } from "react";

interface SkillSuggestion {
  name: string;
  match: string;
  description: string;
  context: string;
  tags: string[];
}

interface NextSuggestion {
  name: string;
  description: string;
  context: string;
}

interface SmartSuggestion {
  skill: SkillSuggestion;
  next: NextSuggestion;
}

export function AISuggestions({ career, difficulty }: { career: string; difficulty: string }) {
  const [suggestion, setSuggestion] = useState<SmartSuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCard, setShowCard] = useState(false);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ career, difficulty }),
      });
      const data = await res.json();
      setSuggestion(data.suggestion || null);
      setShowCard(true);
    } catch (e) {
      setError("Failed to fetch suggestions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-stretch w-full">
      <button
        className="gradient-bg px-4 py-2 rounded text-white font-semibold mb-4 self-center"
        onClick={fetchSuggestions}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Smart Suggestions"}
      </button>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {showCard && suggestion && (
        <Card className="ai-glow gradient-border">
          <div className="gradient-border-content">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <CardTitle className="gradient-text">Smart Suggestions</CardTitle>
              </div>
              <CardDescription>AI-powered recommendations based on your learning progress and goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4">
                {/* Main Skill Suggestion Card */}
                <div className="rounded-lg bg-muted/80 border border-border p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-1">
                    <BadgeCheck className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">skill</span>
                    <Badge className="bg-green-600 text-white text-xs ml-2">{suggestion.skill.match}</Badge>
                  </div>
                  <div className="text-lg font-bold text-blue-200 mb-1">{suggestion.skill.name}</div>
                  <div className="text-base text-muted-foreground mb-1">{suggestion.skill.description}</div>
                  <div className="text-xs text-blue-300 mb-2">{suggestion.skill.context}</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {suggestion.skill.tags.map((tag, i) => (
                      <Badge key={i} className="bg-gray-800 text-gray-200 text-xs">#{tag}</Badge>
                    ))}
                  </div>
                </div>
                {/* Next Recommendation Card */}
                <div className="rounded-lg bg-[#1a2b1e] border border-green-700 p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Lightbulb className="w-4 h-4 text-green-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-green-400">Next Recommended</span>
                  </div>
                  <div className="text-base font-semibold text-green-300 mb-1">{suggestion.next.name}</div>
                  <div className="text-sm text-muted-foreground mb-1">{suggestion.next.description}</div>
                  <div className="text-xs text-green-200">{suggestion.next.context}</div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      )}
    </div>
  );
}
