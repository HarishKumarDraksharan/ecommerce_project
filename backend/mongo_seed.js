// MongoDB Seed Script for ShopSphere Reviews and Analytics
// Run this file using mongosh: mongosh shopsphere_mongo mongo_seed.js

print("Seeding MongoDB Collections...");

// Drop existing collections to start fresh
db.reviews.drop();
db.browsingHistory.drop();
db.searchAnalytics.drop();

// Insert Reviews
const reviews = [
  {
    productId: 1, // iPhone 16 Pro
    userId: 2, // John Doe
    rating: 5,
    title: "Amazing Phone",
    content: "Excellent camera quality and performance. Worth the price.",
    images: [],
    verified: true,
    helpful: 45,
    createdAt: new Date("2026-07-15T10:30:00Z")
  },
  {
    productId: 1,
    userId: 3, // Alex
    rating: 4,
    title: "Great but expensive",
    content: "Battery backup is very good, but it is quite pricey.",
    images: [],
    verified: true,
    helpful: 12,
    createdAt: new Date("2026-07-18T14:20:00Z")
  },
  {
    productId: 2, // Samsung S25
    userId: 4, // David
    rating: 5,
    title: "Best Android Flagship",
    content: "The display is stunning and the AI features are incredible.",
    images: [],
    verified: true,
    helpful: 89,
    createdAt: new Date("2026-07-20T09:15:00Z")
  },
  {
    productId: 4, // ASUS Gaming Laptop
    userId: 2,
    rating: 5,
    title: "Beast Performance",
    content: "Plays all AAA games at ultra settings without overheating.",
    images: [],
    verified: true,
    helpful: 34,
    createdAt: new Date("2026-06-10T11:00:00Z")
  },
  {
    productId: 16, // Clean Code
    userId: 3,
    rating: 5,
    title: "Must Read for Devs",
    content: "This book changed the way I write code completely. Highly recommended.",
    images: [],
    verified: true,
    helpful: 120,
    createdAt: new Date("2026-05-05T08:30:00Z")
  }
];

db.reviews.insertMany(reviews);

print(`Successfully inserted ${reviews.length} reviews.`);

// Insert Analytics Data (Optional for Demo)
db.searchAnalytics.insertMany([
  { userId: 2, query: "iphone", resultCount: 5, searchedAt: new Date() },
  { userId: 3, query: "gaming laptop", resultCount: 2, searchedAt: new Date() },
  { userId: 4, query: "sneakers", resultCount: 8, searchedAt: new Date() }
]);

print("MongoDB Seeding Completed Successfully.");
