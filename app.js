// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');
const routes = require('./routes');
const db = require('./db');
const logger = require('./logger');

// Initialize the Express app
const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to the database
db.connect()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

// Set up routes
app.use('/api', routes);

// SSL certificates
const sslOptions = {
  key: fs.readFileSync('/path/to/your/private.key'),
  cert: fs.readFileSync('/path/to/your/certificate.crt')
};

// Start the HTTPS server
const PORT = process.env.PORT || 3000;
https.createServer(sslOptions, app).listen(PORT, () => {
  logger.info(`HTTPS Server is running on port ${PORT}`);
  console.log(`HTTPS Server is running on port ${PORT}`);
});