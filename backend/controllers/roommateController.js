import User from '../models/user.js';

// @desc    Create or update roommate profile
// @route   PUT /api/user/roommate-profile
// @access  Private
export const updateRoommateProfile = async (req, res) => {
  try {
    const {
      isActive,
      bio,
      age,
      gender,
      occupation,
      occupationType,
      budget,
      moveInDate,
      locationPreference,
      currentLocation,
      lifestyle,
      interests,
      roommatePreferences
    } = req.body;

    const userId = req.user.userId;

    // Find user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your account before creating a roommate profile'
      });
    }

    // Update roommate profile
    user.roommateProfile = {
      isActive: isActive !== undefined ? isActive : user.roommateProfile?.isActive || false,
      bio: bio || user.roommateProfile?.bio || '',
      age: age || user.roommateProfile?.age || null,
      gender: gender || user.roommateProfile?.gender || '',
      occupation: occupation || user.roommateProfile?.occupation || '',
      occupationType: occupationType || user.roommateProfile?.occupationType || '',
      budget: budget || user.roommateProfile?.budget || 10000,
      moveInDate: moveInDate || user.roommateProfile?.moveInDate || new Date(),
      locationPreference: locationPreference || user.roommateProfile?.locationPreference || '',
      currentLocation: currentLocation || user.roommateProfile?.currentLocation || '',
      lifestyle: {
        smoking: lifestyle?.smoking || user.roommateProfile?.lifestyle?.smoking || 'Non-Smoker',
        drinking: lifestyle?.drinking || user.roommateProfile?.lifestyle?.drinking || 'Non-Drinker',
        pets: lifestyle?.pets || user.roommateProfile?.lifestyle?.pets || 'No Pets',
        diet: lifestyle?.diet || user.roommateProfile?.lifestyle?.diet || 'No Preference',
        sleepSchedule: lifestyle?.sleepSchedule || user.roommateProfile?.lifestyle?.sleepSchedule || 'Flexible'
      },
      interests: interests || user.roommateProfile?.interests || [],
      roommatePreferences: {
        genderPreference: roommatePreferences?.genderPreference || user.roommateProfile?.roommatePreferences?.genderPreference || 'Any',
        ageRange: {
          min: roommatePreferences?.ageRange?.min || user.roommateProfile?.roommatePreferences?.ageRange?.min || 18,
          max: roommatePreferences?.ageRange?.max || user.roommateProfile?.roommatePreferences?.ageRange?.max || 35
        },
        occupationPreference: roommatePreferences?.occupationPreference || user.roommateProfile?.roommatePreferences?.occupationPreference || []
      },
      updatedAt: new Date()
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Roommate profile updated successfully',
      data: {
        roommateProfile: user.roommateProfile
      }
    });

  } catch (error) {
    console.error('Update roommate profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating roommate profile'
    });
  }
};

// @desc    Get user's roommate profile
// @route   GET /api/user/roommate-profile
// @access  Private
export const getRoommateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select('name email avatar isVerified roommateProfile');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          isVerified: user.isVerified
        },
        roommateProfile: user.roommateProfile || null
      }
    });
  } catch (error) {
    console.error('Get roommate profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching roommate profile'
    });
  }
};

// @desc    Toggle roommate profile active status
// @route   PATCH /api/user/roommate-profile/active
// @access  Private
export const toggleRoommateProfile = async (req, res) => {
  try {
    const { isActive } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Initialize roommateProfile if it doesn't exist
    if (!user.roommateProfile) {
      user.roommateProfile = {
        isActive: false,
        bio: '',
        age: null,
        gender: '',
        occupation: '',
        occupationType: '',
        budget: 10000,
        moveInDate: new Date(),
        locationPreference: '',
        currentLocation: '',
        lifestyle: {
          smoking: 'Non-Smoker',
          drinking: 'Non-Drinker',
          pets: 'No Pets',
          diet: 'No Preference',
          sleepSchedule: 'Flexible'
        },
        interests: [],
        roommatePreferences: {
          genderPreference: 'Any',
          ageRange: { min: 18, max: 35 },
          occupationPreference: []
        }
      };
    }

    user.roommateProfile.isActive = isActive;
    user.roommateProfile.updatedAt = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: `Roommate profile ${isActive ? 'activated' : 'deactivated'}`,
      data: {
        isActive: user.roommateProfile.isActive
      }
    });

  } catch (error) {
    console.error('Toggle roommate profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while toggling roommate profile'
    });
  }
};