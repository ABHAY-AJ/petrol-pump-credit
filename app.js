
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require("./models/User");
const Meter = require("./models/Meter");
const Transaction = require("./models/Transaction");

const app = express();

const dbUrl = process.env.ATLASDB_URL;

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: dbUrl})
}));

app.use('/users', require('./routes/users'));
app.use('/meters', require('./routes/meters'));
app.use('/transactions', require('./routes/transactions'));

app.get('/', (req, res) => {
    res.render('index');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
