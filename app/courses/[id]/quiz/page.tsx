"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useParams, useRouter } from 'next/navigation';

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const router = useRouter();

  const questions = [
    {
      question: "Which CSS property is essential for Brutalist layouts?",
      options: ["border", "box-shadow", "mix-blend-mode", "filter"],
      answer: 0
    },
    {
      question: "What is the primary color used in our design system?",
      options: ["#FFFFFF", "#9D7BFF", "#2D1B69", "#E6E1FF"],
      answer: 1
    },
    {
      question: "What shadow style defines the 'Sticker UI' look?",
      options: ["Blurry shadow", "Inner shadow", "Hard hard shadow (No blur)", "Glow effect"],
      answer: 2
    }
  ];

  const handleNext = () => {
    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-bg-offwhite flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6">
          <Card className="max-w-md w-full text-center border-3 p-12">
            <h1 className="text-4xl font-heading font-bold text-deep-indigo uppercase mb-4">Quiz Completed!</h1>
            <div className="text-6xl font-heading font-bold text-primary mb-6">{Math.round((score / questions.length) * 100)}%</div>
            <p className="text-lg font-bold text-deep-indigo mb-8">You got {score} out of {questions.length} questions correct.</p>
            <div className="flex flex-col gap-4">
              <Button variant="primary" onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
              <Button variant="secondary" onClick={() => { setShowResult(false); setCurrentQuestion(0); setScore(0); }}>Try Again</Button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-offwhite flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full border-3 p-10">
          <div className="flex justify-between items-center mb-10">
            <span className="font-heading font-bold text-sm text-primary uppercase tracking-widest">Question {currentQuestion + 1} of {questions.length}</span>
            <div className="w-32 h-3 bg-surface-low border-2 border-deep-indigo rounded-md overflow-hidden">
               <div className="h-full bg-primary" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}></div>
            </div>
          </div>

          <h2 className="text-2xl font-heading font-bold text-deep-indigo mb-8 uppercase leading-tight">
            {questions[currentQuestion].question}
          </h2>

          <div className="space-y-4 mb-10">
            {questions[currentQuestion].options.map((option, i) => (
              <button 
                key={i}
                onClick={() => setSelectedOption(i)}
                className={`w-full text-left p-5 border-2 font-bold transition-all rounded-md flex items-center gap-4 ${selectedOption === i ? 'bg-secondary border-deep-indigo shadow-brutal translate-x-1 translate-y-1' : 'bg-white border-deep-indigo/20 hover:border-deep-indigo'}`}
              >
                <span className={`w-8 h-8 rounded-md border-2 border-deep-indigo flex items-center justify-center ${selectedOption === i ? 'bg-primary text-white' : 'bg-surface-low'}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                {option}
              </button>
            ))}
          </div>

          <Button 
            variant="primary" 
            className="w-full py-4 text-lg"
            onClick={handleNext}
            disabled={selectedOption === null}
          >
            {currentQuestion + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
          </Button>
        </Card>
      </main>
    </div>
  );
}
