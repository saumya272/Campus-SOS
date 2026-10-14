const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (request, response) => {
  response.json({ message: 'Campus SOS server is running' });
});

app.listen(5000, () => {
  console.log('Server running at http://localhost:5000');
});