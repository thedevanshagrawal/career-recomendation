"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

export default function Home() {
  const [formData, setFormData] = useState({
    skills: "",
    interests: "",
    analytical: "",
    creative: "",
    preferredWorkEnvironment: "",
    timeCommitment: "",
  });
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim());
      const interestsArray = formData.interests
        .split(",")
        .map((interest) => interest.trim());

      const response = await axios.post("/api/recommend-career", {
        formData: { ...formData, skills: skillsArray, interests: interestsArray },
      });

      setAiRecommendation(response.data.recommendation);
    } catch (error) {
      console.error("Error fetching AI recommendation:", error);
    } finally {
      setLoading(false); // Stop loading
    }

    // Reset form
    setFormData({
      skills: "",
      interests: "",
      analytical: "",
      creative: "",
      preferredWorkEnvironment: "",
      timeCommitment: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full text-center py-16 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
        <h1 className="text-4xl font-bold mb-2">AI-Powered Career Guidance</h1>
        <p className="text-lg">Get career recommendations based on your skills & interests.</p>
      </section>

      {/* Form Section */}
      <section className="w-full max-w-3xl bg-white shadow-md rounded-lg p-8 mt-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Tell us about yourself</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Skills Input */}
          <div>
            <Label htmlFor="skills">Skills</Label>
            <Input
              id="skills"
              name="skills"
              placeholder="e.g., JavaScript, Python, Design"
              value={formData.skills}
              onChange={handleChange}
            />
          </div>

          {/* Interests Input */}
          <div>
            <Label htmlFor="interests">Interests</Label>
            <Input
              id="interests"
              name="interests"
              placeholder="e.g., AI, Web Development, Healthcare"
              value={formData.interests}
              onChange={handleChange}
            />
          </div>

          {/* Personality Traits */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="analytical">Analytical (1-5)</Label>
              <Input
                type="number"
                id="analytical"
                name="analytical"
                min="1"
                max="5"
                value={formData.analytical}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="creative">Creative (1-5)</Label>
              <Input
                type="number"
                id="creative"
                name="creative"
                min="1"
                max="5"
                value={formData.creative}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Preferred Work Environment */}
          <div>
            <Label>Preferred Work Environment</Label>
            <Select
              name="preferredWorkEnvironment"
              onValueChange={(value) =>
                setFormData({ ...formData, preferredWorkEnvironment: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="in-office">In-Office</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time Commitment */}
          <div>
            <Label htmlFor="timeCommitment">Time Commitment (hours/week)</Label>
            <Input
              type="number"
              id="timeCommitment"
              name="timeCommitment"
              min="1"
              max="40"
              value={formData.timeCommitment}
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-500 text-white py-2"
            disabled={loading}
          >
            {loading ? "Processing..." : "Get Career Suggestions"}
          </Button>
        </form>
      </section>

      {/* AI Recommendation Section */}
      {loading ? (
        <p className="mt-6 text-lg text-gray-600 animate-pulse">generating recommendations...</p>
      ) : (
        aiRecommendation && (
          <section className="max-w-3xl bg-white shadow-md rounded-lg p-6 mt-8">
            <h3 className="text-2xl font-semibold text-center mb-4">Your Career Recommendations</h3>
            <div className="space-y-4 text-gray-700">
              {aiRecommendation.split("\n").map((line, index) => (
                <p key={index} className="leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
          </section>
        )
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-4 mt-10 w-full">
        <p>&copy; 2025 AI Career Guide. All rights reserved.</p>
      </footer>
    </div>
  );
}
