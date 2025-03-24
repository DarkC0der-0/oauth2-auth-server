# OAuth2 Auth Server

## Overview

The OAuth2 Auth Server is a comprehensive authentication and authorization platform designed to manage users, roles, and permissions. It includes a FastAPI backend for handling API requests, a PostgreSQL database for storing user data, Redis for caching and rate limiting, and a React frontend served via Nginx for the user interface. The system supports multi-factor authentication (MFA) and audit logging for critical actions.

## Features
- User authentication and authorization
- Role-based access control
- Multi-factor authentication (MFA)
- Audit logging for critical actions
- Rate limiting to prevent brute-force attacks
- Caching frequently accessed data
- Prometheus and Grafana for monitoring and alerts
- Docker and Kubernetes for containerization and orchestration

## Installation and Setup

### Prerequisites
- Docker
- Docker Compose
- Kubernetes (kubectl and minikube, or a cloud provider)
- Node.js and npm for frontend development

### Backend Setup

1. Clone the repository:

    ```sh
    git clone https://github.com/DarkC0der-0/oauth2-auth-server.git
    cd oauth2-auth-server/backend
    ```

2. Install Python dependencies:

    ```sh
    pip install -r requirements.txt
    ```

3. Set up the database:

    ```sh
    alembic upgrade head
    ```

4. Run the backend server:

    ```sh
    uvicorn main:app --host 0.0.0.0 --port 8000
    ```

### Frontend Setup

1. Navigate to the frontend directory:

    ```sh
    cd ../frontend
    ```

2. Install Node.js dependencies:

    ```sh
    npm install
    ```

3. Start the development server:

    ```sh
    npm start
    ```

### Docker Setup

1. Build and run the Docker containers:

    ```sh
    docker-compose build
    docker-compose up -d
    ```

### Kubernetes Setup

1. Deploy PostgreSQL, Redis, FastAPI backend, Prometheus, and Grafana:

    ```sh
    kubectl apply -f k8s/postgres.yaml
    kubectl apply -f k8s/redis.yaml
    kubectl apply -f k8s/deployment.yaml
    kubectl apply -f k8s/prometheus.yaml
    kubectl apply -f k8s/grafana.yaml
    ```

2. Check the status of the services and deployments:

    ```sh
    kubectl get services
    kubectl get deployments
    ```

## API Documentation

### Endpoints

- **POST /token**: User login
- **POST /verify-mfa**: Verify Multi-Factor Authentication (MFA)
- **PUT /users/{user_id}/role**: Update user role
- **PUT /users/{user_id}/password**: Reset user password
- **GET /roles**: Get all roles
- **GET /permissions**: Get all permissions
- **GET /metrics**: Get Prometheus metrics

### Request/Response Schemas

#### User Login
**Request:**
```json
{
  "username": "user@example.com",
  "password": "string"
}
```

**Response:**
```json
{
  "access_token": "string",
  "token_type": "bearer",
  "refresh_token": "string"
}
```

#### Verify MFA
**Request:**
```json
{
  "otp": "123456"
}
```

**Response:**
```json
{
  "access_token": "string",
  "token_type": "bearer",
  "refresh_token": "string"
}
```

#### Update User Role
**Request:**
```json
{
  "role_id": 1
}
```

**Response:**
```json
{
  "message": "Role updated successfully"
}
```

## Running Tests

### Backend Tests

1. Navigate to the backend directory:

    ```sh
    cd backend
    ```

2. Run the tests:

    ```sh
    pytest
    ```

### Frontend Tests

1. Navigate to the frontend directory:

    ```sh
    cd frontend
    ```

2. Run the tests:

    ```sh
    npm test
    ```

## Deployment

### Deploying to AWS ECS

1. Ensure you have the necessary AWS credentials set up in GitHub Secrets (`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`).

2. Create the ECS task definition file (`ecs-task-definition.json`) in the root directory.

3. Configure the GitHub Actions workflow (`.github/workflows/ci-cd.yml`) for CI/CD.

4. Push your changes to the `main` branch to trigger the CI/CD pipeline.

### Example Use Cases

1. **User Authentication:**
   - Users can log in using their email and password.
   - MFA can be enabled for additional security.

2. **Role-Based Access Control:**
   - Admins can assign roles to users and manage permissions.
   - Different roles can access different parts of the application.

3. **Audit Logging:**
   - Critical actions like user logins, role changes, and password resets are logged for security and compliance.

### Architecture Diagram

![Architecture Diagram](./architecture-diagram.png)

## Monitoring and Alerts

### Prometheus and Grafana

1. Access Grafana at `http://localhost:3000` and configure dashboards and alerts.
2. Verify that Prometheus is scraping metrics from FastAPI.
3. Monitor login attempts, token usage, and API performance from Grafana dashboards.
4. Ensure alerts are configured and working as expected.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
