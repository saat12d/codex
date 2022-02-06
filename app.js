const app = require('express')();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const dotenv = require('dotenv')
const secure = require('express-force-https')
const mongoSanitize = require('express-mongo-sanitize')
const dotenv = require('dotenv');

const User = require('./models/user')
const PetCenter = require('./models/petCenter')

const passport = require('passport')
const LocalStrategy = require('passport-local')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const upload = require('../multer.js');
const cloudinary = require('cloudinary');
const res = require('express/lib/response');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.use(express.static(__dirname + '/assets'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(secure)
app.use(mongoSanitize())
dotenv.config()

// PASSPORT CONFIGURATION
app.set('trust proxy', 1)

app.use(session({
  secret: 'Vicky',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000, secure: true }
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.post('/')

app.listen(4000, () => {
    console.log('server running...')
})

router.post("/register", async function (req, res) {
    let newUser = new User(req.body.user);
    newUser.username = req.body.username;
    
    
    if (req.body.adminCode == "petCenter123") {
        newUser.isPetCenter = true;
    }
    
    User.register(newUser, req.body.password, async (err, user) => {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        console.log(user);
        console.log("reached here");
        passport.authenticate("local")(req, res, function () {
            console.log("reached2");
            req.flash("success", "Welcome, " + user.username);
            res.redirect("/pets");
        });
    });
});

router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/pets",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: "Welcome",
    }),
    (req, res) => { }
);

router.get("/logout", (req, res) => {
    req.logout();
    console.log("Logged you out!");
    req.flash("success", "Logged you out");
    res.redirect("/");
});

router.post('/center', upload.array('images', 4), async (req, res) => {
    console.log(req.files)
    console.log(req.body.competition)
    req.body.center.images = []
    if (req.files && req.files[0]) {
        for (const file of req.files) {
            await cloudinary.v2.uploader.upload(file.path, (err, result) => {
                req.body.center.images.push({
                    url: result.secure_url,
                    public_id: result.public_id
                })
                console.log('uploaded')
            })
        }
    }

    PetCenter.create(req.body.center, (err, center) => {
        if(err){
            console.log(err)
            res.redirect('back')
        }
        req.flash('success', 'Successfully added competition.')
        return res.redirect('/centers')
    })
})

router.post('/center',  async (req, res) => {
    let centers = await PetCenter.find({})
    res.send(centers);
})


// display - home, pet centers page, pet page, add pet, login, signup

// routes - register, login, getting pet centers,