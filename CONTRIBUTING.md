# Contributing to typed-local-storage

Thank you for your interest in contributing to typed-local-storage! This document provides guidelines and instructions for contributing to this project.

## Prerequisites

- Node.js v22.5.1 (recommended, see `.nvmrc`)
- [pnpm](https://pnpm.io/installation) as the package manager
- [Biome](https://biomejs.dev/) for linting and formatting

## Development Setup

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/your-username/typed-local-storage.git
   cd typed-local-storage
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Available Scripts**

   ```bash
   pnpm run dev        # Start development mode with watch
   pnpm run build      # Build the package
   pnpm run check      # Run Biome linting
   pnpm run test       # Run tests with Vitest
   pnpm run test:coverage # Run tests with coverage report
   ```

## Development Workflow

1. **Create a new branch for your feature or bugfix**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bugfix-name
   ```

2. **Make your changes**

   - Write code that follows the project's style and conventions
   - Add or update tests as necessary
   - Update documentation if needed

3. **Run tests and linting**

   ```bash
   pnpm run test
   pnpm run check
   ```

4. **Create a changeset for your changes**

   We use [changesets](https://github.com/changesets/changesets) to manage versioning and changelogs.

   ```bash
   pnpm changeset
   ```

   Follow the prompts to describe your changes and select the appropriate version bump (patch, minor, or major).

5. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   We follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

6. **Push your changes and create a pull request**

   ```bash
   git push origin feature/your-feature-name
   ```

   Then go to GitHub and create a pull request against the `main` branch.

## Code Style and Guidelines

- **TypeScript**: Use TypeScript for all code
- **Testing**: Write tests for all new features and bug fixes
- **Documentation**: Update documentation for any API changes
- **Code Style**: Follow the project's code style (enforced by Biome)

### TypeScript Guidelines

- Use types instead of interfaces for consistency
- Don't add types to variables that are automatically inferred
- Never use `any` type
- Prefer arrow functions for consistency
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, isError)

### Testing Guidelines

- Write unit tests for all new functionality
- Test both synchronous and asynchronous adapters
- Test error handling scenarios
- Aim for high test coverage

## Pull Request Process

1. Ensure your code passes all tests and linting
2. Update documentation if necessary
3. Include a changeset describing your changes
4. Make sure your PR description clearly describes the changes and the motivation
5. Wait for a maintainer to review your PR
6. Address any feedback from the review

## Release Process

Releases are handled automatically through GitHub Actions when changes are merged to the main branch.

1. Changesets are used to determine version bumps
2. A release PR is created automatically
3. When the release PR is merged, a new version is published to npm

## Questions?

If you have any questions or need help, please open an issue on GitHub.

Thank you for contributing to typed-local-storage! 