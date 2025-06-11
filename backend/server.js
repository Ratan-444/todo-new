const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app  =  express();
app.use(cors());
app.use(express.json());


mongoose.connect("mongodb://localhost:27017/basic_four",{
  useNewUrlParser: true,
}).then(() => console.log('mongoose connected'));


const movieSchema = new mongoose.Schema({
  title: String,
  poster: String,
  overview: String,
  rating: Number,
});

 const Movie = mongoose.model('Movie',movieSchema);

 app.get('/api/movies', async(req,res) => {
  await  Movie.insertMany([

{
      title: "The Shawshank Redemption",
      poster: "https://i.imgur.com/SuW2ZlC.jpg",
      overview: "Two imprisoned men bond over a number of years...",
      rating: 9.3,
    },
    {
      title: "The Godfather",
      poster: "https://i.imgur.com/Uzvny9I.jpg",
      overview: "The aging patriarch of an organized crime dynasty...",
      rating: 9.2,
    },
    {
      title: "The Dark Knight",
      poster: "https://i.imgur.com/3jLPB46.jpg",
      overview: "When the menace known as the Joker wreaks havoc...",
      rating: 9.0,
    },
    {
      title: "12 Angry Men",
      poster: "https://i.imgur.com/1H2ZVYf.jpg",
      overview: "A jury holdout attempts to prevent a miscarriage of justice...",
      rating: 8.9,
    },
    {
      title: "Schindler's List",
      poster: "https://i.imgur.com/IWZJOmu.jpg",
      overview: "In German-occupied Poland during World War II...",
      rating: 8.9,
    },
    {
      title: "Pulp Fiction",
      poster: "https://i.imgur.com/8UZ0hSx.jpg",
      overview: "The lives of two mob hitmen, a boxer, and others...",
      rating: 8.9,
    },
    {
      title: "The Lord of the Rings",
      poster: "https://i.imgur.com/9ZfA6z2.jpg",
      overview: "A meek Hobbit and eight companions set out on a journey...",
      rating: 8.8,
    },
    {
      title: "Fight Club",
      poster: "https://i.imgur.com/2l5ks3k.jpg",
      overview: "An insomniac office worker and a devil-may-care soapmaker...",
      rating: 8.8,
    },
    {
      title: "Forrest Gump",
      poster: "https://i.imgur.com/uU7vADh.jpg",
      overview: "The presidencies of Kennedy and Johnson, Vietnam...",
      rating: 8.8,
    },
    {
      title: "Inception",
      poster: "https://i.imgur.com/oNxDCkF.jpg",
      overview: "A thief who steals corporate secrets through dream-sharing...",
      rating: 8.7,
    },

  ]);
  res.send("Inseerted Top 10 movies");

 });

 app.get("/movies",  async (req,res) => {
    const movies = await Movie.find({});
  res.json(movies);

 });
PORT = process.env.PORT || 5000;

 app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));




















/** require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/todos', require('./routes/todos'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));*/
