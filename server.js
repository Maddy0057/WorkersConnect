const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Proxy endpoint for images
app.get('/proxy-image', async (req, res) => {
  const { url } = req.query;
  if (!url || !url.startsWith('https://drive.google.com')) {
    return res.status(400).json({ error: 'Invalid or missing image URL' });
  }
  try {
    const response = await axios.get(url, { responseType: 'stream' });
    res.set('Content-Type', response.headers['content-type']);
    response.data.pipe(res);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

const { Worker, Request } = require('./workerSchema');

// Create a worker profile
app.post('/api/workers', async (req, res) => {
  try {
    const worker = new Worker(req.body);
    await worker.save();
    res.status(201).json({ message: 'Worker added successfully', worker });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Get a worker profile
app.get('/api/workers/:id', async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ error: 'Worker not found' });
    res.json(worker);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all worker profiles
app.get('/api/workers', async (req, res) => {
  try {
    const workers = await Worker.find(); // Fetch all workers from the database
    res.json(workers); // Respond with the worker data
  } catch (err) {
    console.error('Error fetching workers:', err);
    res.status(500).json({ error: 'Failed to fetch workers' });
  }
});

// Submit a client request
app.post('/api/service-requests', async (req, res) => {
  try {
    const { workerId, clientName, clientEmail, message } = req.body;
    
    const newRequest = new ServiceRequest({
      workerId,
      clientName,
      clientEmail,
      message
    });

    await newRequest.save();
    res.status(201).json({ message: 'Request submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit request' });
  }
});

module.exports = app;
