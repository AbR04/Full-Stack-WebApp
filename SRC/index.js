const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const bodyParser = require('body-parser'); // Added body-parser
const hbs = require("hbs");
const collection = require('./mongo');
const User = require('./mongo'); // Added import statement for User model


app.use(session({
    secret: 'your secret key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: !true } // `secure: true` only if you're using HTTPS
}));


const folder = path.join(__dirname, './MedServices');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false })); // Added body-parser configuration
app.use(bodyParser.json());


app.set('view engine', "hbs");
app.set("views", folder);

app.get("/", (req, res)=>{
    res.render('LandingPage');
});

app.get('/SignUpPage', (req, res) => {
    res.render('SignUpPage');
});

app.get('/success', (req, res) => {
    res.render('success');
});

app.get('/success1', (req, res) => {
    res.render('success1');
});

app.get('/hospitals_unsigned', (req, res) => {
    res.render('hospitals_unsigned'); 
});

app.get('/login', (req, res) => {
    res.render('LoginPage'); // Assuming 'LoginPage.hbs' is your Handlebars template for login
});

app.get('/Readmore1_u', (req, res) => {
    res.render('Readmore1_u'); // Assuming 'LoginPage.hbs' is your Handlebars template for login
});
app.get('/Readmore2_u', (req, res) => {
    res.render('Readmore2_u'); // Assuming 'LoginPage.hbs' is your Handlebars template for login
});
app.get('/Readmore3_u', (req, res) => {
    res.render('Readmore3_u'); // Assuming 'LoginPage.hbs' is your Handlebars template for login
});

app.get('/Readmore1_s', (req, res) => {
    res.render('Readmore1_s'); // Assuming 'LoginPage.hbs' is your Handlebars template for login
});
app.get('/Readmore2_s', (req, res) => {
    res.render('Readmore2_s'); // Assuming 'LoginPage.hbs' is your Handlebars template for login
});
app.get('/Readmore3_s', (req, res) => {
    res.render('Readmore3_s'); // Assuming 'LoginPage.hbs' is your Handlebars template for login
});

app.get('/SignedInPage', (req, res) => {
    res.render('SignedInPage');
});

// app.get('/schedule', (req, res) => {
//     res.render('schedule');
// });

// app.get('/profile', (req, res) => {
//     res.render('profile'); // Assuming 'LoginPage.hbs' is your Handlebars template for login
// });


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });

        if (user) {
            // Set user ID in the session
            req.session.userId = user._id;
            console.log("User ID in session:", req.session.userId);
            console.log("User data:", user);
            res.redirect('/success');
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).send("Error finding user");
    }
});



app.get('/profile', async (req, res) => {
    console.log("Accessing profile page");

    try {
        // Check if the user is logged in by verifying their session ID
        if (req.session.userId) {
            // Fetch user data using the stored user ID
            const user = await User.findById(req.session.userId);

            if (user) {
                console.log("User data:", user);
                res.render('profile', { user: user });
            } else {
                console.log("User not found");
                res.redirect('/login');
            }
        } else {
            console.log("No user in session");
            res.redirect('/login');
        }
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).send("Error finding user");
    }
});

app.get('/appointment', async (req, res) => {
    console.log("Accessing profile page");

    try {
        // Check if the user is logged in by verifying their session ID
        if (req.session.userId) {
            // Fetch user data using the stored user ID
            const user = await User.findById(req.session.userId);

            if (user) {
                console.log("User data:", user);
                res.render('appointment', { user: user });
            } else {
                console.log("User not found");
                res.redirect('/login');
            }
        } else {
            console.log("No user in session");
            res.redirect('/login');
        }
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).send("Error finding user");
    }
});

app.get('/hospitals_signed', async (req, res) => {
    console.log("Accessing profile page");

    try {
        // Check if the user is logged in by verifying their session ID
        if (req.session.userId) {
            // Fetch user data using the stored user ID
            const user = await User.findById(req.session.userId);

            if (user) {
                console.log("User data:", user);
                res.render('hospitals_signed', { user: user });
            } else {
                console.log("User not found");
                res.redirect('/login');
            }
        } else {
            console.log("No user in session");
            res.redirect('/login');
        }
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).send("Error finding user");
    }
});

app.get('/schedule', async (req, res) => {
    console.log("Accessing report page");

    try {
        // Check if the user is logged in by verifying their session ID
        if (req.session.userId) {
            // Fetch user data using the stored user ID
            const user = await User.findById(req.session.userId);

            if (user) {
                console.log("User data:", user);
                res.render('schedule', { user: user });
            } else {
                console.log("User not found");
                res.redirect('/login');
            }
        } else {
            console.log("No user in session");
            res.redirect('/login');
        }
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).send("Error finding user");
    }
});




app.post('/signup', async (req, res) => {
    console.log(req.body);
    try {
        const data = {
            name: req.body.name,
            password: req.body.password,
            mobile: req.body.mobile,
            email: req.body.email,
            dob: req.body.dob,
            gender: req.body.gender,
            nationality: req.body.nationality,
            confirmPassword: req.body.confirmPassword
        };
    
        const result = await collection.create(data); // Fixed variable names here
        console.log("Inserted:", result);
        res.render('success');
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).send("Error inserting data");
    }
});

app.listen(5000, () => {
    console.log("Port id 5000 and its connected");
});
