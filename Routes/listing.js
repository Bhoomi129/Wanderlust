const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const { populate } = require("../models/Reviews.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage }); //for parsing multipart/form-data, which is primarily used for uploading files.

//combines index and create route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, validateListing, upload.single("listing[image]"), wrapAsync(listingController.createNewListing));

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//search route
router.get("/search", wrapAsync(listingController.searchListings));

//show route + update route + delete route
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;