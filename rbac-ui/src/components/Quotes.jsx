import React, { useState, useEffect } from "react";
import axios from "axios";

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quoteCategory, setQuoteCategory] = useState(""); // Default category
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Fetch user details to get the quote category
    const fetchUserDetails = async () => {
      console.log(localStorage.getItem("token"));
      try {
        const response = await axios.get(
          "https://quotify-o02w.onrender.com/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Add your token here
            },
          }
        );
        console.log("User Details:", response.data);
        if (response.data) {
          setQuoteCategory(response.data.category); // Correctly update the category
          setUsername(response.data.username);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        alert("Failed to fetch user details.");
      }
    };

    fetchUserDetails();
  }, []); // Fetch user details once when the component loads

  useEffect(() => {
    // Fetch quotes only when quoteCategory is available
    if (quoteCategory) {
      console.log("Fetching quotes for category:", quoteCategory);
      setLoading(true);
      axios({
        method: "GET",
        url: `https://api.api-ninjas.com/v1/quotes?category=${quoteCategory}`,
        headers: { "X-Api-Key": process.env.REACT_APP_NINJA_API_KEY },
      })
        .then((response) => {
          console.log("Quotes API Response:", response.data);
          setQuotes(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching quotes:", error);
          setLoading(false);
        });
    }
  }, [quoteCategory]); // Fetch quotes whenever the quoteCategory changes

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("quoteCategory");
    window.location.href = "/";
  };

  return (
    <div className="text-white absolute inset-0 -z-10 w-full items-center justify-center h-screen px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_30%,#63e_100%)]">
      <h2 className="text-3xl font-semibold mb-6 text-center">
        Quotes - {quoteCategory || "Loading..."}
      </h2>
      <div className="flex justify-between">
        <h3 className="text-3xl font-semibold mb-6 text-left">
          Hello {username}!
        </h3>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-px-4 py-2 px-4 rounded-md mb-4"
        >
          Logout
        </button>
      </div>
      <h4 className="text-2xl mb-10">Here is a Quote for You!</h4>
      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {quotes.length > 0 ? (
            quotes.map((quote, index) => (
              <div
                key={index}
                className="p-6 bg-white/10 text-white backdrop-blur-lg shadow-lg rounded-lg border border-white/20"
              >
                <p className="text-xl italic mb-4">"{quote.quote}"</p>
                <p className="text-right text-lg">- {quote.author}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              No quotes found for this category.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Quotes;
