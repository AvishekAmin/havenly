const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const dbUrl = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dbUrl);
}

main()
    .then(() => console.log("Connected to MongoDB for seeding categories"))
    .catch(err => console.log("DB connection error:", err));

const CATEGORIES_MAP = [
    { name: "Beach", keywords: ["beach", "ocean", "sea", "coast", "shore", "island", "beachfront", "bay", "surf", "sand", "secluded beach", "malibu", "cancun", "bali", "mykonos", "maldives", "costa rica"] },
    { name: "Lakes", keywords: ["lake", "lakefront", "kayak", "fishing", "water", "dock", "boat", "tahoe", "coorg", "lakes"] },
    { name: "Mountains", keywords: ["mountain", "alpine", "cabin", "chalet", "peak", "climb", "slope", "ski", "aspen", "verbier", "banff", "swiss alps", "himalaya", "coorg", "manali"] },
    { name: "Camping", keywords: ["camp", "tent", "glamping", "nature", "forest", "wilderness", "canopy", "outdoor", "wood", "treehouse", "parks", "secluded", "stars", "camping"] },
    { name: "Castles", keywords: ["castle", "royal", "palace", "fort", "historic", "king", "queen", "emperor", "dynasty", "chateau", "scotland", "historic castle"] },
    { name: "Pools", keywords: ["pool", "swim", "infinity pool", "jacuzzi", "spa", "soak", "refreshing", "dive", "plunge"] },
    { name: "Farms", keywords: ["farm", "barn", "cow", "horse", "countryside", "rustic", "pasture", "meadow", "vineyard", "harvest", "cottage", "exotic farms"] },
    { name: "Arctic", keywords: ["arctic", "snow", "ice", "winter", "glacier", "cold", "igloo", "northern lights", "freezing", "frost"] },
    { name: "Treehouse", keywords: ["treehouse", "treetops", "canopy", "branches", "cozy treehouse", "forest canopy"] },
    { name: "Domes", keywords: ["dome", "igloo", "stars", "geodesic", "bubble"] },
    { name: "Villa", keywords: ["villa", "estate", "mansion", "palazzo", "tuscany", "phuket", "greece", "luxury villa"] },
    { name: "Cable-Car", keywords: ["cable-car", "cable car", "gondola", "tram", "ride", "mountain ride"] },
    { name: "Cities", keywords: ["city", "urban", "downtown", "loft", "apartment", "tokyo", "dubai", "new york", "london", "paris", "boston", "miami", "la", "los angeles"] },
    { name: "Rooms", keywords: ["room", "suite", "studio", "bed", "loft", "apartment", "cozy", "boutique"] },
    { name: "Trending", keywords: ["trending", "popular", "fame", "premium", "top", "highly rated", "favorite", "choice"] }
];

async function seedCategories() {
    try {
        const listings = await Listing.find({});
        console.log(`Found ${listings.length} listings. Start seeding categories...`);

        let count = 0;
        for (let listing of listings) {
            const title = (listing.title || "").toLowerCase();
            const desc = (listing.description || "").toLowerCase();
            const location = (listing.location || "").toLowerCase();

            const matchedCategories = [];

            for (const cat of CATEGORIES_MAP) {
                const isMatched = cat.keywords.some(keyword => 
                    title.includes(keyword) || 
                    desc.includes(keyword) || 
                    location.includes(keyword)
                );
                if (isMatched) {
                    matchedCategories.push(cat.name);
                }
            }

            // Always assign at least 1-2 categories
            if (matchedCategories.length === 0) {
                matchedCategories.push("Trending");
                if (title.includes("villa") || desc.includes("villa")) {
                    matchedCategories.push("Villa");
                } else if (title.includes("cabin") || desc.includes("cabin")) {
                    matchedCategories.push("Mountains");
                } else {
                    matchedCategories.push("Rooms");
                }
            }

            if (Math.random() < 0.35 && !matchedCategories.includes("Trending")) {
                matchedCategories.push("Trending");
            }

            listing.categories = [...new Set(matchedCategories)];
            await listing.save();
            count++;
        }

        console.log(`Successfully seeded categories for ${count} listings.`);
        mongoose.connection.close();
    } catch (err) {
        console.error("Error seeding categories:", err);
        mongoose.connection.close();
    }
}

seedCategories();
