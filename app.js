const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // To parse JSON data
app.use(express.static("public")); // Serve static files (HTML, CSS, JS)

// Serve the registration form (HTML page)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle the form submission (POST /register)
app.post("/register", async (req, res) => {
  const userData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
  };

  try {
    // Make a POST request to API Gateway (Lambda function)
    const response = await axios.post(
      "https://uxavlf7m43.execute-api.eu-north-1.amazonaws.com/prod/register", // Replace with your API Gateway URL
      userData,
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.status === 200) {
      res.send("Registration successful!");
    } else {
      res.status(500).send("Failed to register user.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error submitting registration.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
