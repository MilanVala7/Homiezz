import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import {
  MapPin,
  Users,
  Search,
  Home,
  MessageCircle,
  Star,
  Filter,
  Heart,
  Wifi,
  Car,
  Dumbbell,
  Coffee,
  Bath,
  Bed,
  Grid,
  List,
  Loader2,
  Eye
} from "lucide-react"
import Navbar from "@/components/Navbar"
import { useRoomStore } from "@/store/roomStore"
import { useNavigate } from "react-router-dom"

export default function FindRoomsPage() {
  const { getRooms, rooms, loading, pagination } = useRoomStore()
  const navigate = useNavigate()
  
  const [filters, setFilters] = useState({
    search: "",
    city: "",
    minPrice: "",
    maxPrice: "",
    roomType: "",
    amenities: [],
    propertyType: "",
    furnishing: "",
    sortBy: "newest",
    page: 1,
    limit: 6
  })

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      search: "",
      propertyType: "",
      city: ""
    }
  })

  // Watch form values
  const searchValue = watch("search")
  const propertyTypeValue = watch("propertyType")
  const cityValue = watch("city")

  // Fetch rooms when filters change
  useEffect(() => {
    const fetchRooms = async () => {
      await getRooms(filters)
    }
    fetchRooms()
  }, [filters, getRooms])

  // Update filters when form values change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        search: searchValue,
        propertyType: propertyTypeValue,
        city: cityValue,
        page: 1 // Reset to first page when search changes
      }))
    }, 500) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchValue, propertyTypeValue, cityValue])

  const handleSearchSubmit = (data) => {
    setFilters(prev => ({
      ...prev,
      search: data.search,
      propertyType: data.propertyType,
      city: data.city,
      page: 1
    }))
  }

  const handlePriceChange = (value) => {
    setFilters(prev => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1],
      page: 1
    }))
  }

  const handleRoomTypeChange = (type, checked) => {
    setFilters(prev => ({
      ...prev,
      roomType: checked ? type : "",
      page: 1
    }))
  }

  const handleAmenityChange = (amenity, checked) => {
    setFilters(prev => {
      const amenities = checked 
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(a => a !== amenity)
      
      return {
        ...prev,
        amenities,
        page: 1
      }
    })
  }

  const handleFurnishingChange = (value) => {
    setFilters(prev => ({
      ...prev,
      furnishing: value,
      page: 1
    }))
  }

  const handleSortChange = (value) => {
    setFilters(prev => ({
      ...prev,
      sortBy: value,
      page: 1
    }))
  }

  const handlePageChange = (page) => {
    setFilters(prev => ({
      ...prev,
      page
    }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleViewDetails = (roomId) => {
    navigate(`/room/${roomId}`)
  }

  const handleContact = (room) => {
    // You can implement contact logic here
    console.log("Contact room owner:", room.owner)
    // Could open a modal or redirect to chat
  }

  const handleAddToFavorites = (roomId) => {
    // Implement favorite functionality
    console.log("Add to favorites:", roomId)
  }

  const roomTypeOptions = ["Single Room", "1 BHK", "2 BHK", "3 BHK", "Shared Room"]
  const amenityOptions = [
    { id: "wifi", name: "Wi-Fi", icon: Wifi },
    { id: "parking", name: "Parking", icon: Car },
    { id: "gym", name: "Gym", icon: Dumbbell },
    { id: "kitchen", name: "Kitchen", icon: Coffee },
    { id: "bath", name: "Attached Bath", icon: Bath },
  ]

  const renderPagination = () => {
    if (!pagination || pagination.total <= 1) return null

    const pages = []
    const totalPages = pagination.total
    const currentPage = pagination.current

    // Always show first page
    pages.push(1)

    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i)
      }
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    // Remove duplicates and sort
    const uniquePages = [...new Set(pages)].sort((a, b) => a - b)

    return (
      <div className="flex justify-center mt-12">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            disabled={!pagination.hasPrev}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>
          
          {uniquePages.map((page, index) => {
            // Add ellipsis if there's a gap
            const showEllipsis = index > 0 && page - uniquePages[index - 1] > 1
            return (
              <div key={page} className="flex items-center">
                {showEllipsis && (
                  <Button variant="outline" disabled className="px-3">
                    ...
                  </Button>
                )}
                <Button
                  className={page === currentPage ? "bg-orange-500 text-white" : "bg-transparent"}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              </div>
            )
          })}
          
          <Button 
            variant="outline" 
            disabled={!pagination.hasNext}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Find Your Perfect Room</h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Discover thousands of verified rooms and apartments across India. Your dream home awaits!
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit(handleSearchSubmit)}>
              <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-2xl shadow-2xl">
                <div className="flex-1">
                  <Input
                    placeholder="🏠 Enter city, area, or landmark..."
                    className="border-0 bg-transparent text-lg placeholder:text-gray-500 focus:ring-0"
                    {...register("search")}
                  />
                </div>
                <Select onValueChange={(value) => setValue("propertyType", value)} value={propertyTypeValue}>
                  <SelectTrigger className="w-full md:w-48 border-0 bg-gray-50">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="pg">PG</SelectItem>
                    <SelectItem value="hostel">Hostel</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="submit"
                  size="lg"
                  className="px-8 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Filters and Results */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <Card className="sticky top-24 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Filter className="h-5 w-5 mr-2 text-orange-600" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Price Range */}
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-900">Price Range</h3>
                    <div className="px-2">
                      <Slider 
                        defaultValue={[5000, 25000]} 
                        max={50000} 
                        min={1000} 
                        step={1000} 
                        className="w-full"
                        onValueChange={handlePriceChange}
                      />
                      <div className="flex justify-between text-sm text-gray-600 mt-2">
                        <span>₹{filters.minPrice || 5000}</span>
                        <span>₹{filters.maxPrice || 25000}</span>
                      </div>
                    </div>
                  </div>

                  {/* Room Type */}
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-900">Room Type</h3>
                    <div className="space-y-2">
                      {roomTypeOptions.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox 
                            id={type}
                            checked={filters.roomType === type}
                            onCheckedChange={(checked) => handleRoomTypeChange(type, checked)}
                          />
                          <label htmlFor={type} className="text-sm text-gray-700 cursor-pointer">
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-900">Amenities</h3>
                    <div className="space-y-2">
                      {amenityOptions.map((amenity) => (
                        <div key={amenity.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={amenity.id}
                            checked={filters.amenities.includes(amenity.id)}
                            onCheckedChange={(checked) => handleAmenityChange(amenity.id, checked)}
                          />
                          <amenity.icon className="h-4 w-4 text-gray-500" />
                          <label htmlFor={amenity.id} className="text-sm text-gray-700 cursor-pointer">
                            {amenity.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Furnishing */}
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-900">Furnishing</h3>
                    <Select onValueChange={handleFurnishingChange} value={filters.furnishing}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select furnishing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fully">Fully Furnished</SelectItem>
                        <SelectItem value="semi">Semi Furnished</SelectItem>
                        <SelectItem value="unfurnished">Unfurnished</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                    onClick={() => setFilters(prev => ({ ...prev, page: 1 }))}
                  >
                    Apply Filters
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="lg:w-3/4">
              {/* Results Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Available Rooms</h2>
                  <p className="text-gray-600">
                    {loading ? "Loading..." : `${pagination?.totalResults || 0} properties found`}
                    {filters.city && ` in ${filters.city}`}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Select onValueChange={handleSortChange} value={filters.sortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex border border-gray-300 rounded-lg">
                    <Button variant="ghost" size="sm" className="px-3">
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="px-3">
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Room Listings */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-500 mr-2" />
                  <span className="text-gray-600">Loading rooms...</span>
                </div>
              ) : rooms.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No rooms found</h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your filters or search criteria to find more results.
                    </p>
                    <Button 
                      onClick={() => setFilters({
                        search: "",
                        city: "",
                        minPrice: "",
                        maxPrice: "",
                        roomType: "",
                        amenities: [],
                        propertyType: "",
                        furnishing: "",
                        sortBy: "newest",
                        page: 1,
                        limit: 6
                      })}
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="grid gap-6">
                    {rooms.map((room) => (
                      <Card
                        key={room._id}
                        className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3 aspect-video md:aspect-square relative">
                            <img
                              src={room.images?.[0] || "/placeholder-room.jpg"}
                              alt={room.title}
                              className="w-full h-full object-cover"
                            />
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                              onClick={() => handleAddToFavorites(room._id)}
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Badge className="absolute bottom-3 left-3 bg-green-500 text-white">
                              {room.isVacant ? 'Available Now' : 'Occupied'}
                            </Badge>
                          </div>

                          <div className="md:w-2/3 p-6">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{room.title}</h3>
                                <p className="text-gray-600 flex items-center">
                                  <MapPin className="h-4 w-4 mr-1 text-orange-500" />
                                  {room.address?.area && `${room.address.area}, `}
                                  {room.address?.city}, {room.address?.state}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-orange-600">
                                  ₹{room.price?.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-500">per month</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Bed className="h-4 w-4 mr-1" />
                                {room.metadata?.bedrooms || room.availableBeds} Bedrooms
                              </div>
                              <div className="flex items-center">
                                <Bath className="h-4 w-4 mr-1" />
                                {room.metadata?.bathrooms || 1} Bathrooms
                              </div>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {room.availableBeds} People
                              </div>
                              <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
                                <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                                <span className="text-yellow-700 font-medium">4.8</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {room.amenities?.slice(0, 4).map((amenity) => (
                                <Badge key={amenity} variant="secondary" className="bg-orange-100 text-orange-700">
                                  {amenity}
                                </Badge>
                              ))}
                              {room.amenities?.length > 4 && (
                                <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                  +{room.amenities.length - 4} more
                                </Badge>
                              )}
                            </div>

                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {room.description || "Fully furnished apartment with modern amenities, perfect for working professionals."}
                            </p>

                            <div className="flex gap-3">
                              <Button 
                                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                                onClick={() => handleViewDetails(room._id)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                              <Button
                                variant="outline"
                                className="border-orange-300 text-orange-700 hover:bg-orange-50 bg-transparent"
                                onClick={() => handleContact(room)}
                              >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Contact
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Pagination */}
                  {renderPagination()}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}