const bcryptjs = require("bcryptjs");

const router = require("express").Router();
const jwt = require('jsonwebtoken');
const secrets = require('./config/secrets.js');

const Users = require("../users/users-model.js");
const { isValid } = require("../users/users-service.js");

router.post("/register", (req, res) => {
  const credentials = req.body;

  if (isValid(credentials)) {

    // hash the password
    const hash = bcryptjs.hashSync(credentials.password, 10);

    credentials.password = hash;

    // save the user to the database
    Users.add(credentials)
      .then(user => {
        res.status(201).json({ data: user });
      })
      .catch(err => {
        res.status(500).json({ message: err.message });
      });
  } else {
    res.status(400).json({
      message: "please provide username and password",
    });
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (isValid(req.body)) {
    Users.findBy({ username: username })
    //why is it in this array?
      .then(([user]) => {
        // compare the password the hash stored in the database
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token =
          res.status(200).json({ message: "hey wow it worked" });
        } else {
          res.status(401).json({ message: "try again" });
        }
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message: "please provide username and password and the password shoud be alphanumeric",
    });
  }
});

module.exports = router;
