import Room from '../models/room.js';
import User from '../models/user.js';
import { uploadRoomImages, deleteImageFromCloudinary } from '../middleware/uploadMiddleware.js';  

const extractPublicId = (url) => {
  const matches = url.match(/\/roomfinder\/rooms\/room_(\d+)_(\d+)/);
  return matches ? `roomfinder/rooms/room_${matches[1]}_${matches[2]}` : null;
};

const uploadRoomImagesHandler = async (req, res) => {
  try {
    uploadRoomImages(req, res, async (error) => {
      if (error) {
        console.error('Upload error:', error);
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No images uploaded'
        });
      }
      
      const imageUrls = req.files.map(file => file.path);
      
      res.status(200).json({
        success: true,
        message: 'Images uploaded successfully',
        data: {
          images: imageUrls,
          count: imageUrls.length
        }
      });
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading images'
    });
  }
};

const getRoom = async (req, res) => {
  try {
    const {
      city,
      minPrice,
      maxPrice,
      roomType,
      amenities,
      propertyType,
      furnishing,
      sortBy = 'newest',
      page = 1,
      limit = 6,
      search
    } = req.query;

    let filter = { isVacant: true };

    if (city) {
      filter['address.city'] = new RegExp(city, 'i');
    }

    if (search) {
      filter.$or = [
        { 'address.city': new RegExp(search, 'i') },
        { 'address.street': new RegExp(search, 'i') },
        { 'metadata.area': new RegExp(search, 'i') },
        { title: new RegExp(search, 'i') }
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    if (propertyType) {
      filter['metadata.propertyType'] = propertyType;
    }

    if (roomType) {
      const bedMapping = {
        'Single Room': 1,
        'Shared Room': { $gte: 2 }, 
        '1 BHK': 1,
        '2 BHK': 2,
        '3 BHK': 3
      };
      
      if (bedMapping[roomType]) {
        filter.availableBeds = bedMapping[roomType];
      }
    }

    // Amenities filter
    if (amenities) {
      const amenitiesArray = Array.isArray(amenities) ? amenities : [amenities];
      filter.amenities = { $all: amenitiesArray };
    }

    // Furnishing filter
    if (furnishing) {
      filter['metadata.furnishing'] = furnishing;
    }

    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'price-low':
        sort.price = 1;
        break;
      case 'price-high':
        sort.price = -1;
        break;
      case 'newest':
        sort.createdAt = -1;
        break;
      case 'oldest':
        sort.createdAt = 1;
        break;
      case 'rating':
        sort.createdAt = -1; // Fallback until rating is implemented
        break;
      default:
        sort.createdAt = -1;
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with population
    const rooms = await Room.find(filter)
      .populate('owner', 'name avatar phone')
      .populate('currentRoommates', 'name avatar')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Room.countDocuments(filter);

    // Get unique cities for filter suggestions
    const cities = await Room.distinct('address.city', { isVacant: true });

    res.status(200).json({
      success: true,
      count: rooms.length,
      pagination: {
        current: pageNum,
        total: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1,
        totalResults: total
      },
      filters: {
        cities: cities.filter(city => city).sort()
      },
      data: rooms
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching rooms'
    });
  }
};

const getRoomById = async (req, res) => {
  try {
    
    const room = await Room.findById(req.params.id)
      .populate('owner', 'name avatar phone email')
      .populate('currentRoommates', 'name avatar');
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Error fetching room:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid room ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching room'
    });
  }
};

// @desc    Get available cities
// @route   GET /api/rooms/cities/available
// @access  Public
const getAvailableCities = async (req, res) => {
  try {
    const cities = await Room.distinct('address.city', { isVacant: true });
    
    res.status(200).json({
      success: true,
      data: cities.filter(city => city).sort()
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cities'
    });
  }
};

