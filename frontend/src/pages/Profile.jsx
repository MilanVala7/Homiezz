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
      pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
      accepted: { label: "Accepted", color: "bg-green-100 text-green-800" },
      rejected: { label: "Rejected", color: "bg-red-100 text-red-800" },
      cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-800" }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  // Room Card Component for My Rooms
  const MyRoomCard = ({ room }) => (
    <Card key={room._id} className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 aspect-video md:aspect-square relative">
          <img
            src={room.images?.[0] || "/placeholder-room.jpg"}
            alt={room.title}
            className="w-full h-full object-cover"
          />
          <Badge className={`absolute top-2 left-2 ${room.isVacant ? 'bg-green-500' : 'bg-red-500'} text-white`}>
            {room.isVacant ? 'Available' : 'Occupied'}
          </Badge>
          <div className="absolute top-2 right-2 flex gap-1">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
              {room.metadata?.propertyType || 'Room'}
            </Badge>
          </div>
        </div>
        <div className="md:w-2/3 p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{room.title}</h3>
            <div className="text-right">
              <div className="text-xl font-bold text-orange-600">
                ₹{room.price?.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">per month</div>
            </div>
          </div>

          <p className="text-gray-600 mb-3 line-clamp-2">{room.description}</p>

          <div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-orange-500" />
              {room.address?.city}, {room.address?.state}
            </div>
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              {room.availableBeds} Beds
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              {room.metadata?.bathrooms || 1} Bath
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {room.amenities?.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-700">
                {amenity}
              </Badge>
            ))}
            {room.amenities?.length > 3 && (
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                +{room.amenities.length - 3} more
              </Badge>
            )}
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Created: {formatDate(room.createdAt)}
            </div>
            <div className="flex gap-2">
              <Link to={`/room/${room._id}`}>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </Link>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDeleteRoom(room._id)}
                disabled={deleteLoading === room._id}
              >
                {deleteLoading === room._id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-1" />
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
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
          <div className="grid gap-4">
            {requestedRooms.map((request) => (
              <Card key={request._id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 aspect-video md:aspect-square relative">
                    <img
                      src={request.room?.images?.[0]}
                      alt={request.room?.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      {getRequestStatusBadge(request.status)}
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request.room?.title}
                        </h3>
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <MapPinIcon className="h-3 w-3 mr-1" />
                          {request.room?.address?.area}, {request.room?.address?.city}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-orange-600">
                          ₹{request.room?.price?.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">per month</div>
                      </div>
                    </div>

                    {/* Request Message */}
                    {request.message && (
                      <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-blue-900">Your Message:</p>
                            <p className="text-sm text-blue-800 mt-1">{request.message}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Room Details */}
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        {request.room?.availableBeds} Beds
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        {request.room?.metadata?.bathrooms || 1} Bath
                      </div>
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-1" />
                        {request.room?.metadata?.propertyType || 'Apartment'}
                      </div>
                    </div>

                    {/* Listing Owner Info */}
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Listed by:</span>
                        <span className="text-sm text-gray-600">{request.room?.owner?.name}</span>
                        {request.room?.owner?.phone && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-600">{request.room.owner.phone}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        Requested on {formatDate(request.createdAt)}
                      </div>
                      
                      <div className="flex gap-2">
                        {request.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRequestAction(request._id, 'cancel')}
                            disabled={actionLoading === request._id}
                          >
                            {actionLoading === request._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-1" />
                            )}
                            Cancel
                          </Button>
                        )}
                        <Link to={`/room/${request.room?._id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View Room
                          </Button>
                        </Link>
                        {request.room?.owner?.phone && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <PhoneCall className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
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
          <div className="grid gap-4">
            {receivedRequests.map((request) => (
              <Card key={request._id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 aspect-video md:aspect-square relative">
                    {/* <img
                      src={request.room?.images?.[0] || "/placeholder-room.jpg"}
                      alt={request.room?.title}
                      className="w-full h-full object-cover"
                    /> */}
                    <div className="absolute top-2 left-2">
                      {getRequestStatusBadge(request.status)}
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request.room?.title}
                        </h3>
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <MapPinIcon className="h-3 w-3 mr-1" />
                          {request.room?.address?.area}, {request.room?.address?.city}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-orange-600">
                          ₹{request.room?.price?.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">per month</div>
                      </div>
                    </div>

                    {/* Requester Information */}
                    <div className="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={request.requester?.avatar} />
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            {request.requester?.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{request.requester?.name}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            {request.requester?.phone && (
                              <>
                                <Phone className="h-3 w-3" />
                                <span>{request.requester.phone}</span>
                              </>
                            )}
                            {request.requester?.email && (
                              <>
                                <span className="text-gray-300">•</span>
                                <Mail className="h-3 w-3" />
                                <span>{request.requester.email}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {request.message && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-purple-900 mb-1">Their Message:</p>
                          <p className="text-sm text-purple-800 bg-white p-2 rounded border">
                            {request.message}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Room Details */}
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        {request.room?.availableBeds} Beds
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        {request.room?.metadata?.bathrooms || 1} Bath
                      </div>
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-1" />
                        {request.room?.metadata?.propertyType || 'Apartment'}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        Requested on {formatDate(request.createdAt)}
                      </div>
                      
                      <div className="flex gap-2">
                        {request.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleRequestAction(request._id, 'accept')}
                              disabled={actionLoading === request._id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {actionLoading === request._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-1" />
                              )}
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRequestAction(request._id, 'reject')}
                              disabled={actionLoading === request._id}
                            >
                              {actionLoading === request._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4 mr-1" />
                              )}
                              Reject
                            </Button>
                          </>
                        )}
                        <Link to={`/room/${request.room?._id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View Room
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
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
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
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
                      <div className="grid gap-6">
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
                <Card>
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