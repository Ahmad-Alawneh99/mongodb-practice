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

	// Find the top 5 countries that have produced the most movies.
	const res5 = await db.collection('movies').aggregate([
		{ $unwind: "$countries" },
		{ $group: { _id: '$countries', numberOfMovies: { $count: {} } } },
		{ $project: { country: '$_id', _id: 0, numberOfMovies: 1} },
		{ $sort: { numberOfMovies: -1 } },
		{ $limit: 5 }
	]).toArray();
	console.log('res5', res5);

	// Find the average number of comments per movie.
	const res6 = await db.collection('comments').aggregate([
		{ $group: { _id: '$movie_id', totalComments: { $count: {} } } },
		{ $group: { _id: null, avgComments: { $avg: '$totalComments' } } },
		{ $project: { avgComments: 1, _id: 0 } },
	]).toArray();
	console.log('res6', res6);

	// Find the most common languages spoken in the movies.
	const res7 = await db.collection('movies').aggregate([
		{ $unwind: '$languages' },
		{ $group: { _id: '$languages', countMovies: { $count: {} } } },
		{ $sort: { countMovies: -1 } },
		{ $project: { language: '$_id', _id: 0, countMovies: 1 } },
		{ $limit: 3 }
	]).toArray();
	console.log('res7', res7);

	// Find the movies that have won the most awards.
	const res8 = await db.collection('movies').find({}, {
		sort: { 'awards.wins': -1 },
		limit: 5,
		projection: { _id: 1, title: 1, awards: 1 }
	}).toArray();
	console.log('res8', res8);

	// Find the distribution of movies across different decades.
	const res9 = await db.collection('movies').aggregate([
		{ $addFields: { isNumericalYear: { $isNumber: '$year' } } },
		{ $match: { isNumericalYear: true } },
		{
			$addFields: {
				decade: {
					$subtract: [ '$year', { $mod: ['$year', 10]  } ],
				}
			}
		},
		{ $group: { _id: '$decade', movies: { $count: {} } } },
		{ $project: { decade: '$_id', movies: 1, _id: 0 } },
		{ $sort: { decade: -1 } },
	]).toArray();
	console.log('res9', res9);

	// Find all users who have commented on movies directed by "Steven Spielberg".
	const res10 = await db.collection('movies').aggregate([
		{ $match: { directors: 'Steven Spielberg' } },
		{ $lookup: {
			from: 'comments',
			localField: '_id',
			foreignField: 'movie_id',
			as: 'comments'
		} },
		{ $unwind: '$comments' },
		{ $group: { _id: '$comments.email'} },
		{ $project: { email: '$_id', _id: 0 } },
	]).toArray();
	console.log('res10', res10);
