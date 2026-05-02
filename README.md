# Ethara AI - Frontend Client

This is the frontend application for Ethara AI (TaskFlow), built with React and Vite. It provides a modern, interactive interface for project management.

## 🚀 Key Features

- **Dynamic Dashboard**: Visual representation of project progress and task distribution.
- **Sprint Board**: Interactive sprint management and tracking.
- **Issue Details**: Deep-dive into issues with sub-task management.
- **Responsive UI**: Built with Tailwind CSS for a seamless experience across devices.
- **Form Validation**: Robust client-side validation using Zod and React Hook Form.

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build System**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui (Radix UI)
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router DOM v6
- **Charts**: Recharts

## 🚦 Setup

1. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

2. Configure environment variables in `.env`:
   ```env
   VITE_API_URL=your_backend_url
   ```

3. Run in development mode:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 📁 Structure

- `src/components`: UI components (including shadcn/ui elements)
- `src/pages`: Main application views (Dashboard, Login, ProjectDetail, etc.)
- `src/hooks`: Custom React hooks for API calls and state
- `src/lib`: Utility functions and configuration
