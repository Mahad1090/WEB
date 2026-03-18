# Task 3 - Login System: Comparison Report

**Student Name:** [Your Name]  
**Date:** March 6, 2026  
**Task:** Login System using Express.js, MongoDB, Sessions, and Class

---

## What I Built

A login system with the following features:
- Register a new account
- Login with username and password
- Protected dashboard (only for logged-in users)
- Logout

---

## Project File Structure

```
Task 3/
├── server.js           <- Main server and all routes
├── config/
│   └── db.js           <- MongoDB connection
├── models/
│   └── User.js         <- User class (register + login)
├── middleware/
│   └── auth.js         <- Protects the dashboard route
├── package.json
└── report.md
```

---

## Comparison: Student Code vs AI Code

| Feature | Student Code | AI Code (ChatGPT) |
|---|---|---|
| **Structure** | Simple, split into small files | Advanced, may use MVC folders |
| **Readability** | Easy – lots of comments | Medium – less comments, shorter code |
| **Security** | Basic – plain text password | Good – uses bcrypt to hash password |
| **Session Handling** | Yes – uses express-session | Yes – uses express-session |
| **Error Handling** | Basic – simple try/catch | Good – custom error classes |
| **Validation** | Basic – checks if fields are empty | Good – uses a validation library |

---

## Code Comparison (Side by Side)

### 1. Registering a User

**Student Code:**
```js
// Simple and easy to read
async register() {
  const existing = await UserModel.findOne({ username: this.username });
  if (existing) {
    throw new Error("Username already taken");
  }
  const newUser = new UserModel({
    username: this.username,
    password: this.password,   // plain text password
  });
  await newUser.save();
  return "User registered successfully";
}
```

**AI Code (ChatGPT style):**
```js
// Uses bcrypt to hash the password before saving
async register() {
  const existing = await UserModel.findOne({ username: this.username });
  if (existing) throw new Error("Username already taken");

  const hashed = await bcrypt.hash(this.password, 10);
  await new UserModel({ username: this.username, password: hashed }).save();
  return "User registered successfully";
}
```

**Difference:** The AI code hashes the password using `bcrypt`. This means even if someone gets into the database, they cannot read the passwords. My student code stores the password as plain text, which is simpler but less safe.

---

### 2. Login Route

**Student Code:**
```js
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }
  try {
    const user = new User(username, password);
    const message = await user.login();
    req.session.user = username;
    res.send(message);
  } catch (error) {
    res.status(401).send(error.message);
  }
});
```

**AI Code (ChatGPT style):**
```js
// More compact, uses bcrypt.compare for password check
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  req.session.user = username;
  res.json({ message: "Login successful" });
});
```

**Difference:** The AI code is shorter and uses `bcrypt.compare()` to check the hashed password. My code is longer but easier to follow and understand.

---

### 3. Auth Middleware

**Student Code:**
```js
const isLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).send("Access denied. Please login first.");
  }
};
```

**AI Code (ChatGPT style):**
```js
// Same idea, just shorter
const isLoggedIn = (req, res, next) => {
  if (!req.session?.user) return res.status(401).json({ error: "Unauthorized" });
  next();
};
```

**Difference:** Both do the same thing. The AI version is shorter using `?.` (optional chaining). My version is easier to read for beginners.

---

## Summary

| What | Notes |
|---|---|
| My code works correctly | Yes |
| My code is easy to understand | Yes – good for beginners |
| AI code is more secure | Yes – it uses bcrypt |
| AI code is shorter | Yes – but harder to read |
| Both use express-session | Yes |
| Both use Mongoose | Yes |
| Both use User class | Yes |

---

## What I Learned

- How to connect Node.js to MongoDB using Mongoose
- How to use JavaScript Classes in a real project
- How sessions work (`req.session`)
- How middleware can protect certain routes
- The difference between plain text passwords and hashed passwords

---

## How to Run the Project

1. Make sure **MongoDB** is running on your computer
2. Open terminal in the project folder
3. Run:
   ```
   npm start
   ```
4. Server starts at `http://localhost:3000`

## Testing the Routes

Use a tool like **Postman** or **Thunder Client** (VS Code):

| Action | Method | URL | Body |
|---|---|---|---|
| Register | POST | `http://localhost:3000/register` | `{ "username": "ali", "password": "1234" }` |
| Login | POST | `http://localhost:3000/login` | `{ "username": "ali", "password": "1234" }` |
| Dashboard | GET | `http://localhost:3000/dashboard` | none |
| Logout | GET | `http://localhost:3000/logout` | none |

---

*Report generated as part of Task 3 submission.*
