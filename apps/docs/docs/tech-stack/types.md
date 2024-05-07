---
sidebar_position: 2
---

# Types

All types will be defined in a central location (`/packages/shared-types/`) using [Zod](https://zod.dev/).

```ts title="/packages/shared-types/src/user.ts"
// Example type definition
import z from "zod";

// This is just a sample, not the type definition used in this project
export const UserDto = z.object({
  email: z
    .string({ required_error: "Object missing email" })
    .email("Invalid email"),
  username: z.string({ required_error: "Object missing username" }),
  password: z
    .string({ required_error: "Object missing password" })
    .min(8, "Invalid password"),
});

export type User = z.output<typeof UserDto>;
```
