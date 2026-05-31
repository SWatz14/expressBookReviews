const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

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
public_users.get('/',async function (req, res) {
  try {
    const response = await axios.get ('http://localhost:5000/');
    res.send(JSON.stringify(response.data, null, 4));
  }catch(error){
    res.status(500).json({message:error.message});
  }
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  try{
    const response = await axios.get(`http://localhost:5000/isbn/${req.params.isbn}`);
  }catch (error) {
    res.status(500).json({message:error.message});
  }
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  try {
        const response = await axios.get(`http://localhost:5000/author/${req.params.author}`);
        res.send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  try {
        const response = await axios.get(`http://localhost:5000/title/${req.params.title}`);
        res.send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn= req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews, null, 4));
  
});

module.exports.general = public_users;
