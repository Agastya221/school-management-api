# School Management API

A Node.js API for managing school data, built with Express.js, TypeScript, PostgreSQL, Redis, and Prisma ORM.

## Features

- Add new schools with name, address, and geographical coordinates
- List schools sorted by proximity to a specified location
- Data validation and error handling
- PostgreSQL database with Prisma ORM
- Redis caching for improved performance
- Docker containerization for easy deployment
- TypeScript for type safety and better developer experience

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Caching**: Redis
- **Containerization**: Docker, Docker Compose
- **API Testing**: Postman

## Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- npm or yarn

## Setup

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/Agastya221/school-management-api.git
cd school-management-api
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Create `.env.local`if  file is not present in the root directory
   - Add the following variables:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/school_management?sslmode=require"
PORT=3000
REDIS_URL="redis://localhost:6379"
```

4. Set up the database:
```bash
# Generate Prisma client
npm run prisma:generate

# Create database and apply migrations
npm run prisma:migrate

# Seed the database with initial data
npx prisma db seed
```

5. Run the application in development mode:
```bash
npm run dev
```

### Docker Deployment

1. Make sure Docker and Docker Compose are installed on your system

2. Run the application using Docker Compose:
```bash
npm run docker:up
```
   This will build and start the containers for:
   - Node.js application
   - PostgreSQL database
   - Redis cache

3. The API will be available at `http://localhost:3000`

## API Endpoints

### Add School
- **URL**: `/api/addSchool`
- **Method**: `POST`
- **Request Body**:
```json
{
  "name": "School Name",
  "address": "School Address",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "School Name",
    "address": "School Address",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "message": "School added successfully"
}
```

### List Schools
- **URL**: `/api/listSchools?latitude=40.7128&longitude=-74.0060`
- **Method**: `GET`
- **Query Parameters**:
  - `latitude`: User's latitude (required)
  - `longitude`: User's longitude (required)
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "School Name",
      "address": "School Address",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z",
      "distance": 0
    },
    {
      "id": 2,
      "name": "Another School",
      "address": "Another Address",
      "latitude": 40.7200,
      "longitude": -74.0100,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z",
      "distance": 0.85
    }
  ],
  "message": "Schools retrieved successfully"
}
```

## Project Structure

```
school-management-api/
├── prisma/
│   ├── schema.prisma       # Database schema definition
│   └── seed.ts             # Database seed script
├── src/
│   ├── controllers/        # Business logic
│   │   └── schoolController.ts
│   ├── middlewares/        # Request processing middleware
│   │   └── validationMiddleware.ts
│   ├── routes/             # API route definitions
│   │   └── schoolRoutes.ts
│   └── index.ts            # Application entry point
├── .env                    # Environment variables
├── docker-compose.yml      # Docker Compose configuration
├── Dockerfile              # Docker container configuration
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## Database Schema

The application uses a PostgreSQL database with the following schema:

```prisma
model School {
  id        Int      @id @default(autoincrement())
  name      String
  address   String
  latitude  Float
  longitude Float
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Database Seeding

The application includes a database seeding mechanism to populate the database with initial data. The seed script is located at `prisma/seed.ts` and is configured in the `package.json` file:

```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

To seed the database:

```bash
npx prisma db seed
```

This will populate the database with predefined schools, making it easier to test the application without manually adding data.

## Caching Strategy

The application uses Redis for caching:
- School list is cached to improve performance for frequently accessed data
- Cache is invalidated when new schools are added

## Available Scripts

- `npm run dev`: Run the application in development mode
- `npm run build`: Build the TypeScript code
- `npm start`: Run the built application in production mode
- `npm run prisma:generate`: Generate Prisma client
- `npm run prisma:migrate`: Run database migrations
- `npm run prisma:studio`: Open Prisma Studio to manage database
- `npm run docker:up`: Build and start Docker containers

## Error Handling

The API includes comprehensive error handling for:
- Missing or invalid input data
- Invalid geographical coordinates
- Server errors

## License

ISC 