var middlewareObj = {},
	Gadget  = require("../models/gadgets"),
	Comment = require("../models/comment");

middlewareObj.checkGadgetOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Gadget.findById(req.params.id, function(err, foundGadget) {
			if (err) {
				req.flash("error", "Something Went Wrong");
				res.redirect("back");
			}
			else {
				if (foundGadget.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "Permission Denied");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "Please Login First");
		res.redirect("back");
	}
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err) {
				res.redirect("back");
			}
			else {
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "Permission Denied");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "Please Login First");
		res.redirect("back");
	}
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
	req.flash("error", "Please Login First");
    res.redirect("/login");
};

module.exports = middlewareObj;