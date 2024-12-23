import dbConnect from "../../lib/db";
import mongoose from "mongoose";

export default async function handler(req, res) {
  try {
    // Connect to the database
    await dbConnect();

    // Start a session for the transaction
    const session = await mongoose.startSession();

    // Define the logic to fetch a random document from a collection
    const getRandomDocument = async (collectionName, session) => {
      const collection = mongoose.connection.db.collection(collectionName);
      const count = await collection.countDocuments({}, { session }); // Get total document count
      if (count === 0) throw new Error(`Collection "${collectionName}" is empty`);
      const randomIndex = Math.floor(Math.random() * count); // Generate random index
      const randomDocument = await collection
        .find({}, { session })
        .skip(randomIndex)
        .limit(1)
        .toArray(); // Fetch the random document
      return randomDocument[0]; // Return the first (and only) result
    };

    let randomQuestions;

    // Run all fetches in a transaction
    await session.withTransaction(async () => {
      const question1 = await getRandomDocument("question1", session);
      const question2 = await getRandomDocument("question2", session);
      const question3 = await getRandomDocument("question3", session);
      const question4 = await getRandomDocument("question4", session);

      // Combine the results
      randomQuestions = { question1, question2, question3, question4 };
    });

    // End the session
    session.endSession();

    // Respond with the random questions
    res.status(200).json(randomQuestions);
  } catch (error) {
    console.error("Failed to fetch random questions:", error);
    res.status(500).json({ error: "Failed to fetch random questions" });
  }
}