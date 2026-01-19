import { Template } from '../types/index.js';

export function getMernTemplate(): Template {
  return {
    name: 'MERN',
    description: 'MongoDB + Express + React + Node.js',
    structure: {
      frontend: {
        src: {
          components: {
            pages: null,
            shared: null,
          },
          context: null,
          hooks: null,
          lib: null,
          types: null,
          utils: null,
        },
        public: null,
      },
      backend: {
        src: {
          controllers: null,
          models: null,
          routes: null,
          middleware: null,
          utils: null,
          config: null,
        },
      },
    },
    files: [
      // Root files
      {
        path: 'README.md',
        content: generateReadme(),
      },
      {
        path: '.gitignore',
        content: generateGitignore(),
      },

      // Frontend files
      {
        path: 'frontend/package.json',
        content: generateFrontendPackageJson(),
      },
      {
        path: 'frontend/vite.config.ts',
        content: generateViteConfig(),
      },
      {
        path: 'frontend/tsconfig.json',
        content: generateTsConfig(),
      },
      {
        path: 'frontend/index.html',
        content: generateIndexHtml(),
      },
      {
        path: 'frontend/src/main.tsx',
        content: generateMainTsx(),
      },
      {
        path: 'frontend/src/App.tsx',
        content: generateAppTsx(),
      },
      {
        path: 'frontend/src/index.css',
        content: generateIndexCss(),
      },
      {
        path: 'frontend/.env.example',
        content: 'VITE_API_URL=http://localhost:5000/api\n',
      },

      // Backend files
      {
        path: 'backend/package.json',
        content: generateBackendPackageJson(),
      },
      {
        path: 'backend/tsconfig.json',
        content: generateBackendTsConfig(),
      },
      {
        path: 'backend/src/index.ts',
        content: generateServerIndex(),
      },
      {
        path: 'backend/src/config/database.ts',
        content: generateDatabaseConfig(),
      },
      {
        path: 'backend/src/routes/index.ts',
        content: generateRoutes(),
      },
      {
        path: 'backend/src/controllers/health.controller.ts',
        content: generateHealthController(),
      },
      {
        path: 'backend/src/middleware/errorHandler.ts',
        content: generateErrorHandler(),
      },
      {
        path: 'backend/.env.example',
        content: generateBackendEnv(),
      },
    ],
  };
}

function generateReadme(): string {
  return `# MERN Stack Project

MongoDB + Express + React + Node.js

## Setup

### Backend
\`\`\`bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB connection string
npm run dev
\`\`\`

### Frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## URLs
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
`;
}

function generateGitignore(): string {
  return `node_modules/
dist/
.env
.env.local
*.log
.DS_Store
coverage/
`;
}

function generateFrontendPackageJson(): string {
  return JSON.stringify(
    {
      name: 'frontend',
      private: true,
      version: '0.0.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'tsc && vite build',
        preview: 'vite preview',
      },
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        axios: '^1.6.5',
        'react-router-dom': '^6.21.1',
      },
      devDependencies: {
        '@types/react': '^18.2.43',
        '@types/react-dom': '^18.2.17',
        '@vitejs/plugin-react': '^4.2.1',
        typescript: '^5.2.2',
        vite: '^5.0.8',
      },
    },
    null,
    2
  );
}

function generateViteConfig(): string {
  return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
})
`;
}

function generateTsConfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2020',
        useDefineForClassFields: true,
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        skipLibCheck: true,
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx',
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
      },
      include: ['src'],
      references: [{ path: './tsconfig.node.json' }],
    },
    null,
    2
  );
}

function generateIndexHtml(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MERN App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

function generateMainTsx(): string {
  return `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;
}

function generateAppTsx(): string {
  return `import { useState, useEffect } from 'react'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error(err))
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>MERN Stack App</h1>
      <p>Server says: {message || 'Loading...'}</p>
    </div>
  )
}

export default App
`;
}

function generateIndexCss(): string {
  return `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
}
`;
}

function generateBackendPackageJson(): string {
  return JSON.stringify(
    {
      name: 'backend',
      version: '1.0.0',
      type: 'module',
      scripts: {
        dev: 'tsx watch src/index.ts',
        build: 'tsc',
        start: 'node dist/index.js',
      },
      dependencies: {
        express: '^4.18.2',
        mongoose: '^8.0.4',
        cors: '^2.8.5',
        dotenv: '^16.3.1',
        bcrypt: '^5.1.1',
        jsonwebtoken: '^9.0.2',
      },
      devDependencies: {
        '@types/express': '^4.17.21',
        '@types/node': '^20.11.5',
        '@types/cors': '^2.8.17',
        '@types/bcrypt': '^5.0.2',
        '@types/jsonwebtoken': '^9.0.5',
        typescript: '^5.3.3',
        tsx: '^4.7.0',
      },
    },
    null,
    2
  );
}

function generateBackendTsConfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2020',
        module: 'ESNext',
        moduleResolution: 'node',
        outDir: './dist',
        rootDir: './src',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true,
      },
      include: ['src/**/*'],
      exclude: ['node_modules'],
    },
    null,
    2
  );
}

function generateServerIndex(): string {
  return `import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import router from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', router);

// Error handler
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(\`🚀 Server running on port \${PORT}\`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
`;
}

function generateDatabaseConfig(): string {
  return `import mongoose from 'mongoose';

export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mern_app');
    console.log(\`✓ MongoDB Connected: \${conn.connection.host}\`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}
`;
}

function generateRoutes(): string {
  return `import { Router } from 'express';
import { healthCheck } from '../controllers/health.controller.js';

const router = Router();

router.get('/health', healthCheck);

export default router;
`;
}

function generateHealthController(): string {
  return `import { Request, Response } from 'express';

export function healthCheck(req: Request, res: Response) {
  res.json({
    status: 'ok',
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
  });
}
`;
}

function generateErrorHandler(): string {
  return `import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
}
`;
}

function generateBackendEnv(): string {
  return `PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern_app
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
`;
}