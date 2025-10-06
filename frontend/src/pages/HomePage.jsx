import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Users,
  Shield,
  Search,
  Home,
  MessageCircle,
  Star,
  Sparkles,
  Heart,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navbar />

      {/* Hero Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-300/20 to-amber-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-300/20 to-orange-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="mb-6">
            <Badge className="mb-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 text-sm font-medium">
              <Sparkles className="h-4 w-4 mr-2" />
              Trusted by 50,000+ Users
            </Badge>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Find Your Perfect{" "}
            <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent animate-pulse">
              Roommate
            </span>{" "}
            &{" "}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse">
              Home
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Discover safe, verified accommodations and connect with like-minded
            roommates. Your perfect living situation is just a search away. ✨
          </p>

          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-4 p-3 bg-white rounded-2xl border border-orange-200 shadow-2xl backdrop-blur-sm">
              <div className="flex-1">
                <Input
                  placeholder="🏠 Enter city, area, or landmark..."
                  className="border-0 bg-transparent text-lg placeholder:text-gray-500 focus:ring-0"
                />
              </div>
              <Button
                size="lg"
                className="px-10 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg rounded-xl"
              >
                <Search className="h-5 w-5 mr-2" />
                Search Now
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="px-10 py-4 text-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-xl rounded-xl transform hover:scale-105 transition-all"
            >
              <Users className="h-6 w-6 mr-3" />
              <Link to="/find-roommates">Find Roommates</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-10 py-4 text-lg border-2 border-orange-300 text-orange-700 shadow-xl rounded-xl transform hover:scale-105 transition-all bg-transparent"
            >
              <Home className="h-6 w-6 mr-3" />
              <Link to="/find-rooms">Browse Rooms</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2">
              Why Choose Us
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Homiezz?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of roommate and accommodation finding
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-orange-50/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">
                  Verified & Safe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg text-gray-600 leading-relaxed">
                  All users verified with Aadhar authentication. Your safety is
                  our top priority with 24/7 support.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-amber-50/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">
                  Smart Matching
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg text-gray-600 leading-relaxed">
                  AI-powered matching based on preferences, lifestyle, and
                  location for perfect compatibility.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-yellow-50/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">
                  Easy Communication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg text-gray-600 leading-relaxed">
                  Built-in messaging system with video calls to connect with
                  potential roommates instantly.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2">
              <TrendingUp className="h-4 w-4 mr-2" />
              Most Popular
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Listings
            </h2>
            <p className="text-xl text-gray-600">
              Handpicked accommodations just for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm"
              >
                <div className="aspect-video bg-gradient-to-br from-orange-100 to-amber-100 relative overflow-hidden">
                  <img
                    src={`/modern-luxury-apartment.png?key=6s1of&height=250&width=400&query=modern luxury apartment room ${i}`}
                    alt={`Room ${i}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 text-lg font-bold shadow-lg">
                    ₹{12000 + i * 2000}/month
                  </Badge>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-orange-600 px-2 py-1">
                      <Heart className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-xl">
                    Luxury 2BHK Apartment
                    <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm ml-1 font-bold text-yellow-700">
                        4.{8 + i}
                      </span>
                    </div>
                  </CardTitle>
                  <CardDescription className="flex items-center text-base">
                    <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                    Koramangala, Bangalore
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Fully furnished premium room with Wi-Fi, AC, gym access, and
                    nearby metro connectivity.
                  </p>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg rounded-xl py-3">
                    <Link to="/view-details">View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Sign Up",
                desc: "Create your profile with Aadhar verification",
              },
              {
                step: "2",
                title: "Set Preferences",
                desc: "Tell us about your ideal living situation",
              },
              {
                step: "3",
                title: "Browse & Match",
                desc: "Explore listings and connect with roommates",
              },
              {
                step: "4",
                title: "Move In",
                desc: "Finalize your perfect living arrangement",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of users who have found their ideal roommates and
            homes through our platform.
          </p>
          <Button
            size="lg"
            className="px-16 py-6 text-xl bg-white text-orange-600 hover:bg-gray-100 shadow-2xl rounded-2xl transform hover:scale-105 transition-all"
          >
            <Sparkles className="h-6 w-6 mr-3" />
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
