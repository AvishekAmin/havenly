const mongoose = require("mongoose");

if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({
    accessToken: mapToken,
});

const initData = require("./data.js");
const Listing = require("../models/listing.js");
const dbUrl = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}

const initDB = async () => {
    await Listing.deleteMany({});

    for (let obj of initData.data) {
        let response = await geocodingClient
            .forwardGeocode({
                query: obj.location,
                limit: 1,
            })
            .send();
        obj.owner = "6a114ca740e5b59b5d582da6";
        obj.geometry = response.body.features[0].geometry;
    }
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB();