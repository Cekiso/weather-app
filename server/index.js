require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4545;

// Serve static files from public folder
app.use(express.static(path.join(__dirname, '../public')));

// Serve client JavaScript files
app.use('/client', express.static(path.join(__dirname, '../client')));

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});