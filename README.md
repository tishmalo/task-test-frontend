# Task Manager Frontend (Vue.js)

A modern task management application built with Vue.js 3, featuring real-time updates, responsive design, and comprehensive task management capabilities.

##  Features

- **Modern Vue.js 3** with Composition API
- **Authentication System** (Login, Register, Password Reset)
- **Task Management** (CRUD operations with real-time updates)
- **Responsive Design** with Tailwind CSS
- **State Management** with Pinia
- **API Integration** with Laravel backend
- **Real-time Notifications** and event handling
- **Search & Filtering** capabilities
- **Data Persistence** across page refreshes
- **Mobile-friendly** interface

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0 or higher)
- **npm** (v7.0 or higher) or **yarn**
- **Git** for version control
- **Laravel Backend** running on `http://localhost:8000`

##  Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd task-management-frontend
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Application
VITE_APP_NAME="Task Manager"
VITE_APP_URL="http://localhost:5173"

# API Configuration
VITE_API_BASE_URL="http://localhost:8000/api"


```

### 4. Install Required Dependencies

The project uses several key dependencies. Install them if not already included:

```bash
# Core dependencies
npm install vue@^3.3.0 vue-router@^4.2.0 pinia@^2.1.0

# UI and Icons
npm install @heroicons/vue@^2.0.0 @headlessui/vue@^1.7.0

# HTTP Client
npm install axios@^1.4.0

# Utilities
npm install @vueuse/core@^10.0.0

# Development dependencies
npm install -D @vitejs/plugin-vue@^4.2.0 vite@^4.3.0
npm install -D tailwindcss@^3.3.0 postcss@^8.4.0 autoprefixer@^10.4.0
```

### 5. Tailwind CSS Setup

Initialize Tailwind CSS:

```bash
npx tailwindcss init -p
```

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}
```

Create `src/main.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;


```

### 6. Project Structure Setup

Create the following directory structure:

```
src/
├── components/          # Reusable components
│   ├── AppNavigation.vue
│   ├── TaskModal.vue
│   └── NotificationContainer.vue
├── composables/         # Vue composables
│   └── useEventBus.js
├── services/           # API services
│   ├── api.js
│   ├── authService.js
│   └── taskService.js
├── stores/             # Pinia stores
│   ├── authStore.js
│   └── taskStore.js
├── views/              # Page components
│   ├── auth/
│   │   ├── LoginView.vue
│   │   ├── RegisterView.vue
│   │   ├── ForgotPasswordView.vue
│   │   └── ResetPasswordView.vue
│   ├── DashboardView.vue
│   ├── TasksView.vue
│   └── TaskDetailView.vue
├── router/             # Vue Router configuration
│   └── index.js
├── App.vue             # Root component
├── main.js             # Application entry point
└── main.css           # Global styles
```

### 7. Vite Configuration

Update `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    cors: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
})
```

## Running the Application

### Development Server

```bash
# Start development server
npm run dev

# Or with yarn
yarn dev
```

The application will be available at `http://localhost:5173`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Linting & Code Quality

```bash
# Run ESLint (if configured)
npm run lint

# Format code with Prettier (if configured)
npm run format
```

##  Configuration

### API Integration

The frontend communicates with a Laravel backend. Ensure your Laravel API is running and accessible.

**Key API Endpoints:**
- `POST /api/register` - User registration
- `POST /api/login` - User authentication
- `POST /api/logout` - User logout
- `GET /api/tasks` - Fetch tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### Authentication

The app uses Laravel Sanctum for API authentication:
- Tokens are stored in localStorage
- Automatic token inclusion in API requests
- Token validation on page refresh
- Graceful handling of expired tokens

### State Management

**Pinia Stores:**
- `authStore` - Manages user authentication state
- `taskStore` - Manages task data and operations

**Key Features:**
- Data persistence across page refreshes
- Optimistic updates for better UX
- Error handling and recovery
- Real-time event notifications

##  Styling

The application uses **Tailwind CSS** for styling:

- **Responsive design** for all screen sizes
- **Dark mode** support (optional)
- **Custom components** with consistent styling
- **Modern UI patterns** and animations

## Features Overview

### Authentication
- **Login/Register** with form validation
- **Password reset** functionality
- **Remember me** option
- **Auto-logout** on token expiration

### Task Management
- **Create, read, update, delete** tasks
- **Search and filter** functionality
- **Sorting** by various criteria
- **Pagination** for large datasets
- **Real-time updates** when tasks change

### User Interface
- **Responsive navigation** with mobile menu
- **Task status indicators** (overdue, due today, etc.)
- **Interactive modals** for task editing
- **Toast notifications** for user feedback
- **Loading states** and error handling

## Troubleshooting

### Common Issues



**1. API Connection Issues**
```bash
# Verify API base URL in .env file
# Ensure Laravel backend is running on correct port
```

**2. Build Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**3. Tailwind Styles Not Loading**
```bash
# Ensure Tailwind is properly configured
# Check postcss.config.js and tailwind.config.js
```

### Debug Mode

Enable debug logging by adding to your `.env`:
```env
VITE_DEBUG=true
```

## Development Guidelines

### Code Style
- Use **Composition API** for all components
- Follow **Vue.js style guide** conventions
- Use **TypeScript** for type safety (optional)
- Write **clear, descriptive component names**

### Component Structure
```vue
<template>
  <!-- Template content -->
</template>

<script setup>
// Composition API logic
</script>

<style scoped>
/* Component-specific styles */
</style>
```

### State Management
- Use **Pinia stores** for global state
- Keep **local state** in components when appropriate
- Use **composables** for reusable logic
- Implement **proper error handling**

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Static Hosting

The built files in `dist/` can be deployed to:
- **Netlify**
- **Vercel**
- **GitHub Pages**
- **AWS S3 + CloudFront**
- **Any static file server**

### Environment Variables for Production

Update your production environment variables:
```env
VITE_API_BASE_URL="https://your-api-domain.com/api"
VITE_APP_URL="https://your-frontend-domain.com"
```

## Additional Resources

- [Vue.js Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions and support:
- Create an issue in the repository
- Contact the development team -+254740274151
- Check the documentation

---

**Cheers From Jonathan** 