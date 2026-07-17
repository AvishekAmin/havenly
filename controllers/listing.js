const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const CATEGORIES = require("../constants/categories");

const heroContent = {
    Trending: {
        title: 'Trending <span class="gradient-text">Stays</span>',
        subtitle: "Discover the most popular destinations"
    },
    Rooms: {
        title: 'Luxury <span class="gradient-text">Rooms</span>',
        subtitle: "Comfortable rooms for every journey"
    },
    Cities: {
        title: 'Famous <span class="gradient-text">Cities</span>',
        subtitle: "Explore vibrant urban destinations"
    },
    Mountains: {
        title: 'Mountain <span class="gradient-text">Escapes</span>',
        subtitle: "Cabins, chalets and alpine adventures"
    },
    Castles: {
        title: 'Historic <span class="gradient-text">Castles</span>',
        subtitle: "Experience timeless royal living"
    },
    Pools: {
        title: 'Refreshing <span class="gradient-text">Pools</span>',
        subtitle: "Relax in stunning stays with private pools"
    },
    Camping: {
        title: 'Camping <span class="gradient-text">Zones</span>',
        subtitle: "Reconnect with nature under open skies"
    },
    Farms: {
        title: 'Exotic <span class="gradient-text">Farms</span>',
        subtitle: "Peaceful countryside retreats await"
    },
    Arctic: {
        title: 'Arctic <span class="gradient-text">Destinations</span>',
        subtitle: "Discover unforgettable snowy escapes"
    },
    Beach: {
        title: 'Beach <span class="gradient-text">Resorts</span>',
        subtitle: "Luxury stays by the sea"
    },
    Treehouse: {
        title: 'Cozy <span class="gradient-text">Treehouses</span>',
        subtitle: "Stay above the forest canopy"
    },
    Domes: {
        title: 'Ice <span class="gradient-text">Domes</span>',
        subtitle: "Unique dome stays beneath the stars"
    },
    Lakes: {
        title: 'Serene <span class="gradient-text">Lakes</span>',
        subtitle: "Wake up beside breathtaking waters"
    },
    Villa: {
        title: 'Luxury <span class="gradient-text">Villas</span>',
        subtitle: "Private villas for unforgettable vacations"
    },
    "Cable-Car": {
        title: 'Cable Car <span class="gradient-text">Adventures</span>',
        subtitle: "Stay near breathtaking mountain rides"
    },
    default: {
        title: 'Find Your <span class="gradient-text">Perfect Stay</span>',
        subtitle: "Discover handpicked luxury homes"
    }
};

module.exports.index = async (req, res) => {
    const selectedCategory = req.query.category || "";
    const filter = selectedCategory ? { categories: selectedCategory } : {};
    const allListings = await Listing.find(filter);
    const hero = heroContent[selectedCategory] || heroContent.default;

    res.render("listings/index", { allListings, selectedCategory, hero });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new", { CATEGORIES });
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if(!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show", { listing });
};

module.exports.createListing = async (req, res) => { 
    let response = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        })
        .send();

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing); 
    newListing.owner = req.user._id; 
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save(); 
    console.log(savedListing);
    req.flash("success", "New Listing Created!"); 
    res.redirect("/listings"); 
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace(
        "/upload",
        "/upload/w_250,h_150,c_fill"
    );
    res.render("listings/edit", { listing, originalImageUrl, CATEGORIES });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};