// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const csrf = require('csurf');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: true }));
app.use(csrf());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});
const User = mongoose.model('User', UserSchema);

// Task Schema
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String } // Store user's name
});

const Task = mongoose.model('Task', TaskSchema);

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.session.token;
  if (!token) return res.redirect('/login');
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.redirect('/login');
    req.user = { id: decoded.id, name: decoded.name, role: decoded.role };
    next();
  });  
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.redirect('/');
  next();
};

// Routes
app.get('/', authenticateToken, async (req, res) => {
  const { status, search, sort } = req.query;
  let query = { userId: req.user.id };

  if (status) query.status = status;
  if (search) query.title = new RegExp(search, 'i');

  const sortOrder = sort || 'desc'; // Default to 'desc' if not provided
  const sortOption = sortOrder === 'desc' ? -1 : 1;

  const tasks = await Task.find(query).sort({ createdAt: sortOption });

  res.render('index', { user: req.user, tasks, csrfToken: req.csrfToken(), sortOrder });
});
app.get('/', authenticateToken, async (req, res) => {
  const { status, search, sort } = req.query;
  let query = { userId: req.user.id };

  if (status) query.status = status;
  if (search) query.title = new RegExp(search, 'i');

  const sortOrder = sort || 'desc'; // Default to 'desc' if not provided
  const sortOption = sortOrder === 'desc' ? -1 : 1;

  const tasks = await Task.find(query).sort({ createdAt: sortOption });

  res.render('index', { user: req.user, tasks, csrfToken: req.csrfToken(), sortOrder });
});
app.get('/', authenticateToken, async (req, res) => {
  const { status, search, sort } = req.query;
  let query = { userId: req.user.id };

  if (status) query.status = status;
  if (search) query.title = new RegExp(search, 'i');

  const sortOrder = sort || 'desc'; // Default to 'desc' if not provided
  const sortOption = sortOrder === 'desc' ? -1 : 1;

  const tasks = await Task.find(query).sort({ createdAt: sortOption });

  res.render('index', { user: req.user, tasks, csrfToken: req.csrfToken(), sortOrder });
});
app.get('/', authenticateToken, async (req, res) => {
    const { status, search, sort } = req.query;
    let query = { userId: req.user.id };
  
    if (status) query.status = status;
    if (search) query.title = new RegExp(search, 'i');
  
    const sortOrder = sort || 'desc'; // Default to 'desc' if not provided
    const sortOption = sortOrder === 'desc' ? -1 : 1;
  
    const tasks = await Task.find(query).sort({ createdAt: sortOption });
  
    res.render('index', { user: req.user, tasks, csrfToken: req.csrfToken(), sortOrder });
  });
  

app.get('/admin', authenticateToken, isAdmin, async (req, res) => {
  const tasks = await Task.find().populate('userId', 'name');
  res.render('admin', { tasks, csrfToken: req.csrfToken() });
});

app.get('/login', (req, res) => res.render('login', { csrfToken: req.csrfToken() }));
app.get('/register', (req, res) => res.render('register', { csrfToken: req.csrfToken() }));
app.get('/tasks/new', authenticateToken, (req, res) => {
  res.render('new-task', { csrfToken: req.csrfToken() });
});

// Registration
app.post('/register', [
  check('email').isEmail(),
  check('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.render('register', { errors: errors.array(), csrfToken: req.csrfToken() });
  
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashedPassword, role });
  res.redirect('/login');
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.render('login', { error: 'Invalid credentials', csrfToken: req.csrfToken() });
  }
  const token = jwt.sign(
    { id: user._id, name: user.name, role: user.role }, 
    process.env.JWT_SECRET
  );
  req.session.token = token;
  res.redirect('/');
});

// Task Creation
app.post('/tasks', authenticateToken, async (req, res) => {
  const { title, description } = req.body;
  const task = new Task({
    title,
    description,
    userId: req.user.id,
    userName: req.user.name
  });
  await task.save();
  res.redirect('/');
});

// Mark Task as Completed
app.post('/tasks/complete/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    await Task.findByIdAndUpdate(id, { status: 'Completed' });
    res.redirect('/');
});


// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
