# QuizList

The "QuizList" page is where the quizzes that allready have been created can be viewed. The user get a list of all the quizzes available, and can click on any of the quizzes to enter the quiz. The Quizzes are fetched using a GET call from the DB

## Functions
* React related hooks
* React UI components
* Reatc Query

```tsx title="/admin/game/create/page.tsx"

import React, { useEffect, useState } from "react";
import { Navbar } from "@repo/ui/navbar";
import Link from "next/link";
```
