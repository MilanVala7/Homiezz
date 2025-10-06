import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, X, Plus, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { toast } from "react-hot-toast";
import { useRoommateStore } from "@/store/roommateStore";

const INTERESTS_OPTIONS = [
  "Music", "Gaming", "Reading", "Fitness", "Cooking", "Travel", "Photography",
  "Yoga", "Movies", "Dancing", "Art", "Tech", "Sports", "Nature", "Books",
  "Writing", "Hiking", "Cycling", "Meditation", "Podcasts", "Foodie", "Coffee",
  "Crafting", "Volunteering", "Language Learning"
];

const OCCUPATION_TYPES = ["Student", "Working Professional", "Freelancer", "Other"];
const GENDERS = ["Male", "Female", "Other"];
const SLEEP_SCHEDULES = ["Early Bird", "Night Owl", "Flexible"];
const SMOKING_OPTIONS = ["Non-Smoker", "Social Smoker", "Smoker"];
const DRINKING_OPTIONS = ["Non-Drinker", "Social Drinker", "Drinker"];
const PET_OPTIONS = ["Pet Friendly", "No Pets"];
const DIET_OPTIONS = ["Vegetarian", "Non-Vegetarian", "Vegan", "No Preference"];

export default function RoommateProfileForm({ initialData, onUpdate }) {
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(initialData);
  const [customInterest, setCustomInterest] = useState("");

  // Zustand store
  const {
    updateRoommateProfile,
    toggleRoommateProfile,
    getUserRoommateProfile
  } = useRoommateStore();

  // Update local state when initialData changes
  useEffect(() => {
    setProfile(initialData);
  }, [initialData]);

  const handleInputChange = (field, value) => {
    const updatedProfile = {
      ...profile,
      [field]: value
    };
    setProfile(updatedProfile);
    onUpdate?.(updatedProfile);
  };

  const handleLifestyleChange = (field, value) => {
    const updatedProfile = {
      ...profile,
      lifestyle: {
        ...profile.lifestyle,
        [field]: value
      }
    };
    setProfile(updatedProfile);
    onUpdate?.(updatedProfile);
  };

  const handlePreferencesChange = (field, value) => {
    const updatedProfile = {
      ...profile,
      roommatePreferences: {
        ...profile.roommatePreferences,
        [field]: value
      }
    };
    setProfile(updatedProfile);
    onUpdate?.(updatedProfile);
  };

  const addInterest = (interest) => {
    if (interest && !profile.interests.includes(interest)) {
      const updatedProfile = {
        ...profile,
        interests: [...profile.interests, interest]
      };
      setProfile(updatedProfile);
      onUpdate?.(updatedProfile);
    }
    setCustomInterest("");
  };

  const removeInterest = (interestToRemove) => {
    const updatedProfile = {
      ...profile,
      interests: profile.interests.filter(interest => interest !== interestToRemove)
    };
    setProfile(updatedProfile);
    onUpdate?.(updatedProfile);
  };

  const addCustomInterest = () => {
    if (customInterest.trim()) {
      addInterest(customInterest.trim());
    }
  };

  const handleToggleActive = async (isActive) => {
    try {
      await toggleRoommateProfile(isActive);
      // Update local state
      const updatedProfile = { ...profile, isActive };
      setProfile(updatedProfile);
      onUpdate?.(updatedProfile);
    } catch (error) {
      console.error('Error toggling profile:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateRoommateProfile(profile);
      toast.success("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Error saving profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      await getUserRoommateProfile();
      toast.success("Profile reset to saved values");
    } catch (error) {
      console.error("Error resetting profile:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Activation */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Profile Visibility</span>
              <Switch
                checked={profile.isActive}
                onCheckedChange={handleToggleActive}
              />
            </CardTitle>
            <CardDescription>
              {profile.isActive 
                ? "Your profile is visible to other users looking for roommates" 
                : "Your profile is hidden from searches"}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Basic Information */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Tell others about yourself
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="18"
                  max="100"
                  value={profile.age}
                  onChange={(e) => handleInputChange("age", parseInt(e.target.value) || "")}
                  placeholder="Enter your age"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={profile.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDERS.map(gender => (
                      <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={profile.occupation}
                  onChange={(e) => handleInputChange("occupation", e.target.value)}
                  placeholder="e.g., Software Engineer, Student"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupationType">Occupation Type</Label>
                <Select value={profile.occupationType} onValueChange={(value) => handleInputChange("occupationType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {OCCUPATION_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">About Me</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Describe yourself, your lifestyle, and what you're looking for in a roommate..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location & Budget */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Location & Budget</CardTitle>
            <CardDescription>
              Where do you want to live and what's your budget?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentLocation">Current Location</Label>
                <Input
                  id="currentLocation"
                  value={profile.currentLocation}
                  onChange={(e) => handleInputChange("currentLocation", e.target.value)}
                  placeholder="e.g., Koramangala, Bangalore"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationPreference">Preferred Area</Label>
                <Input
                  id="locationPreference"
                  value={profile.locationPreference}
                  onChange={(e) => handleInputChange("locationPreference", e.target.value)}
                  placeholder="e.g., Indiranagar, Whitefield"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">
                Monthly Budget: ₹{profile.budget?.toLocaleString()}
              </Label>
              <Slider
                value={[profile.budget]}
                onValueChange={([value]) => handleInputChange("budget", value)}
                max={50000}
                min={5000}
                step={1000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>₹5,000</span>
                <span>₹50,000</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Move-in Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !profile.moveInDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {profile.moveInDate ? format(profile.moveInDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={profile.moveInDate}
                    onSelect={(date) => handleInputChange("moveInDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* Lifestyle */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Lifestyle</CardTitle>
            <CardDescription>
              Help others understand your daily habits and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Smoking</Label>
                <Select value={profile.lifestyle.smoking} onValueChange={(value) => handleLifestyleChange("smoking", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SMOKING_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Drinking</Label>
                <Select value={profile.lifestyle.drinking} onValueChange={(value) => handleLifestyleChange("drinking", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DRINKING_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pets</Label>
                <Select value={profile.lifestyle.pets} onValueChange={(value) => handleLifestyleChange("pets", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PET_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Diet</Label>
                <Select value={profile.lifestyle.diet} onValueChange={(value) => handleLifestyleChange("diet", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIET_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sleep Schedule</Label>
              <Select value={profile.lifestyle.sleepSchedule} onValueChange={(value) => handleLifestyleChange("sleepSchedule", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SLEEP_SCHEDULES.map(schedule => (
                    <SelectItem key={schedule} value={schedule}>{schedule}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Interests */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Interests & Hobbies</CardTitle>
            <CardDescription>
              Share your interests to find like-minded roommates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Your Interests</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {profile.interests.map(interest => (
                  <Badge key={interest} variant="secondary" className="flex items-center gap-1">
                    {interest}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeInterest(interest)}
                    />
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  placeholder="Add an interest..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomInterest();
                    }
                  }}
                />
                <Button type="button" onClick={addCustomInterest} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Popular Interests</Label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS_OPTIONS.map(interest => (
                  <Badge
                    key={interest}
                    variant={profile.interests.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => 
                      profile.interests.includes(interest) 
                        ? removeInterest(interest)
                        : addInterest(interest)
                    }
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Roommate Preferences */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Roommate Preferences</CardTitle>
            <CardDescription>
              What are you looking for in a roommate?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Preferred Gender</Label>
              <Select 
                value={profile.roommatePreferences.genderPreference} 
                onValueChange={(value) => handlePreferencesChange("genderPreference", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any">Any</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Preferred Age Range: {profile.roommatePreferences.ageRange.min} - {profile.roommatePreferences.ageRange.max} years
              </Label>
              <Slider
                value={[profile.roommatePreferences.ageRange.min, profile.roommatePreferences.ageRange.max]}
                onValueChange={([min, max]) => handlePreferencesChange("ageRange", { min, max })}
                max={65}
                min={18}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>18 years</span>
                <span>65 years</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}