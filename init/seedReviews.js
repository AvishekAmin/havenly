//  Review Seeder
//  ================================================================================================
//  Deletes all existing reviews and generates realistic demo reviews for every listing.
//  Run: node init/seedReviews.js
//  ================================================================================================

const mongoose = require("mongoose");
const path = require("path");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config({ path: path.join(__dirname, "../.env") });
}

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");

const dbUrl = process.env.ATLASDB_URL;

const guestNames = [
    "Sanjay Singh", "Amit Kumar", "Madhuri Sen", "Suman Patel", "Ayush Singhania",
    "Gayetri Bhunia", "Abhinav Sen", "Preeti Goyal", "Kaustav Bagchi", "Ankit Acharya",
    "Pawan Kumar", "Anushka Sharma", "Rohit Patel", "Dhananjay Pal", "Abhishek Sharma",
    "Shruti Singh", "Priyanshu Kar", "Aditya Ghosh", "Tanmoy Majumdar", "Sonali Bhowmick",
    "Abhijit Pal", "Suman Kanjilal", "Pritam Pal", "Mrinmoy Sarkar", "Kanika Das",
    "Ishan Mullick", "Hriday Sarkar", "Khushi Kapoor", "Sanket Adhikari", "Chinmoy Majumdar",
    "Tapan Sardar", "Sanjay Dixit", "Kanchan Dey", "Sushma Roy", "Debanjay Upadhyay",
    "Subhash Bose", "Rahul Sharma", "Nayan Mukherjee", "Arup Biswas", "Priyanshu Ghosh",
    "Monalisa Banerjee", "Utkarsh Talukdar", "Ratan Sikdar", "Jibon Bhowmick", "Preeti Singh",
    "Vinay Mahato", "Utsab Das", "Lalit Sharma", "Vikash Shinde", "Dipankar Mondal"
];

// Sentence pools for combinatoric generation
const pool1 = [
    "Our stay at this beautiful property was absolutely wonderful from start to finish.",
    "We had an incredible time here and couldn't have asked for a better experience.",
    "What a gem of a place! It exceeded all of our expectations in every possible way.",
    "This is hands down one of the best accommodations we have ever stayed in.",
    "We fell in love with the charm and atmosphere of this lovely home immediately.",
    "A truly stellar experience that made our holiday incredibly special and relaxing.",
    "This property is the perfect retreat for anyone looking to unwind in style.",
    "From the moment we arrived, we felt completely relaxed and at home.",
    "An absolutely delightful stay that we will cherish for a very long time.",
    "We were blown away by the beauty and design of this spectacular space.",
    "This place has a wonderful vibe and is perfect for a relaxing getaway.",
    "A beautiful and peaceful haven that provided the ultimate vacation experience.",
    "Everything about this stay was top-tier, and we enjoyed every single minute.",
    "An exceptionally well-maintained property that offers a premium feel throughout.",
    "We had a magical stay here and are already planning our return trip.",
    "This property is a masterpiece of design and comfort, truly outstanding.",
    "A fantastic experience that combined luxury with a warm, welcoming atmosphere.",
    "We spent a week here and it felt like our own private paradise.",
    "The perfect blend of modern convenience and cozy charm, we loved it.",
    "This accommodation is a masterclass in hospitality and high-end living.",
    "We had a serene and refreshing stay that was exactly what we needed.",
    "A highly memorable stay in a setting that was nothing short of picturesque.",
    "We were thoroughly impressed by the quality and layout of the entire property.",
    "This home is absolutely stunning and matches the listing pictures perfectly.",
    "An amazing getaway that offered comfort, beauty, and absolute tranquility."
];

const pool2 = [
    "The location is absolutely prime, nestled in a safe and incredibly vibrant neighborhood.",
    "It is situated in a quiet, peaceful area but still close to everything.",
    "We loved the convenience of being just steps away from local cafes and shops.",
    "The property is perfectly placed for exploring the city while offering a quiet retreat.",
    "Located in a highly desirable neighborhood with scenic walking paths nearby.",
    "It was so easy to access public transit, making sightseeing completely effortless.",
    "The surrounding area is full of charm, history, and amazing dining options.",
    "Positioned in a quiet enclave that guarantees a peaceful night's sleep.",
    "We couldn't have asked for a better location for our vacation adventures.",
    "A highly convenient spot with a grocery store and bakery just around the corner.",
    "The neighborhood is safe, clean, and has a very friendly local feel.",
    "It's located within walking distance to some of the best attractions in town.",
    "Tucked away in a beautiful spot that offers stunning natural surroundings.",
    "The location is a major highlight, offering quick access to the main sights.",
    "It sits in a peaceful neighborhood that feels away from the tourist crowds.",
    "We loved being surrounded by nature while still having modern conveniences close by.",
    "The setting is incredibly scenic, offering the perfect backdrop for our photos.",
    "Conveniently located with plenty of parking space available nearby.",
    "The area is exceptionally quiet, allowing us to sleep with the windows open.",
    "An ideal basecamp for anyone wanting to explore the local culture and landmarks.",
    "We enjoyed morning walks around the beautiful and friendly neighborhood.",
    "Perfectly situated to enjoy both the bustling city life and serene evenings.",
    "The property is located in a quiet street, just off the main boulevard.",
    "A wonderful location that offers both privacy and easy accessibility.",
    "It is in a quiet, upscale area that felt very secure and welcoming."
];

