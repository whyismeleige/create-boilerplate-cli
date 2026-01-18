import { ProjectConfig } from '../types';
import { getStackDisplayName } from '../utils/helpers';

/**
 * Generate README.md content
 */
export function generateReadme(config: ProjectConfig): string {
  const { name, description, stack, features } = config;

  return `# ${name}

${description}

## Tech Stack

${getStackDisplayName(stack)}

### Features

${features.typescript ? '- ✅ TypeScript' : ''}
${features.eslint ? '- ✅ ESLint' : ''}
${features.prettier ? '- ✅ Prettier' : ''}
${features.docker ? '- ✅ Docker' : ''}
${features.githubActions ? '- ✅ GitHub Actions CI/CD' : ''}
${features.testing !== 'none' ? `- ✅ ${features.testing.charAt(0).toUpperCase() + features.testing.slice(1)} for testing` : ''}

## Getting Started

### Prerequisites

${getPrerequisites(config)}

### Installation

${getInstallationInstructions(config)}

### Running the Application

${getRunInstructions(config)}

## Project Structure

\`\`\`
${getProjectStructure(config)}
\`\`\`

${features.docker ? getDockerInstructions(config) : ''}

${features.testing !== 'none' ? getTestingInstructions(config) : ''}

## Environment Variables

${getEnvironmentVariables(config)}

## Scripts

${getScripts(config)}

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Author

${config.author || 'Your Name'}

---

Created with [create-boilerplate](https://github.com/yourusername/create-boilerplate) 🚀
`;
}

/**
 * Get prerequisites section
 */
function getPrerequisites(config: ProjectConfig): string {
  const reqs = ['- Node.js (v18 or higher)'];

  if (config.stack === 'flask' || config.stack === 'django') {
    reqs.push('- Python 3.11 or higher');
    reqs.push('- pip');
  } else {
    reqs.push('- npm or yarn');
  }

  if (config.stack === 'mern') {
    reqs.push('- MongoDB');
  } else if (config.stack === 'pern') {
    reqs.push('- PostgreSQL');
  }

  if (config.features.docker) {
    reqs.push('- Docker and Docker Compose (optional)');
  }

  return reqs.join('\n');
}

/**
 * Get installation instructions
 */
function getInstallationInstructions(config: ProjectConfig): string {
  if (config.stack === 'flask' || config.stack === 'django') {
    return `\`\`\`bash
# Clone the repository
git clone <repository-url>
cd ${config.name}

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\\Scripts\\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
\`\`\``;
  }

  if (config.stack === 'mern' || config.stack === 'pern') {
    return `\`\`\`bash
# Clone the repository
git clone <repository-url>
cd ${config.name}

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
\`\`\``;
  }

  return `\`\`\`bash
# Clone the repository
git clone <repository-url>
cd ${config.name}

# Install dependencies
npm install
\`\`\``;
}

/**
 * Get run instructions
 */
function getRunInstructions(config: ProjectConfig): string {
  if (config.stack === 'flask' || config.stack === 'django') {
    return `\`\`\`bash
# Make sure virtual environment is activated
python run.py
\`\`\`

The application will be available at \`http://localhost:5000\``;
  }

  if (config.stack === 'mern' || config.stack === 'pern') {
    return `\`\`\`bash
# Start the server (in one terminal)
cd server
npm run dev

# Start the client (in another terminal)
cd client
npm run dev
\`\`\`

- Frontend: \`http://localhost:5173\`
- Backend: \`http://localhost:5000\``;
  }

  if (config.stack === 'nextjs') {
    return `\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.`;
  }

  return `\`\`\`bash
npm run dev
\`\`\``;
}

/**
 * Get project structure
 */
