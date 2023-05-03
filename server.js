// // Import necessary modules and files
// const express = require('express');
// const path = require('path');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');

// // Create an Express app
// const app = express();

// // Set up body-parser middleware to parse request bodies
// app.use(bodyParser.urlencoded({ extended: true }));

// // Set up static directory for serving static files like CSS and JS
// app.use(express.static(path.join(__dirname, 'public')));

// // Connect to MongoDB
// mongoose.connect('mongodb+srv://weldios:weldios@cluster0.pit02xd.mongodb.net/?retryWrites=true&w=majority',
//     {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     })
//     .then(() => {
//         console.log('Connected to MongoDB');
//     })
//     .catch((err) => {
//         console.log('Failed to connect to MongoDB', err);
//     });

// // Define route for the login page
// // app.get('/login', (req, res) => {
// //     res.sendFile(path.join(__dirname, 'views', 'login.html'));
// // });

// app.get('/login', function (req, res) {
//     res.sendFile(path.join(__dirname, 'login.html'));
// });

// // Define route for the signup page
// app.get('/signup', (req, res) => {
//     res.sendFile(path.join(__dirname, 'signup.html'));
// });


// // Define route for handling form submission when user logs in
// app.post('/login', (req, res) => {
//     const { matricNumber, password } = req.body;

//     // Handle login logic here
//     // Check if matricNumber and password match records in the database
//     // If they match, create a session for the user and redirect to dashboard page
//     // If they don't match, display an error message and redirect to login page
// });

// // Define route for handling form submission when user signs up
// app.post('/signup', (req, res) => {
//     const { name, matricNumber, email, password } = req.body;

//     // Handle signup logic here
//     // Check if matricNumber or email already exist in the database
//     // If they don't exist, create a new user record in the database and redirect to login page
//     // If they already exist, display an error message and redirect to signup page
// });

// // Start the server
// app.listen(3000, () => {
//     console.log('Server started on port 3000');
// });



const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
//const mongoose = require('mongoose');
const PORT = 3000;

const app = express();

// Connect to MongoDB database
// mongoose.connect('mongodb://localhost/weldios e-library', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(err => console.error('Could not connect to MongoDB', err));

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://weldios:weldios@cluster0.pit02xd.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log('Failed to connect to MongoDB', err);
    });


// Define user schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    matricNumber: String,
    password: String
});

// Define user model
const User = mongoose.model('User', userSchema);

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Route for sign up page
app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

// Route for handling sign up form submission
app.post('/signup', async (req, res) => {
    try {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create new user
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            matricNumber: req.body.matricNumber,
            password: hashedPassword
        });

        // Save user to database
        await user.save();

        res.send('Sign up successful');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

// Route for login page
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

// Route for handling login form submission
app.post('/login', async (req, res) => {
    try {
        // Find user by matric number
        const user = await User.findOne({ matricNumber: req.body.matricNumber });
        if (!user) return res.status(400).send('Invalid matric number or password');

        // Check password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).send('Invalid matric number or password');

        res.send('Login successful');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
    //Route to redirect the user to the dashboard//
    app.post('/login', function (req, res) {
        // check user's credentials
        // if credentials are valid
        res.redirect('views/book/dashboard.ejs'); // redirect to dashboard page
    });
});

// //Route to redirect the user to the dashboard//
// app.post('/login', function (req, res) {
//     // check user's credentials
//     // if credentials are valid
//     res.redirect('views/book/dashboard.ejs'); // redirect to dashboard page
// });


app.get('/books/:id', function (req, res) {
    Book.findById(req.params.id, function (err, book) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            res.render('book/show', { book: book });
        }
    });
});

// Import the Book model
const Book = require('./models/book');

// Handle the POST request to add a new book
app.post('/books/new', (req, res) => {
    // Extract the book details from the request body
    const { title, author, isbn, url, category } = req.body;

    // Create a new Book instance with the details
    const book = new Book({
        title,
        author,
        isbn,
        url,
        category
    });

    // Save the book to the database
    book.save((err) => {
        if (err) {
            console.error(err);
            res.redirect('/books/new');
        } else {
            res.redirect('/books');
        }
    });
});

// Start server
app.listen(3000, () => console.log('Server started'));

"C:\Users\Lenovo x280\WELDIOS E-LIBRARY"