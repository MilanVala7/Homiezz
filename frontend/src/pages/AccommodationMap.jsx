import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const roomIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/489/489969.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35]
});

const facilityIcons = {
  restaurant: new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448633.png',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  }),
  hospital: new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2965/2965936.png',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  }),
  transportation: new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3474/3474366.png',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  }),
  shopping: new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1170/1170678.png',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  }),
  education: new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684819.png',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  }),
  entertainment: new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2331/2331966.png',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  })
};

// Sample data for rooms and facilities with focus on Anand district
const roomData = [
  {
    id: 1,
    name: "Riverfront Retreat",
    position: [23.0225, 72.5714], // Ahmedabad
    price: 2500,
    rating: 4.5,
    facilities: ["WiFi", "AC", "Parking", "Swimming Pool"],
    description: "Beautiful riverside accommodation with modern amenities and stunning views.",
    contact: "+91 9876543210",
    nearbyFacilities: [
      { type: "restaurant", position: [23.0205, 72.5694], name: "Spice Garden", distance: "0.3km" },
      { type: "shopping", position: [23.0245, 72.5734], name: "City Center Mall", distance: "0.5km" },
      { type: "transportation", position: [23.0215, 72.5724], name: "Ahmedabad Railway Station", distance: "0.4km" }
    ],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
    ]
  },
  {
    id: 2,
    name: "Anand Dairy Residency",
    position: [22.5645, 72.9289], // Anand
    price: 1800,
    rating: 4.3,
    facilities: ["WiFi", "AC", "Breakfast", "24/7 Security"],
    description: "Comfortable stay near Amul Dairy. Perfect for business travelers and tourists.",
    contact: "+91 9876543211",
    nearbyFacilities: [
      { type: "restaurant", position: [22.5635, 72.9279], name: "Amul Cafe", distance: "0.2km" },
      { type: "education", position: [22.5665, 72.9309], name: "Anand University", distance: "1.2km" },
      { type: "hospital", position: [22.5655, 72.9299], name: "Anand General Hospital", distance: "0.8km" },
      { type: "shopping", position: [22.5640, 72.9270], name: "Anand Market", distance: "0.5km" }
    ],
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
    ]
  },
  {
    id: 3,
    name: "Heritage Haveli",
    position: [21.7645, 72.1519], // Bharuch
    price: 2000,
    rating: 4.2,
    facilities: ["Heritage Style", "Garden", "Traditional Cuisine", "Cultural Events"],
    description: "Experience traditional Gujarati hospitality in this beautifully restored heritage property.",
    contact: "+91 9876543212",
    nearbyFacilities: [
      { type: "shopping", position: [21.7655, 72.1529], name: "Old Market", distance: "0.3km" },
      { type: "transportation", position: [21.7635, 72.1509], name: "Bharuch Bus Stand", distance: "0.7km" },
      { type: "entertainment", position: [21.7660, 72.1535], name: "Riverfront Park", distance: "0.4km" }
    ],
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGF2ZWxpfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
    ]
  },
  {
    id: 4,
    name: "Milk City Hostel",
    position: [22.5600, 72.9300], // Anand (Another location)
    price: 1200,
    rating: 4.0,
    facilities: ["Budget Friendly", "Common Kitchen", "Laundry", "Student Discount"],
    description: "Affordable accommodation for students and budget travelers in the heart of Anand.",
    contact: "+91 9876543213",
    nearbyFacilities: [
      { type: "education", position: [22.5610, 72.9310], name: "Anand College", distance: "0.3km" },
      { type: "restaurant", position: [22.5590, 72.9290], name: "Student Cafe", distance: "0.2km" },
      { type: "transportation", position: [22.5605, 72.9305], name: "Anand Auto Stand", distance: "0.1km" }
    ],
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e3786832?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGhvc3RlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
    ]
  },
  {
    id: 5,
    name: "Business Hotel Surat",
    position: [21.1959, 72.7937], // Surat
    price: 4000,
    rating: 4.3,
    facilities: ["WiFi", "Conference Room", "Gym", "Business Center"],
    description: "Premium business accommodation with all modern amenities for corporate travelers.",
    contact: "+91 9876543214",
    nearbyFacilities: [
      { type: "shopping", position: [21.1969, 72.7947], name: "Diamond Market", distance: "0.4km" },
      { type: "transportation", position: [21.1949, 72.7927], name: "Surat Airport", distance: "3.2km" },
      { type: "restaurant", position: [21.1979, 72.7957], name: "Business Lunch Cafe", distance: "0.3km" },
      { type: "entertainment", position: [21.1980, 72.7960], name: "City Cinema", distance: "0.6km" }
    ],
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
    ]
  },
  {
    id: 6,
    name: "Anand Farmstay",
    position: [22.5550, 72.9350], // Anand outskirts
    price: 2200,
    rating: 4.7,
    facilities: ["Organic Farm", "Home-cooked Meals", "Nature Walks", "Pet Friendly"],
    description: "Experience rural life with modern comforts at our organic farmstay near Anand.",
    contact: "+91 9876543215",
    nearbyFacilities: [
      { type: "entertainment", position: [22.5560, 72.9360], name: "Nature Trail", distance: "0.1km" },
      { type: "restaurant", position: [22.5540, 72.9340], name: "Farm Kitchen", distance: "On-site" },
      { type: "transportation", position: [22.5570, 72.9370], name: "Village Bus Stop", distance: "0.8km" }
    ],
    images: [
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFybXN0YXl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
    ]
  }
];

