# Project Setup

## Installation

- **Step 1:** Run `bun install` in the root folder of the repository.
- **Step 2:** That's it.

## Running

### Docs

```bash
cd apps/docs
bun start
```

This will start the Documentation. You can edit it and see your changes live.

### Project

```bash
# Run this in the root folder
sudo docker compose up
bun run build
bun run dev
```

This will start the front- and backend in development mode.
