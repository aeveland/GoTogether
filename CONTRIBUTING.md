# Contributing to Go Together

Thank you for your interest in contributing to Go Together! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/goTogether.git
   cd goTogether
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```
5. **Start development servers**:
   ```bash
   npm run dev
   ```

## Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the coding standards below

3. **Test your changes**:
   ```bash
   npm test
   npm run build  # Ensure build works
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

## Coding Standards

### JavaScript
- Use ES6+ features
- Follow consistent naming conventions (camelCase for variables/functions)
- Add JSDoc comments for functions and classes
- Keep functions focused and small
- Use async/await for asynchronous operations

### CSS
- Use CSS custom properties for theming
- Follow BEM methodology for class naming
- Maintain responsive design principles
- Use Material Design guidelines

### Database
- Use parameterized queries to prevent SQL injection
- Add proper indexes for performance
- Include migration scripts for schema changes

## Commit Message Format

Use conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

Example: `feat: add shopping list item assignment feature`

## Pull Request Guidelines

- **Title**: Use a clear, descriptive title
- **Description**: Explain what changes you made and why
- **Screenshots**: Include screenshots for UI changes
- **Testing**: Describe how you tested your changes
- **Breaking Changes**: Note any breaking changes

## Code Review Process

1. All PRs require at least one review
2. Address feedback promptly
3. Keep PRs focused and reasonably sized
4. Update documentation as needed

## Reporting Issues

When reporting bugs, please include:
- Steps to reproduce the issue
- Expected vs actual behavior
- Browser/environment information
- Screenshots if applicable
- Console errors if any

## Feature Requests

For new features:
- Check existing issues first
- Provide clear use cases
- Consider implementation complexity
- Discuss with maintainers before large changes

## Project Structure

```
goTogether/
├── client/          # Frontend application
├── server/          # Backend API
├── database/        # Database schema and migrations
├── tests/           # Test files
└── docs/           # Documentation
```

## Development Tips

- Use the browser developer tools for debugging
- Check console logs for errors
- Test on multiple browsers/devices
- Follow accessibility best practices
- Write tests for new features

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for questions about the codebase
- Check existing issues and documentation first

Thank you for contributing to Go Together! 🏕️