function getProjectStructure(config: ProjectConfig): string {
  if (config.stack === 'mern' || config.stack === 'pern') {
    return `${config.name}/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.${config.features.typescript ? 'tsx' : 'jsx'}
│   │   └── main.${config.features.typescript ? 'tsx' : 'jsx'}
│   └── package.json
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── index.${config.features.typescript ? 'ts' : 'js'}
│   └── package.json
└── README.md`;
  }

  if (config.stack === 'nextjs') {
    return `${config.name}/
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── components/
│   │   ├── layout.${config.features.typescript ? 'tsx' : 'jsx'}
│   │   └── page.${config.features.typescript ? 'tsx' : 'jsx'}
│   └── lib/
├── public/
└── package.json`;
  }

  if (config.stack === 'flask') {
    return `${config.name}/
├── app/
│   ├── __init__.py
│   ├── routes/
│   ├── models/
│   └── utils/
├── tests/
├── requirements.txt
└── run.py`;
  }

  return `${config.name}/
├── src/
│   └── index.${config.features.typescript ? 'ts' : 'js'}
├── package.json
└── README.md`;
}

/**
 * Get Docker instructions
 */
function getDockerInstructions(config: ProjectConfig): string {
  return `## Docker

Build and run with Docker:

\`\`\`bash
# Build and start services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop services
docker-compose down
\`\`\`

${config.stack === 'mern' || config.stack === 'pern' ? 'The docker-compose setup includes the database, so no separate installation is needed.' : ''}
`;
}

/**
 * Get testing instructions
 */
function getTestingInstructions(config: ProjectConfig): string {
  return `## Testing

Run tests:

\`\`\`bash
npm test
\`\`\`

Run tests in watch mode:

\`\`\`bash
npm run test:watch
\`\`\`

Generate coverage report:

\`\`\`bash
npm run test:coverage
\`\`\`
`;
}

/**
 * Get environment variables
 */
function getEnvironmentVariables(config: ProjectConfig): string {
  let envVars = 'Create a `.env` file in the root directory:\n\n```env\n';

  if (config.stack === 'mern') {
    envVars += `MONGODB_URI=mongodb://localhost:27017/${config.name}\nPORT=5000\n`;
  } else if (config.stack === 'pern') {
    envVars += `DATABASE_URL=postgresql://user:password@localhost:5432/${config.name}\nPORT=5000\n`;
  } else if (config.stack === 'flask') {
    envVars += `FLASK_ENV=development\nFLASK_APP=run.py\n`;
  } else if (config.stack === 'nextjs') {
    envVars += `NEXT_PUBLIC_API_URL=http://localhost:3000/api\n`;
  } else {
    envVars += `PORT=3000\nNODE_ENV=development\n`;
  }

  envVars += '```';
  return envVars;
}

/**
 * Get scripts section
 */
function getScripts(config: ProjectConfig): string {
  let scripts = '';

  if (config.stack === 'mern' || config.stack === 'pern') {
    scripts = `### Server

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm start\` - Start production server

### Client

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build`;
  } else if (config.stack === 'nextjs') {
    scripts = `- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm start\` - Start production server
- \`npm run lint\` - Run ESLint`;
  } else if (config.stack === 'flask') {
    scripts = `- \`python run.py\` - Start development server
- \`pytest\` - Run tests`;
  } else {
    scripts = `- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm start\` - Start production server`;
  }

  return scripts;
}

/**
 * Generate .env.example file
 */
export function generateEnvExample(config: ProjectConfig): string {
  if (config.stack === 'mern') {
    return `MONGODB_URI=mongodb://localhost:27017/${config.name}
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here
`;
  }

  if (config.stack === 'pern') {
    return `DATABASE_URL=postgresql://user:password@localhost:5432/${config.name}
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here
`;
  }

  if (config.stack === 'flask') {
    return `FLASK_ENV=development
FLASK_APP=run.py
SECRET_KEY=your_secret_key_here
DATABASE_URL=sqlite:///app.db
`;
  }

  if (config.stack === 'nextjs') {
    return `NEXT_PUBLIC_API_URL=http://localhost:3000/api
DATABASE_URL=
`;
  }

  return `PORT=3000
NODE_ENV=development
`;
}