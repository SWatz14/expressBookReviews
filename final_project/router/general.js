const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    return users.filter(user => user.username === username).length > 0;
  }


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user. Username and password are required." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4))
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn =req.params.isbn;
  res.send(JSON.stringify(books[isbn],null, 4));
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const keys = Object.keys(books);
  const booksByAuthor = keys.filter(key=> books[key].author === author).map(key=>books[key]);

  res.send(JSON.stringify(booksByAuthor,null,4));
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const keys = Object.keys(books);
  const booksByTitle = keys.filter(key => books[key].title === title).map(key=>books[key]);

  res.send(JSON.stringify(booksByTitle,null,4));
 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn= req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews, null, 4));
  
});

module.exports.general = public_users;
