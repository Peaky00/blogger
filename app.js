const express = require('express');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

// Initialize Passport
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // For displaying flash messages

app.get('/', (req, res) => {
    res.render('home', { layout: 'layouts/main' });
  });
// Set up a simple route
app.get('/', (req, res) => {
  res.send('Hello, world!'); // Send a simple response
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
