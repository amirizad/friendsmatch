module.exports = (app,path) => {
	var fs = require('fs');
	app.get('/api/questions', (req,res) => {
		fs.readFile('./app/data/questions.json', 'utf8', (err, data) => {
				if(err){console.log(err)};
				return res.json(data);
		});
	});
	app.get('/api/friends', (req,res) => {
		fs.readFile('./app/data/friends.json', 'utf8', (err, data) => {
				if(err){console.log(err)};
				data = JSON.parse(data);
				return res.json(data);
		});
	});
	app.get('/api/clear', (req,res) => {
		fs.writeFile('./app/data/friends.json', '[]', (err) => {
			if (err) throw err;
			console.log('The file content has been deleted!');
			return res.send('The existing friends list has been deleted!');
		});
	});
	app.post('/api/friends', (req,res) => {
		var user = req.body,
				scores = user.scores,
				diff = 50,
				match = 0,
				comScores = [];
		fs.readFile('./app/data/friends.json', 'utf8', (err, data) => {
			if(err){console.log(err)};
			var list = JSON.parse(data);
			var newData = list.concat(user);
			fs.writeFile('./app/data/friends.json', JSON.stringify(newData), (err) => {
				if (err) throw err;
				console.log('The friends list updated!');
			});

			for ( i = 0 ; i < list.length ; i++ ){
				comScores = list[i].scores;
				var compare = 0;
				for ( j = 0 ; j < comScores.length ; j++){
					compare += Math.abs(comScores[j] - scores[j]);
				};
				if ( compare < diff ){
					diff = compare;
					match = i;
				}
			};

			var match = {
						name: list[match].name,
						email: list[match].email,
						photo: list[match].photo,
					};
			return res.json(match);
		});
	});
};