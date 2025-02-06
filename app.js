// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');
const routes = require('./routes');
const axios = require('axios');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const DATABASE_NAME = "gameDB";
const COLLECTION_NAME = "games";
const PORT = process.env.PORT;
//const cors = require('cors');

// Safety measures
app.use(express.json());  
app.use(cors());

// Connecting to MongoDB database
const connectDB = async () => {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    return client.db(DATABASE_NAME).collection(COLLECTION_NAME);
};

// Load SSL/TLS certificates
const SSL_KEY_PATH = 'ssl/server.key';
const SSL_CERT_PATH = 'ssl/server.cert';

if (fs.existsSync(SSL_KEY_PATH) && fs.existsSync(SSL_CERT_PATH)) {
    // Start HTTPS Server
    const httpsOptions = {
        key: fs.readFileSync(SSL_KEY_PATH),
        cert: fs.readFileSync(SSL_CERT_PATH),
    };

    https.createServer(httpsOptions, app).listen(PORT, () => {
        console.log(`HTTPS Server running on https://localhost:${PORT}`);
    });
} else {
    console.warn("SSL certificates not found! Running server on HTTP.");
    
    // Start HTTP Server as a fallback
    http.createServer(app).listen(PORT, () => {
        console.log(`HTTP Server running on http://localhost:${PORT}`);
    });
};
