import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import {
  MapPin,
  Search,
  MessageCircle,
  Star,
  Filter,
  Heart,
  Briefcase,
  GraduationCap,
  Coffee,
  Music,
  Gamepad2,
  Book,
  Dumbbell,
  Shield,
  Calendar,
  Clock,
  User,
} from "lucide-react"
import Navbar from "@/components/Navbar"
import { useRoommateStore } from "@/store/roommateStore";

export default function FindRoommatesPage() {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Zustand store
  const {
    roommates,
    loading,
    error,
    filters,
    pagination,
    getRoommates,
    setFilters,
    sendRoommateMessage,
    clearError
  } = useRoommateStore();

  // Fetch roommates on component mount
  useEffect(() => {
    fetchRoommates();
  }, []);

  // Clear error when component unmounts
  useEffect(() => {
    return () => clearError();
  }, []);

  const fetchRoommates = async (newFilters = {}) => {
    try {
      await getRoommates(newFilters);
    } catch (error) {
      console.error('Error fetching roommates:', error);
    }
  };

  const handleSearch = () => {
    fetchRoommates();
  };

  const handleFilterChange = (key, value) => {
    setFilters({ [key]: value });
  };

  const handleLifestyleToggle = (lifestyle) => {
    const currentLifestyle = filters.lifestyle || [];
    const newLifestyle = currentLifestyle.includes(lifestyle)
      ? currentLifestyle.filter(item => item !== lifestyle)
      : [...currentLifestyle, lifestyle];
    
    setFilters({ lifestyle: newLifestyle });
  };

  const handleInterestToggle = (interest) => {
    const currentInterests = filters.interests || [];
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter(item => item !== interest)
      : [...currentInterests, interest];
    
    setFilters({ interests: newInterests });
  };

  const handleSortChange = (value) => {
    handleFilterChange('sortBy', value);
    fetchRoommates({ ...filters, sortBy: value });
  };

  const handleSendMessage = async (roommateId) => {
    try {
      await sendRoommateMessage(roommateId, "Hi, I'm interested in being roommates!");
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading roommates...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Find Your Perfect Roommate</h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Connect with like-minded people who share your lifestyle, interests, and living preferences.
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-2xl shadow-2xl">
              <div className="flex-1">
                <Input
                  placeholder="👥 Enter city, area, or preferences..."
                  className="border-0 bg-transparent text-lg placeholder:text-gray-500 focus:ring-0"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Select value={filters.gender} onValueChange={(value) => handleFilterChange('gender', value)}>
                <SelectTrigger className="w-full md:w-48 border-0 bg-gray-50">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Any">Any</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="lg"
                className="px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg"
                onClick={handleSearch}
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Error Display */}
      {error && (
        <div className="container mx-auto px-4 mt-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Results Section */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Available Roommates</h2>
                <p className="text-gray-600">
                  {pagination?.totalResults || roommates.length} potential roommates found
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Select value={filters.sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Recently Joined</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="budget-low">Budget: Low to High</SelectItem>
                    <SelectItem value="budget-high">Budget: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Roommate Profiles */}
            <div className="grid gap-6">
              {roommates.map((roommate) => (
                <RoommateCard 
                  key={roommate._id} 
                  roommate={roommate}
                  onSendMessage={handleSendMessage}
                />
              ))}
            </div>

            {roommates.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No roommates found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Roommate Card Component
function RoommateCard({ roommate, onSendMessage }) {
  const profile = roommate.roommateProfile;
  
  if (!profile) return null;

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 aspect-square relative">
          <img
            src={roommate.avatar || "/professional-person.png"}
            alt={`${roommate.name}'s profile`}
            className="w-full h-full object-cover"
          />
          <Button size="sm" variant="ghost" className="absolute top-3 right-3 bg-white/80 hover:bg-white">
            <Heart className="h-4 w-4" />
          </Button>
          {roommate.isVerified && (
            <Badge className="absolute bottom-3 left-3 bg-green-500 text-white flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
              Verified
            </Badge>
          )}
        </div>

        <div className="md:w-3/4 p-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-gray-900">{roommate.name}</h3>
                {roommate.isVerified && (
                  <Badge className="bg-blue-100 text-blue-700 flex items-center">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 flex items-center mb-1">
                <MapPin className="h-4 w-4 mr-1 text-purple-500" />
                {profile.currentLocation || profile.locationPreference}
              </p>
              <p className="text-gray-600 flex items-center">
                <User className="h-4 w-4 mr-1" />
                {profile.age} years • {profile.occupation}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-purple-600">
                ₹{profile.budget?.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">budget/month</div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Briefcase className="h-4 w-4 mr-1" />
              {profile.occupationType}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Available from {new Date(profile.moveInDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {profile.lifestyle?.sleepSchedule}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {profile.interests?.slice(0, 5).map((interest) => (
              <Badge key={interest} variant="secondary" className="bg-purple-100 text-purple-700">
                {interest}
              </Badge>
            ))}
          </div>

          <p className="text-gray-600 mb-4 line-clamp-2">
            {profile.bio || "Looking for a compatible roommate to share living space."}
          </p>

          <div className="flex gap-3">
            <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              View Profile
            </Button>
            <Button
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50 bg-transparent"
              onClick={() => onSendMessage(roommate._id)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}