import { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !rollNumber) {
      setMessage("Please enter name and roll number");
      return;
    }

    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, rollNumber })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to signup");
        return;
      }

      setMessage("Signup successful");
      setName("");
      setRollNumber("");
    } catch (error) {
      setMessage("Server not reachable");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", fontFamily: "Arial" }}>
      <h2>Student Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="text"
          placeholder="Roll Number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>
          Signup
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default App;
