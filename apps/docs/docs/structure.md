---
sidebar_position: 2
---

# Folder Structure

```bash
pp3s-groupD # Repository / root folder
├───apps # Monorepo Folder containing all applications
│   ├───docs # Documentation
│   │   ├───docs # Docs written in MD/MDX
│   │   ├───src # React code for Docs
│   │   └───static # Static content for Docs
│   ├───server # ExpressJS backend
│   └───web # NextJS frontend app
│       ├───app # App router
│       └───public # Static content
└───packages # Code to share across apps
    ├───eslint-config # Shared eslint config
    ├───typescript-config # Shared TS config
    ├───ui # UI library to share React components across apps
    └───shared-types # TS types to share across all code
```
