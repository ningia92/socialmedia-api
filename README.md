## Social Media API

The Social Media API is a RESTful API built with Node.js, Express, and Mongoose that allows users to register, authenticate (JWT), and interact with posts and users. Key features include creating and managing posts, following/unfollowing other users, viewing a personalized feed, and liking/disliking posts. The app also integrates a variety of security and validation middleware to protect from common attacks.

#### Setup

```bash
npm install && npm start
```

#### Database Connection

1. Import mongodb.js
2. Invoke in app.listen() callback
3. Setup .env in the root
4. Add MONGO_URI with correct value

#### User Model

Email Validation Regex

```regex
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
```

#### Register User

- Validate - name, email, password - with Mongoose
- Hash Password (with bcryptjs)
- Save User
- Generate Token (JWT)
- Send Response with Token

#### Login User

- Validate - email, password - in controller
- If email or password is missing, throw Error('Please provide email and password')
- Find User
- Compare Passwords
- If no user or password does not match, throw Error('Invalid credentials')
- If correct, generate Token (JWT)
- Send Response with Token (JWT)

#### Major Endpoints

##### Auth
- POST /api/v1/auth/register --> register a new user
- POST /api/v1/auth/login --> logs in and return a JWT

##### Users
- GET /api/v1/users/:id --> retrieves user details
- DELETE /api/v1/users/:id --> deletes a user accounts
- PATCH /api/v1/users/:id/name --> updates user's name
- PATCH /api/v1/users/:id/password --> updates user's password
- GET /api/v1/users/:id/followers --> lists the user's followers
- GET /api/v1/users/:id/following --> lists the users that the user is following
- PATCH /api/v1/users/:id/follow --> follows another user
- PATCH /api/v1/users/:id/unfollow --> unfollows a user
- GET /api/v1/users/:id/feed --> returns posts from followed users

##### Posts
- POST /api/v1/posts/posts --> creates a new post
- GET /api/v1/posts --> retrieves all user's posts
- GET /api/v1/posts/:id --> retrieves a single post by ID
- PATCH /api/v1/posts/:id --> updates an existing post
- DELETE /api/v1/posts/:id --> deletes a post
- PATCH /api/v1/posts/:id/like --> toggles like/dislike on a post

#### Error Handling

- ##### Mongoose Errors:
    - Cast Error
    - Duplicate (Email)
    - Validation Error

- ##### JWT Errors:
    - JsonWebTokenError
    - TokenExpiredError

#### Security

- helmet: sets secure HTTP headers
- cors: manages cross-origin requests securely
- express-mongo-sanitize: prevents NoSQL injection
- express-xss-sanitizer: protects against XSS attacks
- express-slow-down and express-rate-limit: limit and slow down requests to mitigate DoS/brute-force attacks