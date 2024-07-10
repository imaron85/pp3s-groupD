# CreateQuiz

The "create" page is where the new quizzes are created. The creator can input title, description, questions and answers. Main compoenent of this page is a form where alle the quiz detais are added, and then sended to the backend for storing the quiz in the database.

## Imports
* React related hooks
* React UI components
* Reatc Query

```tsx title="/admin/game/create/page.tsx"

import { useState } from "react";
import Switch from "react-switch";
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { UseMutationOptions } from '@tanstack/react-query';
import Link from "next/link";

```

## Interfaces/Types
* Choice (answers)
* Question
* Quiz
* QuizCreationResponse

```tsx title="/admin/game/create/page.tsx"

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

```

## Functions
* Function for creating a quiz
* In this function the POST request is sent to the backend to create a new quiz


```tsx title="/admin/game/create/page.tsx"

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

```


