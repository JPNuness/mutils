# Monorepo for TypeScript Utilities and Vue Helpers

This monorepo contains reusable TypeScript utilities and Vue.js helpers, structured using pnpm workspaces. It includes:

- **core-utils**: General TypeScript utility functions.
- **vue-utils**: Vue-specific helpers and composables.

## 🚀 Features

- **pnpm Workspaces** for managing multiple packages efficiently.
- **Vite** for a fast development and build experience.
- **Vitest** for unit testing utilities and Vue components.
- **ESLint & Prettier:** Code consistency and linting for better maintainability.
- **TypeScript** for type safety and maintainability.
- **Modular Exports**: Utilities are structured into separate modules and exported individually for optimized imports. Example:
  ```ts
  import { isObject } from '@monorepo/core-utils/object'
  ```
- **Tree-shakable Packages**: Ensuring only the necessary functions are included in the final bundle to optimize performance.

## 🛠 Setup

1. Install dependencies:
   ```sh
   pnpm install
   ```
2. Run tests:
   ```sh
   pnpm test
   ```

## 📜 License

MIT
