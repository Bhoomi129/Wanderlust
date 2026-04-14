const Listing = require("./models/listing.js");
const Review = require("./models/Reviews.js");
const ExpressErrors = require("./utils/ExpressErrors.js");
const {listingSchema, reviewSchema} = require("./schema.js");

//for validation of listing data on server side
module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressErrors(400, errMsg);
    } else {
        next();
    }
}

//for validation of review data on server side
module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressErrors(400, errMsg);
    } else {
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {

        req.session.redirectUrl = req.originalUrl; 

        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;

    //authorization
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let {reviewId, id} = req.params;

    //authorization
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}