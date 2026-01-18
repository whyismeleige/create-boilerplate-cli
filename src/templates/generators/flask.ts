import { Template } from '../../types/templates.types';
import { ProjectConfig } from '../../types';

import { generateReadme, generateEnvExample } from '../content/readme';

export const flaskTemplate: Template = {
  name: 'Flask',
  description: 'Python Web Framework',
  version: '1.0.0',
  structure: {
    app: {
      '__init__.py': null,
      routes: {
        '__init__.py': null,
        'main.py': null,
      },
      models: {
        '__init__.py': null,
      },
      utils: {
        '__init__.py': null,
      },
    },
    tests: {
      '__init__.py': null,
      'test_main.py': null,
    },
  },
  dependencies: {},
  devDependencies: {},
  scripts: {},
  files: [],
};

export function getFlaskTemplateFiles(config: ProjectConfig) {
  return [
    {
      path: 'README.md',
      content: generateReadme(config),
    },
    {
      path: '.gitignore',
      content: `# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
ENV/

# Flask
instance/
.webassets-cache

# Testing
.pytest_cache/
.coverage
htmlcov/

# IDE
.vscode/
.idea/

# Environment
.env
.env.local
`,
    },
    {
      path: 'requirements.txt',
      content: generateRequirements(config),
    },
    {
      path: 'run.py',
      content: generateRunPy(config),
    },
    {
      path: 'config.py',
      content: generateConfig(config),
    },
    {
      path: 'app/__init__.py',
      content: generateAppInit(config),
    },
    {
      path: 'app/routes/__init__.py',
      content: '',
    },
    {
      path: 'app/routes/main.py',
      content: generateMainRoutes(config),
    },
    {
      path: 'app/models/__init__.py',
      content: '',
    },
    {
      path: 'app/utils/__init__.py',
      content: '',
    },
    {
      path: 'tests/__init__.py',
      content: '',
    },
    {
      path: 'tests/test_main.py',
      content: generateTests(config),
    },
    {
      path: '.env.example',
      content: generateEnvExample(config),
    },
    
  ];
}

function generateRequirements(config: ProjectConfig): string {
  let deps = `Flask==3.0.0
python-dotenv==1.0.0
`;

  if (config.features.testing === 'pytest') {
    deps += `pytest==7.4.3
pytest-flask==1.3.0
`;
  }

  return deps;
}

function generateRunPy(config: ProjectConfig): string {
  return `from app import create_app
import os

app = create_app()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)
`;
}

function generateConfig(config: ProjectConfig): string {
  return `import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    DEBUG = False
    TESTING = False

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
`;
}

function generateAppInit(config: ProjectConfig): string {
  return `from flask import Flask
import os

def create_app(config_name=None):
    """Application factory"""
    app = Flask(__name__)
    
    # Load configuration
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    from config import config
    app.config.from_object(config[config_name])
    
    # Register blueprints
    from app.routes.main import main_bp
    app.register_blueprint(main_bp)
    
    return app
`;
}

function generateMainRoutes(config: ProjectConfig): string {
  return `from flask import Blueprint, jsonify

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return jsonify({
        'message': 'Welcome to ${config.name} API!',
        'status': 'running'
    })

@main_bp.route('/api/health')
def health():
    return jsonify({
        'status': 'healthy'
    })
`;
}

function generateTests(config: ProjectConfig): string {
  return `import pytest
from app import create_app

@pytest.fixture
def app():
    app = create_app('testing')
    return app

@pytest.fixture
def client(app):
    return app.test_client()

def test_index(client):
    response = client.get('/')
    assert response.status_code == 200
    data = response.get_json()
    assert 'message' in data

def test_health(client):
    response = client.get('/api/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'healthy'
`;
}