var express = require('express');
var bcrypt = require('bcryptjs');
var randomstring = require("randomstring");
var get_ip = require('ipware')().get_ip;

var nodemailer = require('nodemailer');

var router = express.Router();

const transporter = nodemailer.createTransport({
  servie: 'smtp.gmail.com',
  secure: false,
  port: 587,
  auth: {
    user: 'mishan2512@gmail.com',
    pass: 'gdnyoastdlrywynk'
  },
  tls: {
    rejectUnauthorized: false
  }
});


/* GET home page. */
// '/' router is for go to index/login page
router.get('/', (req, res, next) => {
  if (req.session.user_id) {
    if (req.session.roll_id == 1) {
      res.redirect('/dashboard');
    } else if (req.session.roll_id == 2) {
      // res.send('this is retailer');
      // res.render('pages/x.ejs');
      res.redirect('/saller');

    } else if (req.session.roll_id == 3) {
      res.redirect('/store');
      // res.render('pages/customers/index.ejs');
    }
  } else {
    res.render('pages/index.ejs', { title: 'login' });
  }
});

// this is for go to index/login page
router.get('/login', (req, res, next) => {
  if (req.session.user_id) {
    if (req.session.roll_id == 1) {
      res.redirect('/dashboard');
    } else if (req.session.roll_id == 2) {
      // res.send('this is retailer');
      // res.render('pages/x.ejs');
      res.redirect('/saller');

    } else if (req.session.roll_id == 3) {
      res.redirect('/store');
      // res.render('pages/customers/index.ejs');
    }
  } else {
    var ip_info = get_ip(req);
    console.log(ip_info);
    // { clientIp: '127.0.0.1', clientIpRoutable: false }
    res.render('pages/index.ejs', { title: 'login' });
  }
   
  // res.send('index');
});

// this is for check login
router.post('/login', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = [];
  // console.log(email);
  // console.log(password);
  //  check validation
  if (!email || !password) {
    errors.push({
      msg: 'Invalid Email or Password'
    });
  }

  if (errors.length > 0) {
    res.render('pages/index.ejs', {
      errors,
      email,
      password
    });
  } else {
    var sql = `SELECT * From users WHERE email = ?`;
    db.query(sql, [email], (err, results) => {
      // console.log(results.id);
      if (err) throw err;
      if (typeof results !== 'undefined' && results.length > 0) {
        var db_pass = null;
        results.forEach(element => {
          // console.log('this is for : '+element.password);
          db_pass = element.password;
          session_id = element.id;
          session_email = element.email;
          session_roll_id = element.roll_id;
        });

        bcrypt.compare(password, db_pass, (err, isMatch) => {
          // console.log(isMatch);
          if (isMatch) {
            req.session.user_id = session_id;
            req.session.user_email = session_email;
            req.session.roll_id = session_roll_id;
            // console.log(req.session.user_id);
            // console.log(req.session.user_email);
            // console.log(req.session.roll_id);
            if (req.session.roll_id == 1) {
              res.redirect('/dashboard');
            } else if (req.session.roll_id == 2) {
              // res.send('this is retailer');
              // res.render('pages/x.ejs');
              res.redirect('/saller');

            } else if (req.session.roll_id == 3) {
              res.redirect('/store');
              // res.render('pages/customers/index.ejs');
            }
          } else {
            errors.push({
              msg: 'Password Is Wrong !'
            });
            if (errors.length > 0) {
              res.render('pages/index.ejs', {
                errors,
                email,
                password
              });
            }
          } //else
        });
      } else {
        errors.push({
          msg: 'Email Do Not Found, Kindle Register'
        });
        if (errors.length > 0) {
          res.render('pages/index.ejs', {
            errors,
            email,
            password
          });
        }
      } //else end
    });
  }
  // res.render('pages/index', { title: 'Express' });
});

// this is for register new user
router.get('/register', (req, res, next) => {
  res.render('pages/register.ejs', { title: 'register' });
  // res.send('index');
});

// this is for register new user
router.post('/register', (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const password1 = req.body.password1;
  const user_token = randomstring.generate(42);
  // console.log(name);
  // console.log(email);
  // console.log(password);
  // console.log(password1);
  // console.log(user_token);
  const errors = [];

  //  check validation
  if (!name || !email || !password || !password1) {
    errors.push({
      msg: 'Please fill all field'
    });
  }

  // check password match
  if (password !== password1) {
    errors.push({
      msg: 'Password do not match'
    });
  }

  // check pass length
  if (password.length < 6) {
    errors.push({
      msg: 'Password should be at least 6 characters'
    });
  }

  if (errors.length > 0) {
    res.render('pages/register', {
      errors,
      name,
      email,
      password,
      password1
    });
  } else {
    // query to check user is already register or not
    var sql = `SELECT * FROM users WHERE email = '${email}'`;
    db.query(sql, (err, results) => {
      // handle err
      if (err) throw err;
      // check user is already in data base or not
      if (typeof results !== 'undefined' && results.length > 0) {
        errors.push({
          msg: 'Email is allready taken'
        });
        res.render('pages/register', {
          errors,
          name,
          email,
          password,
          password1
        });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;

            // set pass to hash
            // query to insert user
            var sql = "INSERT INTO users (name, email, password, token) VALUES (?,?,?,?)";
            // var sql = "INSERT INTO users (name, email, password) VALUES ("+name+","+email+","+password+")";
            // console.log(sql);
            db.query(sql, [name, email, hash, user_token], (err, results) => {
              // check user is created or note
              if (err) {
                console.log(err);
              } else {
                var success = [];
                success.push({
                  msg: 'Registration Success, You Can Login'
                });
                res.render('pages/register', {
                  success
                });
              } //else end
            });

          })
        })
      } //else end
    });
  } //else end

}); //route end

// this is for log out
router.get('/logout', (req, res, next) => {
  // by destroying session, it log out
  req.session.destroy((err) => {
    res.redirect('/');
  });
});


// forgote password
router.get('/forgot', (req, res, next) => {
  res.render('pages/forgot.ejs');
});

// check mail is exist if yes send reset link 
router.post('/forgot', (req, res, next) => {
  const email = req.body.email;
  const errors = [];
  // res.send(email);
  // console.log(email);
  // check email is empty or note
  if (!email) {
    errors.push({
      msg: 'Please Enter Email'
    });
  }

  if (email) {
    var sql = `SELECT * FROM users WHERE email = '${email}'`;
    // console.log(sql);
    db.query(sql, (err, results) => {
      // error handling
      if (err) throw err;
      // if email is not available in db
      // console.log(results);
      if (typeof results !== 'undefined' && results.length > 0) {
        // res.send('Reset Link Is Success Fully Sended');

        results.forEach(element => {
          const link = __dirname + "/resetpass/?token=" + element.token + "&id=" + element.id;
          console.log(link);
          // res.send(element.id+" / "+element.email+" / "+element.token)
          const HalperOption = {
            from: '"Mishan Goti <mishan2512@gmail.com>"',
            to: 'mishan2512@gmail.com',
            subject: 'node js test for reset link',
            text: 'Password Reset Link : ' + link
          };

          transporter.sendMail(HalperOption, (err, info) => {
            if (err) {
              console.log(err);
            } else {
              console.log('mail sended');
            }
          });
          res.send('done');
        });
      } else {
        errors.push({
          msg: 'Email In Not Available In Our Database'
        });
        res.render('pages/forgot.ejs', {
          errors,
          email
        });
      }
    });
  }

  if (errors.length > 0) {
    res.render('pages/forgot.ejs', {
      errors
    });
  } else {
    req.send('email is sended');
  }

});

module.exports = router;
