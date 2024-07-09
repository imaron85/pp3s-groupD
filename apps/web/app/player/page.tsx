'use client'

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Navbar } from "@repo/ui/navbar";

interface Choice {
  text: string;
  isCorrect: boolean;
}

interface Question {
  questionText: string;
  choices: Choice[];
}

interface Quiz {
  _id: string;
  title: string;
  questions: Question[];
  author: string;
  createdAt: string;
}

const PlayerPage = () => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const id = "c1e046bc-ccb0-455b-a528-947d6c648c9c";

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`http://localhost:3001/quiz/quiz?_id=${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch quiz");
        }
        const data = await response.json();
        setQuiz(data.quiz);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchQuiz();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  const handleChoiceClick = (isCorrect: boolean) => {
    alert(`You selected an answer: ${isCorrect ? 'Correct' : 'Incorrect'}`);
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert('Quiz completed!');
    }
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];

  if (!currentQuestion) {
    return <div>Question not found</div>;
  }

  return (
    <>
      <Navbar />
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">{quiz.title}</h1>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">{currentQuestion.questionText}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQuestion.choices.map((choice, choiceIndex) => (
              <button
                key={choiceIndex}
                className={`p-4 border rounded-md text-white font-bold text-center ${
                  choiceIndex % 4 === 0
                    ? "bg-red-500 hover:bg-red-600"
                    : choiceIndex % 4 === 1
                    ? "bg-green-500 hover:bg-green-600"
                    : choiceIndex % 4 === 2
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-yellow-500 hover:bg-yellow-600"
                }`}
                onClick={() => handleChoiceClick(choice.isCorrect)}
              >
                {choice.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayerPage;