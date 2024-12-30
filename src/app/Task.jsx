"use client"; // Needed for client-side rendering in Next.js
import React, { useState } from "react";
import Image from "next/image";
import "./Task.css"; // Ensure Task.css is placed in the same folder or update the path

function Task() {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // For phone number
  const [showQuestions, setShowQuestions] = useState(false);
  const [questions, setQuestions] = useState([]); // To store questions fetched from the API
  const [isLoading, setIsLoading] = useState(false); // For loading state

  const handleEmailChange = (e) => setEmail(e.target.value);

  const handlePhoneChange = (e) => setPhoneNumber(e.target.value);

  const handleShowQuestions = async () => {
    if (email.trim() === "" || phoneNumber.trim() === "") {
      alert("Please enter a valid email address and phone number.");
    } else {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/users?email=${email}&phoneNumber=${phoneNumber}`);
        const data = await response.json();

        if (response.ok) {
          setQuestions([
            data.randomQuestions.question1.question,
            data.randomQuestions.question2.question,
            data.randomQuestions.question3.question,
            data.randomQuestions.question4.question,
          ]);
          setShowQuestions(true); // Show questions
        } else {
          alert(data.error || "An error occurred.");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        alert("Failed to fetch user data. Please try again.");
      } finally {
        setIsLoading(false); // Hide the loading screen
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    setEmail("");
    setPhoneNumber("");
    setShowQuestions(false);
    setQuestions([]); // Clear the questions on logout
  };

  return (
    <div>
      <div className="header">
        <div className="mn"></div>
        <div className="top">
          {email && showQuestions && (
            <div className="logout-section">
              <p className="welcome-message">Welcome, {email}</p>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="content">
        <div className="logo">
        <img
          src="/cs.png"
          alt="CS Logo"
          width={90}
          height={90}
          sizes="(max-width: 768px) 60px, 60px"
        />
        <img
          src="/aiesec.png"
          alt="AIESEC Logo"
          width={250}
          height={30}
          sizes="(max-width: 768px) 200px, 250px"
        />
        </div>
        <div className="main-con">
          <div className="welcome">Welcome to the Newbie Assessments</div>
          <div className="con">
            {!showQuestions ? (
              <>
                <p>Enter your Email and Phone Number to Get the Questions</p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                />
                <input
                  type="tel"
                  placeholder="Enter your WhatsApp number eg: 0712345678"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                />
                <button onClick={handleShowQuestions} className="btn-check">
                  Check
                </button>
              </>
            ) : (
              <div className="questions-block">
                <h3>Here are your questions: Scroll down</h3>
                <ul>
                  {questions.map((question, index) => (
                    <li key={index}>{question}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="con-instruction">
          <div className="instructions">
            <h3>Instructions</h3>
            {/* <p style={{marginTop:"5px", marginBottom:"5px"}}>Please read the following instructions carefully </p> */}
            <ul>
              <li>Please enter email & number to get the questions</li>
              <li>Please Avoid using Generative AI platforms to answer.</li>
              <li>Please provide answers in the form below.</li>
              <li>Submission Link:</li>
            </ul>
          </div>
        </div>
        <div className="foot-con">
          <div className="footer">
            <p className="quote">
              "Leadership is the capacity to translate vision into reality."
            </p>
            <p>&copy; 2024 AIESEC in University of Moratuwa. All rights reserved.</p>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="loading-overlay">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
}

export default Task;