import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Star,
  Wifi,
  Car,
  Utensils,
  Tv,
  Wind,
  Shield,
  Phone,
  MessageCircle,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  Home,
  DollarSign,
  Bed,
  Bath,
  Loader2,
  ArrowLeft,
  Send,
  Clock,
  UserCheck
} from "lucide-react"
import { useRoomStore } from "@/store/roomStore"
import { useAuthStore } from "@/store/userStore"
import { toast } from "react-hot-toast"

export default function ViewDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [requestMessage, setRequestMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { getRoomById, currentRoom, requestRoom } = useRoomStore()
  const { user } = useAuthStore()

  // Fetch room details when component mounts
  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!id) {
        toast.error("Room ID not found")
        navigate('/find-rooms')
        return
      }

      try {
        setLoading(true)
        const result = await getRoomById(id)
        if (!result.success) {
          toast.error("Room not found")
          navigate('/find-rooms')
        }
      } catch (error) {
        console.error('Error fetching room details:', error)
        toast.error("Failed to load room details")
        navigate('/find-rooms')
      } finally {
        setLoading(false)
      }
    }

    fetchRoomDetails()
  }, [id, getRoomById, navigate])

  const nextImage = () => {
    if (!currentRoom?.images) return
    setCurrentImageIndex((prev) => (prev + 1) % currentRoom.images.length)
  }

  const prevImage = () => {
    if (!currentRoom?.images) return
    setCurrentImageIndex((prev) => (prev - 1 + currentRoom.images.length) % currentRoom.images.length)
  }

  const handleContactOwner = () => {
    if (currentRoom?.owner?.phone) {
      window.open(`tel:${currentRoom.owner.phone}`, '_self')
    } else {
      toast.info("Owner contact information not available")
    }
  }

  const handleShareRoom = async () => {
    const shareUrl = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentRoom?.title || 'Room Listing',
          text: `Check out this room: ${currentRoom?.title}`,
          url: shareUrl,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl)
      toast.success("Link copied to clipboard!")
    }
  }

  const handleSendRequest = async () => {
    // Check if user is logged in
    if (!user) {
      toast.error("Please login to send a request")
      navigate('/login')
      return
    }

    // Check if user is trying to request their own room
    if (currentRoom?.owner?.id === user.id) {
      toast.error("You cannot request your own room")
      return
    }

    if (!requestMessage.trim()) {
      toast.error("Please enter a message for the owner")
      return
    }

    setIsSubmitting(true)
    try {
      console.log('Sending request for room:', id)
      const result = await requestRoom(id, requestMessage)
      
      if (result.success) {
        toast.success("Request sent successfully! The listing user will contact you soon.")
        setRequestMessage("")
      } else {
        toast.error(result.message || "Failed to send request")
      }
    } catch (error) {
      console.error('Error sending request:', error)
      toast.error("Failed to send request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleQuickMessage = (messageType) => {
    const listingUserName = currentRoom.owner?.name || 'there'
    const quickMessages = {
      visit: `Hi ${listingUserName}, I'm interested in visiting your room at ${currentRoom?.address?.area || 'this location'}. Please let me know your available timings.`,
      virtual: `Hi ${listingUserName}, I'm interested in your room and would like to request a virtual tour. Could you please share more details?`,
      general: `Hi ${listingUserName}, I'm interested in your room listing and would like to know more details. Please let me know when we can connect.`,
      immediate: `Hi ${listingUserName}, I'm very interested in this room and available for immediate move-in. Could you please share the next steps?`
    }
    setRequestMessage(quickMessages[messageType])
  }

  // Get the listing user type display text
  const getListingUserType = () => {
    if (currentRoom.metadata?.ownershipType === 'tenant') {
      return 'Tenant (Listing User)'
    }
    return 'Property Owner'
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading room details...</p>
        </div>
      </div>
    )
  }

  // Show error state if no room data
  if (!currentRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Room Not Found</h3>
          <p className="text-gray-600 mb-4">The room you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/find-rooms')}>
            Back to Rooms
          </Button>
        </div>
      </div>
    )
  }

  const images = currentRoom.images || ["/modern-luxury-apartment.png"]
  const amenitiesList = [
    { icon: Wifi, label: "High-Speed WiFi", id: "wifi" },
    { icon: Car, label: "Parking Available", id: "parking" },
    { icon: Utensils, label: "Fully Equipped Kitchen", id: "kitchen" },
    { icon: Tv, label: "Smart TV", id: "tv" },
    { icon: Wind, label: "Air Conditioning", id: "ac" },
    { icon: Shield, label: "Security System", id: "security" },
  ]

  // Filter amenities that are actually available
  const availableAmenities = amenitiesList.filter(amenity => 
    currentRoom.amenities?.includes(amenity.id)
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 border-b border-orange-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg">
              <img src="/logo.png" alt="Homiezz Logo" height={"40px"} width={"40px"}/>
            </div>
            <span 
              className="bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent animate-pulse text-4xl font-bold cursor-pointer" 
              onClick={() => navigate('/')}
            >
              Homiezz
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="border-orange-300 text-orange-700 hover:bg-orange-50 bg-transparent"
              onClick={handleShareRoom}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              variant="outline" 
              className={`border-orange-300 ${isLiked ? 'text-red-500' : 'text-orange-700'} hover:bg-orange-50 bg-transparent`}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
              {isLiked ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <div className="relative h-96">
                <img
                  src={images[currentImageIndex] || "/placeholder.svg"}
                  alt={currentRoom.title}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
                <Badge className="absolute top-4 left-4 bg-green-500 text-white">
                  {currentRoom.isVacant ? 'Available Now' : 'Occupied'}
                </Badge>
              </div>
            </Card>

            {/* Property Details */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {currentRoom.title}
                    </CardTitle>
                    <div className="flex items-center mt-2 text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>
                        {currentRoom.address?.area && `${currentRoom.address.area}, `}
                        {currentRoom.address?.city}, {currentRoom.address?.state}
                        {currentRoom.address?.zip && ` - ${currentRoom.address.zip}`}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-orange-600">
                      ₹{currentRoom.price?.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">per month</div>
                    {currentRoom.metadata?.securityDeposit > 0 && (
                      <div className="text-sm text-gray-500">
                        + ₹{currentRoom.metadata.securityDeposit.toLocaleString()} deposit
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">4.8</span>
                    <span className="ml-1 text-sm text-gray-500">(24 reviews)</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                  {currentRoom.metadata?.ownershipType === 'tenant' && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Sublet Available
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Home className="h-6 w-6 mx-auto text-orange-600 mb-2" />
                    <div className="text-sm font-medium">
                      {currentRoom.metadata?.bedrooms || 1} BHK
                    </div>
                    <div className="text-xs text-gray-500">
                      {currentRoom.metadata?.propertyType || 'Apartment'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Bed className="h-6 w-6 mx-auto text-orange-600 mb-2" />
                    <div className="text-sm font-medium">
                      {currentRoom.availableBeds} Beds
                    </div>
                    <div className="text-xs text-gray-500">Available</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Bath className="h-6 w-6 mx-auto text-orange-600 mb-2" />
                    <div className="text-sm font-medium">
                      {currentRoom.metadata?.bathrooms || 1} Bath
                    </div>
                    <div className="text-xs text-gray-500">Rooms</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Calendar className="h-6 w-6 mx-auto text-orange-600 mb-2" />
                    <div className="text-sm font-medium">
                      {currentRoom.isVacant ? 'Available Now' : 'Occupied'}
                    </div>
                    <div className="text-xs text-gray-500">Status</div>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {currentRoom.description || "No description provided."}
                  </p>
                </div>

                <Separator />

                {/* Amenities */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                  {availableAmenities.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableAmenities.map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                          <amenity.icon className="h-4 w-4 text-orange-600" />
                          <span className="text-sm">{amenity.label}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No amenities listed.</p>
                  )}
                </div>

                {/* Owner Details for Tenant Listings */}
                {currentRoom.metadata?.ownershipType === 'tenant' && currentRoom.metadata?.ownerDetails && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Owner Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Owner Name:</span>
                          <span className="font-medium">{currentRoom.metadata.ownerDetails.ownerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Contact:</span>
                          <span className="font-medium">{currentRoom.metadata.ownerDetails.ownerContact}</span>
                        </div>
                        {currentRoom.metadata.ownerDetails.permissionDetails && (
                          <div>
                            <span className="text-gray-600">Permission Details:</span>
                            <p className="text-sm text-gray-600 mt-1">
                              {currentRoom.metadata.ownerDetails.permissionDetails}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Listing User Info */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Listing User</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={currentRoom.owner?.avatar || "/professional-person.png"} />
                    <AvatarFallback>
                      {currentRoom.owner?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{currentRoom.owner?.name || 'Unknown User'}</div>
                    <div className="text-sm text-gray-500">
                      {getListingUserType()}
                    </div>
                    <div className="flex items-center mt-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs ml-1">4.9 (15 reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                    onClick={handleContactOwner}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Request Form - Always Visible */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm top-24">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <UserCheck className="h-5 w-5 mr-2 text-orange-500" />
                  Send Request
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quick Message Buttons */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Quick Messages</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start text-left h-auto py-2"
                      onClick={() => handleQuickMessage('visit')}
                    >
                      <Clock className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span className="text-xs">Schedule Visit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start text-left h-auto py-2"
                      onClick={() => handleQuickMessage('virtual')}
                    >
                      <span className="text-xs">Virtual Tour</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start text-left h-auto py-2"
                      onClick={() => handleQuickMessage('general')}
                    >
                      <span className="text-xs">More Info</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start text-left h-auto py-2"
                      onClick={() => handleQuickMessage('immediate')}
                    >
                      <span className="text-xs">Immediate Move-in</span>
                    </Button>
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Your Message to {currentRoom.owner?.name || 'Listing User'}
                  </label>
                  <textarea
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    placeholder="Introduce yourself and mention why you're interested in this room..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  onClick={handleSendRequest}
                  disabled={isSubmitting || !requestMessage.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Request to {currentRoom.metadata?.ownershipType === 'tenant' ? 'Tenant' : 'Owner'}
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Your request will be sent directly to {currentRoom.owner?.name || 'the listing user'}
                </p>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-gray-400" />
                  <span className="ml-2 text-gray-500">Map View</span>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="text-sm text-gray-600">
                    <strong>Full Address:</strong>
                  </div>
                  <p className="text-sm">
                    {currentRoom.address?.street}<br />
                    {currentRoom.address?.area && `${currentRoom.address.area}, `}
                    {currentRoom.address?.city}, {currentRoom.address?.state}
                    {currentRoom.address?.zip && ` - ${currentRoom.address.zip}`}
                  </p>
                  {currentRoom.metadata?.landmark && (
                    <div className="text-sm text-gray-600">
                      <strong>Landmark:</strong> {currentRoom.metadata.landmark}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}