// Function to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance.toFixed(1);
};

// Map controller component
const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const AccommodationMap = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showFacilities, setShowFacilities] = useState(true);
  const [filterPrice, setFilterPrice] = useState(5000);
  const [filterRating, setFilterRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [currentView, setCurrentView] = useState({ center: [22.5645, 72.9289], zoom: 13 }); // Default to Anand

  const districts = ["All", "Anand", "Ahmedabad", "Surat", "Bharuch", "Vadodara", "Rajkot"];

  // Filter rooms based on various criteria
  const filteredRooms = roomData.filter(room => 
    room.price <= filterPrice && 
    room.rating >= filterRating &&
    (selectedDistrict === "All" || 
     calculateDistance(room.position[0], room.position[1], currentView.center[0], currentView.center[1]) < 50) &&
    (room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     room.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    if (district !== "All") {
      // Set view to the district center
      const districtCenters = {
        "Anand": { center: [22.5645, 72.9289], zoom: 13 },
        "Ahmedabad": { center: [23.0225, 72.5714], zoom: 12 },
        "Surat": { center: [21.1959, 72.7937], zoom: 12 },
        "Bharuch": { center: [21.7645, 72.1519], zoom: 13 },
        "Vadodara": { center: [22.3072, 73.1812], zoom: 12 },
        "Rajkot": { center: [22.3039, 70.8022], zoom: 12 }
      };
      setCurrentView(districtCenters[district] || { center: [22.5645, 72.9289], zoom: 8 });
    } else {
      setCurrentView({ center: [22.2587, 71.1924], zoom: 7 });
    }
  };

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-col h-screen">
        {/* Header */}
        <motion.header 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 shadow-lg"
        >
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <h1 className="text-2xl font-bold">Accommodation Finder</h1>
              
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search accommodations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 rounded-lg text-gray-800 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                
                <select
                  value={selectedDistrict}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="px-4 py-2 rounded-lg text-gray-800 w-full md:w-40 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                
                <button 
                  onClick={() => setShowFacilities(!showFacilities)}
                  className="bg-white text-orange-700 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors w-full md:w-auto"
                >
                  {showFacilities ? 'Hide Facilities' : 'Show Facilities'}
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Existing Content */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Sidebar */}
          <motion.div 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className="w-full md:w-96 bg-white p-4 shadow-lg overflow-y-auto z-10"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Filters</h2>
            
            {/* Price Filter */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Max Price: ₹{filterPrice}</label>
              <input 
                type="range" 
                min="1000" 
                max="5000" 
                step="500"
                value={filterPrice}
                onChange={(e) => setFilterPrice(parseInt(e.target.value))}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹1000</span>
                <span>₹5000</span>
              </div>
            </div>
            
            {/* Rating Filter */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Min Rating: {filterRating}+</label>
              <input 
                type="range" 
                min="0" 
                max="5" 
                step="0.5"
                value={filterRating}
                onChange={(e) => setFilterRating(parseFloat(e.target.value))}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>5</span>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Available Rooms ({filteredRooms.length})
              {selectedDistrict !== "All" && ` in ${selectedDistrict}`}
            </h2>
            
            {filteredRooms.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No accommodations found matching your criteria
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {filteredRooms.map(room => (
                  <motion.div
                    key={room.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg shadow cursor-pointer border-2 transition-all duration-200 ${
                      selectedRoom?.id === room.id 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-white bg-white hover:border-blue-200'
                    }`}
                    onClick={() => {
                      setSelectedRoom(room);
                      setCurrentView({ center: room.position, zoom: 15 });
                    }}
                  >
                    <h3 className="font-semibold text-gray-800">{room.name}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{room.description}</p>
                    
                    <div className="flex justify-between mt-3">
                      <span className="text-blue-600 font-bold">₹{room.price}/night</span>
                      <span className="flex items-center text-yellow-500">
                        ★<span className="ml-1 text-gray-700">{room.rating}</span>
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {room.facilities.slice(0, 3).map((facility, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {facility}
                        </span>
                      ))}
                      {room.facilities.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          +{room.facilities.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {calculateDistance(room.position[0], room.position[1], currentView.center[0], currentView.center[1])}km from center
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Map */}
          <div className="flex-1 relative">
            <MapContainer
              center={currentView.center}
              zoom={currentView.zoom}
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <MapController center={currentView.center} zoom={currentView.zoom} />
              
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Room markers */}
              {filteredRooms.map(room => (
                <Marker
                  key={room.id}
                  position={room.position}
                  icon={roomIcon}
                  eventHandlers={{
                    click: () => {
                      setSelectedRoom(room);
                      setCurrentView({ center: room.position, zoom: 15 });
                    }
                  }}
                >
                  <Popup>
                    <div className="p-2 w-64">
                      <h3 className="font-semibold text-lg">{room.name}</h3>
                      <p className="text-blue-600 font-bold">₹{room.price}/night</p>
                      <p className="flex items-center text-yellow-500">
                        ★<span className="ml-1 text-gray-700">{room.rating}</span>
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {room.facilities.slice(0, 3).map((facility, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {facility}
                          </span>
                        ))}
                      </div>
                      <button 
                        className="mt-3 w-full bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition-colors"
                        onClick={() => {
                          setSelectedRoom(room);
                          setCurrentView({ center: room.position, zoom: 15 });
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              {/* Facility markers */}
              {showFacilities && filteredRooms.map(room => (
                room.nearbyFacilities.map((facility, index) => (
                  <Marker
                    key={`${room.id}-${index}`}
                    position={facility.position}
                    icon={facilityIcons[facility.type]}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold">{facility.name}</h3>
                        <p className="capitalize text-gray-600">{facility.type}</p>
                        <p className="text-sm text-gray-500">Near {room.name} ({facility.distance})</p>
                      </div>
                    </Popup>
                  </Marker>
                ))
              ))}
              
              {/* Highlight selected room */}
              {selectedRoom && (
                <Circle
                  center={selectedRoom.position}
                  radius={300}
                  pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
                />
              )}
            </MapContainer>
            
            {/* Info panel for selected room */}
            <AnimatePresence>
              {selectedRoom && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-4 left-4 right-4 md:right-auto md:w-96 bg-white rounded-lg shadow-lg p-4 border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{selectedRoom.name}</h3>
                      <p className="text-blue-600 font-bold text-lg">₹{selectedRoom.price}/night</p>
                      <p className="flex items-center text-yellow-500">
                        ★<span className="ml-1 text-gray-700">{selectedRoom.rating}</span>
                      </p>
                    </div>
                    <button 
                      onClick={() => setSelectedRoom(null)}
                      className="text-gray-500 hover:text-gray-700 text-lg"
                    >
                      ✕
                    </button>
                  </div>
                  
                  {/* Image carousel */}
                  <div className="mb-4">
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                      {selectedRoom.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${selectedRoom.name} ${index + 1}`}
                          className="h-20 w-20 object-cover rounded-lg flex-shrink-0"
                        />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{selectedRoom.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Facilities:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRoom.facilities.map((facility, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded">
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Nearby Facilities:</h4>
                    <ul className="space-y-2">
                      {selectedRoom.nearbyFacilities.map((facility, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <span className={`p-1 rounded mr-2 ${
                            facility.type === 'restaurant' ? 'bg-green-100 text-green-700' :
                            facility.type === 'hospital' ? 'bg-red-100 text-red-700' :
                            facility.type === 'transportation' ? 'bg-purple-100 text-purple-700' :
                            facility.type === 'education' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {facility.type === 'restaurant' ? '🍴' :
                             facility.type === 'hospital' ? '🏥' :
                             facility.type === 'transportation' ? '🚌' : 
                             facility.type === 'education' ? '🎓' : '🛍️'}
                          </span>
                          <span>{facility.name} ({facility.distance})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex space-x-3">
                    <a 
                      href={`tel:${selectedRoom.contact}`}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors text-center"
                    >
                      Call Now
                    </a>
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                      Book Now
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationMap;