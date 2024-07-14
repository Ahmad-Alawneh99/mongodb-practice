const express = require('express');
const mongo = require("mongodb");

// const mongoose = require('mongoose');
// const User = require('./models/User');

// const connect = async () => {
//     try {
//         await mongoose.connect('mongodb+srv://admin:7jljvDHBXDcWVA2r@practice.d5dbwkb.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=Practice');
//         console.log('connected to mongoDB');
//     } catch (error) {
//         console.log('failed to connect to mongoDB', error);
//     }
// }

// connect();

const uri = "mongodb+srv://admin:7jljvDHBXDcWVA2r@practice.d5dbwkb.mongodb.net/?retryWrites=true&w=majority&appName=Practice";

const client = new mongo.MongoClient(uri);
const db = client.db('sample_mflix');

const app = express();

const port = 3000;

app.use(express.json());

app.get('/', async (req, res, next) => {
    console.log(await db.collection('users').findOne({ _id: new mongo.ObjectId('59b99db4cfa9a34dcd7885b6') }))
	return res.send('Hello World!');
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
