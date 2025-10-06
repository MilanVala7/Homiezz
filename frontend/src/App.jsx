import React, { Suspense, useEffect } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import FancyLoader from "./components/Loading";
import HomePage from "./pages/HomePage";
import CreateProfileForm from "./pages/CreateUserProfile";
import FindRoomsPage from "./pages/FindRooms";
import FindRoommatesPage from "./pages/FindRoommates";
import AboutPage from "./pages/About";
import ViewDetailsPage from "./pages/ViewDetails";
import ResetPassword from "./pages/ResetPassword";
import { useAuthStore } from "./store/userStore";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import Contact from "./pages/Contact";
import AddRoomPage from "./pages/AddRoomPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup"; 
import AccommodationMap from "./pages/AccommodationMap";
import RoommateProfilePage from "./pages/RoommateProfilePage";

const App = () => {
  return (
    <Suspense fallback={<FancyLoader />}>
      <Router>
        <AppContent />
      </Router>
    </Suspense>
  );
};

const AppContent = () => {
  const { checkAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/createUserProfile"
          element={
            <div className="container mx-auto py-8">
              <CreateProfileForm />
            </div>
          }
        />
        <Route path="/find-rooms" element={<FindRoomsPage />} />
        <Route path="/find-roommates" element={<FindRoommatesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/room/:id" element={<ViewDetailsPage />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/add-rooms" element={<AddRoomPage />} />
        <Route path="/map"  element={<AccommodationMap />}/>
        <Route path="/roommate-profile" element={<RoommateProfilePage />} />
      </Routes>
    </div>
  );
};


export default App;