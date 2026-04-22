# Notes Tracker

This project is a continuation of an earlier project I started in 2024.  
This is **version 3**, following two previous repositories.

The application consists of:
- **Backend:** Java with Spring Boot  
- **Frontend:** TypeScript  

---

## Tech Stack

- Java (Spring Boot)
- TypeScript
- Docker
- MongoDB
- Node.js / npm

---

##  Requirements

Make sure you have the following installed:

- Docker
- Node.js and npm
- An IDE:
  - Recommended: IntelliJ IDEA (for backend)
  - Alternative: Visual Studio Code
- Basic understanding of:
  - Spring Boot
  - TypeScript / JavaScript

---

##  Setup Guide

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd notes_tracker
```

---

##  Backend Setup

### Environment Variables

1. Navigate to the `backend` folder.
2. Locate the `.env.example` file.
3. Create a new `.env` file in the same directory.
4. Fill in the required values:
   - MongoDB credentials
   - `SPRING_DATA_MONGODB_AUTHENTICATION_DATABASE=admin`
   - `JWT_SECRET` → generate one here:  
     https://randomkeygen.com/jwt-secret

---

### Application Configuration

1. Go to:
   ```
   backend/src/main/resources
   ```
2. Copy:
   ```
   example.application.properties
   ```
3. Create:
   ```
   application.properties
   ```
4. Paste the contents into the new file.

---

### Test Configuration

1. Navigate to:
   ```
   backend/src/test/resources
   ```
2. Copy:
   ```
   example.application-test.properties
   ```
3. Create:
   ```
   application-test.properties
   ```
4. Update:
   - Test database credentials
   - CORS origins

---

## Running the Backend

### Using Docker (Recommended)

```bash
docker-compose -f docker-compose-dev.yml up --build
```

### Running Tests you must have a dokcer container running

```bash
docker-compose -f docker-compose-test.yml up --build
```

### Using an IDE

- Run the application via IntelliJ or your preferred IDE
- Run tests using Maven or the IDE test runner

---

##  Frontend Setup

1. Navigate to the `frontend` folder.
2. Locate `.env.example`.
3. Create a `.env` file in the same directory.
4. Fill in the required environment variables.

---

## You're Ready!

You should now have both the backend and frontend running locally and ready for development.

---

##  Notes

- Make sure Docker is running before executing commands.
- Double-check all `.env` and configuration files.
- If something fails, check:
  - Docker logs
  - IDE console output

---

## Contributing

Feel free to fork the project and submit pull requests. Suggestions and improvements are always welcome.


## Notes
To run the backend through vscode you must setup a launch.json file where you paste your environment variables so that you can run the application.