// @desc    Create a new room
// @route   POST /api/rooms
// @access  Private
const createRoom = async (req, res) => {
  try {
    // Check if user exists on request
    if (!req.user || !req.user.userId) {
      console.error('User not found on request object');
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in again.'
      });
    }

    // Get the full user object from database
    const fullUser = await User.findById(req.user.userId);
    
    if (!fullUser) {
      return res.status(401).json({
        success: false,
        message: 'User not found in database'
      });
    }

    // Check if user is verified
    if (!fullUser.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your account before listing a room'
      });
    }

    // Extract data from request body
    const {
      title,
      description,
      propertyType,
      bedrooms,
      bathrooms,
      availableBeds,
      city,
      state,
      area,
      address,
      landmark,
      pincode,
      price,
      securityDeposit,
      amenities,
      ownershipType,
      ownerName,
      ownerContact,
      permissionDetails,
      images 
    } = req.body;

    // Validate required fields
    if (!title || !price || !city || !state || !address) {
      return res.status(400).json({
        success: false,
        message: 'Title, price, city, state, and address are required fields'
      });
    }

    // Validate images
    if (!images || images.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'At least 3 images are required'
      });
    }

    // Create room with proper structure
    const roomData = {
      title,
      description,
      address: {
        street: address,
        city: city,
        state: state,
        zip: pincode || ''
      },
      price: parseInt(price),
      amenities: amenities || [],
      images: images, 
      availableBeds: parseInt(availableBeds) || 1,
      owner: fullUser._id,
      isVacant: true,
      metadata: {
        propertyType: propertyType || 'apartment',
        bedrooms: parseInt(bedrooms) || 1,
        bathrooms: parseInt(bathrooms) || 1,
        area: area || '',
        landmark: landmark || '',
        ownershipType: ownershipType || 'self',
        securityDeposit: securityDeposit ? parseInt(securityDeposit) : 0
      }
    };

    // Add owner details if ownership type is tenant
    if (ownershipType === 'tenant') {
      roomData.metadata.ownerDetails = {
        ownerName: ownerName || '',
        ownerContact: ownerContact || '',
        permissionDetails: permissionDetails || ''
      };
    }

    console.log('Room data to be saved:', roomData);

    // Create room
    let room;
    try {
      room = await Room.create(roomData);
      console.log('Room created successfully:', room);
    } catch (createError) {
      console.error('Error creating room in database:', createError);
      return res.status(400).json({
        success: false,
        message: 'Failed to create room: ' + createError.message
      });
    }

    // Check if room was created successfully
    if (!room || !room._id) {
      console.error('Room creation failed - no room object or ID returned');
      return res.status(500).json({
        success: false,
        message: 'Room creation failed - no room ID returned'
      });
    }

    // Add room to user's listedRooms
    try {
      await User.findByIdAndUpdate(
        fullUser._id,
        { $push: { listedRooms: room._id } }
      );
      console.log('Room added to user\'s listedRooms');
    } catch (userUpdateError) {
      console.error('Error updating user:', userUpdateError);
      // Don't fail the request if just the user update fails
    }

    // Populate owner details
    try {
      await room.populate('owner', 'name avatar');
    } catch (populateError) {
      console.error('Error populating owner:', populateError);
      // Continue even if population fails
    }

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room
    });
  } catch (error) {
    console.error('Error in createRoom controller:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating room: ' + error.message
    });
  }
};

// @desc    Update a room
// @route   PUT /api/rooms/:id
// @access  Private
const updateRoom = async (req, res) => {
  try {
    // Get the full user object from database
    const fullUser = await User.findById(req.user.userId);
    
    let room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    // Check if user is room owner
    if (room.owner.toString() !== fullUser._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this room'
      });
    }
    
    // Extract data from request body
    const {
      title,
      description,
      propertyType,
      bedrooms,
      bathrooms,
      availableBeds,
      city,
      state,
      area,
      address,
      landmark,
      pincode,
      price,
      securityDeposit,
      amenities,
      ownershipType,
      ownerName,
      ownerContact,
      permissionDetails,
      images,
      isVacant
    } = req.body;
    
    // Update room
    room = await Room.findByIdAndUpdate(
      req.params.id,
      {
        title: title || room.title,
        description: description || room.description,
        address: {
          street: address || room.address.street,
          city: city || room.address.city,
          state: state || room.address.state,
          zip: pincode || room.address.zip
        },
        price: price ? parseInt(price) : room.price,
        amenities: amenities || room.amenities,
        images: images || room.images,
        availableBeds: availableBeds ? parseInt(availableBeds) : room.availableBeds,
        isVacant: isVacant !== undefined ? isVacant : room.isVacant,
        metadata: {
          propertyType: propertyType || room.metadata?.propertyType,
          bedrooms: bedrooms ? parseInt(bedrooms) : room.metadata?.bedrooms,
          bathrooms: bathrooms ? parseInt(bathrooms) : room.metadata?.bathrooms,
          area: area || room.metadata?.area,
          landmark: landmark || room.metadata?.landmark,
          ownershipType: ownershipType || room.metadata?.ownershipType,
          ownerDetails: ownershipType === 'tenant' ? {
            ownerName: ownerName || room.metadata?.ownerDetails?.ownerName,
            ownerContact: ownerContact || room.metadata?.ownerDetails?.ownerContact,
            permissionDetails: permissionDetails || room.metadata?.ownerDetails?.permissionDetails
          } : room.metadata?.ownerDetails,
          securityDeposit: securityDeposit ? parseInt(securityDeposit) : room.metadata?.securityDeposit
        }
      },
      {
        new: true,
        runValidators: true
      }
    ).populate('owner', 'name avatar');
    
    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      data: room
    });
  } catch (error) {
    console.error('Error updating room:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid room ID'
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating room'
    });
  }
};

