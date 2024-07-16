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
	// Find the total number of movies for each genre.
	const res1 = await db.collection('movies').aggregate([
		{ $unwind: '$genres' },
		{ $group: { _id: '$genres', totalMovies: { $count: {} } } },
		{ $project: { genre: '$_id', totalMovies: 1, _id: 0 } },
	]).toArray();
	console.log('res1', res1);

	// Find the average rating of movies that were released in the 1990s.
	const res2 = await db.collection('movies').aggregate([
		{ $match: { year: { $in: [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999] } } },
		{ $group: { _id: null, averageRating: { $avg: '$imdb.rating' } } },
		{ $project: { _id: 0 } }
	]).toArray();
	console.log('res2', res2);

	// Find all movies that have been rated by more than 50,000 users.
	const res3 = await db.collection('movies').find({ 'imdb.votes': { $gte: 50000 } }, { projection: { _id: 1, name: 1, imdb: 1 } }).toArray();
	console.log('res3', res3);

	// Find the distribution of movie runtimes (e.g., <90 mins, 90-120 mins, >120 mins).
	const res4 = await db.collection('movies').aggregate([
		{
			$project: {
				distribution: {
					$cond: { if: { $lt: ['$runtime', 90] }, then: '<90 mins', else: { $cond: { if: { $gt: ['$runtime', 120] }, then: '>120 mins', else: '90-120 mins' } } }
				},
				_id: 1,
				runtime: 1,
				name: 1,
			}
		},
	]).toArray();
	console.log('res4', res4);

	return res.send('Completed');
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
