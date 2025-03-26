<think>
Based on the codebase you've shared, I need to create a README for your CLI project generator called `@rahilsyedd/boilerplate`.

From the files provided, I can see:

1. This is a TypeScript CLI tool for generating project boilerplates
2. It supports two usage patterns:
   - Interactive mode (when run without arguments)
   - Command-based mode (e.g., `boilerplate setup node`)
3. It has templates for at least "node" and "react" projects
4. The tool is published on npm as `@rahilsyedd/boilerplate`
5. It creates projects with Git initialization and automatic dependency installation

For the README, I'll include:
- Project description and purpose
- Installation instructions
- Usage examples (both interactive and command-based)
- Available templates
- How to create custom templates
- Development instructions (building from source)
- License information

I'll format this using markdown to create a professional-looking README file.
</think>

# @rahilsyedd/boilerplate

A versatile CLI tool for quickly generating project boilerplates with different templates.

## Overview

Boilerplate is a command-line utility that helps you quickly scaffold new projects using predefined templates. It eliminates the repetitive setup process when starting new projects by providing ready-to-use project structures.

## Installation

Install the package globally:

```bash
npm install -g @rahilsyedd/boilerplate
```

## Usage

Boilerplate supports two modes of operation:

### 1. Command-based mode

Directly specify which template you want to use:

```bash
boilerplate setup node    # Creates a Node.js/Express project
boilerplate setup react   # Creates a React project
```

This will:
- Create a new project directory (default: `node-express-app` for node, `react-app` for react)
- Copy all template files
- Initialize a git repository
- Install dependencies automatically

### 2. Interactive mode

Simply run the command without arguments to enter interactive mode:

```bash
boilerplate
```

You'll be prompted to:
- Select a project template from the available options
- Enter a name for your project

## Available Templates

- **node**: A Node.js/Express application template
- **react**: A React application template
- [Any other templates in your src/templates directory]

## Project Structure

```
your-project/
├── package.json       # Project dependencies and scripts
├── src/               # Source directory
│   ├── index.ts       # CLI entry point
│   └── templates/     # Project templates
│       ├── node/      # Node.js template
│       └── react/     # React template
├── build/             # Compiled JavaScript files
└── tsconfig.json      # TypeScript configuration
```

## Creating Custom Templates

To add your own templates:

1. Create a new directory under `src/templates/` with your template name
2. Add all the files needed for your template
3. Rebuild the project with `npm run build`

Your template will now be available for use.

## Development

Clone the repository:

```bash
git clone <repository-url>
cd boilerplate
```

Install dependencies:

```bash
npm install
```

Build the project:

```bash
npm run build
```

For development, you can use:

```bash
npm run dev
```

## Testing Your Changes Locally

Link the package locally:

```bash
npm link
```

Now you can test your changes by running:

```bash
boilerplate
```

## License

ISC

## Author

[@rahilsyedd](https://github.com/rahilsyedd)
