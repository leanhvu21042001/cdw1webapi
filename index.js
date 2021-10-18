const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { errorHandler } = require('./src/middlewares/errorHandler');
const credentials = require('./src/middlewares/credentials');
const corsOptions = require('./src/config/corsOptions');


// Create application instance
const app = express();

// write logs to a file.
const accessLogStream = fs.createWriteStream(path.join(__dirname, './src/logs', 'requestLog.log'));

// setup the logger.
app.use(morgan('combined', { stream: accessLogStream }));

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement.
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// set up for cookies middleware
app.use(cookieParser());

// routes
app.use("/api", require('./src/routes/index.routes'));

// handler errors
app.all('*', (req, res) => {
  return res.status(404).json({ mgs: "Error 404", success: false });
});

app.use(errorHandler);

const port = process.env.PORT || 3500;
app.listen(
  port,
  () => console.log(
    `http://localhost:${port}\n ------------------------`
  )
);