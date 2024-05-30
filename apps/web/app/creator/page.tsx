'use client'

import { useState } from "react";
import styles from "./page.module.css";
import Switch from "react-switch";

interface Answer {
  answerText: string;
  isCorrect: boolean;
}

interface Question {
  id: number;
  questionText: string;
  answers: Answer[];
}

export default function Page(): JSX.Element {
  
  const [questions, setQuestions] = useState<Question[]>([]);
  
  const handleNewQuestion = () => {
    const newQuestion: Question = {
      id: questions.length + 1,
      questionText: '',
      answers: [
        {answerText: '', isCorrect: false},
        {answerText: '', isCorrect: false},
        {answerText: '', isCorrect: false},
        {answerText: '', isCorrect: false}
      ]
    };
    setQuestions(currentQuestions => [...currentQuestions, newQuestion]);
  }

  const handleQuestionTitleChange = (questionText: string, questionId:number) => {
    setQuestions(quizQuestions =>
      quizQuestions.map((quizQuestion) =>
      quizQuestion.id === questionId ? {...quizQuestion, questionText: questionText}: quizQuestion
  )
    );
  };

  const handleQuestionAnswerChange = (answerText: string, questionId: number, answerId: number) => {
    setQuestions(quizQuestions => 
      quizQuestions.map((q) =>
        q.id === questionId ? {
          ...q,
          answers: q.answers.map((a, aId) =>
            aId === answerId ? {...a, answerText} :a
        )
        } : q
      )
    );
  };

  const handleCorrectAnswerToggle = (questionId: number, answerId: number, isCorrect: boolean) => {
    setQuestions(quizQuestions =>
      quizQuestions.map((q) =>
        q.id === questionId ? {
          ...q,
          answers: q.answers.map((a, aId) =>
            aId === answerId ? {...a, isCorrect: isCorrect } :a
        )
        } : q)
    )
  }; 

  return (
    <main>
      <div className={styles.flexCenter}>
      <h1>Create new Kahoot</h1>
      </div>
      <div className={styles.flexCenter}>
      {questions.map((question) => (
        <div className={styles.flexCenter} key={question.id}>
          <p>Question {question.id}</p>
          <input 
          className={styles.flexCenter}
          type="text" 
          placeholder="Enter question" 
          value={question.questionText} 
          onChange={(q) => {
            handleQuestionTitleChange(q.target.value, question.id)}}
          />
          {question.answers.map((answer, answerId) => (
            <div className={styles.answerRow} key={answerId}>
            <input 
              type="text"
              placeholder={'Enter answer'}
              value={answer.answerText}
              onChange={(e) => handleQuestionAnswerChange(e.target.value, question.id, answerId)}
            />
             <Switch checked={answer.isCorrect} onChange={(checked: boolean) => handleCorrectAnswerToggle(question.id, answerId, checked)}/>
            </div>
          ))}
        </div>

      ))}
      </div>
      <div className={styles.flexCenter}>
      <button onClick={handleNewQuestion}>Add question</button>
      <button onClick={handleNewQuestion}>Create Quiz</button>
      </div>
    </main>
  );
}
