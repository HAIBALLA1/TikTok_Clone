db = db.getSiblingDB('admin');

// Création de l'utilisateur administrateur
db.createUser({
  user: "admin",
  pwd: "MySecureP@ssw0rd2024", 
  roles: [ { role: "root", db: "admin" } ]
});

// Passer à la base de données 'tiktok_clone' pour initialiser les collections
db = db.getSiblingDB('tiktok_clone');

// Users Collection
// Stores user profiles and authentication information
db.createCollection('users');
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });

// Videos Collection
// Stores video metadata and references
db.createCollection('videos');
db.videos.createIndex({ "userId": 1 });          // For quick user's videos lookup
db.videos.createIndex({ "createdAt": -1 });      // For feed sorting

// Comments Collection
// Stores video comments
db.createCollection('comments');
db.comments.createIndex({ "videoId": 1 });       // For video comments lookup
db.comments.createIndex({ "userId": 1 });

// Likes Collection
// Tracks user likes on videos
db.createCollection('likes');
db.likes.createIndex({ "videoId": 1, "userId": 1 }, { unique: true });  // Prevent duplicate likes

// Followers Collection
// Manages user relationships
db.createCollection('followers');
db.followers.createIndex({ "followerId": 1, "followingId": 1 }, { unique: true });  // Prevent duplicate follows