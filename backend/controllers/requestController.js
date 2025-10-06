import RoomRequest from '../models/RoomRequest.js';
import Room from '../models/room.js';
import User from '../models/user.js';

// @desc    Send room request
// @route   POST /api/rooms/:roomId/request
// @access  Private
// In requestController.js, fix the sendRoomRequest function:

const sendRoomRequest = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { message } = req.body;
    const userId = req.user.userId;

    console.log("Received request for room:", roomId, "from user:", userId);

    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if room is available
    if (!room.isVacant) {
      return res.status(400).json({
        success: false,
        message: 'Room is not available for rent'
      });
    }

    // Check if user is not the room owner
    if (room.owner.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot request your own room'
      });
    }

    // Check if request already exists
    const existingRequest = await RoomRequest.findOne({
      room: roomId,
      requester: userId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You have already sent a request for this room'
      });
    }

    console.log("Creating room request...");

    // Create room request
    const roomRequest = await RoomRequest.create({
      room: roomId,
      requester: userId,
      owner: room.owner,
      message: message || '',
      status: 'pending'
    });

    console.log("Room request created:", roomRequest._id);

    // Populate the request
    await roomRequest.populate('room', 'title price images address availableBeds amenities metadata');
    await roomRequest.populate('requester', 'name avatar phone');
    await roomRequest.populate('owner', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Room request sent successfully',
      data: roomRequest
    });
  } catch (error) {
    console.error('Error sending room request:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid room ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while sending room request'
    });
  }
};
// @desc    Get user's sent requests
// @route   GET /api/rooms/requests/sent
// @access  Private
const getSentRequests = async (req, res) => {
  try {
    const userId = req.user.userId;

    const sentRequests = await RoomRequest.find({ requester: userId })
      .populate('room', 'title price images address availableBeds isVacant metadata amenities description')
      .populate('owner', 'name avatar phone')
      .sort({ createdAt: -1 });

    // Transform data to match room format for frontend
    const requestsWithRoomData = sentRequests.map(request => ({
      ...request.room.toObject(),
      requestId: request._id,
      status: request.status,
      message: request.message,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt
    }));

    res.status(200).json({
      success: true,
      count: sentRequests.length,
      data: requestsWithRoomData
    });
  } catch (error) {
    console.error('Error fetching sent requests:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sent requests'
    });
  }
};

// @desc    Get received requests for user's rooms
// @route   GET /api/rooms/requests/received
// @access  Private
const getReceivedRequests = async (req, res) => {
  try {
    const userId = req.user.userId;

    const receivedRequests = await RoomRequest.find({ 
      owner: userId, 
      status: 'pending' 
    })
      .populate('room', 'title price images address availableBeds isVacant metadata amenities description')
      .populate('requester', 'name avatar phone email')
      .sort({ createdAt: -1 });

    // Transform data to include requester info
    const requestsWithRequesterData = receivedRequests.map(request => ({
      ...request.room.toObject(),
      requestId: request._id,
      status: request.status,
      message: request.message,
      requester: request.requester,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt
    }));

    res.status(200).json({
      success: true,
      count: receivedRequests.length,
      data: requestsWithRequesterData
    });
  } catch (error) {
    console.error('Error fetching received requests:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching received requests'
    });
  }
};

// @desc    Accept room request
// @route   POST /api/rooms/requests/:requestId/accept
// @access  Private
const acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.userId;

    const roomRequest = await RoomRequest.findById(requestId)
      .populate('room')
      .populate('requester');

    if (!roomRequest) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if user is the room owner
    if (roomRequest.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept this request'
      });
    }

    // Check if request is still pending
    if (roomRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request has already been processed'
      });
    }

    // Check if room is still available
    if (!roomRequest.room.isVacant) {
      return res.status(400).json({
        success: false,
        message: 'Room is no longer available'
      });
    }

    // Update request status
    roomRequest.status = 'accepted';
    await roomRequest.save();

    // Update room status and add roommate
    const room = await Room.findById(roomRequest.room._id);
    room.isVacant = false;
    room.currentRoommates.push(roomRequest.requester._id);
    await room.save();

    // Update user's rentedRooms
    await User.findByIdAndUpdate(
      roomRequest.requester._id,
      { $push: { rentedRooms: room._id } }
    );

    res.status(200).json({
      success: true,
      message: 'Request accepted successfully',
      data: roomRequest
    });
  } catch (error) {
    console.error('Error accepting request:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while accepting request'
    });
  }
};

// @desc    Reject room request
// @route   POST /api/rooms/requests/:requestId/reject
// @access  Private
const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.userId;

    const roomRequest = await RoomRequest.findById(requestId);

    if (!roomRequest) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if user is the room owner
    if (roomRequest.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject this request'
      });
    }

    // Check if request is still pending
    if (roomRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request has already been processed'
      });
    }

    // Update request status
    roomRequest.status = 'rejected';
    await roomRequest.save();

    res.status(200).json({
      success: true,
      message: 'Request rejected successfully',
      data: roomRequest
    });
  } catch (error) {
    console.error('Error rejecting request:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while rejecting request'
    });
  }
};

export {
  sendRoomRequest,
  getSentRequests,
  getReceivedRequests,
  acceptRequest,
  rejectRequest
};