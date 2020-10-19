var express    = require("express"),
	router     = express.Router({mergeParams: true}),
	Gadget     = require("../models/gadgets"),
	Comment    = require("../models/comment"),
	middleware = require("../middleware");

// ====================
// COMMENTS ROUTES
// ====================

router.get("/new", middleware.isLoggedIn, function(req, res){
    // find gadget by id
    Gadget.findById(req.params.id, function(err, gadget){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {gadget: gadget});
        }
    })
});

router.post("/", middleware.isLoggedIn,function(req, res){
   //lookup gadget using ID
   Gadget.findById(req.params.id, function(err, gadget){
       if(err){
           console.log(err);
           res.redirect("/gadgets");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
			   comment.author.id = req.user._id;
			   comment.author.username = req.user.username;
			   comment.save();
               gadget.comments.push(comment);
               gadget.save();
               res.redirect('/gadgets/' + gadget._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to gadget
   //redirect gadget show page
});

// Comments Edit 

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if (err) {
			res.redirect("back");
		} else {
			res.render("comments/edit",{gadget_id:req.params.id, comment: foundComment});
		}
	});
});


// Comments Update

router.put("/:comment_id/", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if (err) {
			res.redirect("back");
		} else {
			res.redirect("/gadgets/" + req.params.id);
		}
	});
});

// Delete Comment

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if (err) {
			res.redirect("back");
		} else {
			req.flash("success", "Comment Deleted");
			res.redirect("/gadgets/" + req.params.id);
		}
	});
});

module.exports = router;