'use client';

import { Navbar } from "@repo/ui/navbar";
import { useState } from "react";
import Switch from "react-switch";
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { UseMutationOptions } from '@tanstack/react-query';
import Link from "next/link";

interface Choice {
  text: string;
  isCorrect: boolean;
}

interface Question {
  questionText: string;
  choices: Choice[];
}

interface Quiz {
  title: string;
  description: string;
  questions: Question[];
  author: string;
}

interface QuizCreationResponse {
  quiz: Quiz;
}

const createQuiz = async (newQuiz: Quiz): Promise<QuizCreationResponse> => {
  console.log("Sending quiz data:", newQuiz);
  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/quiz/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newQuiz),
  });

  console.log("Received response:", response);
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to create quiz:", errorText);
    throw new Error('Failed to create quiz');
  }
  return await response.json();
};

const CreateGame = () => {
  const [quizTitle, setQuizTitle] = useState<string>('');
  const [quizDescription, setQuizDescription] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isQuizCreated, setIsQuizCreated] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const mutationOptions: UseMutationOptions<QuizCreationResponse, Error, Quiz, unknown> = {
    onSuccess: (data: QuizCreationResponse) => {
      queryClient.invalidateQueries({
        queryKey: ['quizzes'],
      });
      setQuizzes(currentQuizzes => [...currentQuizzes, data.quiz]);
      setQuizTitle('');
      setQuizDescription('');
      setQuestions([]);
      alert('Quiz created successfully!');
      setIsQuizCreated(true);
    },
    onError: (error: Error) => {
      console.error("Error creating quiz:", error.message);
      alert('Failed to create quiz. Please try again.');
    }
  };

  const mutation = useMutation<QuizCreationResponse, Error, Quiz, unknown>({ mutationFn: createQuiz, ...mutationOptions }, new QueryClient());

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      questionText: '',
      choices: Array.from({ length: 4 }, () => ({
        text: '',
        isCorrect: false
      }))
    };
    setQuestions(currentQuestions => [...currentQuestions, newQuestion]);
  };

  const handleQuestionTextChange = (newQuestionText: string, questionIndex: number) => {
    setQuestions(currentQuestions =>
      currentQuestions.map((question, index) =>
        index === questionIndex ? { ...question, questionText: newQuestionText } : question
      )
    );
  };

  const handleChoiceTextChange = (newChoiceText: string, questionIndex: number, choiceIndex: number) => {
    setQuestions(currentQuestions =>
      currentQuestions.map((question, qIndex) =>
        qIndex === questionIndex ? {
          ...question,
          choices: question.choices.map((choice, cIndex) =>
            cIndex === choiceIndex ? { ...choice, text: newChoiceText } : choice
          )
        } : question
      )
    );
  };

  const handleDeleteQuestion = (questionIndex: number) => {
    setQuestions(currentQuestions => currentQuestions.filter((_, index) => index !== questionIndex));
  };

  const handleCorrectChoiceToggle = (questionIndex: number, choiceIndex: number, isCorrect: boolean) => {
    setQuestions(quizQuestions =>
      quizQuestions.map((q, qIndex) =>
        qIndex === questionIndex ? {
          ...q,
          choices: q.choices.map((c, cIndex) =>
            cIndex === choiceIndex ? { ...c, isCorrect: isCorrect } : c
          )
        } : q
      )
    );
  };

  const handleCreateNewQuiz = async () => {

    if (!quizTitle || !quizDescription || questions.some(q => !q.questionText || q.choices.some(c => !c.text))) {
      alert('All fields must be filled.');
      return;
    }
    if (questions.some(q => !q.choices.some(c => c.isCorrect))) {
      alert('Each question must have at least one correct answer.');
      return;
    }

    const newQuiz: Quiz = {
      title: quizTitle,
      description: quizDescription,
      questions: questions.map(q => ({
        questionText: q.questionText,
        choices: q.choices.map(c => ({
          text: c.text,
          isCorrect: c.isCorrect,
        }))
      })),
      author: "Test Author" // Assuming a default or user-provided author
    };
    console.log("Creating new quiz with data:", newQuiz);
    mutation.mutate(newQuiz);
  };

  const resetForm = () => {
    setQuizTitle('');
    setQuizDescription('');
    setQuestions([]);
    setIsQuizCreated(false); 
  };

  if (isQuizCreated) {
    return (
      <>
        <div className="p-4 max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">{quizTitle} Successfully Created</h1>
          <div className="space-x-4">
        <button onClick={resetForm} className="px-4 py-2 text-white rounded bg-black hover:bg-gray-800">Create New Quiz</button>
        <Link href="/start" className="inline-block px-4 py-2 text-white rounded bg-black hover:bg-gray-800">Start Quiz</Link>
      <Link href="/" className="inline-block px-4 py-2 text-white rounded bg-black hover:bg-gray-800">Home</Link>


      </div>
        </div>
      </>
    );
  }

  return (
    <>
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
        <div>
          <label className="block text-sm font-medium text-gray-700 flex justify-between items-center">Quiz title:</label>
          <textarea
            value={quizDescription}
            onChange={(e) => setQuizDescription(e.target.value)}
            placeholder="Enter quiz description"
            className="mb-4 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <ul className="ml-5">
          {questions.map((question, questionIndex) => (
            <li key={questionIndex} className="mb-6 border-b pb-4">
              <div className="mb-2 ">
                <label className="block text-sm font-medium text-gray-700 flex justify-between items-center">
                  Question {questionIndex + 1}:
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(questionIndex)}
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
                  onChange={(q) => handleQuestionTextChange(q.target.value, questionIndex)}
                />
              </div>
              <div className="ml-5">
                <label className="block text-sm font-medium text-gray-700 flex justify-between items-center">Choices:</label>
                {question.choices.map((choice, choiceIndex) => (
                  <div key={choiceIndex}>
                    <label className="block text-sm font-medium text-gray-700 flex justify-between items-center">
                      <input
                        type="text"
                        value={choice.text}
                        onChange={(a) => handleChoiceTextChange(a.target.value, questionIndex, choiceIndex)}
                        placeholder="Enter choice"
                        className="mr-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <Switch
                        checked={choice.isCorrect}
                        onChange={(checked: boolean) => handleCorrectChoiceToggle(questionIndex, choiceIndex, checked)}
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
            className="mr-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
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
            className="mr-2 px-4 py-2 text-white rounded bg-black hover:bg-gray-800"
          >
            Create new quiz
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateGame;
