# MariCloud

MariCloud is a personal cloud-storage project for organizing files in folders through a web interface. The frontend is built with React and Vite, the backend uses Spring Boot, file objects are stored in MinIO, and PostgreSQL stores application data.

## Features

- Browse files and folders in a web interface
- Create nested folders
- Upload files into the current folder
- View storage usage and file sizes
- Store file objects in MinIO and application metadata in PostgreSQL
- Run supporting services locally with Docker Compose

> **Project status:** This project is under active development. Some interface actions may not yet be implemented by the backend.

## Tech stack

| Component | Technology |
| --- | --- |
| Frontend | React 19, Vite |
| Backend | Java 25, Spring Boot |
| Database | PostgreSQL 18 |
| Object storage | MinIO |
| Local infrastructure | Docker Compose |

## Repository structure

```text
maricloud/
├── backend/          # Spring Boot REST API
├── frontend/         # React + Vite web application
├── infrastructure/   # PostgreSQL and MinIO Docker Compose setup
└── download-test/     # Download-related test files
```

## Prerequisites

- Git
- Node.js and npm
- JDK 25
- Docker Engine with the Docker Compose plugin

## Run locally

### 1. Clone the repository

```bash
git clone https://github.com/Marimuthu-07/maricloud.git
cd maricloud
```

### 2. Start PostgreSQL and MinIO

From the repository root:

```bash
docker compose -f infrastructure/docker-compose.yml up -d
```

The current Compose configuration exposes PostgreSQL on port `5432`, MinIO's API on `9000`, and the MinIO console on `9001`.

**Local development only:** the Compose configuration contains development credentials and a machine-specific MinIO data path. Replace these with your own local settings before using the setup elsewhere. Never use development credentials in production.

### 3. Configure and start the backend

The backend reads its database password and MinIO connection settings from environment variables. Set values matching your local Compose configuration in the terminal where you will run the backend:

```bash
export MARI_CLOUD_DB_PASSWORD='your-local-postgres-password'
export MINIO_URL='http://localhost:9000'
export MINIO_ROOT_USER='your-local-minio-user'
export MINIO_ROOT_PASSWORD='your-local-minio-password'
```

Update the PostgreSQL and MinIO credentials in `infrastructure/docker-compose.yml` to match the values you choose.

Start the Spring Boot API:

```bash
cd backend
./mvnw spring-boot:run
```

The backend uses port `8080` by default.

### 4. Start the frontend

Open another terminal from the repository root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). The Vite development server proxies `/api` requests to `http://localhost:8080`.

## Useful commands

From `frontend/`:

```bash
npm run dev       # Start the development server
npm run build     # Build the production frontend
npm run preview   # Preview a production build
npm run lint      # Run ESLint
```

From `backend/`:

```bash
./mvnw spring-boot:run  # Run the API
./mvnw test             # Run backend tests
```

## Configuration notes

- The backend's default storage quota is 10 GiB.
- PostgreSQL and MinIO must be running before the backend can use them.
- Keep passwords, access keys, and other secrets out of source control.
- Before production deployment, configure secure credentials, persistent storage, TLS, backups, and appropriate network access rules.

## Contributing

Issues and pull requests are welcome. When reporting a problem, include reproduction steps, expected and actual behavior, and relevant logs with secrets removed.

## License

MariCloud is licensed under the MIT License. See [LICENSE](LICENSE) for the full text.
