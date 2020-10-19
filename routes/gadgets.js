var express    = require("express"),
	router     = express.Router(),
	Gadget = require("../models/gadgets"),
	middleware = require("../middleware");

//INDEX - show all gadgets
router.get("/", function(req, res){
    // Get all gadgets from DB
    Gadget.find({}, function(err, allGadgets){
       if(err){
           console.log(err);
       } else {
          res.render("gadgets/index",{gadgets:allGadgets});
       }
    });
});

//CREATE - add new gadget to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to gadgets array
    var name = req.body.name;
	var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
    var newGadget = {name: name, price: price, image: image, description: desc, author: author}
    // Create a new gadget and save to DB
    Gadget.create(newGadget, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to gadgets page
            res.redirect("/gadgets");
        }
    });
});

//NEW - show form to create new gadget
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("gadgets/new"); 
});

// SHOW - shows more info about one gadget
router.get("/:id", function(req, res){
    //find the gadget with provided ID
    Gadget.findById(req.params.id).populate("comments").exec(function(err, foundGadget){
        if(err){
            console.log(err);
        } else {
            //render show template with that gadget
            res.render("gadgets/show", {gadget: foundGadget});
        }
    });
});

// Edit CG

router.get("/:id/edit", middleware.checkGadgetOwnership, function(req, res) {
	Gadget.findById(req.params.id, function(err, foundGadget) {
		res.render("gadgets/edit",{gadget:foundGadget});
	});
});

// Update CG

router.put("/:id", middleware.checkGadgetOwnership, function(req, res) {
	Gadget.findByIdAndUpdate(req.params.id, req.body.gadget, function(err, updatedGadget) {
		if (err) {
			res.redirect("/gadgets")
		}
		else {
			res.redirect("/gadgets/" + req.params.id);
		}
	});
});

// Destroy CG

router.delete("/:id", middleware.checkGadgetOwnership, function(req, res) {
	Gadget.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			res.redirect("/gadgets");
		} else {
			res.redirect("/gadgets");
		}
	})
});

module.exports = router;