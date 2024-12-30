import dbConnect from "../../lib/db";
import mongoose from "mongoose";

export default async function questions(req, res) {
  try {
    // Ensure database connection
    await dbConnect();

    // Check if the request method is POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed. Use POST." });
    }

    // Extract questions from the request body
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "Invalid input. Provide a list of questions." });
    }

    // Access the "question1" collection
    const question1Collection = mongoose.connection.db.collection("question1");

    // Map questions to the format required by the database
    const documents = questions.map((question) => ({ string: question }));

    // Insert the questions into the collection
    const result = await question1Collection.insertMany(documents);

    // Respond with success message and inserted count
    res.status(200).json({
      message: "Questions added successfully.",
      insertedCount: result.insertedCount,
    });
  } catch (error) {
    console.error("Failed to add questions:", error);
    res.status(500).json({ error: "Failed to add questions." });
  }
}