const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the registration form HTML from public folder
app.use(express.static('public'));

// Handle form submission, forward data to API Gateway
app.post('/submit', async (req, res) => {
  const userData = req.body;
  const apiGatewayUrl = 'https://bolnp0se1m.execute-api.eu-north-1.amazonaws.com/prod'; // CHANGE THIS

  try {
    const response = await fetch(apiGatewayUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      res.send('Registration successful!');
    } else {
      res.status(500).send('Failed to register user.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error submitting registration.');
  }
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