const pool3 = [
    "The space was absolutely immaculate, sparkling clean, and smelled fresh upon arrival.",
    "We were highly impressed by the high standards of cleanliness and hygiene.",
    "The interior design is stunning, featuring a perfect blend of style and function.",
    "Everything inside felt fresh, new, and kept in absolutely pristine condition.",
    "The decor is exceptionally tasteful, creating a warm and luxurious atmosphere.",
    "You can tell the owners take great pride in maintaining this property.",
    "The layout is spacious and open, providing plenty of room to stretch out.",
    "The house was spotless, with fresh linens and towels provided for everyone.",
    "We loved the modern styling and the high-quality finishes throughout the home.",
    "The living area is incredibly cozy, perfect for relaxing after a long day.",
    "The property is clean, well-lit, and has a very inviting ambience.",
    "Every room was clean, dust-free, and organized with great attention to detail.",
    "The house boasts high ceilings and large windows that let in beautiful light.",
    "The kitchen and bathrooms were sparkling clean and modern.",
    "We appreciated the spotless condition of the property and the fresh scent.",
    "The aesthetic is beautiful, combining clean lines with cozy furnishings.",
    "The bedrooms are spacious and the whole house is kept perfectly clean.",
    "The interior is beautifully curated, making it a joy to spend time indoors.",
    "Everything was in order, clean, and ready for our check-in.",
    "The decor has a lovely local touch that makes the space feel unique.",
    "The property is solid, clean, and built with high-quality materials.",
    "We found the place to be exceptionally clean, comfortable, and well-designed.",
    "The space is bright, clean, and features beautiful modern artwork.",
    "Pristine cleanliness made us feel comfortable and safe from day one.",
    "The house is incredibly neat, tidy, and has a peaceful energy."
];

const pool4 = [
    "The beds were exceptionally comfortable, guaranteeing a deep and restful sleep.",
    "We made great use of the fully-equipped kitchen, which had everything we needed.",
    "The WiFi was incredibly fast and stable, which was perfect for our remote work.",
    "We loved spending our evenings on the private terrace enjoying the fresh air.",
    "The amenities were top-notch, from the espresso machine to the premium toiletries.",
    "The heating and air conditioning worked perfectly, keeping us comfortable throughout.",
    "The bathroom was a highlight, featuring a luxurious shower with great water pressure.",
    "A highly comfortable setup with smart TV, Bluetooth speakers, and board games.",
    "The king-sized bed was like sleeping on a cloud, absolutely amazing comfort.",
    "We appreciated the thoughtful extras, like the welcome basket of local treats.",
    "The kitchen had top-of-the-line appliances and plenty of cooking utensils.",
    "The outdoor seating area was perfect for enjoying our morning coffee.",
    "The water pressure was excellent and there was always plenty of hot water.",
    "Fast internet made streaming movies and handling video calls effortless.",
    "The linens were high quality and the pillows were incredibly supportive.",
    "We loved the relaxing lounge chairs and the selection of books available.",
    "Every amenity listed was fully functional and of premium quality.",
    "The property features a beautiful garden that was perfect for relaxing.",
    "The coffee maker was a lifesaver, and the kitchen essentials were great.",
    "The closet space was generous, allowing us to unpack completely.",
    "The dining table was spacious, perfect for family dinners and game nights.",
    "Having laundry facilities on-site was a huge convenience for our week-long stay.",
    "The lighting options were excellent, allowing us to set a cozy mood.",
    "We enjoyed the pool, which was clean, warm, and very well-maintained.",
    "All appliances were modern and the smart lock made entry very simple."
];

