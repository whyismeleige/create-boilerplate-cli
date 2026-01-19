import { Template } from '../types/index.js';

export function getNextjsTemplate(): Template {
  return {
    name: 'Next.js',
    description: 'Full-stack React framework',
    structure: {
      src: {
        app: {
          api: null,
          components: {
            shared: null,
          },
        },
        lib: null,
        types: null,
        utils: null,
      },
      public: null,
    },
    files: [
      {
        path: 'README.md',
        content: generateReadme(),
      },
      {
        path: '.gitignore',
        content: `node_modules/\n.next/\ndist/\n.env\n.env.local\n*.log\n.DS_Store\ncoverage/\n`,
      },
      {
        path: 'package.json',
        content: generatePackageJson(),
      },
      {
        path: 'tsconfig.json',
        content: generateTsConfig(),
      },
      {
        path: 'next.config.js',
        content: generateNextConfig(),
      },
      {
        path: 'tailwind.config.ts',
        content: generateTailwindConfig(),
      },
      {
        path: 'postcss.config.js',
        content: `module.exports = {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n}\n`,
      },
      {
        path: 'src/app/layout.tsx',
        content: generateLayout(),
      },
      {
        path: 'src/app/page.tsx',
        content: generatePage(),
      },
      {
        path: 'src/app/globals.css',
        content: generateGlobalsCss(),
      },
      {
        path: 'src/app/api/hello/route.ts',
        content: generateApiRoute(),
      },
      {
        path: '.env.example',
        content: `NEXT_PUBLIC_API_URL=http://localhost:3000/api\n`,
      },
    ],
  };
}

function generateReadme(): string {
  return `# Next.js Project

Full-stack React framework with App Router and TypeScript

## Setup

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Features
- ✅ App Router
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ API Routes

## Project Structure
\`\`\`
src/
├── app/
│   ├── api/          # API routes
│   ├── components/   # React components
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home page
├── lib/              # Utility functions
├── types/            # TypeScript types
└── utils/            # Helper functions
\`\`\`

## Learn More
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
`;
}

function generatePackageJson(): string {
  return JSON.stringify({
    name: 'nextjs-app',
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
    },
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      next: '^14.0.4',
    },
    devDependencies: {
      typescript: '^5.3.3',
      '@types/node': '^20.11.5',
      '@types/react': '^18.2.45',
      '@types/react-dom': '^18.2.18',
      autoprefixer: '^10.4.16',
      postcss: '^8.4.32',
      tailwindcss: '^3.4.0',
      eslint: '^8.56.0',
      'eslint-config-next': '^14.0.4',
    },
  }, null, 2);
}

function generateTsConfig(): string {
  return JSON.stringify({
    compilerOptions: {
      target: 'ES2017',
      lib: ['dom', 'dom.iterable', 'esnext'],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'preserve',
      incremental: true,
      plugins: [
        {
          name: 'next',
        },
      ],
      paths: {
        '@/*': ['./src/*'],
      },
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
    exclude: ['node_modules'],
  }, null, 2);
}

function generateNextConfig(): string {
  return `/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig
`;
}

function generateTailwindConfig(): string {
  return `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
`;
}

function generateLayout(): string {
  return `import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Next.js App',
  description: 'Created with project-launcher-cli',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`;
}

function generatePage(): string {
  return `'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message))
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Next.js App
        </h1>
        <p className="text-xl text-gray-600">
          {message || 'Loading...'}
        </p>
      </div>
    </main>
  )
}
`;
}

function generateGlobalsCss(): string {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
`;
}

function generateApiRoute(): string {
  return `import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Hello from Next.js API!',
    timestamp: new Date().toISOString(),
  })
}
`;
}