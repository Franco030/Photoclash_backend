const express = require('express');
const app = express();
app.all('*', (req, res) => res.json(req.headers));
app.listen(3001, () => console.log('Listening on 3001'));
