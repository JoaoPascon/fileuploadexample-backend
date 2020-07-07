
require('dotenv').config()

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const port = 3000;

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'))

// para liberar o acesso a recursos estaticos
app.use('/files', 
        express.static(path.resolve(__dirname, '..' , 'tmp', 'uploads'))
)

/* Database Connection */
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true
})

app.use(require('./routes'));

app.listen(process.env.PORT || port, () => {
    console.log(`Serve on, in port ${port}`);
});