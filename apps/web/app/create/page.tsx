"use client";

import { useState } from "react";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { UseMutationOptions } from "@tanstack/react-query";
import { backendUrl } from "../../src/util";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Head from "next/head";

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
  const response = await fetch(backendUrl + "/quiz/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newQuiz),
  });

  console.log("Received response:", response);
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to create quiz:", errorText);
    throw new Error("Failed to create quiz");
  }
  return await response.json();
};

export default function CreateQuiz() {
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [quizDescription, setQuizDescription] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [created, setCreated] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const mutationOptions: UseMutationOptions<
    QuizCreationResponse,
    Error,
    Quiz,
    unknown
  > = {
    onSuccess: (data: QuizCreationResponse) => {
      queryClient.invalidateQueries({
        queryKey: ["quizzes"],
      });
      setCreated(true);
      setQuizTitle("");
      setQuizDescription("");
      setQuestions([]);
      toast("Quiz created successfully!", { type: "success" });
    },
    onError: (error: Error) => {
      console.error("Error creating quiz:", error.message);
      toast("Failed to create quiz. Please try again.", { type: "error" });
    },
  };

  const mutation = useMutation<QuizCreationResponse, Error, Quiz, unknown>(
    { mutationFn: createQuiz, ...mutationOptions },
    new QueryClient()
  );

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      questionText: "",
      choices: Array.from({ length: 4 }, () => ({
        text: "",
        isCorrect: false,
      })),
    };
    setQuestions((currentQuestions) => [...currentQuestions, newQuestion]);
  };

  const handleQuestionTextChange = (
    newQuestionText: string,
    questionIndex: number
  ) => {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question, index) =>
        index === questionIndex
          ? { ...question, questionText: newQuestionText }
          : question
      )
    );
  };

  const handleChoiceTextChange = (
    newChoiceText: string,
    questionIndex: number,
    choiceIndex: number
  ) => {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question, qIndex) =>
        qIndex === questionIndex
          ? {
              ...question,
              choices: question.choices.map((choice, cIndex) =>
                cIndex === choiceIndex
                  ? { ...choice, text: newChoiceText }
                  : choice
              ),
            }
          : question
      )
    );
  };

  const handleDeleteQuestion = (questionIndex: number) => {
    setQuestions((currentQuestions) =>
      currentQuestions.filter((_, index) => index !== questionIndex)
    );
  };

  const handleCorrectChoiceToggle = (
    questionIndex: number,
    choiceIndex: number,
    isCorrect: boolean
  ) => {
    setQuestions((quizQuestions) =>
      quizQuestions.map((q, qIndex) =>
        qIndex === questionIndex
          ? {
              ...q,
              choices: q.choices.map((c, cIndex) =>
                cIndex === choiceIndex ? { ...c, isCorrect: isCorrect } : c
              ),
            }
          : q
      )
    );
  };

  const handleCreateNewQuiz = async () => {
    if (
      !quizTitle ||
      !quizDescription ||
      questions.some((q) => !q.questionText || q.choices.some((c) => !c.text))
    ) {
      toast("All fields must be filled.", { type: "error" });
      return;
    }
    if (questions.some((q) => !q.choices.some((c) => c.isCorrect))) {
      toast("Each question must have at least one correct answer.", {
        type: "error",
      });
      return;
    }

    const newQuiz: Quiz = {
      title: quizTitle,
      description: quizDescription,
      questions: questions.map((q) => ({
        questionText: q.questionText,
        choices: q.choices.map((c) => ({
          text: c.text,
          isCorrect: c.isCorrect,
        })),
      })),
      author: "Test Author", // Assuming a default or user-provided author
    };
    console.log("Creating new quiz with data:", newQuiz);
    mutation.mutate(newQuiz);
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <Head>
        <title>Create Quiz - Quiz Night</title>
      </Head>
      {created ? (
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">Quiz created!</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/start"
              className="bg-black text-white shadow transition-colors hover:bg-black/80 font-bold py-2 px-4 rounded-xl mt-4"
            >
              Play a Quiz
            </Link>
            <Link
              href="/"
              className="bg-black text-white shadow transition-colors hover:bg-black/80 font-bold py-2 px-4 rounded-xl mt-4"
            >
              Back to Home
            </Link>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl mx-auto p-6 sm:p-8 md:p-10 bg-white rounded-lg shadow-md">
          <div className="mb-6">
            <h2 className="text-3xl font-bold">Create a New Quiz</h2>
            <p className="text-gray-500">
              Fill out the details below to build your interactive quiz.
            </p>
          </div>
          <form className="grid gap-6">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-gray-700 font-medium">
                Quiz Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter a title for your quiz"
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="description"
                className="text-gray-700 font-medium"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                placeholder="Provide a brief description of your quiz"
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Questions</h3>
                <button
                  type="button"
                  className="bg-primary text-primary-foreground text-center hover:bg-primary/90 font-medium py-2 px-4 rounded-md"
                  onClick={handleAddQuestion}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 inline-block"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Question
                </button>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-4">
                  {questions.map((question, questionIndex) => (
                    <div key={"question" + questionIndex}>
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor={"question-" + questionIndex}
                            className="text-gray-700 font-medium"
                          >
                            Question {questionIndex + 1}
                          </label>
                          <button
                            type="button"
                            onClick={() => handleDeleteQuestion(questionIndex)}
                            className="text-red-600 hover:underline"
                          >
                            Delete Question
                          </button>
                        </div>
                        <textarea
                          id={"question-" + questionIndex}
                          rows={2}
                          placeholder="Enter the question text"
                          className="mb-4 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={question.questionText}
                          onChange={(q) =>
                            handleQuestionTextChange(
                              q.target.value,
                              questionIndex
                            )
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {question.choices.map((choice, choiceIndex) => (
                          <div
                            key={"choice" + questionIndex + choiceIndex}
                            className="grid gap-2"
                          >
                            <label
                              htmlFor={
                                "answer-" + questionIndex + "-" + choiceIndex
                              }
                              className="text-gray-700 font-medium"
                            >
                              Answer {choiceIndex + 1}
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={
                                  "answer-" +
                                  questionIndex +
                                  "-" +
                                  choiceIndex +
                                  "-correct"
                                }
                                className="form-checkbox text-blue-500 rounded"
                                checked={choice.isCorrect}
                                onChange={(e) =>
                                  handleCorrectChoiceToggle(
                                    questionIndex,
                                    choiceIndex,
                                    e.target.checked
                                  )
                                }
                              />
                              <input
                                id={
                                  "answer-" + questionIndex + "-" + choiceIndex
                                }
                                type="text"
                                placeholder="Enter answer text"
                                className="border border-gray-300 rounded-md px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={choice.text}
                                onChange={(a) =>
                                  handleChoiceTextChange(
                                    a.target.value,
                                    questionIndex,
                                    choiceIndex
                                  )
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              onClick={handleCreateNewQuiz}
              className="bg-primary text-primary-foreground text-center hover:bg-primary/90 font-medium py-2 px-4 rounded-md"
            >
              Create Quiz
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
