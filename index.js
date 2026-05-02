require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connection = require('./service/db');
const authentication = require('./routers/auth');
const project = require('./routers/project');
const sprint = require('./routers/sprint');
const issue = require('./routers/issue');
const subissue = require('./routers/subissue');
const { verifyToken } = require('./routers/auth');

const app = express();

// ── CORS ────────────────────────────────────────────────────────────────
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 

// ── Body parsing (built-in Express, no extra dependency needed) ─────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ── Database connection (cached for serverless warm starts) ─────────────
let dbConnected = false;
app.use(async (req, res, next) => {
  if (!dbConnected) {
    try {
      await connection();
      dbConnected = true;
    } catch (err) {
      console.error('DB connection failed:', err);
      // Continue anyway — individual routes will fail with a clear DB error
    }
  }
  next();
});

// ── Routes ──────────────────────────────────────────────────────────────
app.use('/auth', authentication.router);
app.use('/api/project', verifyToken, project);
app.use('/api/sprint', verifyToken, sprint);
app.use('/api/issue', verifyToken, issue);
app.use('/api/subissue', verifyToken, subissue);

app.get('/', (req, res) => {
  res.send('Welcome to the Jira-like API');
});

// ── 404 handler ─────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: '404: Not Found' });
});

// ── Global error handler (prevents unhandled errors from crashing) ──────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// ── Local dev server (skipped on Vercel) ────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`Server running on port ${port}...`);
  });
}

module.exports = app;
