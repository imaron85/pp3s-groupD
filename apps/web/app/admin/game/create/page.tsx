'use client';

import { Navbar } from "@repo/ui/navbar";
import { useState } from "react";
import Switch from "react-switch";
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { UseMutationOptions } from '@tanstack/react-query';


interface Answer {
  answerId: number;
  answerText: string;
  isCorrect: boolean;
}

interface Question {
  questionId: number;
  questionText: string;
  answers: Answer[];
}

interface Quiz {
  quizId: number;
  quizTitle: string;
  questions: Question[];
}

interface QuizCreationResponse {
  quiz: Quiz;
}

const createQuiz = async (newQuiz: Quiz): Promise<QuizCreationResponse> => {
  const response = await fetch('http://localhost:3001/quiz/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newQuiz),
  });
  if (!response.ok) {
    throw new Error('Failed to create quiz');
  }
  return await response.json();
};


const CreateGame = () => {
  const [quizTitle, setQuizTitle] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  const queryClient = useQueryClient();

  const mutationOptions: UseMutationOptions<QuizCreationResponse, Error, Quiz, unknown> = {
    onSuccess: (data: QuizCreationResponse) => {
      queryClient.invalidateQueries({
        queryKey: ['quizzes'],
      });
      setQuizzes(currentQuizzes => [...currentQuizzes, data.quiz]);
      setQuizTitle('');
      setQuestions([]);
      alert('Quiz created successfully!');
    },
    onError: (error: Error) => {
      console.error("Error creating quiz:", error.message);
      alert('Failed to create quiz. Please try again.');
    }
  };

  const mutation = useMutation<QuizCreationResponse, Error, Quiz, unknown>({ mutationFn: createQuiz, ...mutationOptions }, new QueryClient());


  const handleAddQuestion = () => {
    const newQuestion: Question = {
      questionId: questions.length + 1,
      questionText: '',
      answers: Array.from({ length: 4 }, (_, id) => ({
        answerId: id,
        answerText: '',
        isCorrect: false
      }))
    };
    setQuestions(currentQuestions => [...currentQuestions, newQuestion]);
  };

  const handleQuestionTextChange = (newQuestionText: string, questionId: number) => {
    setQuestions(currentQuestions =>
      currentQuestions.map(question =>
        question.questionId === questionId ? { ...question, questionText: newQuestionText } : question
      )
    );
  };

  const handleAnswerTextChange = (newAnswerText: string, questionId: number, answerId: number) => {
    setQuestions(currentQuestions =>
      currentQuestions.map(question =>
        question.questionId === questionId ? {
          ...question,
          answers: question.answers.map(answer =>
            answer.answerId === answerId ? { ...answer, answerText: newAnswerText } : answer
          )
        } : question
      )
    );
  };

  const handleDeleteQuestion = (questionId: number) => {
    setQuestions(currentQuestions => currentQuestions.filter(question => question.questionId !== questionId));
  };

  const handleCorrectAnswerToggle = (questionId: number, answerId: number, isCorrect: boolean) => {
    setQuestions(quizQuestions =>
      quizQuestions.map(q =>
        q.questionId === questionId ? {
          ...q,
          answers: q.answers.map(a =>
            a.answerId === answerId ? { ...a, isCorrect: isCorrect } : a
          )
        } : q
      )
    );
  };

  const handleCreateNewQuiz = async () => {
    const newQuiz: Quiz = {
      quizId: 0, // Replace with the appropriate value
      quizTitle: quizTitle,
      questions: questions.map(q => ({
        questionId: 0, // Replace with the appropriate value
        questionText: q.questionText,
        answers: q.answers.map(a => ({
          answerId: 0, // Replace with the appropriate value
          answerText: a.answerText,
          isCorrect: a.isCorrect,
        }))
      }))
    };

    mutation.mutate(newQuiz);
  };

  return (
    <>
      <Navbar />
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Create new quiz</h1>
        <div>
          <label className="block text-sm font-medium text-gray-700 flex justify-between items-center">Quiz title:</label>
          <input
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Enter quiz title"
            className="mb-4 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <ul className="ml-5">
          {questions.map((question) => (
            <li key={question.questionId} className="mb-6 border-b pb-4">
              <div className="mb-2 ">
                <label className="block text-sm font-medium text-gray-700 flex justify-between items-center">
                  Question {question.questionId}:
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(question.questionId)}
                    className="text-red-600 hover:underline"
                  >
                    Delete Question
                  </button>
                </label>
                <input
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  type="text"
                  placeholder="Enter question"
                  value={question.questionText}
                  onChange={(q) => handleQuestionTextChange(q.target.value, question.questionId)}
                />
              </div>
              <div className="ml-5">
                <label className="block text-sm font-medium text-gray-700 flex justify-between items-center">Answers:</label>
                {question.answers.map((answer) => (
                  <div key={answer.answerId}>
                    <label className="block text-sm font-medium text-gray-700 flex justify-between items-center">
                      <input
                        type="text"
                        value={answer.answerText}
                        onChange={(a) => handleAnswerTextChange(a.target.value, question.questionId, answer.answerId)}
                        placeholder="Enter answer"
                        className="mr-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <Switch
                        checked={answer.isCorrect}
                        onChange={(checked: boolean) => handleCorrectAnswerToggle(question.questionId, answer.answerId, checked)}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 mb-20 flex justify-center">
          <button
            type="button"
            onClick={handleAddQuestion}
            className="mr-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add New Question
          </button>
        </div>
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setQuizTitle('')}
            className="mr-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreateNewQuiz}
            className="mr-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Create new quiz
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateGame;
