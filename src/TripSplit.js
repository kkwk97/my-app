import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // To handle routing to new post page

function TripSplit() {
  const [summary, setSummary] = useState([]);

  // Fetch trip split data from API
  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const response = await fetch('/api/trip_split'); // Replace with your actual endpoint
        if (response.ok) {
          const data = await response.json();
          setSummary(data);
        } else {
          console.error("Failed to fetch trip summary");
        }
      } catch (error) {
        console.error("Error fetching trip summary:", error);
      }
    };

    fetchSummaryData();
  }, []);

  return (
    <div className="container">
      <Link to="/new-post" className="btn btn-primary btn-sm" style={{ width: "20%", marginBottom: "10px" }}>
        New Post
      </Link>

      <table className="table">
        <thead>
          <tr>
            <th>User</th>
            <th>Total Spent</th>
            <th>Total Owed</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {summary.length > 0 ? (
            summary.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>${item.spent.toFixed(2)}</td>
                <td>${item.owed.toFixed(2)}</td>
                <td className={item.balance >= 0 ? "positive" : "negative"}>
                  {item.balance >= 0 ? "+" : ""}
                  ${item.balance.toFixed(2)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Loading...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TripSplit;
