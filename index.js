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
	// // All Movies in the year 2000
	// const res1 = await db.collection('movies').find({ year: 2000 }).toArray();
    // console.log('res1', res1);

	// // Comments by johndoe@example.com
	// const res2 = await db.collection('comments').find({ email: 'johndoe@example.com' }).toArray();
    // console.log('res2', res2);

	// // Find the first 10 theaters in the database
	// const res3 = await db.collection('theaters').find({},{ limit: 10 }).toArray();
    // console.log('res3', res3);

	// // Find the first 10 theaters in the database
	// const res4 = await db.collection('users').find({ name: 'Alice' }).toArray();
	// console.log('res4', res4);

	// // Find all movies that have "Comedy" as one of their genres.
	// const res5 = await db.collection('movies').find({ genres: 'Comedy' }).toArray();
	// console.log('res5', res5);

	// const res6 = await db.collection('comments').find({ movie_id: '573a1390f29313caabcd42e8' }).toArray();
	// console.log('res6', res6);

	// const res7 = await db.collection('theaters').find({ 'location.address.city': 'New York' }).toArray();
	// console.log('res7', res7);

	// const res8 = await db.collection('movies').find({ directors: 'Christopher Nolan' }).toArray();
	// console.log('res8', res8);

	// Find the top 5 movies with the highest IMDb rating.
	const res9 = await db.collection('movies').aggregate([
		{ $match: {'imdb.rating': { $ne: '' } } },
		{ $project: { _id: 1, imdb: 1 } },
		{ $sort: { 'imdb.rating': -1 } },
		{ $limit: 5 }
	]).toArray();
	console.log('res9', res9);

	// Find the total number of comments for each movie.
	const res10 = await db.collection('comments').aggregate([
		{ $group: { _id: '$movie_id', numberOfComments: { $count: {} } } },
		{ $project: { _id: 1, numberOfComments: 1 } },
		{ $sort: { numberOfComments: -1 } }
	]).toArray();
	console.log('res10', res10);

	// Find the average runtime of movies for each genre.
	const res11 = await db.collection('movies').aggregate([
		{ $unwind: '$genres' },
		{ $group: { _id: '$genres', averageRun: { $avg: '$runtime' }} },
		{ $project: { _id: 1, averageRun: 1 } },
		{ $sort: { averageRun: -1 } }
	]).toArray();
	console.log('res11', res11);

	const res12 = await db.collection('movies').aggregate([
		{ $group: { _id: '$year', moviesReleased: { $count: {} } } },
		{ $project: { year: '$_id', moviesReleased: 1, _id: 0 } },
		{ $sort: { year: -1 } },
	]).toArray();
	console.log('res12', res12);

	return res.send('Completed');
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
