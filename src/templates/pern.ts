import { Template } from '../types/index.js';

export function getPernTemplate(): Template {
  return {
    name: 'PERN',
    description: 'PostgreSQL + Express + React + Node.js',
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
          database: {
            migrations: null,
          },
        },
      },
    },
    files: [
      {
        path: 'README.md',
        content: generateReadme(),
      },
      {
        path: '.gitignore',
        content: `node_modules/\ndist/\n.env\n.env.local\n*.log\n.DS_Store\ncoverage/\n`,
      },
      // Frontend (same as MERN)
      {
        path: 'frontend/package.json',
        content: generateFrontendPackageJson(),
      },
      {
        path: 'frontend/vite.config.ts',
        content: `import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\nexport default defineConfig({\n  plugins: [react()],\n  server: { port: 5173 },\n})\n`,
      },
      {
        path: 'frontend/tsconfig.json',
        content: generateTsConfig(),
      },
      {
        path: 'frontend/index.html',
        content: `<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>PERN App</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>\n  </body>\n</html>\n`,
      },
      {
        path: 'frontend/src/main.tsx',
        content: `import React from 'react'\nimport ReactDOM from 'react-dom/client'\nimport App from './App.tsx'\nimport './index.css'\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>,\n)\n`,
      },
      {
        path: 'frontend/src/App.tsx',
        content: `import { useState, useEffect } from 'react'\n\nfunction App() {\n  const [message, setMessage] = useState('')\n\n  useEffect(() => {\n    fetch('http://localhost:5000/api/health')\n      .then(res => res.json())\n      .then(data => setMessage(data.message))\n      .catch(err => console.error(err))\n  }, [])\n\n  return (\n    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>\n      <h1>PERN Stack App</h1>\n      <p>Server says: {message || 'Loading...'}</p>\n    </div>\n  )\n}\n\nexport default App\n`,
      },
      {
        path: 'frontend/src/index.css',
        content: `* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;\n}\n`,
      },
      {
        path: 'frontend/.env.example',
        content: 'VITE_API_URL=http://localhost:5000/api\n',
      },
      // Backend
      {
        path: 'backend/package.json',
        content: generateBackendPackageJson(),
      },
      {
        path: 'backend/tsconfig.json',
        content: JSON.stringify({
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
        }, null, 2),
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
        content: `import { Router } from 'express';\nimport { healthCheck } from '../controllers/health.controller.js';\n\nconst router = Router();\n\nrouter.get('/health', healthCheck);\n\nexport default router;\n`,
      },
      {
        path: 'backend/src/controllers/health.controller.ts',
        content: `import { Request, Response } from 'express';\nimport pool from '../config/database.js';\n\nexport async function healthCheck(req: Request, res: Response) {\n  try {\n    const result = await pool.query('SELECT NOW()');\n    res.json({\n      status: 'ok',\n      message: 'Server is running!',\n      database: 'Connected',\n      timestamp: result.rows[0].now,\n    });\n  } catch (error) {\n    res.status(500).json({\n      status: 'error',\n      message: 'Database connection failed',\n    });\n  }\n}\n`,
      },
      {
        path: 'backend/src/middleware/errorHandler.ts',
        content: `import { Request, Response, NextFunction } from 'express';\n\nexport function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {\n  console.error(err.stack);\n  res.status(500).json({\n    status: 'error',\n    message: err.message || 'Internal Server Error',\n  });\n}\n`,
      },
      {
        path: 'backend/.env.example',
        content: generateBackendEnv(),
      },
    ],
  };
}

function generateReadme(): string {
  return `# PERN Stack Project

PostgreSQL + Express + React + Node.js

## Prerequisites
- PostgreSQL installed and running

## Setup

### Database
\`\`\`bash
createdb pern_app
\`\`\`

### Backend
\`\`\`bash
cd backend
npm install
cp .env.example .env
# Update .env with your PostgreSQL credentials
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

function generateFrontendPackageJson(): string {
  return JSON.stringify({
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
  }, null, 2);
}

function generateTsConfig(): string {
  return JSON.stringify({
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
  }, null, 2);
}

function generateBackendPackageJson(): string {
  return JSON.stringify({
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
      pg: '^8.11.3',
      cors: '^2.8.5',
      dotenv: '^16.3.1',
      bcrypt: '^5.1.1',
      jsonwebtoken: '^9.0.2',
    },
    devDependencies: {
      '@types/express': '^4.17.21',
      '@types/node': '^20.11.5',
      '@types/cors': '^2.8.17',
      '@types/pg': '^8.10.9',
      '@types/bcrypt': '^5.0.2',
      '@types/jsonwebtoken': '^9.0.5',
      typescript: '^5.3.3',
      tsx: '^4.7.0',
    },
  }, null, 2);
}

function generateServerIndex(): string {
  return `import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
});
`;
}

function generateDatabaseConfig(): string {
  return `import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pern_app',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
});

pool.on('connect', () => {
  console.log('✓ PostgreSQL Connected');
});

export default pool;
`;
}

function generateBackendEnv(): string {
  return `PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=pern_app
DB_PASSWORD=postgres
DB_PORT=5432
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
`;
}