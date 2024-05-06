// server.js
const express = require('express');
const app = express();
const fs = require('fs');
const filePath = 'db.json';
const cors = require('cors');
app.use(cors());
app.use(express.json());
// Define a route
app.post('/task', (req, res) => {
   let newTask =  ",\n" + JSON.stringify(req.body) + "]";
   fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        res.status(500).send('Error reading file');
        return;
    }
    const content = data.slice(0, -1);

    fs.writeFile(filePath, content + newTask, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        res.status(500).send('Error writing to file');
        return;
      }
      console.log('Data written to file successfully!');
      res.status(200);
    });
});
    
});
app.get('/task', (req,res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        res.status(500).send('Error reading file');
        return;
    }

    // Parse the file contents (assuming it contains valid JSON)
    const jsonData = JSON.parse(data);

    // Send the JSON data as the response
    res.json(jsonData);
});
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});