// @desc    Delete a room and its images from Cloudinary
// @route   DELETE /api/rooms/:id
// @access  Private
const deleteRoom = async (req, res) => {
  try {
    // Get the full user object from database
    const fullUser = await User.findById(req.user.userId);
    
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    // Check if user is room owner
    if (room.owner.toString() !== fullUser._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this room'
      });
    }

    // Delete images from Cloudinary
    if (room.images && room.images.length > 0) {
      try {
        for (const imageUrl of room.images) {
          const publicId = extractPublicId(imageUrl);
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
            console.log('Deleted image from Cloudinary:', publicId);
          }
        }
      } catch (cloudinaryError) {
        console.error('Error deleting images from Cloudinary:', cloudinaryError);
        // Continue with room deletion even if image deletion fails
      }
    }
    
    await Room.findByIdAndDelete(req.params.id);
    
    // Remove room from user's listedRooms
    await User.findByIdAndUpdate(
      fullUser._id,
      { $pull: { listedRooms: req.params.id } }
    );
    
    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting room:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid room ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while deleting room'
    });
  }
};

// @desc    Update room images
// @route   PUT /api/rooms/:id/images
// @access  Private
const updateRoomImages = async (req, res) => {
  try {
    const fullUser = await User.findById(req.user.userId);
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    // Check if user is room owner
    if (room.owner.toString() !== fullUser._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this room'
      });
    }

    uploadRoomImages(req, res, async (error) => {
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      const newImages = req.files ? req.files.map(file => file.path) : [];
      const updatedImages = [...room.images, ...newImages];

      // Update room with new images
      const updatedRoom = await Room.findByIdAndUpdate(
        req.params.id,
        { images: updatedImages },
        { new: true }
      ).populate('owner', 'name avatar');

      res.status(200).json({
        success: true,
        message: 'Room images updated successfully',
        data: updatedRoom
      });
    });
  } catch (error) {
    console.error('Error updating room images:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating room images'
    });
  }
};

// @desc    Delete specific room image
// @route   DELETE /api/rooms/:id/images/:imageIndex
// @access  Private
const deleteRoomImage = async (req, res) => {
  try {
    const fullUser = await User.findById(req.user.userId);
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    // Check if user is room owner
    if (room.owner.toString() !== fullUser._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this room'
      });
    }

    const imageIndex = parseInt(req.params.imageIndex);
    
    if (imageIndex < 0 || imageIndex >= room.images.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image index'
      });
    }

    // Delete image from Cloudinary
    const imageUrl = room.images[imageIndex];
    const publicId = extractPublicId(imageUrl);
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
        console.log('Deleted image from Cloudinary:', publicId);
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
        // Continue with deletion from room even if Cloudinary deletion fails
      }
    }

    // Remove image from array
    const updatedImages = room.images.filter((_, index) => index !== imageIndex);
    
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { images: updatedImages },
      { new: true }
    ).populate('owner', 'name avatar');

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      data: updatedRoom
    });
  } catch (error) {
    console.error('Error deleting room image:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting room image'
    });
  }
};

// @desc    Get user's rooms
// @route   GET /api/rooms/my-rooms
// @access  Private
const getMyRooms = async (req, res) => {
  try {
    // Get the full user object from database
    const fullUser = await User.findById(req.user.userId);
    
    const rooms = await Room.find({ owner: fullUser._id })
      .populate('owner', 'name avatar')
      .populate('currentRoommates', 'name avatar')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    console.error('Error fetching user rooms:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user rooms'
    });
  }
};

export {
  createRoom,
  updateRoom,
  deleteRoom,
  getMyRooms,
  getRoomById,
  getRoom,
  getAvailableCities,
  uploadRoomImagesHandler,
  updateRoomImages,
  deleteRoomImage 
};