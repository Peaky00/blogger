const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./Public/config/database'); // Assuming you've configured your database connection
const path = require('path');

const app = express();

// Middleware for parsing request body (Define this before using it)
function myMiddleware(req, res, next) {
    // Your middleware logic here
    console.log('Middleware executed');
    next(); // Don't forget to call next to pass control to the next middleware or route handler.
}

// Use the middleware in your Express app
app.use(myMiddleware);

// Define your routes and handle requests
app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up session management
const sessionStore = new SequelizeStore({
  db: sequelize,
});
app.use(
  session({
    secret: 'your-secret-key', // Replace with a secure secret key
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Set 'views' directory for your HTML files
app.set('views', path.join(__dirname, 'views'));

// Set the view engine to 'ejs' instead of 'html'
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

// Define your routes
const authRoutes = require('./controllers/authController');
const blogRoutes = require('./controllers/blogController');

app.use('/', authRoutes);
app.use('/blog', blogRoutes);

// Start the Express.js server
const PORT = process.env.PORT || 3000;
sequelize
  .sync() // Sync the database models with the actual database tables
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database synchronization error:', error);
  });
