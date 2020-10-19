var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require('mongoose'),
    Gadget         = require("./models/gadgets"),
	seedDB         = require("./seeds"),
	Comment        = require("./models/comment"),
	passport       = require("passport"),
	LocalStrategy  = require("passport-local"),
	User           = require("./models/user"),
	methodOverride = require("method-override"),
	flash          = require("connect-flash");

// required routes
var commentRoutes    = require("./routes/comments"),
	gadgetRoutes = require("./routes/gadgets"),
	indexRoutes      = require("./routes/index");

mongoose.connect('mongodb+srv://devesh_1011:Chaturvedi@123@cluster0.gem31.mongodb.net/<dbname>?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// mongoose.connect('mongodb://localhost/gadgets', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

//Gadget.create({name:"Rishikesh", image:"https://images.unsplash.com/photo-1497501917125-1d703ac4a255?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60", description:"nikal lawde"});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(indexRoutes);
app.use("/gadgets/:id/comments", commentRoutes);
app.use("/gadgets", gadgetRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
	console.log("The Technofony Server has Started");
});