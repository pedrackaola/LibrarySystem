const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require('../modules/db')
const session = require("express-session");

router.get("/register", async (req, res) => {
    res.render("register.ejs")
  });

  router.post("/register", async (req, res) => {
    const { name, email, password1, password2 } = req.body;
  
    try {
      const users = await db.query("SELECT email FROM users");
      const userss = users.rows;
      const existingUser = userss.find(user => user.email === email);
  
      if (existingUser) {
        res.send("Email already exists.");
      } else if (email.length < 4) {
        res.send("Email must be greater than 3 characters.");
      } else if (name.length < 2) {
        res.send("Name must be greater than 1 character.");
      } else if (password1 !== password2) {
        res.send("Passwords don't match.");
      } else if (password1.length < 4) {
        res.send("Password must be at least 4 characters.");
      } else {
        const hashedPassword = await bcrypt.hash(password1, 10);
  
        await db.query(
          "INSERT INTO users (name, email, password1) VALUES ($1, $2, $3)",
          [name, email, hashedPassword]
        );
  
        const returnTo = req.session.returnTo || "/";
        delete req.session.returnTo;
        res.redirect(returnTo);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      res.send(`Error during signup: ${error.message}`);
    }
  });
  
  
  router.get("/login", async (req, res) => {
    res.render("login.ejs")
  });
  
  
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
      const user = result.rows[0];
      
      if (!user || !(await bcrypt.compare(password, user.password1))) {
        res.status(401).send("Invalid email or password.");
        return;
      }
  
      // Authentication successful
      req.session.loggedIn = true;
      req.session.userId = user.id;
  
      // Redirect the user to the stored URL or "/logged"
      const returnTo =  "/logged";
      res.redirect(returnTo);
  
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).send("Error during login.");
    }
  });
  
  
  
  router.get("/user", async (req, res) => {
    try {
      if (req.session.loggedIn) {
        const result = await db.query("SELECT * FROM users WHERE id = $1", [req.session.userId]);
        const userData = result.rows[0];
  
        if (userData) {
          res.render("user.ejs", { loggedIn: true, user: userData });
        } else {
          res.send("User data not found.");
        }
      } else {
        console.log('The user is not logged in');
        res.redirect('/login');
      }
    } catch (error) {
      console.error("Error during fetching user data:", error);
      res.send("Error during fetching user data.");
    }
  });
  
  router.get("/user/:id/settings", async (req, res) => {
    const userId = req.params.id;
  
    try {
      const result = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
      const userData = result.rows[0];
  
      if (userData) {
        res.render("settings.ejs", { user: userData });
      } else {
        console.log('User not found.');
        res.status(404).send('User not found.');
      }
    } catch (error) {
      console.error("Error during fetching user data:", error);
      res.status(500).send('Internal Server Error');
    }
  });
  router.post("/user/:id/settings", async (req, res) => {
    const userId = req.params.id;
    const { fav_gen, fav_author, fav_book, gender, age } = req.body;
  
    try {
      const result = await db.query(
        "UPDATE users SET fav_gen = $1, fav_author = $2, fav_book = $3, gender = $4, age = $5 WHERE id = $6",
        [fav_gen, fav_author, fav_book, gender, age, userId]
      );
      
      if (result.rowCount > 0) {
        res.redirect("/user");
      } else {
        console.log('User not found or no changes were made.');
        res.status(404).send('User not found or no changes were made.');
      }
    } catch (error) {
      console.error("Error during updating user data:", error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  
  router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error during logout:", err);
      }
      res.redirect("/");
    });
  });
  


  module.exports = router;