import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/userStore";
import { useRoomStore } from "@/store/roomStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2, Mail, Phone, User, Shield, Home, Building, Edit, Save,
  Plus, Heart, MessageCircle, MapPin, Bed, Bath, Users as UsersIcon,
  Star, Clock, CheckCircle, XCircle, Trash2, Eye, Calendar,
  UserCheck, MessageSquare, PhoneCall, MapPinIcon
} from "lucide-react";
import { toast } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, loading: authLoading, updateProfile } = useAuthStore();
  const {
    userRooms,
    requestedRooms,
    receivedRequests,
    loading: roomsLoading,
    getUserRooms,
    getRequestedRooms,
    getReceivedRequests,
    deleteRoom,
    acceptRequest,
    rejectRequest,
    cancelRequest
  } = useRoomStore();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      fetchUserRoomsData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchUserRoomsData = async () => {
    try {
      await Promise.all([
        getUserRooms(),
        getRequestedRooms(),
        getReceivedRequests()
      ]);
    } catch (error) {
      console.error('Error fetching rooms data:', error);
      toast.error('Failed to load rooms data');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room? This action cannot be undone.")) {
      return;
    }

    setDeleteLoading(roomId);
    try {
      const result = await deleteRoom(roomId);
      if (result.success) {
        toast.success("Room deleted successfully");
      } else {
        toast.error("Failed to delete room");
      }
    } catch (error) {
      toast.error("Failed to delete room");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    setActionLoading(requestId);
    try {
      let result;
      if (action === 'accept') {
        result = await acceptRequest(requestId);
      } else if (action === 'reject') {
        result = await rejectRequest(requestId);
      } else if (action === 'cancel') {
        result = await cancelRequest(requestId);
      }

      if (result.success) {
        toast.success(`Request ${action}ed successfully`);
        // Refresh the requests data
        await fetchUserRoomsData();
      } else {
        toast.error(`Failed to ${action} request`);
      }
    } catch (error) {
      toast.error(`Failed to ${action} request`);
    } finally {
      setActionLoading(null);
    }
  };

  const getRequestStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      accepted: { label: "Accepted", color: "bg-green-100 text-green-800 border-green-200" },
      rejected: { label: "Rejected", color: "bg-red-100 text-red-800 border-red-200" },
      cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-800 border-gray-200" }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant="outline" className={`${config.color} border text-xs`}>{config.label}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoomFromRequest = (request) => {
    if (request.room) {
      return request.room;
    }
    if (request.roomId) {
      return request;
    }
    return request;
  };

  const getRequesterFromRequest = (request) => {
    return request.requester || {};
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center">Please log in to view your profile</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const roleConfig = {
    owner: {
      badge: "bg-amber-100 text-amber-800 hover:bg-amber-100",
      gradient: "from-amber-500 to-amber-600",
      icon: <Home className="h-5 w-5" />
    },
    tenant: {
      badge: "bg-purple-100 text-purple-800 hover:bg-purple-100",
      gradient: "from-purple-500 to-purple-600",
      icon: <Building className="h-5 w-5" />
    },
    admin: {
      badge: "bg-red-100 text-red-800 hover:bg-red-100",
      gradient: "from-red-500 to-red-600",
      icon: <Shield className="h-5 w-5" />
    }
  };

  const userRole = user.role?.toLowerCase() || 'tenant';
  const config = roleConfig[userRole] || roleConfig.tenant;

