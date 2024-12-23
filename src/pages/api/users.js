import dbConnect from "../../lib/db";
import mongoose from "mongoose";

export default async function users(req, res) {
  try {
    // Connect to the database
    await dbConnect();

    // Extract the email and phoneNumber from the request query
    const { email, phoneNumber } = req.query;

    // Ensure that email is provided (used for fetching the questions)
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Access the "users" collection
    const usersCollection = mongoose.connection.db.collection("users");

    // Check if the user exists using email
    let user = await usersCollection.findOne({ email });

    if (!user) {
      console.log("User not found. Creating a new user...");

      // Helper function to fetch a random question from a collection
      const getRandomQuestion = async (collectionName) => {
        const collection = mongoose.connection.db.collection(collectionName);
        const count = await collection.countDocuments();

        if (count === 0) {
          console.log(`Collection "${collectionName}" is empty`);
          return null; // Return null if the collection is empty
        }

        const randomIndex = Math.floor(Math.random() * count);
        const randomDocument = await collection.find().skip(randomIndex).limit(1).toArray();
        return {
          id: randomDocument[0]._id.toString(), // Convert ObjectId to string
          question: randomDocument[0].string,  // Get the question text
        };
      };

      // Fetch one random question from each question bank
      const question1 = await getRandomQuestion("question1");
      const question2 = await getRandomQuestion("question2");
      const question3 = await getRandomQuestion("question3");
      const question4 = await getRandomQuestion("question4");

      // Create a new user document with both email and phone number
      const newUser = {
        email, // Store email
        phoneNumber, // Store phone number
        createdAt: new Date(),
        randomQuestions: {
          question1,
          question2,
          question3,
          question4,
        },
      };

      // Insert the new user document into the collection
      const result = await usersCollection.insertOne(newUser);
      console.log("New user created:", result.insertedId);

      // Assign the newly created user document to `user`
      user = newUser;
    }

    // Respond with the user data (email, phone number, and questions)
    res.status(200).json(user);
  } catch (error) {
    console.error("Failed to process user request:", error);
    res.status(500).json({ error: "Failed to process user request" });
  }
}