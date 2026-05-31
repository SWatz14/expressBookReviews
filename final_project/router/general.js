const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Check if a user with the given username already exists
const doesExist = (username) => {
    return users.filter(user => user.username === username).length > 0;
}

// Helper function to get all books using Promise
const getAllBooks = () => new Promise((resolve) => resolve(books));

// Helper function to get book by ISBN using Promise
const getBookByISBN = (isbn) => new Promise((resolve, reject) => {
    const result = books[isbn];
    result ? resolve(result) : reject("Book not found");
});

// Helper function to get books by author using Promise
const getBooksByAuthor = (author) => new Promise((resolve) => {
    const result = Object.keys(books)
        .filter(key => books[key].author === author)
        .map(key => books[key]);
    resolve(result);
});

// Helper function to get books by title using Promise
const getBooksByTitle = (title) => new Promise((resolve) => {
    const result = Object.keys(books)
        .filter(key => books[key].title === title)
        .map(key => books[key]);
    resolve(result);
});

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if user already exists
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user. Username and password are required." });
});

// Get the full list of books available in the shop using async/await with Promise
public_users.get('/', async function (req, res) {
    try {
        const allBooks = await getAllBooks();
        res.send(JSON.stringify(allBooks, null, 4));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get book details based on ISBN using async/await with Promise
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const book = await getBookByISBN(req.params.isbn);
        res.send(JSON.stringify(book, null, 4));
    } catch (error) {
        res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on author using async/await with Promise
public_users.get('/author/:author', async function (req, res) {
    try {
        const booksByAuthor = await getBooksByAuthor(req.params.author);
        res.send(JSON.stringify(booksByAuthor, null, 4));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get book details based on title using async/await with Promise
public_users.get('/title/:title', async function (req, res) {
    try {
        const booksByTitle = await getBooksByTitle(req.params.title);
        res.send(JSON.stringify(booksByTitle, null, 4));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;