const pool5 = [
    "The host was incredibly welcoming, helpful, and provided outstanding local tips.",
    "Check-in was completely seamless, thanks to the clear and detailed instructions.",
    "Communication was exceptionally fast, friendly, and helpful at all times.",
    "The host went above and beyond to ensure we had everything we needed.",
    "We received a warm welcome and a personal tour of the property upon arrival.",
    "The self-check-in process was very convenient and worked flawlessly.",
    "The host was highly responsive and resolved our minor query within minutes.",
    "We appreciated the guide book provided, which had excellent restaurant choices.",
    "The host check-in instructions were precise, making arrival stress-free.",
    "The host was very accommodating, allowing us to check in slightly early.",
    "We felt very well cared for, with the host checking in to ensure all was well.",
    "The hospitality was outstanding, reflecting the true spirit of the community.",
    "The host was polite, professional, and respected our privacy completely.",
    "The check-in instructions were accompanied by helpful photos and directions.",
    "Our host was an absolute pleasure to deal with, very kind and helpful.",
    "The host provided fresh milk, bread, and fruits for our arrival, a lovely touch.",
    "Communication was proactive, ensuring we had all details days before arriving.",
    "The host gave us great recommendations for hidden gems in the local area.",
    "We loved the warm hospitality and the smooth check-in experience.",
    "The host was always available to help and answer any questions we had.",
    "Check-out was just as simple and easy as the check-in process.",
    "The host went out of their way to arrange transport for our departure.",
    "A very thoughtful host who made sure our stay was comfortable.",
    "The self-check-in keypad was easy to use and very secure.",
    "The host check-in guide made finding the property very easy."
];

const pool6 = [
    "This property offers outstanding value for money and we highly recommend it.",
    "We will definitely choose to stay here again on our next visit to the area.",
    "If you are looking for a perfect place to stay, do not hesitate to book this.",
    "It was an absolute pleasure staying here, and we would give it ten stars if we could.",
    "A highly recommended listing that provides a top-tier travel experience.",
    "We are already recommending this place to all of our friends and family.",
    "This stay was worth every single penny and we will certainly return.",
    "A flawless experience that left us feeling refreshed and extremely happy.",
    "We had a wonderful time and would book this property again in a heartbeat.",
    "An overall amazing stay that represents the pinnacle of quality hosting.",
    "We left with great memories and will definitely be back in the future.",
    "Do yourself a favor and book this place immediately — you won't regret it.",
    "The price is very reasonable given the excellent quality and location.",
    "We had a perfect experience and cannot recommend this place highly enough.",
    "A true home away from home that we were very sad to leave.",
    "We had an amazing holiday, largely thanks to this wonderful accommodation.",
    "The value, comfort, and location make this property an absolute must-stay.",
    "A highly positive experience from start to finish, absolutely recommended.",
    "We would stay here again without any hesitation whatsoever.",
    "A 5-star experience in every sense, we will be back very soon.",
    "We were sad to say goodbye to this beautiful and comfortable haven.",
    "An exceptional stay that exceeded our expectations in every way.",
    "This place is worth booking just for the peaceful atmosphere alone.",
    "We had a fantastic time and are very grateful for the hospitality.",
    "A perfect stay that we would recommend to anyone visiting the area."
];

const destinationSpecific = {
    paris: [
        "Walking to the local boulangerie for fresh baguettes and croissants each morning was the highlight of our Parisian stay.",
        "Having a glimpse of the Eiffel Tower and the beautiful streets of Paris made our evenings magical."
    ],
    tokyo: [
        "The proximity to the Tokyo subway made navigating the Shinjuku and Shibuya districts incredibly easy.",
        "Exploring the local ramen shops and convenience stores nearby gave us a true taste of Tokyo."
    ],
    maldives: [
        "Snorkeling directly off the villa deck into the turquoise Maldivian waters was an unforgettable experience.",
        "Waking up to the serene sound of the ocean and the white sandy beaches of the Maldives felt like absolute paradise."
    ],
    aspen: [
        "Coming back to the cozy fireplace after a long, chilly day on the Aspen slopes was absolute bliss.",
        "The mountain views and proximity to the ski lifts made this the perfect Aspen winter getaway."
    ],
    goa: [
        "The beach was just a short stroll away, and we loved spending our evenings at the local beach shacks in Goa.",
        "Renting a scooter to explore the old Portuguese quarters and pristine beaches of Goa was incredibly fun."
    ],
    santorini: [
        "Watching the sunset paint the caldera in stunning golden hues directly from our balcony was a dream come true.",
        "The classic whitewashed walls and iconic blue domes of Santorini were right at our doorstep."
    ]
};

function normalizeName(name) {
    return name.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, "_");
}

