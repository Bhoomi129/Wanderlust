const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
    .then(() => {
        console.log("connected to URL");
    })
    .catch((err) => {
        console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

const initDB = async() => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "694cd39066352267f8048810", 
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}; 

initDB(); 