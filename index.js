// import http from 'http';
import express from 'express';
import cors from 'cors';
import { logger } from './loggerMiddleware.js';

const app = express();

app.use(cors()) //CORS
app.use(express.json()); 

app.use(logger) //middleware

let notes = [
	{
		'id': 1,
		'content': 'Nota numero 1',
		'date': '2021-05-30T17:30:31.098Z',
		'important': true,
	},
	{
		id: 2,
		content: 'Nota numero 2',
		date: '2021-05-30T17:10:21.098Z',
		important: false,
	},
	{
		id: 3,
		content: 'Nota numero 3',
		date: '2021-05-30T17:30:21.098Z',
		important: true,
	},
];

app.get('/api/notes', (req, res) => {
	res.json(notes);
});

app.get('/api/notes/:id', (req, res) => {
	const id = Number(req.params.id);
	const note = notes.find((note) => note.id === id);
	note ? res.json(note) : res.status(404).end();
});

app.post('/api/notes', (req, res) => {
	const note = req.body;
	if (!note || !note.content) {
		return res.status(400).json({
			error: 'note.content is missing',
		});
	}

	const ids = notes.map((note) => note.id);
	const maxId = Math.max(...ids);

	const newNote = {
		id: maxId + 1,
		content: note.content,
		important: typeof note.important !== 'undefined' ? note.important : false,
		date: new Date().toISOString(),
	};
	notes = [...notes, newNote];

	res.status(201).json(newNote);
});



app.delete('/api/notes/:id', (req, res) => {
	const id = Number(req.params.id);
	notes = notes.filter((note) => note.id !== id);
	res.status(204).end();
});

app.get('/', (req, res) => {
	res.send('<h1>API</h1>');
});

app.use((req, res) => {
	res.status(404).json({
		error: 'Not found'
	})
})

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
