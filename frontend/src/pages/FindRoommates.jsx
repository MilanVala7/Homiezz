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
  Home,
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
import { useState } from "react"
import Navbar from "@/components/Navbar"

export default function FindRoommatesPage() {
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Navigation */}
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
                />
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-48 border-0 bg-gray-50">
                  <SelectValue placeholder="Age Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-25">18-25 years</SelectItem>
                  <SelectItem value="26-30">26-30 years</SelectItem>
                  <SelectItem value="31-35">31-35 years</SelectItem>
                  <SelectItem value="35+">35+ years</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="lg"
                className="px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Results */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Button */}
            <div className="mb-4 lg:hidden flex justify-end">
              <Button
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50 bg-transparent flex items-center gap-2"
                onClick={() => setShowMobileFilters(true)}
              >
                <Filter className="h-5 w-5" />
                Filters
              </Button>
            </div>
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              {/* Desktop Filters */}
              <div className="hidden lg:block">
                <Card className="sticky top-24 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <Filter className="h-5 w-5 mr-2 text-purple-600" />
                      Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Budget Range */}
                    <div>
                      <h3 className="font-semibold mb-3 text-gray-900">Budget Range</h3>
                      <div className="px-2">
                        <Slider defaultValue={[8000, 20000]} max={40000} min={2000} step={1000} className="w-full" />
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                          <span>₹8,000</span>
                          <span>₹20,000</span>
                        </div>
                      </div>
                    </div>

                    {/* Gender Preference */}
                    <div>
                      <h3 className="font-semibold mb-3 text-gray-900">Gender Preference</h3>
                      <div className="space-y-2">
                        {["Male", "Female", "Any"].map((gender) => (
                          <div key={gender} className="flex items-center space-x-2">
                            <Checkbox id={gender} />
                            <label htmlFor={gender} className="text-sm text-gray-700">
                              {gender}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Occupation */}
                    <div>
                      <h3 className="font-semibold mb-3 text-gray-900">Occupation</h3>
                      <div className="space-y-2">
                        {[
                          { name: "Working Professional", icon: Briefcase },
                          { name: "Student", icon: GraduationCap },
                          { name: "Freelancer", icon: Coffee },
                        ].map((occupation) => (
                          <div key={occupation.name} className="flex items-center space-x-2">
                            <Checkbox id={occupation.name} />
                            <occupation.icon className="h-4 w-4 text-gray-500" />
                            <label htmlFor={occupation.name} className="text-sm text-gray-700">
                              {occupation.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Lifestyle */}
                    <div>
                      <h3 className="font-semibold mb-3 text-gray-900">Lifestyle</h3>
                      <div className="space-y-2">
                        {["Non-Smoker", "Non-Drinker", "Pet Friendly", "Vegetarian", "Night Owl", "Early Bird"].map(
                          (lifestyle) => (
                            <div key={lifestyle} className="flex items-center space-x-2">
                              <Checkbox id={lifestyle} />
                              <label htmlFor={lifestyle} className="text-sm text-gray-700">
                                {lifestyle}
                              </label>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    {/* Interests */}
                    <div>
                      <h3 className="font-semibold mb-3 text-gray-900">Interests</h3>
                      <div className="space-y-2">
                        {[
                          { name: "Music", icon: Music },
                          { name: "Gaming", icon: Gamepad2 },
                          { name: "Reading", icon: Book },
                          { name: "Fitness", icon: Dumbbell },
                        ].map((interest) => (
                          <div key={interest.name} className="flex items-center space-x-2">
                            <Checkbox id={interest.name} />
                            <interest.icon className="h-4 w-4 text-gray-500" />
                            <label htmlFor={interest.name} className="text-sm text-gray-700">
                              {interest.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      Apply Filters
                    </Button>
                  </CardContent>
                </Card>
              </div>
              {/* Mobile Filters Modal */}
              {showMobileFilters && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 lg:hidden">
                  <div className="bg-white rounded-2xl shadow-2xl w-[90vw] max-w-md p-6 relative overflow-y-auto max-h-[90vh]">
                    <button
                      className="absolute top-3 right-3 text-gray-500 hover:text-purple-600 text-xl"
                      onClick={() => setShowMobileFilters(false)}
                      aria-label="Close"
                    >
                      &times;
                    </button>
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl">
                        <Filter className="h-5 w-5 mr-2 text-purple-600" />
                        Filters
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Budget Range */}
                      <div>
                        <h3 className="font-semibold mb-3 text-gray-900">Budget Range</h3>
                        <div className="px-2">
                          <Slider defaultValue={[8000, 20000]} max={40000} min={2000} step={1000} className="w-full" />
                          <div className="flex justify-between text-sm text-gray-600 mt-2">
                            <span>₹8,000</span>
                            <span>₹20,000</span>
                          </div>
                        </div>
                      </div>
                      {/* Gender Preference */}
                      <div>
                        <h3 className="font-semibold mb-3 text-gray-900">Gender Preference</h3>
                        <div className="space-y-2">
                          {["Male", "Female", "Any"].map((gender) => (
                            <div key={gender} className="flex items-center space-x-2">
                              <Checkbox id={gender} />
                              <label htmlFor={gender} className="text-sm text-gray-700">
                                {gender}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Occupation */}
                      <div>
                        <h3 className="font-semibold mb-3 text-gray-900">Occupation</h3>
                        <div className="space-y-2">
                          {[
                            { name: "Working Professional", icon: Briefcase },
                            { name: "Student", icon: GraduationCap },
                            { name: "Freelancer", icon: Coffee },
                          ].map((occupation) => (
                            <div key={occupation.name} className="flex items-center space-x-2">
                              <Checkbox id={occupation.name} />
                              <occupation.icon className="h-4 w-4 text-gray-500" />
                              <label htmlFor={occupation.name} className="text-sm text-gray-700">
                                {occupation.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Lifestyle */}
                      <div>
                        <h3 className="font-semibold mb-3 text-gray-900">Lifestyle</h3>
                        <div className="space-y-2">
                          {["Non-Smoker", "Non-Drinker", "Pet Friendly", "Vegetarian", "Night Owl", "Early Bird"].map(
                            (lifestyle) => (
                              <div key={lifestyle} className="flex items-center space-x-2">
                                <Checkbox id={lifestyle} />
                                <label htmlFor={lifestyle} className="text-sm text-gray-700">
                                  {lifestyle}
                                </label>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                      {/* Interests */}
                      <div>
                        <h3 className="font-semibold mb-3 text-gray-900">Interests</h3>
                        <div className="space-y-2">
                          {[
                            { name: "Music", icon: Music },
                            { name: "Gaming", icon: Gamepad2 },
                            { name: "Reading", icon: Book },
                            { name: "Fitness", icon: Dumbbell },
                          ].map((interest) => (
                            <div key={interest.name} className="flex items-center space-x-2">
                              <Checkbox id={interest.name} />
                              <interest.icon className="h-4 w-4 text-gray-500" />
                              <label htmlFor={interest.name} className="text-sm text-gray-700">
                                {interest.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                        Apply Filters
                      </Button>
                    </CardContent>
                  </div>
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="lg:w-3/4">
              {/* Results Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Available Roommates</h2>
                  <p className="text-gray-600">847 potential roommates found in Bangalore</p>
                </div>
                <div className="flex items-center gap-4">
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compatibility">Best Match</SelectItem>
                      <SelectItem value="newest">Recently Joined</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="budget">Budget Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Roommate Profiles */}
              <div className="grid gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card
                    key={i}
                    className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 aspect-square relative">
                        <img
                          src={`/professional-person.png?height=200&width=200&query=professional person ${i} portrait`}
                          alt={`Profile ${i}`}
                          className="w-full h-full object-cover"
                        />
                        <Button size="sm" variant="ghost" className="absolute top-3 right-3 bg-white/80 hover:bg-white">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Badge className="absolute bottom-3 left-3 bg-green-500 text-white flex items-center">
                          <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                          Online
                        </Badge>
                      </div>

                      <div className="md:w-3/4 p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">
                                {["Priya", "Rahul", "Sneha", "Arjun", "Kavya", "Vikram"][i - 1]} S.
                              </h3>
                              <Badge className="bg-blue-100 text-blue-700 flex items-center">
                                <Shield className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                              <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
                                <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                                <span className="text-yellow-700 font-medium text-sm">4.{8 + i}</span>
                              </div>
                            </div>
                            <p className="text-gray-600 flex items-center mb-1">
                              <MapPin className="h-4 w-4 mr-1 text-purple-500" />
                              Koramangala, Bangalore
                            </p>
                            <p className="text-gray-600 flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {25 + i} years •{" "}
                              {
                                [
                                  "Software Engineer",
                                  "Marketing Manager",
                                  "Data Analyst",
                                  "Designer",
                                  "Product Manager",
                                  "Consultant",
                                ][i - 1]
                              }
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-purple-600">
                              ₹{(8000 + i * 2000).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">budget/month</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1" />
                            Working Professional
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Available from {["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i - 1]} 2024
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {i % 2 === 0 ? "Night Owl" : "Early Bird"}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {[
                            ["Non-Smoker", "Vegetarian", "Pet Friendly"],
                            ["Music Lover", "Fitness", "Reading"],
                            ["Gaming", "Cooking", "Travel"],
                            ["Photography", "Yoga", "Movies"],
                            ["Dancing", "Art", "Tech"],
                            ["Sports", "Nature", "Books"],
                          ][i - 1].map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-purple-100 text-purple-700">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-2">
                          Looking for a clean, friendly roommate to share a 2BHK apartment. I work in tech, love
                          cooking, and enjoy weekend movie marathons. Prefer someone who values cleanliness and mutual
                          respect.
                        </p>

                        <div className="flex gap-3">
                          <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                            View Profile
                          </Button>
                          <Button
                            variant="outline"
                            className="border-purple-300 text-purple-700 hover:bg-purple-50 bg-transparent"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-12">
                <div className="flex gap-2">
                  <Button variant="outline" disabled>
                    Previous
                  </Button>
                  <Button className="bg-purple-500 text-white">1</Button>
                  <Button variant="outline">2</Button>
                  <Button variant="outline">3</Button>
                  <Button variant="outline">...</Button>
                  <Button variant="outline">12</Button>
                  <Button variant="outline">Next</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
