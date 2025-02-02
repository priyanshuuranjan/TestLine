import React, { useEffect, useState } from "react";

const Card = ({ children }) => (
  <div className="border p-4 rounded bg-white shadow">{children}</div>
);
const CardContent = ({ children }) => <div className="p-2">{children}</div>;
const Button = ({ onClick, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`bg-blue-500 text-white p-2 rounded w-full my-2 ${
      disabled ? "opacity-50 cursor-not-allowed" : ""
    }`}
  >
    {children}
  </button>
);
const Progress = ({ value, className }) => (
  <div
    className={`bg-gray-300 w-full h-4 rounded overflow-hidden ${className}`}
  >
    <div className="bg-green-500 h-4" style={{ width: `${value}%` }}></div>
  </div>
);

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data...");
        const response = await fetch("https://api.jsonserve.com/Uw5CrX", {
          mode: "cors",
        });

        console.log("Response received:", response);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Parsed data:", data);

        if (
          data.questions &&
          Array.isArray(data.questions) &&
          data.questions.length > 0
        ) {
          setQuestions(data.questions);
        } else {
          console.warn("No questions found in API response.");
          setError("No quiz data available.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load quiz data. Showing offline quiz.");

        // ✅ Use dummy data if API fails
        setQuestions([
          {
            description: "What is the capital of France?",
            options: [
              { description: "Paris", is_correct: true },
              { description: "Berlin", is_correct: false },
              { description: "Madrid", is_correct: false },
            ],
          },
          {
            description: "What is 2 + 2?",
            options: [
              { description: "3", is_correct: false },
              { description: "4", is_correct: true },
              { description: "5", is_correct: false },
            ],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(score + 10);
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setQuizCompleted(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {loading ? (
        <p>Loading Quiz...</p>
      ) : (
        <>
          {error && <p className="text-red-500">{error}</p>}{" "}
          {quizCompleted ? (
            <Card className="w-96 text-center p-4">
              <CardContent>
                <h2 className="text-2xl font-bold">Quiz Completed!</h2>
                <p className="text-lg mt-2">Your Score: {score} points</p>
                <Button onClick={() => window.location.reload()}>
                  Restart Quiz
                </Button>
              </CardContent>
            </Card>
          ) : questions.length > 0 ? (
            <Card className="w-96 p-4">
              <CardContent>
                <h2 className="text-xl font-semibold">
                  {questions[currentQuestion]?.description}
                </h2>
                <div className="mt-4">
                  {questions[currentQuestion]?.options?.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswer(option.is_correct)}
                    >
                      {option.description}
                    </Button>
                  ))}
                </div>
                <Progress
                  value={((currentQuestion + 1) / questions.length) * 100}
                  className="mt-4"
                />
              </CardContent>
            </Card>
          ) : (
            <p>No quiz data available.</p>
          )}
        </>
      )}
    </div>
  );
};

export default App;
