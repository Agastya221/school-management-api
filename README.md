# School Management API

A Node.js API for managing school data, built with Express.js and PostgreSQL using Prisma ORM.

## Features

- Add new schools with name, address, and geographical coordinates
- List schools sorted by proximity to a specified location
- Data validation and error handling
- PostgreSQL database with Prisma ORM
- Redis
- Docker

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- Redis 
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd school-management-api
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
```
DATABASE_URL="postgresql://username:password@localhost:5432/school_management"
PORT=3000
```
   - Replace `username` and `password` with your PostgreSQL credentials

4. Set up the database:
```bash
# Generate Prisma client
npm run prisma:generate

# Create database and apply migrations
npm run prisma:migrate
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

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

## Error Handling

The API includes comprehensive error handling for:
- Missing or invalid input data
- Invalid geographical coordinates
- Server errors

## License

ISC 