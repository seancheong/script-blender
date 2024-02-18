# Script Blender

## Introduction

**Script Blender** is a web-based platform that enhances the coding experience for JavaScript developers. It enables users to create and edit code snippets, providing instant feedback with real-time execution results. This tool is perfect for both novice and experienced developers, offering a streamlined environment conducive to learning, experimentation, and project management.

View the coding platform web app live at [https://www.script-blender.com](https://www.script-blender.com)

## Key Features

### Monaco Editor: The Power of VS Code

**Script Blender** integrates the `Monaco Editor`, renowned for its use in `Visual Studio Code`. This means users familiar with VS Code will find the **Script Blender** environment intuitive and easy to navigate. Enjoy the same rich coding experience, including:

- Syntax highlighting
- Advanced editing features
- A wide array of shortcut keys identical to those in VS Code

This feature significantly reduces the learning curve for new users and enhances productivity for those already familiar to the `VS Code editor`.

### Simplified Import Statements

**Script Blender** uniquely simplifies the process of using import statements. Developers can directly import popular libraries like `lodash` using a straightforward import statement:

```javascript
import _ from 'lodash';

console.log('is [1, 2, 3] an array:', _.isArray([1, 2, 3]));
console.log('is "1, 2, 3" an array:', _.isArray('1, 2, 3'));
```

No additional installation is required. **Script Blender** automatically handles these imports, making it incredibly easy for developers to test out various libraries' functionalities without installing them locally. This feature is particularly beneficial for rapid prototyping and exploring new libraries.

## Prerequisites

Before running **Script Blender**, ensure you have a `Redis` server available. **Script Blender** uses `Redis` for caching npm packages to enhance performance. You can set up `Redis` locally or use a cloud-based `Redis` service.

## Environment Setup

To run **Script Blender** successfully, you need to configure your environment variables:

1. Create a `.env.local` file in the root directory of the project.
2. Add the following environment variables:

```bash
REDIS_HOST=your-redis-url
REDIS_PORT=your-redis-port
REDIS_PASS=your-redis-password
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.
