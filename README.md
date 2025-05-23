# Pokédex API

A RESTful API providing Pokémon data and authentication services for the Pokédex application.

See the front for the link of the video that demonstrates the application.

## Features

- **Pokémon Management**: CRUD operations for Pokémon data
- **Authentication**: Secure login and registration system
- **Search Functionality**: Search and filter Pokémon by various criteria
- **Static File Serving**: Serves Pokémon images and other assets
- **Rate Limiting**: Prevents abuse of the API
- **CORS Support**: Configured for cross-origin requests

## Technologies Used

- Node.js
- Express.js
- MongoDB (with Mongoose)
- JSON Web Tokens for authentication
- Rate limiting middleware

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Authenticate a user

### Pokémon
- `GET /api/pokemons` - Get all Pokémon (with pagination, search, and filtering)
- `GET /api/pokemons/:id` - Get a specific Pokémon by ID
- `POST /api/pokemons` - Create a new Pokémon (requires authentication)
- `PUT /api/pokemons/:id` - Update a Pokémon (requires authentication)
- `DELETE /api/pokemons/:id` - Delete a Pokémon (requires authentication)

## Getting Started

### Prerequisites

- Node.js (v14 or later recommended)
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ArmDng/pokedex-api-ArmDng.git
   cd pokedex-api-ArmDng
   ```

   
2. Create a `.env` file in the root directory and add the following environment variables:
    ```plaintext
    MONGODB_URI=mongodb://MONGODB_URL
    JWT_SECRET=your_jwt_secret_key
    FRONTEND_URL=FRONTENED_URL
    ```
3. Start the server
   ```bash
   npm run
   ```