function generateReviewComment(listing) {
    const pools = [pool1, pool2, pool3, pool4, pool5, pool6];
    // Shuffle and pick 4 or 5 pools
    const shuffledPools = [...pools].sort(() => 0.5 - Math.random());
    const selectedPoolsCount = Math.random() < 0.5 ? 4 : 5;
    const selectedPools = shuffledPools.slice(0, selectedPoolsCount);

    let sentences = selectedPools.map(pool => pool[Math.floor(Math.random() * pool.length)]);

    // Check destination specific match
    const locationLower = (listing.location || "").toLowerCase();
    const countryLower = (listing.country || "").toLowerCase();
    let destKey = null;

    for (let key in destinationSpecific) {
        if (locationLower.includes(key) || countryLower.includes(key)) {
            destKey = key;
            break;
        }
    }

    if (destKey && Math.random() < 0.4) {
        const destSentences = destinationSpecific[destKey];
        const destSentence = destSentences[Math.floor(Math.random() * destSentences.length)];
        const replaceIdx = Math.floor(Math.random() * sentences.length);
        sentences[replaceIdx] = destSentence;
    }

    let reviewText = sentences.join(" ");
    let wordCount = reviewText.split(/\s+/).length;

    // Adjust length to 40 - 70 words
    if (wordCount < 40) {
        const remainingPools = pools.filter(p => !selectedPools.includes(p));
        if (remainingPools.length > 0) {
            const extraSent = remainingPools[0][Math.floor(Math.random() * remainingPools[0].length)];
            reviewText += " " + extraSent;
        }
    } else if (wordCount > 70) {
        reviewText = reviewText.split(/\s+/).slice(0, 70).join(" ") + ".";
        reviewText = reviewText.replace(/\.\.+/g, ".").replace(/\s\./g, ".").trim();
    }

    return reviewText;
}

async function seedReviews() {
    try {
        console.log("Connecting to Database...");
        await mongoose.connect(dbUrl);
        console.log("Connected successfully!");

        // 1. Delete all existing reviews from Reviews collection
        console.log("Deleting all existing reviews from the Review collection...");
        await Review.deleteMany({});
        console.log("Deleted all reviews!");

        // 2. Clear reviews array of every Listing
        console.log("Clearing review references from all Listings...");
        await Listing.updateMany({}, { $set: { reviews: [] } });
        console.log("Listing reviews cleared!");

        // 3. Find or Create users for each guest name
        console.log("Creating or locating guest users...");
        const users = [];
        for (let name of guestNames) {
            const username = normalizeName(name);
            let user = await User.findOne({ username });
            if (!user) {
                user = new User({ email: `${username}@gmail.com`, username });
                user = await User.register(user, "password123");
            }
            users.push(user);
        }
        console.log(`Created/located ${users.length} guest users.`);

        // 4. Retrieve all listings
        const listings = await Listing.find({});
        console.log(`Found ${listings.length} listings to seed reviews for.`);

        // 5. Generate reviews for each listing
        let totalReviewsCreated = 0;
        for (let listing of listings) {
            // Generate a random number of reviews between 12 and 25
            const numReviews = Math.floor(Math.random() * (25 - 12 + 1)) + 12;
            console.log(`Generating ${numReviews} reviews for: "${listing.title}"...`);

            const reviewIds = [];
            // To prevent duplicate authors in the same listing's reviews
            const shuffledUsers = [...users].sort(() => 0.5 - Math.random());

            for (let i = 0; i < numReviews; i++) {
                const author = shuffledUsers[i % shuffledUsers.length];
                
                // Favor 4 and 5 stars (e.g. 3: 15% chance, 4: 40% chance, 5: 45% chance)
                const rand = Math.random();
                const rating = rand < 0.15 ? 3 : (rand < 0.55 ? 4 : 5);

                const comment = generateReviewComment(listing);

                // Varied review dates between 10 days and 2 years ago
                const timeAgo = 10 * 24 * 60 * 60 * 1000 + Math.floor(Math.random() * (365 * 2 * 24 * 60 * 60 * 1000));
                const createdAt = new Date(Date.now() - timeAgo);

                const newReview = new Review({
                    comment,
                    rating,
                    createdAt,
                    author: author._id
                });

                await newReview.save();
                reviewIds.push(newReview._id);
                totalReviewsCreated++;
            }

            listing.reviews = reviewIds;
            await listing.save();
        }

        console.log(`Seeding complete! Successfully generated and linked ${totalReviewsCreated} reviews.`);
        mongoose.connection.close();
        console.log("Database connection closed.");
    } catch (err) {
        console.error("Error during seeding process:", err);
        mongoose.connection.close();
    }
}

seedReviews();
