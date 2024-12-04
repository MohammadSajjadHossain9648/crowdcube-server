const express = require('express');
const cors = require('cors');

const app = express();

const prot = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

// routes
app.get("/", (req, res) => {
    res.send("welcome to home page");
})

app.listen(port, () => {
    console.log(`Server running on port ${prot}`);
})