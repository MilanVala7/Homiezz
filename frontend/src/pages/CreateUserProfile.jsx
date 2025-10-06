import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

const CreateProfileForm = () => {
  const { createProfile, loading } = useProfileStore();
  const [includeSkills, setIncludeSkills] = useState(false);
  const [skills, setSkills] = useState([{ 
    skillName: "", 
    proficiency: "Beginner", 
    experience: "0 years",
    availability: {
      day: [],
      slots: [{ start: "09:00", end: "17:00" }]
    },
    sessionPreferences: {
      duration: 60,
      locationType: "remote"
    }
  }]);

  const [formData, setFormData] = useState({
    about: "",
    location: {
      city: "",
      country: "",
      coordinates: {
        type: "Point",
        coordinates: [0, 0]
      }
    },
    profileImage: "",
    languages: [],
    stats: {
      credits: 3,
      sessionsCompleted: 0,
      avgRating: 0,
      skillsTaught: 0,
      skillsLearned: 0
    },
    verification: {
      emailVerified: false,
      phoneVerified: false,
      identityVerified: false
    },
    badge: "Beginner"
  });

  const languagesOptions = ["English", "Spanish", "French", "German", "Chinese", "Hindi", "Gujarati", "Other"];
  const proficiencyOptions = ["Beginner", "Intermediate", "Advanced", "Expert"];
  const daysOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const durationOptions = [30, 60, 90];
  const locationTypeOptions = ["remote", "in-person", "both"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, [name]: value }
    }));
  };

  const handleCoordinatesChange = (index, value) => {
    const newCoordinates = [...formData.location.coordinates.coordinates];
    newCoordinates[index] = Number(value);
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: {
          ...prev.location.coordinates,
          coordinates: newCoordinates
        }
      }
    }));
  };

  const handleLanguageChange = (lang) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  const handleSkillChange = (skillIndex, field, value) => {
    const newSkills = [...skills];
    newSkills[skillIndex][field] = value;
    setSkills(newSkills);
  };

  const handleAvailabilityDayChange = (skillIndex, day) => {
    const newSkills = [...skills];
    const dayIndex = newSkills[skillIndex].availability.day.indexOf(day);
    
    if (dayIndex === -1) {
      newSkills[skillIndex].availability.day.push(day);
    } else {
      newSkills[skillIndex].availability.day.splice(dayIndex, 1);
    }
    
    setSkills(newSkills);
  };

  const handleSlotChange = (skillIndex, slotIndex, field, value) => {
    const newSkills = [...skills];
    newSkills[skillIndex].availability.slots[slotIndex][field] = value;
    setSkills(newSkills);
  };

  const addSkill = () => {
    setSkills([...skills, { 
      skillName: "", 
      proficiency: "Beginner", 
      experience: "0 years",
      availability: {
        day: [],
        slots: [{ start: "09:00", end: "17:00" }]
      },
      sessionPreferences: {
        duration: 60,
        locationType: "remote"
      }
    }]);
  };

  const removeSkill = (index) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };

  const addSlot = (skillIndex) => {
    const newSkills = [...skills];
    newSkills[skillIndex].availability.slots.push({ start: "09:00", end: "17:00" });
    setSkills(newSkills);
  };

  const removeSlot = (skillIndex, slotIndex) => {
    const newSkills = [...skills];
    newSkills[skillIndex].availability.slots.splice(slotIndex, 1);
    setSkills(newSkills);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const profileData = {
        ...formData,
        skills: includeSkills ? skills : undefined
      };
      console.log(profileData)
      await createProfile(profileData);
    } catch (error) {
      console.error("Profile creation failed:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Complete Your Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* About Section */}
        <div className="space-y-2">
          <Label htmlFor="about">About You</Label>
          <Textarea
            id="about"
            name="about"
            value={formData.about}
            onChange={handleInputChange}
            placeholder="Tell us about yourself..."
            rows={4}
            required
          />
        </div>

        {/* Location Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={formData.location.city}
              onChange={handleLocationChange}
              placeholder="Your city"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              value={formData.location.country}
              onChange={handleLocationChange}
              placeholder="Your country"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              value={formData.location.coordinates.coordinates[0]}
              onChange={(e) => handleCoordinatesChange(0, e.target.value)}
              placeholder="Longitude"
              step="0.000001"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              value={formData.location.coordinates.coordinates[1]}
              onChange={(e) => handleCoordinatesChange(1, e.target.value)}
              placeholder="Latitude"
              step="0.000001"
              required
            />
          </div>
        </div>

        {/* Profile Image */}
        <div className="space-y-2">
          <Label htmlFor="profileImage">Profile Image URL</Label>
          <Input
            id="profileImage"
            name="profileImage"
            value={formData.profileImage}
            onChange={handleInputChange}
            placeholder="https://example.com/your-image.jpg"
            required
          />
        </div>

        {/* Languages */}
        <div className="space-y-2">
          <Label>Languages You Speak (Select at least one)</Label>
          <div className="flex flex-wrap gap-2">
            {languagesOptions.map(lang => (
              <Button
                key={lang}
                type="button"
                variant={formData.languages.includes(lang) ? "default" : "outline"}
                onClick={() => handleLanguageChange(lang)}
              >
                {lang}
              </Button>
            ))}
          </div>
          {formData.languages.length === 0 && (
            <p className="text-sm text-red-500">Please select at least one language</p>
          )}
        </div>

        {/* Badge */}
        <div className="space-y-2">
          <Label htmlFor="badge">Skill Level Badge</Label>
          <select
            id="badge"
            value={formData.badge}
            onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
          </select>
        </div>

        {/* Skills Toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="includeSkills"
            checked={includeSkills}
            onChange={() => setIncludeSkills(!includeSkills)}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <Label htmlFor="includeSkills">Do you want to add skills?</Label>
        </div>

        {/* Skills Section */}
        {includeSkills && (
          <div className="space-y-4">
            <Label>Your Skills</Label>
            {skills.map((skill, skillIndex) => (
              <div key={skillIndex} className="border p-4 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`skillName-${skillIndex}`}>Skill Name</Label>
                    <Input
                      id={`skillName-${skillIndex}`}
                      value={skill.skillName}
                      onChange={(e) => handleSkillChange(skillIndex, "skillName", e.target.value)}
                      placeholder="e.g., JavaScript, Cooking"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`proficiency-${skillIndex}`}>Proficiency</Label>
                    <select
                      id={`proficiency-${skillIndex}`}
                      value={skill.proficiency}
                      onChange={(e) => handleSkillChange(skillIndex, "proficiency", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      {proficiencyOptions.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`experience-${skillIndex}`}>Experience</Label>
                  <Input
                    id={`experience-${skillIndex}`}
                    value={skill.experience}
                    onChange={(e) => handleSkillChange(skillIndex, "experience", e.target.value)}
                    placeholder="e.g., 2 years"
                    required
                  />
                </div>

                {/* Availability Days */}
                <div className="space-y-2">
                  <Label>Available Days</Label>
                  <div className="flex flex-wrap gap-2">
                    {daysOptions.map(day => (
                      <Button
                        key={day}
                        type="button"
                        variant={skill.availability.day.includes(day) ? "default" : "outline"}
                        onClick={() => handleAvailabilityDayChange(skillIndex, day)}
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                  {skill.availability.day.length === 0 && (
                    <p className="text-sm text-red-500">Please select at least one day</p>
                  )}
                </div>

                {/* Time Slots */}
                <div className="space-y-2">
                  <Label>Available Time Slots</Label>
                  {skill.availability.slots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="grid grid-cols-2 md:grid-cols-3 gap-2 items-end">
                      <div className="space-y-1">
                        <Label htmlFor={`start-${skillIndex}-${slotIndex}`}>Start Time</Label>
                        <Input
                          id={`start-${skillIndex}-${slotIndex}`}
                          type="time"
                          value={slot.start}
                          onChange={(e) => handleSlotChange(skillIndex, slotIndex, "start", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`end-${skillIndex}-${slotIndex}`}>End Time</Label>
                        <Input
                          id={`end-${skillIndex}-${slotIndex}`}
                          type="time"
                          value={slot.end}
                          onChange={(e) => handleSlotChange(skillIndex, slotIndex, "end", e.target.value)}
                          required
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeSlot(skillIndex, slotIndex)}
                        disabled={skill.availability.slots.length === 1}
                      >
                        Remove Slot
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addSlot(skillIndex)}
                  >
                    Add Time Slot
                  </Button>
                </div>

                {/* Session Preferences */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Session Duration (minutes)</Label>
                    <div className="flex gap-2">
                      {durationOptions.map(duration => (
                        <Button
                          key={duration}
                          type="button"
                          variant={skill.sessionPreferences.duration === duration ? "default" : "outline"}
                          onClick={() => handleSkillChange(
                            skillIndex, 
                            "sessionPreferences", 
                            { ...skill.sessionPreferences, duration }
                          )}
                        >
                          {duration}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Location Type</Label>
                    <div className="flex gap-2 flex-wrap">
                      {locationTypeOptions.map(type => (
                        <Button
                          key={type}
                          type="button"
                          variant={skill.sessionPreferences.locationType === type ? "default" : "outline"}
                          onClick={() => handleSkillChange(
                            skillIndex, 
                            "sessionPreferences", 
                            { ...skill.sessionPreferences, locationType: type }
                          )}
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {skills.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSkill(skillIndex)}
                  >
                    Remove Skill
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addSkill}
            >
              Add Another Skill
            </Button>
          </div>
        )}

        {/* Submit Button */}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : "Complete Profile"}
        </Button>
      </form>
    </div>
  );
};

export default CreateProfileForm;