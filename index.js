require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { check, validationResult } = require('express-validator');
const connection = require('./service/db');
const authentication = require('./routers/auth');
const project = require('./routers/project');
const sprint = require('./routers/sprint');
const issue = require('./routers/issue');
const subissue = require('./routers/subissue');
const { verifyToken } = require('./routers/auth');

// Database connection
connection();

// Middlewares
const app = express();
app.use(cors({
  origin: '*', // For development, allow all. In production, set to FRONTEND_URL
  methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization'
}));
app.options('*', cors()); // Enable pre-flight for all routes

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/auth', authentication.router);
app.use('/api/project', verifyToken, project);
app.use('/api/sprint', verifyToken, sprint);
app.use('/api/issue', verifyToken, issue);
app.use('/api/subissue', verifyToken, subissue);
// Serve frontend in production
// const __dirname1 = path.resolve();
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "/client/build")));
//   app.get(/^(?!\/api).*/, (req, res) => {
//     res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"));
//   });
// } else {
  app.get('/', (req, res) => {
    res.send('Welcome to the Jira-like API');
  });
// }

// Catch-all route for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: '404: Not Found' });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});

module.exports = app; // For Vercel serverless
