import React, { useState, useEffect } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [curriculumFilter, setCurriculumFilter] = useState("");
  const [tutors, setTutors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [bookings, setBookings] = useState([]);

  // Fetch tutors on load or filter change
  useEffect(() => {
    const fetchTutors = async () => {
      const url = `http://localhost:5000/api/tutors/search?q=${searchQuery}&curriculum=${curriculumFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      setTutors(data);
    };
    fetchTutors();
  }, [searchQuery, curriculumFilter]);

  // Fetch bookings if logged in
  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) return;
      const res = await fetch("http://localhost:5000/api/bookings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setBookings(data);
    };
    fetchBookings();
  }, [token]);

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const body = Object.fromEntries(formData);

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    }
  };

  // Register handler
  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const body = Object.fromEntries(formData);

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    alert(data.message);
  };

  // Book a session
  const handleBooking = async (tutorId) => {
    const date = new Date();
    date.setHours(date.getHours() + 1); // Next hour

    const res = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        student: "64f3b7d89c9d6e1d9c9d6e1d", // Replace with real ID
        tutor: tutorId,
        date,
        duration: 60
      })
    });

    const data = await res.json();
    alert("Session booked!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Academium</h1>
          <nav className="space-x-6 hidden md:flex">
            <button onClick={() => setActiveTab("home")} className={`text-sm font-medium ${activeTab === "home" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}>Home</button>
            <button onClick={() => setActiveTab("browse")} className={`text-sm font-medium ${activeTab === "browse" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}>Browse Tutors</button>
            <button onClick={() => setActiveTab("dashboard")} className={`text-sm font-medium ${activeTab === "dashboard" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}>
              {token ? "Dashboard" : "Login"}
            </button>
          </nav>
          {!token && (
            <div className="flex space-x-3">
              <button onClick={() => setActiveTab("login")} className="px-4 py-2 text-sm border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition">Log In</button>
              <button onClick={() => setActiveTab("register")} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">Sign Up</button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      {activeTab === "home" && (
        <section className="relative bg-gradient-to-r from-blue-50 to-green-50 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#000" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          <div className="container mx-auto px-4 py-16 md:py-24 relative">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Find Trusted Tutors for IGCSE, CBC & GCSE – Anytime, Anywhere.
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Connect with experienced educators and achieve academic excellence in your preferred subjects and curricula.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <input 
                  type="text" 
                  placeholder="Subject or Tutor Name..." 
                  className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select 
                  className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={curriculumFilter}
                  onChange={(e) => setCurriculumFilter(e.target.value)}
                >
                  <option value="">All Curricula</option>
                  <option>IGCSE</option>
                  <option>CBC</option>
                  <option>GCSE</option>
                </select>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition whitespace-nowrap">
                  Search
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Browse Tutors */}
      {activeTab === "browse" && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-12">Browse Tutors</h3>
            
            {/* Search + Filters */}
            <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-center">
              <input 
                type="text" 
                placeholder="Search by name or subject..." 
                className="px-4 py-3 w-full md:w-1/2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select 
                className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-1/4"
                value={curriculumFilter}
                onChange={(e) => setCurriculumFilter(e.target.value)}
              >
                <option value="">All Curricula</option>
                <option>IGCSE</option>
                <option>CBC</option>
                <option>GCSE</option>
              </select>
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {tutors.map((tutor) => (
                <div key={tutor._id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition border border-gray-200">
                  <img src={tutor.image || "https://placehold.co/300x300 "} alt={tutor.name} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h4 className="text-xl font-semibold mb-1">{tutor.name}</h4>
                    <p className="text-gray-600 mb-2">{tutor.subject} • {tutor.curriculum}</p>
                    <div className="flex items-center mb-4">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span>{tutor.rating}</span>
                      <span className="ml-2 text-gray-500">({tutor.sessions} sessions)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-blue-600">KES {tutor.hourlyRate}/hr</span>
                      <button 
                        onClick={() => handleBooking(tutor._id)} 
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
                      >
                        Book Session
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dashboard */}
      {activeTab === "dashboard" && token && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-12">Your Bookings</h3>
            <div className="max-w-3xl mx-auto">
              {bookings.length > 0 ? (
                <ul className="space-y-4">
                  {bookings.map((booking) => (
                    <li key={booking._id} className="border p-4 rounded-lg shadow-sm">
                      <p><strong>Tutor:</strong> {booking.tutor?.name}</p>
                      <p><strong>Date:</strong> {new Date(booking.date).toLocaleString()}</p>
                      <p><strong>Status:</strong> {booking.status}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500">No bookings yet.</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Login Form */}
      {activeTab === "login" && !token && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-md">
            <h3 className="text-2xl font-bold mb-6 text-center">Log In</h3>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="email" name="email" placeholder="Email" required className="w-full px-4 py-3 border border-gray-300 rounded-md" />
              <input type="password" name="password" placeholder="Password" required className="w-full px-4 py-3 border border-gray-300 rounded-md" />
              <button type="submit" className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">Log In</button>
            </form>
          </div>
        </section>
      )}

      {/* Register Form */}
      {activeTab === "register" && !token && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-md">
            <h3 className="text-2xl font-bold mb-6 text-center">Create Account</h3>
            <form onSubmit={handleRegister} className="space-y-4">
              <input type="text" name="name" placeholder="Full Name" required className="w-full px-4 py-3 border border-gray-300 rounded-md" />
              <input type="email" name="email" placeholder="Email" required className="w-full px-4 py-3 border border-gray-300 rounded-md" />
              <input type="password" name="password" placeholder="Password" required className="w-full px-4 py-3 border border-gray-300 rounded-md" />
              <select name="role" className="w-full px-4 py-3 border border-gray-300 rounded-md">
                <option value="student">Student</option>
                <option value="tutor">Tutor</option>
              </select>
              <button type="submit" className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">Register</button>
            </form>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Academium</h4>
              <p className="text-gray-400">Connecting students with trusted tutors for IGCSE, CBC, and GCSE curricula.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Home</a></li>
                <li><a href="#" className="hover:text-white">Tutors</a></li>
                <li><a href="#" className="hover:text-white">Courses</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">FAQs</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">📘</a>
                <a href="#" className="text-gray-400 hover:text-white">🐦</a>
                <a href="#" className="text-gray-400 hover:text-white">💼</a>
              </div>
              <p className="mt-4 text-gray-400">© 2025 Academium. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
