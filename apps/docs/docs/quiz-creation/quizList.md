# QuizList

The "QuizList" page is where the quizzes that allready have been created can be viewed. The user get a list of all the quizzes available, and can click on any of the quizzes to enter the quiz. The Quizzes are fetched using a GET call from the DB

## Imports
* React related hooks
* React UI components
* Reatc Query

```tsx title="/admin/game/list/page.tsx"

import React, { useEffect, useState } from "react";
import { Navbar } from "@repo/ui/navbar";
import Link from "next/link";
```
## Functions
* For updating the list with the quizzes a useEffect is used for calling endingpoint in backend that GET's from the DB
  
```tsx title="/admin/game/list/page.tsx" useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch('http://localhost:3001/quiz/quizzes');
        if (!response.ok) {
          throw new Error('Failed to fetch quizzes');
        }
        const data = await response.json();
        setQuizzes(data.quizzes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);
```
