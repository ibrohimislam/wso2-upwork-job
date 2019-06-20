const express = require('express');
const cors = require('cors')
const port = 3000;

var app = express()
app.use(cors())

const args = process.argv.slice(2)

app.get('/', (req, res) => res.json({ test: args[0] }));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
