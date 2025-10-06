import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, UserPlus, Home } from "lucide-react";
import Navbar from "@/components/Navbar";
import RoommateProfileForm from "@/components/RoommateProfileForm";
import { useRoommateStore } from "@/store/roommateStore";
import { useAuthStore } from "@/store/userStore";


export default function RoommateProfilePage() {
  const navigate = useNavigate();
  
  // Zustand stores
  const {
    userRoommateProfile,
    loading,
    getUserRoommateProfile,
    clearError
  } = useRoommateStore();

  const { user } = useAuthStore();

  // State for form data
  const [formData, setFormData] = useState({
    isActive: false,
    bio: "",
    age: "",
    gender: "",
    occupation: "",
    occupationType: "",
    budget: 10000,
    moveInDate: new Date(),
    locationPreference: "",
    currentLocation: "",
    lifestyle: {
      smoking: "Non-Smoker",
      drinking: "Non-Drinker",
      pets: "No Pets",
      diet: "No Preference",
      sleepSchedule: "Flexible"
    },
    interests: [],
    roommatePreferences: {
      genderPreference: "Any",
      ageRange: { min: 18, max: 35 },
      occupationPreference: []
    }
  });

  // Fetch profile on component mount
  useEffect(() => {
    fetchProfile();
    
    // Clear error when component unmounts
    return () => clearError();
  }, []);

  const fetchProfile = async () => {
    try {
      await getUserRoommateProfile();
    } catch (error) {
      console.error('Error fetching roommate profile:', error);
    }
  };

  // Update form data when profile is loaded
  useEffect(() => {
    if (userRoommateProfile?.roommateProfile) {
      const profile = userRoommateProfile.roommateProfile;
      setFormData(prev => ({
        ...prev,
        ...profile,
        moveInDate: profile.moveInDate ? new Date(profile.moveInDate) : new Date(),
        age: profile.age || "",
        budget: profile.budget || 10000,
        lifestyle: {
          smoking: profile.lifestyle?.smoking || "Non-Smoker",
          drinking: profile.lifestyle?.drinking || "Non-Drinker",
          pets: profile.lifestyle?.pets || "No Pets",
          diet: profile.lifestyle?.diet || "No Preference",
          sleepSchedule: profile.lifestyle?.sleepSchedule || "Flexible"
        },
        interests: profile.interests || [],
        roommatePreferences: {
          genderPreference: profile.roommatePreferences?.genderPreference || "Any",
          ageRange: {
            min: profile.roommatePreferences?.ageRange?.min || 18,
            max: profile.roommatePreferences?.ageRange?.max || 35
          },
          occupationPreference: profile.roommatePreferences?.occupationPreference || []
        }
      }));
    }
  }, [userRoommateProfile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        {/* Header with Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                onClick={() => navigate("/")}
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Roommate Profile</h1>
              <p className="text-gray-600 mt-1">
                {userRoommateProfile?.roommateProfile ? 
                  "Manage your roommate profile and preferences" : 
                  "Create your profile to find compatible roommates"
                }
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate("/find-roommates")}
            >
              <UserPlus className="h-4 w-4" />
              Find Roommates
            </Button>
          </div>
        </div>

        {/* Welcome Message for New Users */}
        {!userRoommateProfile?.roommateProfile && !loading && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-1">
                    Create Your Roommate Profile
                  </h3>
                  <p className="text-blue-700 text-sm">
                    Fill out your profile to connect with potential roommates who share your lifestyle and preferences. 
                    Your profile will help others get to know you better and find the perfect match.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Status Card for Existing Profiles */}
        {userRoommateProfile?.roommateProfile && (
          <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Profile Status:{" "}
                    <span className={userRoommateProfile.roommateProfile.isActive ? 
                      "text-green-600" : "text-gray-500"
                    }>
                      {userRoommateProfile.roommateProfile.isActive ? 
                        "Active" : "Inactive"
                      }
                    </span>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {userRoommateProfile.roommateProfile.isActive ? 
                      "Your profile is visible to other users searching for roommates" :
                      "Your profile is hidden from roommate searches"
                    }
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Last updated:{" "}
                    {userRoommateProfile.roommateProfile.updatedAt ? 
                      new Date(userRoommateProfile.roommateProfile.updatedAt).toLocaleDateString() :
                      "Never"
                    }
                  </p>
                  {user && (
                    <p className="text-xs text-gray-500 mt-1">
                      Welcome, {user.name}!
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your profile...</p>
            </div>
          </div>
        )}

        {/* Roommate Profile Form - Always Show */}
        <RoommateProfileForm 
          initialData={formData}
          onUpdate={setFormData}
        />

        {/* Help Section */}
        <Card className="mt-8 bg-gray-50 border-0">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Complete Your Profile</h4>
                <p className="text-gray-600">
                  Fill out all sections to increase your chances of finding compatible roommates.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Be Honest</h4>
                <p className="text-gray-600">
                  Accurate information helps you connect with roommates who share your lifestyle.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Set Preferences</h4>
                <p className="text-gray-600">
                  Specify what you're looking for in a roommate to find better matches.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}