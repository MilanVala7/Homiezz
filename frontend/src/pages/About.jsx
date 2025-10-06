import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Home,
  Users,
  Shield,
  Heart,
  Star,
  MapPin,
  Phone,
  Mail,
  Award,
  Target,
  Lightbulb,
  CheckCircle,
  ArrowRight,
} from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"


export default function AboutPage() {
  const stats = [
    { number: "50,000+", label: "Happy Users", icon: Users },
    { number: "25,000+", label: "Properties Listed", icon: Home },
    { number: "15,000+", label: "Successful Matches", icon: Heart },
    { number: "4.8/5", label: "Average Rating", icon: Star },
  ]

  const team = [
    {
      name: "Priya Sharma",
      role: "CEO & Founder",
      image: "/professional-person.png",
      description: "10+ years in real estate technology",
    },
    {
      name: "Arjun Patel",
      role: "CTO",
      image: "/professional-person.png",
      description: "Former Google engineer, AI specialist",
    },
    {
      name: "Sneha Gupta",
      role: "Head of Operations",
      image: "/professional-person.png",
      description: "Expert in customer experience",
    },
    {
      name: "Rahul Singh",
      role: "Head of Marketing",
      image: "/professional-person.png",
      description: "Growth hacking specialist",
    },
  ]

  const values = [
    {
      icon: Shield,
      title: "Safety First",
      description: "Every user is verified through Aadhar authentication and background checks.",
    },
    {
      icon: Heart,
      title: "Community Focused",
      description: "Building meaningful connections between roommates and property owners.",
    },
    {
      icon: Target,
      title: "Smart Matching",
      description: "AI-powered algorithms to find the perfect roommate or property match.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Constantly improving our platform with cutting-edge technology.",
    },
  ]

  const milestones = [
    { year: "2020", event: "RoomMate founded with a vision to simplify room finding" },
    { year: "2021", event: "Launched in 5 major cities with 1,000+ properties" },
    { year: "2022", event: "Introduced AI-powered roommate matching algorithm" },
    { year: "2023", event: "Expanded to 15 cities, 25,000+ properties listed" },
    { year: "2024", event: "50,000+ users and industry recognition awards" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About{" "}
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              RoomMate
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We're revolutionizing how people find rooms and roommates in India. Our mission is to make accommodation
            hunting safe, simple, and stress-free for everyone.
          </p>
          <div className="flex justify-center space-x-4">
            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-3">
              Join Our Community
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" className="px-8 py-3 bg-transparent">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <stat.icon className="h-8 w-8 mx-auto text-orange-600 mb-4" />
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                RoomMate was born from personal experience. Our founders struggled to find safe, affordable
                accommodation while studying and working in different cities. The process was time-consuming,
                unreliable, and often unsafe.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We realized that millions of students, professionals, and families face the same challenges every day.
                That's when we decided to build a platform that would make room finding transparent, secure, and
                efficient.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, RoomMate is India's most trusted platform for finding rooms and roommates, with advanced
                verification systems, AI-powered matching, and a community of over 50,000 happy users.
              </p>
            </div>
            <div className="relative">
              <img src="/modern-luxury-apartment.png" alt="Our Story" className="rounded-2xl shadow-2xl" />
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 rounded-xl shadow-lg">
                <Award className="h-8 w-8 mb-2" />
                <div className="font-bold">Best PropTech</div>
                <div className="text-sm opacity-90">Startup 2024</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and help us build a platform that truly serves our community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow"
              >
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're a passionate team of technologists, designers, and real estate experts working to transform the
              accommodation industry.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow"
              >
                <CardContent className="pt-8">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={member.image || "/placeholder.svg"} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-orange-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From a small startup to India's leading roommate finding platform.
            </p>
          </div>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <Card className="flex-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant="secondary" className="mb-2">
                          {milestone.year}
                        </Badge>
                        <p className="text-gray-900 font-medium">{milestone.event}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white">
            <CardContent className="py-16 text-center">
              <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Have questions or want to partner with us? We'd love to hear from you.
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-8">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>hello@roommate.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Mumbai, India</span>
                </div>
              </div>
              <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3">Contact Us Today</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