const MyRoomCard = ({ room }) => (
  <Card key={room._id} className="overflow-hidden hover:shadow-md transition-all duration-200 border border-gray-200 w-full mb-4">
    <div className="flex">
      {/* Image Section */}
      <div className="w-1/4 relative">
        <img
          src={room.images?.[0] || "/placeholder-room.jpg"}
          alt={room.title}
          className="w-full h-32 object-cover"
        />
        <Badge className={`absolute top-2 left-2 ${room.isVacant ? 'bg-green-500' : 'bg-red-500'} text-white text-xs`}>
          {room.isVacant ? 'Available' : 'Occupied'}
        </Badge>
      </div>

      {/* Content Section */}
      <div className="w-3/4 p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{room.title}</h3>
            <div className="flex items-center text-gray-600 mt-1">
              <MapPin className="h-3 w-3 mr-1 text-orange-500" />
              <span className="text-sm line-clamp-1">
                {room.address?.area && `${room.address.area}, `}{room.address?.city}
              </span>
            </div>
          </div>
          <div className="text-right ml-4">
            <div className="text-xl font-bold text-orange-600">
              ₹{room.price?.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">per month</div>
          </div>
        </div>

        {/* Quick Details */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            {room.availableBeds} Beds
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            {room.metadata?.bathrooms || 1} Bath
          </div>
          <div className="flex items-center">
            <Home className="h-4 w-4 mr-1" />
            {room.metadata?.propertyType || 'Apartment'}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Listed {formatDate(room.createdAt)}
          </div>
          <div className="flex gap-2">
            <Link to={`/room/${room._id}`}>
              <Button size="sm" variant="outline" className="h-8 text-xs">
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
            </Link>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDeleteRoom(room._id)}
              disabled={deleteLoading === room._id}
              className="h-8 text-xs"
            >
              {deleteLoading === room._id ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Trash2 className="h-3 w-3 mr-1" />
              )}
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  </Card>
);

  // Sent Requests Component
  const SentRequestsSection = () => (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Heart className="h-5 w-5 mr-2 text-purple-500" />
          My Room Requests
        </CardTitle>
        <CardDescription>
          Rooms you've requested to rent ({requestedRooms.length} requests)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {roomsLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : requestedRooms.length > 0 ? (
          <div className="grid gap-3">
            {requestedRooms.map((request) => {
              const room = getRoomFromRequest(request);
              const requestId = request.requestId || request._id;
              
              return (
                <Card key={requestId} className="overflow-hidden hover:shadow-md transition-shadow border border-gray-200">
                  <div className="flex">
                    {/* Room Image - Compact on left */}
                    <div className="w-2/7 relative flex-shrink-0">
                      <img
                        src={room.images?.[0] || "/placeholder-room.jpg"}
                        alt={room.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 left-1">
                        {getRequestStatusBadge(request.status || 'pending')}
                      </div>
                    </div>

                    {/* Content - Right side */}
                    <div className="flex-1 p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                                {room.title || 'Room'}
                              </h3>
                              <div className="flex items-center mt-1 text-xs text-gray-600">
                                <MapPinIcon className="h-3 w-3 mr-1 text-orange-500 flex-shrink-0" />
                                <span className="line-clamp-1">
                                  {room.address?.area && `${room.address.area}, `}{room.address?.city}
                                  {!room.address?.area && !room.address?.city && 'Location not specified'}
                                </span>
                              </div>
                            </div>
                            <div className="text-right ml-2 flex-shrink-0">
                              <div className="text-sm font-bold text-orange-600">
                                ₹{room.price?.toLocaleString() || '0'}
                              </div>
                              <div className="text-xs text-gray-500">month</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Room Details */}
                      <div className="flex items-center gap-3 mb-2 text-xs text-gray-600">
                        <div className="flex items-center">
                          <Bed className="h-3 w-3 mr-1" />
                          {room.availableBeds || 1}
                        </div>
                        <div className="flex items-center">
                          <Bath className="h-3 w-3 mr-1" />
                          {room.metadata?.bathrooms || 1}
                        </div>
                        <div className="flex items-center">
                          <Home className="h-3 w-3 mr-1" />
                          {room.metadata?.propertyType || 'Apt'}
                        </div>
                      </div>

                      {/* Request Message Preview */}
                      {request.message && (
                        <div className="mb-2">
                          <p className="text-xs text-gray-600 line-clamp-2">
                            <span className="font-medium">Your message:</span> {request.message}
                          </p>
                        </div>
                      )}

                      {/* Listing Owner & Actions */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(request.createdAt)}
                        </div>
                        
                        <div className="flex gap-1">
                          {(request.status === 'pending' || !request.status) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRequestAction(requestId, 'cancel')}
                              disabled={actionLoading === requestId}
                              className="h-7 text-xs"
                            >
                              {actionLoading === requestId ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              Cancel
                            </Button>
                          )}
                          <Link to={`/room/${room._id}`}>
                            <Button size="sm" variant="outline" className="h-7 text-xs">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </Link>
                          {room.owner?.phone && (
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700 h-7 text-xs"
                              onClick={() => window.open(`tel:${room.owner.phone}`, '_self')}
                            >
                              <PhoneCall className="h-3 w-3 mr-1" />
                              Call
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No room requests sent yet</h3>
            <p className="text-gray-500 mt-2 mb-6">
              Start exploring rooms and send requests to interested properties
            </p>
            <Link to="/find-rooms">
              <Button>
                <Eye className="h-4 w-4 mr-2" />
                Browse Rooms
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Received Requests Component
  const ReceivedRequestsSection = () => (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
          Received Requests
        </CardTitle>
        <CardDescription>
          Requests for your listed rooms ({receivedRequests.length} requests)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {roomsLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : receivedRequests.length > 0 ? (
          <div className="grid gap-3">
            {receivedRequests.map((request) => {
              const room = getRoomFromRequest(request);
              const requester = getRequesterFromRequest(request);
              const requestId = request.requestId || request._id;
              
              return (
                <Card key={requestId} className="overflow-hidden hover:shadow-md transition-shadow border border-gray-200">
                  <div className="flex">
                    {/* Room Image - Compact on left */}
                    <div className="w-2/7 relative flex-shrink-0">
                      <img
                        src={room.images?.[0] || "/placeholder-room.jpg"}
                        alt={room.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 left-1">
                        {getRequestStatusBadge(request.status || 'pending')}
                      </div>
                    </div>

                    {/* Content - Right side */}
                    <div className="flex-1 p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                                {room.title || 'Room'}
                              </h3>
                              <div className="flex items-center mt-1 text-xs text-gray-600">
                                <MapPinIcon className="h-3 w-3 mr-1 text-orange-500 flex-shrink-0" />
                                <span className="line-clamp-1">
                                  {room.address?.area && `${room.address.area}, `}{room.address?.city}
                                  {!room.address?.area && !room.address?.city && 'Location not specified'}
                                </span>
                              </div>
                            </div>
                            <div className="text-right ml-2 flex-shrink-0">
                              <div className="text-sm font-bold text-orange-600">
                                ₹{room.price?.toLocaleString() || '0'}
                              </div>
                              <div className="text-xs text-gray-500">month</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Requester Information */}
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={requester.avatar} />
                          <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                            {requester.name?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">{requester.name || 'Unknown User'}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            {requester.phone && (
                              <span className="truncate">{requester.phone}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Request Message Preview */}
                      {request.message && (
                        <div className="mb-2">
                          <p className="text-xs text-gray-600 line-clamp-2">
                            <span className="font-medium">Message:</span> {request.message}
                          </p>
                        </div>
                      )}

                      {/* Quick Room Details */}
                      <div className="flex items-center gap-3 mb-2 text-xs text-gray-600">
                        <div className="flex items-center">
                          <Bed className="h-3 w-3 mr-1" />
                          {room.availableBeds || 1}
                        </div>
                        <div className="flex items-center">
                          <Bath className="h-3 w-3 mr-1" />
                          {room.metadata?.bathrooms || 1}
                        </div>
                        <div className="flex items-center">
                          <Home className="h-3 w-3 mr-1" />
                          {room.metadata?.propertyType || 'Apt'}
                        </div>
                      </div>

                      {/* Actions and Date */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(request.createdAt)}
                        </div>
                        
                        <div className="flex gap-1">
                          {(request.status === 'pending' || !request.status) && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleRequestAction(requestId, 'accept')}
                                disabled={actionLoading === requestId}
                                className="bg-green-600 hover:bg-green-700 h-7 text-xs"
                              >
                                {actionLoading === requestId ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                )}
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRequestAction(requestId, 'reject')}
                                disabled={actionLoading === requestId}
                                className="h-7 text-xs"
                              >
                                {actionLoading === requestId ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <XCircle className="h-3 w-3 mr-1" />
                                )}
                                Reject
                              </Button>
                            </>
                          )}
                          <Link to={`/room/${room._id}`}>
                            <Button size="sm" variant="outline" className="h-7 text-xs">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No requests received yet</h3>
            <p className="text-gray-500 mt-2 mb-6">
              You'll see requests here when users show interest in your listed rooms
            </p>
            <Link to="/add-rooms">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                List More Rooms
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header Section */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className={`h-32 bg-gradient-to-r ${config.gradient}`} />
            <CardContent className="pt-0 relative">
              <div className="flex flex-col items-center -mt-16">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-2xl font-bold bg-white">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center mt-4">
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  <div className="flex items-center justify-center mt-2 space-x-2">
                    <Badge variant="outline" className={config.badge}>
                      <div className="flex items-center">
                        {config.icon}
                        <span className="ml-1 capitalize">{user.role}</span>
                      </div>
                    </Badge>
                    {user.isVerified && (
                      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="my-rooms">My Rooms</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Personal Information
                    </CardTitle>
                    <CardDescription>Your basic profile details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-gray-700">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-700">{user.phone}</span>
                      </div>
                    )}
                    {user.aadharNumber && (
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-700">Aadhar: •••• •••• {user.aadharNumber.slice(-4)}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Status</CardTitle>
                    <CardDescription>Your account information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Email Verification</span>
                      <Badge variant={user.isVerified ? "default" : "secondary"}>
                        {user.isVerified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Account Role</span>
                      <Badge variant="outline" className={config.badge}>
                        {user.role}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Member Since</span>
                      <span className="text-gray-500">
                        {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Listed Rooms</p>
                        <p className="text-2xl font-bold text-gray-900">{userRooms.length}</p>
                      </div>
                      <Home className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Sent Requests</p>
                        <p className="text-2xl font-bold text-gray-900">{requestedRooms.length}</p>
                      </div>
                      <Heart className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Received Requests</p>
                        <p className="text-2xl font-bold text-gray-900">{receivedRequests.length}</p>
                      </div>
                      <MessageCircle className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="my-rooms" className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <div>
                      <CardTitle>My Listed Rooms</CardTitle>
                      <CardDescription>
                        Rooms you've listed for rent ({userRooms.length} rooms)
                      </CardDescription>
                    </div>
                    <Link to="/add-rooms">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Room
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    {roomsLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                      </div>
                    ) : userRooms.length > 0 ? (
                      <div className="grid gap-6 md:grid-cols-2">
                        {userRooms.map(room => (
                          <MyRoomCard key={room._id} room={room} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Home className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No rooms listed yet</h3>
                        <p className="text-gray-500 mt-2">
                          Start by listing your first room for rent
                        </p>
                        <Link to="/add-rooms">
                          <Button className="mt-4">
                            <Plus className="h-4 w-4 mr-2" />
                            List a Room
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="requests" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sent Requests */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <SentRequestsSection />
                </motion.div>

                {/* Received Requests */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <ReceivedRequestsSection />
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      {isEditing ? (
                        <>
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSave}>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setIsEditing(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;