'use client'

import { useState, useEffect } from "react";
import { completeOnboarding } from "@/app/actions/profile";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

const INTERESTS = [
  "Healing", "Family", "Finances", "Guidance", "Peace", 
  "Addiction", "Missions", "Grief", "Spiritual Growth", "Relationships"
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [timezone, setTimezone] = useState("UTC");

  useEffect(() => {
    try {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    } catch (e) {
      console.error("Timezone detection failed", e);
    }
  }, []);

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  const handleFormSubmit = async (formData: FormData) => {
    formData.append('prayer_interests', JSON.stringify(interests));
    const result = await completeOnboarding(formData);
    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-lg">
        <div className="flex justify-between items-center mb-16">
          <div className="flex space-x-2">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className={`h-0.5 w-8 transition-colors ${i <= step ? "bg-black" : "bg-neutral-200"}`}
              />
            ))}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Step {step} of 3</span>
        </div>

        <form action={handleFormSubmit}>
          {step === 1 && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div>
                <h1 className="text-4xl font-bold tracking-tighter mb-4 uppercase">The Basics</h1>
                <p className="text-neutral-500 text-sm font-medium">Help us personalize your community experience.</p>
              </div>

              <div className="space-y-8">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Full Name</label>
                  <input 
                    name="full_name"
                    required
                    placeholder="Enter your name"
                    className="w-full bg-transparent border-b border-neutral-200 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Username</label>
                  <input 
                    name="username"
                    required
                    placeholder="unique_handle"
                    className="w-full bg-transparent border-b border-neutral-200 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => setStep(2)}
                className="w-full border-b-2 border-black py-4 flex items-center justify-between text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all px-2"
              >
                Next Step <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div>
                <h1 className="text-4xl font-bold tracking-tighter mb-4 uppercase">Your Place</h1>
                <p className="text-neutral-500 text-sm font-medium">Connect with brothers and sisters nearby.</p>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Country</label>
                    <input 
                      name="country"
                      required
                      placeholder="e.g. USA"
                      className="w-full bg-transparent border-b border-neutral-200 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">City</label>
                    <input 
                      name="city"
                      required
                      placeholder="e.g. New York"
                      className="w-full bg-transparent border-b border-neutral-200 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Timezone</label>
                  <input 
                    name="timezone"
                    defaultValue={timezone}
                    className="w-full bg-transparent border-b border-neutral-200 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Preferred Language</label>
                  <select 
                    name="language"
                    className="w-full bg-transparent border-b border-neutral-200 py-3 text-sm focus:outline-none focus:border-black transition-colors appearance-none"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="pt">Português</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-4">
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="w-1/3 border border-neutral-200 py-4 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest hover:border-black transition-all"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </button>
                <button 
                  type="button" 
                  onClick={() => setStep(3)}
                  className="w-2/3 border-b-2 border-black py-4 flex items-center justify-between text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all px-4"
                >
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div>
                <h1 className="text-4xl font-bold tracking-tighter mb-4 uppercase">Heart & Mission</h1>
                <p className="text-neutral-500 text-sm font-medium">What are you passionate about praying for?</p>
              </div>

              <div className="space-y-8">
                <div className="flex flex-wrap gap-3">
                  {INTERESTS.map(interest => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                        interests.includes(interest) 
                          ? "bg-black text-white" 
                          : "border border-neutral-100 text-neutral-400 hover:border-neutral-300"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>

                <div className="flex items-start space-x-3 pt-4 border-t border-neutral-100">
                  <input 
                    type="checkbox" 
                    name="open_to_local_meetups"
                    id="meetups" 
                    className="mt-1 w-4 h-4 rounded-none border-neutral-300 text-black focus:ring-transparent accent-black"
                  />
                  <label htmlFor="meetups" className="text-xs text-neutral-500 leading-relaxed">
                    I'm open to local meetups and physical prayer circles in my city.
                  </label>
                </div>
              </div>

              {error && <p className="text-xs font-bold text-red-500">{error}</p>}

              <div className="flex space-x-4">
                <button 
                  type="button" 
                  onClick={() => setStep(2)}
                  className="w-1/3 border border-neutral-200 py-4 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest hover:border-black transition-all"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </button>
                <button 
                  type="submit"
                  className="w-2/3 bg-black text-white py-4 flex items-center justify-between text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-all px-4"
                >
                  Complete Onboarding <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
