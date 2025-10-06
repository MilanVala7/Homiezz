import express from "express";
import User from "../models/user.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all active roommate profiles with filters
router.get("/", async (req, res) => {
  try {
    const {
      location,
      minBudget,
      maxBudget,
      gender,
      occupationType,
      lifestyle,
      interests,
      page = 1,
      limit = 10,
      sortBy = 'newest'
    } = req.query;

    let filter = { "roommateProfile.isActive": true, "isVerified": true };

    // Location filter
    if (location) {
      filter.$or = [
        { "roommateProfile.locationPreference": new RegExp(location, "i") },
        { "roommateProfile.currentLocation": new RegExp(location, "i") }
      ];
    }

    // Budget filter
    if (minBudget || maxBudget) {
      filter["roommateProfile.budget"] = {};
      if (minBudget) filter["roommateProfile.budget"].$gte = parseInt(minBudget);
      if (maxBudget) filter["roommateProfile.budget"].$lte = parseInt(maxBudget);
    }

    // Gender filter
    if (gender && gender !== "Any") {
      filter["roommateProfile.gender"] = gender;
    }

    // Occupation type filter
    if (occupationType) {
      filter["roommateProfile.occupationType"] = occupationType;
    }

    // Lifestyle filters
    if (lifestyle) {
      const lifestyleArray = lifestyle.split(',');
      lifestyleArray.forEach(item => {
        const [key, value] = item.split(':');
        if (key && value) {
          filter[`roommateProfile.lifestyle.${key}`] = value;
        }
      });
    }

    // Interests filter
    if (interests) {
      const interestsArray = interests.split(',');
      filter["roommateProfile.interests"] = {
        $in: interestsArray.map(interest => new RegExp(interest, "i"))
      };
    }

    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'newest':
        sort.createdAt = -1;
        break;
      case 'oldest':
        sort.createdAt = 1;
        break;
      case 'budget-low':
        sort["roommateProfile.budget"] = 1;
        break;
      case 'budget-high':
        sort["roommateProfile.budget"] = -1;
        break;
      default:
        sort.createdAt = -1;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const roommates = await User.find(filter)
      .select("name email avatar roommateProfile isVerified createdAt")
      .limit(limitNum)
      .skip(skip)
      .sort(sort);

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        roommates,
        pagination: {
          current: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalResults: total,
          hasNext: pageNum < Math.ceil(total / limitNum),
          hasPrev: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Get roommates error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching roommates'
    });
  }
});

// Get single roommate profile
router.get("/:id", async (req, res) => {
  try {
    const roommate = await User.findById(req.params.id)
      .select("name email avatar phone roommateProfile isVerified createdAt");

    if (!roommate || !roommate.roommateProfile?.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Roommate profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: roommate
    });
  } catch (error) {
    console.error('Get roommate error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid roommate ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching roommate profile'
    });
  }
});

export default router;