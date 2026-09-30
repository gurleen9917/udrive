import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


//  Home / Landing Screen Component with Hero Background
function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-8 text-center relative"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80')` 
      }}
    >
      <div className="max-w-4xl mx-auto py-16 z-10 text-white">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
          Find & Rent Your Dream Ride with <span className="text-blue-400">U Drive</span>
        </h1>
        <p className="text-xl text-gray-200 mb-10 leading-relaxed drop-shadow">
          Explore our wide selection of premium sedans, rugged SUVs, luxury cars, and bikes. Book in seconds and hit the road.
        </p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => navigate('/vehicles')}
            className="bg-blue-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-blue-700 transition text-lg">
            Browse All Vehicles
          </button>
          <button 
            onClick={() => navigate('/my-bookings')}
            className="bg-white/10 backdrop-blur-md border-2 border-white text-white font-bold px-8 py-4 rounded-xl shadow hover:bg-white/20 transition text-lg">
            View My Bookings
          </button>
        </div>
      </div>
    </div>
  );
}

//  Vehicle List with Dynamic Category Sections
function VehicleList({ searchQuery }) {
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/vehicles')
      .then(response => setVehicles(response.data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  const filteredVehicles = vehicles.filter(vehicle => {
    const query = searchQuery.toLowerCase();
    return (
      vehicle.make.toLowerCase().includes(query) ||
      vehicle.model.toLowerCase().includes(query) ||
      vehicle.category.toLowerCase().includes(query)
    );
  });

  // Extract unique categories dynamically (e.g., Sedan, SUV, Bike, Luxury)
  const uniqueCategories = [...new Set(filteredVehicles.map(v => v.category))];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        
        {filteredVehicles.length === 0 ? (
          <p className="text-center text-gray-500 text-xl mt-12">No vehicles found matching your search.</p>
        ) : (
          uniqueCategories.map(category => {
            // Get all vehicles belonging to this specific category
            const categoryVehicles = filteredVehicles.filter(v => v.category === category);

            return (
              <div key={category} className="mb-12">
                {/* Category Heading */}
                <h2 className="text-3xl font-bold text-blue-900 mb-6 border-b-2 border-blue-200 pb-2 flex items-center justify-between">
                  <span>{category}s</span>
                  <span className="text-sm font-normal text-gray-500">({categoryVehicles.length} available)</span>
                </h2>

                {/* Grid for this specific category */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryVehicles.map((vehicle) => (
                    <div key={vehicle._id} className="bg-white rounded-xl shadow-lg overflow-hidden transition hover:shadow-xl">
                      <img 
                        src={vehicle.imageUrl} 
                        alt={`${vehicle.make} ${vehicle.model}`} 
                        className="w-full h-56 object-cover" 
                      />
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-2xl font-bold text-gray-800">
                            {vehicle.make} {vehicle.model}
                          </h3>
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                            {vehicle.category}
                          </span>
                        </div>
                        <p className="text-xl font-extrabold text-green-600 mb-4">
                          ${vehicle.dailyRate} <span className="text-sm text-gray-500 font-normal">/ day</span>
                        </p>
                        <button 
                          onClick={() => navigate(`/book/${vehicle._id}`)}
                          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition">
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

//  Booking Screen with Live Price Calculation
function BookingScreen() {
  const { id } = useParams(); 
  const [vehicle, setVehicle] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/vehicles`)
      .then(response => {
        const found = response.data.find(v => v._id === id);
        if (found) setVehicle(found);
      })
      .catch(error => console.error("Error fetching vehicle details:", error));
  }, [id]);

  // Calculate live days and total price
  const calculateTotal = () => {
    if (!startDate || !endDate || !vehicle) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays * vehicle.dailyRate : 0;
  };

  const estimatedTotal = calculateTotal();

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/bookings', {
        vehicleId: id,
        startDate,
        endDate
      });
      setStatus(`Success! Booking confirmed. Total: $${response.data.totalPrice}`);
    } catch (error) {
      console.error(error);
      setStatus('Failed to create booking. Check terminal for errors.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Booking</h2>
        
        {vehicle ? (
          <div className="mb-6">
            <p className="text-xl font-semibold text-blue-900">{vehicle.make} {vehicle.model}</p>
            <p className="text-green-600 font-bold">${vehicle.dailyRate} <span className="text-sm text-gray-500 font-normal">/ day</span></p>
          </div>
        ) : (
          <p className="mb-6 text-gray-400 text-sm">Loading vehicle details...</p>
        )}
        
        <form onSubmit={handleBooking} className="flex flex-col gap-4 mb-6">
          <div className="text-left">
            <label className="block text-gray-700 font-semibold mb-1">Pickup Date</label>
            <input 
              type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-left">
            <label className="block text-gray-700 font-semibold mb-1">Return Date</label>
            <input 
              type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Live Price Display Box */}
          {estimatedTotal > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-blue-900 font-bold flex justify-between items-center">
              <span>Estimated Total:</span>
              <span className="text-xl text-green-600">${estimatedTotal}</span>
            </div>
          )}

          <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition mt-2">
            Confirm Booking
          </button>
        </form>

        {status && (
          <div className="mb-6 p-3 rounded-lg bg-blue-50 text-blue-800 font-semibold border border-blue-200">
            {status}
          </div>
        )}

        <Link to="/" className="text-blue-600 hover:underline font-semibold">
          ← Back to Vehicles
        </Link>
      </div>
    </div>
  );
}
// Registration Screen Component
function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center pt-20 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Create an Account</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input 
            type="text" placeholder="Full Name" required value={name} onChange={e => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          <input 
            type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          <input 
            type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
            Sign Up
          </button>
        </form>
        {message && <p className="mt-4 text-center font-semibold text-green-600">{message}</p>}
      </div>
    </div>
  );
}

//  Login Screen Component
function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userName', response.data.user.name);
      setMessage('Login successful! Welcome back.');
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center pt-20 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Welcome Back</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input 
            type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          <input 
            type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
            Login
          </button>
        </form>
        {message && <p className="mt-4 text-center font-semibold text-blue-600">{message}</p>}
      </div>
    </div>
  );
}

//  My Bookings Dashboard Component with Delete Functionality
function MyBookingsScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/bookings')
      .then(response => {
        setBookings(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      });
  }, []);

  // Handle cancellation/deletion request
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`);
      // Filter out the deleted booking from local state instantly
      setBookings(bookings.filter(booking => booking._id !== id));
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Your Reservation History</h1>
        
        {loading ? (
          <p className="text-gray-600">Loading your bookings...</p>
        ) : bookings.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow text-center">
            <p className="text-gray-500 mb-4 text-lg">You haven't booked any vehicles yet.</p>
            <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
              Browse Vehicles
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-50 text-blue-900 border-b border-gray-200">
                  <th className="p-4 font-semibold">Vehicle</th>
                  <th className="p-4 font-semibold">Start Date</th>
                  <th className="p-4 font-semibold">Return Date</th>
                  <th className="p-4 font-semibold">Total Price</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="p-4 font-bold text-gray-800">
                      {booking.vehicle ? `${booking.vehicle.make} ${booking.vehicle.model}` : 'Vehicle Unavailable'}
                    </td>
                    <td className="p-4 text-gray-600">{booking.startDate?.slice(0, 10)}</td>
                    <td className="p-4 text-gray-600">{booking.endDate?.slice(0, 10)}</td>
                    <td className="p-4 font-bold text-green-600">${booking.totalPrice}</td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleDelete(booking._id)}
                        className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm font-semibold hover:bg-red-200 transition">
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Smart Navigation Bar Component
function Navbar({ searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-900 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold tracking-wider flex items-center gap-2">
          <span className="text-blue-400">U</span>Drive
        </Link>
        
        <div className="hidden md:flex flex-1 mx-12">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by make, model, or category..." 
            className="w-full bg-white px-4 py-2 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner"
          />
        </div>

        <div className="flex gap-6 items-center font-semibold">
          <Link to="/" className="hover:text-blue-300 transition">Home</Link>
           <Link to="/vehicles" className="hover:text-blue-300 transition">Vehicles</Link>
          
          <Link to="/my-bookings" className="hover:text-blue-300 transition">My Bookings</Link>
          
          <div className="h-6 w-px bg-blue-700 mx-2"></div>

          {token ? (
            <div className="flex items-center gap-4">
              <span className="text-blue-200">Hello, {userName}</span>
              <button 
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition shadow-sm text-sm">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-300 transition">Login</Link>
              <Link to="/register" className="bg-white text-blue-900 px-5 py-2 rounded-full hover:bg-gray-100 transition shadow-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

//  Main App Component
function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <BrowserRouter>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> 
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/vehicles" element={<VehicleList searchQuery={searchQuery} />} />
        <Route path="/book/:id" element={<BookingScreen />} />
        <Route path="/my-bookings" element={<MyBookingsScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;