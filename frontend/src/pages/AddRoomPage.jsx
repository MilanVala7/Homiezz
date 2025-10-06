import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  MapPin,
  Upload,
  Trash2,
  Bed,
  Bath,
  Wifi,
  Car,
  Dumbbell,
  Coffee,
  Tv,
  Wind,
  Shield,
  Palette,
  ArrowLeft,
  Check,
  Loader2,
  AlertCircle
} from "lucide-react"
import Navbar from "@/components/Navbar"
import { useRoomStore } from "@/store/roomStore"
import { useAuthStore } from "@/store/userStore"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export default function AddRoomPage() {
  const [step, setStep] = useState(1)
  const [ownershipType, setOwnershipType] = useState("self")
  const [amenities, setAmenities] = useState([])
  const [images, setImages] = useState([])
  const [uploadedImageUrls, setUploadedImageUrls] = useState([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [stepErrors, setStepErrors] = useState({})

  const { register, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm({
    mode: "onChange",
    defaultValues: {
      budget: {
        min: 0,
        max: 0
      }
    }
  })

  const { createRoom, loading } = useRoomStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const amenitiesList = [
    { id: "wifi", name: "Wi-Fi", icon: Wifi },
    { id: "parking", name: "Parking", icon: Car },
    { id: "gym", name: "Gym", icon: Dumbbell },
    { id: "kitchen", name: "Kitchen", icon: Coffee },
    { id: "tv", name: "TV", icon: Tv },
    { id: "ac", name: "Air Conditioning", icon: Wind },
    { id: "washing_machine", name: "Washing Machine", icon: Wind },
    { id: "security", name: "24/7 Security", icon: Shield },
    { id: "furnished", name: "Furnished", icon: Palette },
  ]

  // Validation schemas for each step
  const stepValidations = {
    1: ['title', 'propertyType', 'bedrooms', 'bathrooms', 'availableBeds', 'description'],
    2: ['city', 'state', 'area', 'address', 'pincode'],
    3: ['price'],
    4: [] // Custom validation for step 4
  }

  const toggleAmenity = (amenityId) => {
    if (amenities.includes(amenityId)) {
      setAmenities(amenities.filter(id => id !== amenityId))
    } else {
      setAmenities([...amenities, amenityId])
    }
  }

  const validateStep = async (currentStep) => {
    let isValid = true
    const newErrors = {}

    if (currentStep === 1) {
      isValid = await trigger(stepValidations[1])
      if (!isValid) {
        newErrors.step1 = "Please fix all errors in basic information"
      }
    } else if (currentStep === 2) {
      isValid = await trigger(stepValidations[2])
      if (!isValid) {
        newErrors.step2 = "Please fix all errors in location details"
      }
    } else if (currentStep === 3) {
      isValid = await trigger(stepValidations[3])
      if (amenities.length === 0) {
        newErrors.amenities = "Please select at least one amenity"
        isValid = false
      }
      if (!isValid) {
        newErrors.step3 = "Please fix all errors in pricing & amenities"
      }
    } else if (currentStep === 4) {
      // Custom validation for step 4
      if (ownershipType === 'tenant') {
        const ownerNameValid = await trigger('ownerName')
        const ownerContactValid = await trigger('ownerContact')
        if (!ownerNameValid || !ownerContactValid) {
          newErrors.step4 = "Please provide owner details"
          isValid = false
        }
      }
      if (images.length + uploadedImageUrls.length < 3) {
        newErrors.images = "Please upload at least 3 images"
        isValid = false
      }
    }

    setStepErrors(newErrors)
    return isValid
  }

  const nextStep = async () => {
    const isValid = await validateStep(step)
    if (isValid) {
      setStep(step + 1)
      setStepErrors(prev => ({ ...prev, [`step${step}`]: '' }))
    } else {
      const firstErrorElement = document.querySelector('.text-red-500')
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  const prevStep = () => {
    setStep(step - 1)
    setStepErrors(prev => ({ ...prev, [`step${step}`]: '' }))
  }

  const uploadImagesToCloudinary = async (imageFiles) => {
    setUploadingImages(true)
    try {
      const formData = new FormData()
      imageFiles.forEach(file => {
        formData.append('images', file)
      })

      const response = await fetch('http://localhost:3000/api/rooms/upload-images', {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Upload failed: ${response.status} - ${errorText}`)
      }

      const result = await response.json()

      if (result.success) {
        setUploadedImageUrls(result.data.images)
        return result.data.images
      } else {
        throw new Error(result.message || 'Failed to upload images')
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      toast.error('Failed to upload images: ' + error.message)
      return []
    } finally {
      setUploadingImages(false)
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (images.length + files.length > 10) {
      toast.warn("Maximum 10 images allowed")
      return
    }
    
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`)
        return false
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`)
        return false
      }
      return true
    })
    
    setImages(prev => [...prev, ...validFiles])
  }

  const removeImage = async (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    if (index < uploadedImageUrls.length) {
      setUploadedImageUrls(prev => prev.filter((_, i) => i !== index))
    }
  }

  const onSubmit = async (data) => {
    const isValid = await validateStep(4)
    if (!isValid) {
      toast.error("Please fix all errors before submitting")
      return
    }

    let finalImageUrls = [...uploadedImageUrls]

    if (images.length > 0) {
      const newImageUrls = await uploadImagesToCloudinary(images)
      finalImageUrls = [...finalImageUrls, ...newImageUrls]
    }

    if (finalImageUrls.length < 3) {
      toast.warn("Please upload at least 3 images")
      return
    }

    const roomData = {
      title: data.title,
      description: data.description,
      propertyType: data.propertyType,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      availableBeds: data.availableBeds,
      city: data.city,
      state: data.state,
      area: data.area,
      address: data.address,
      landmark: data.landmark,
      pincode: data.pincode,
      price: data.price,
      securityDeposit: data.securityDeposit || 0,
      amenities: amenities,
      ownershipType: ownershipType,
      images: finalImageUrls
    }

    if (ownershipType === 'tenant') {
      roomData.ownerName = data.ownerName
      roomData.ownerContact = data.ownerContact
      roomData.permissionDetails = data.permissionDetails
    }

    const result = await createRoom(roomData)

    if (result.success) {
      toast.success("Room listed successfully!")
      setStep(1)
      setAmenities([])
      setImages([])
      setUploadedImageUrls([])
      navigate('/')
    }
  }

  const watchMinBudget = watch("budget.min")
  const watchMaxBudget = watch("budget.max")
  useEffect(() => {
    if (watchMinBudget && watchMaxBudget && parseInt(watchMinBudget) > parseInt(watchMaxBudget)) {
      setStepErrors(prev => ({
        ...prev,
        budget: "Minimum budget cannot be greater than maximum budget"
      }))
    } else {
      setStepErrors(prev => ({ ...prev, budget: "" }))
    }
  }, [watchMinBudget, watchMaxBudget])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navbar />

      <div className="container mx-auto py-8 px-4">
        <Button variant="ghost" className="mb-6" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl flex items-center justify-center gap-2">
                  <Home className="h-8 w-8 text-orange-500" />
                  List Your Room
                </CardTitle>
                <CardDescription>
                  Fill in the details about your room to find the perfect roommate
                </CardDescription>

                {/* Progress Steps */}
                <div className="flex justify-center mt-6">
                  <div className="flex items-center">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center">
                        <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                          i === step ? "bg-orange-500 text-white" :
                          i < step ? "bg-green-500 text-white" : "bg-gray-200"
                        }`}>
                          {i < step ? <Check className="h-5 w-5" /> : i}
                        </div>
                        {i < 4 && (
                          <div className={`h-1 w-16 ${i < step ? "bg-green-500" : "bg-gray-200"}`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Step 1: Basic Information */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h3>

                      {stepErrors.step1 && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                          <p className="text-red-700 text-sm">{stepErrors.step1}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="title">Room Title *</Label>
                          <Input
                            id="title"
                            placeholder="e.g., Spacious 2BHK near Tech Park"
                            {...register("title", { 
                              required: "Title is required",
                              minLength: {
                                value: 4,
                                message: "Title should be at least 4 characters"
                              },
                              maxLength: {
                                value: 50,
                                message: "Title should not exceed 50 characters"
                              }
                            })}
                          />
                          {errors.title && (
                            <div className="flex items-center gap-1 text-red-500 text-sm">
                              <AlertCircle className="h-4 w-4" />
                              {errors.title.message}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="propertyType">Property Type *</Label>
                          <Select onValueChange={(value) => setValue("propertyType", value, { shouldValidate: true })}>
                            <SelectTrigger className={errors.propertyType ? "border-red-500" : ""}>
                              <SelectValue placeholder="Select property type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="apartment">Apartment</SelectItem>
                              <SelectItem value="house">Independent House</SelectItem>
                              <SelectItem value="villa">Villa</SelectItem>
                              <SelectItem value="pg">PG</SelectItem>
                              <SelectItem value="hostel">Hostel</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.propertyType && (
                            <div className="flex items-center gap-1 text-red-500 text-sm">
                              <AlertCircle className="h-4 w-4" />
                              Property type is required
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="bedrooms">Bedrooms *</Label>
                          <Select onValueChange={(value) => setValue("bedrooms", value, { shouldValidate: true })}>
                            <SelectTrigger className={errors.bedrooms ? "border-red-500" : ""}>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6].map(num => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} {num === 1 ? "Bedroom" : "Bedrooms"}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.bedrooms && (
                            <div className="flex items-center gap-1 text-red-500 text-sm">
                              <AlertCircle className="h-4 w-4" />
                              Bedrooms count is required
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bathrooms">Bathrooms *</Label>
                          <Select onValueChange={(value) => setValue("bathrooms", value, { shouldValidate: true })}>
                            <SelectTrigger className={errors.bathrooms ? "border-red-500" : ""}>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4].map(num => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} {num === 1 ? "Bathroom" : "Bathrooms"}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.bathrooms && (
                            <div className="flex items-center gap-1 text-red-500 text-sm">
                              <AlertCircle className="h-4 w-4" />
                              Bathrooms count is required
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="availableBeds">Available Beds *</Label>
                          <Input
                            id="availableBeds"
                            type="number"
                            min="1"
                            max="20"
                            {...register("availableBeds", {
                              required: "Available beds is required",
                              min: { 
                                value: 1, 
                                message: "At least 1 bed required" 
                              },
                              max: { 
                                value: 20, 
                                message: "Maximum 20 beds allowed" 
                              },
                              validate: (value) => {
                                const bedrooms = watch("bedrooms")
                                if (bedrooms && parseInt(value) > parseInt(bedrooms) * 4) {
                                  return "Too many beds for the number of bedrooms"
                                }
                                return true
                              }
                            })}
                          />
                          {errors.availableBeds && (
                            <div className="flex items-center gap-1 text-red-500 text-sm">
                              <AlertCircle className="h-4 w-4" />
                              {errors.availableBeds.message}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe your room, neighborhood, and what makes it special..."
                          rows={4}
                          {...register("description", { 
                            required: "Description is required",
                            maxLength: {
                              value: 1000,
                              message: "Description should not exceed 1000 characters"
                            }
                          })}
                        />
                        {errors.description && (
                          <div className="flex items-center gap-1 text-red-500 text-sm">
                            <AlertCircle className="h-4 w-4" />
                            {errors.description.message}
                          </div>
                        )}
                        <p className="text-sm text-gray-500">
                          {watch("description")?.length || 0}/1000 characters
                        </p>
                      </div>

                      <div className="flex justify-end">
                        <Button type="button" onClick={nextStep}>
                          Next: Location
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Location Details */}
                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Location Details</h3>

                      {stepErrors.step2 && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                          <p className="text-red-700 text-sm">{stepErrors.step2}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            placeholder="e.g., Bangalore"
                            {...register("city", { 
                              required: "City is required",
                              pattern: {
                                value: /^[a-zA-Z\s]+$/,
                                message: "City should contain only letters"
                              }
                            })}
                          />
                          {errors.city && (
                            <div className="flex items-center gap-1 text-red-500 text-sm">
                              <AlertCircle className="h-4 w-4" />
                              {errors.city.message}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="state">State *</Label>
                          <div className="relative">
                            <Input
                              id="state"
                              placeholder="Start typing to search..."
                              {...register("state", {
                                required: "State is required",
                                validate: (value) =>
                                  indianStates.includes(value) || "Please select a valid state"
                              })}
                              list="state-options"
                              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            {watch("state") && (
                              <ul
                                className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 w-full overflow-auto"
                                role="listbox"
                              >
                                {indianStates
                                  .filter((state) =>
                                    state.toLowerCase().includes(watch("state")?.toLowerCase() || "")
                                  )
                                  .map((state) => (
                                    <li
                                      key={state}
                                      className="px-4 py-2 cursor-pointer hover:bg-orange-100"
                                      onClick={() => {
                                        setValue("state", state, { shouldValidate: true });
                                        trigger("state");
                                      }}
                                    >
                                      {state}
                                    </li>
                                  ))}
                              </ul>
                            )}
                          </div>
                          {errors.state && (
                            <div className="flex items-center gap-1 text-red-500 text-sm">
                              <AlertCircle className="h-4 w-4" />
                              {errors.state.message}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="area">Area/Locality *</Label>
                        <Input
                          id="area"
                          placeholder="e.g., Koramangala"
                          {...register("area", { 
                            required: "Area is required",
                            minLength: {
                              value: 2,
                              message: "Area should be at least 2 characters"
                            }
                          })}
                        />
                        {errors.area && (
                          <div className="flex items-center gap-1 text-red-500 text-sm">
                            <AlertCircle className="h-4 w-4" />
                            {errors.area.message}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Full Address *</Label>
                        <Textarea
                          id="address"
                          placeholder="Building name, floor, street address..."
                          rows={3}
                          {...register("address", { 
                            required: "Address is required",
                          })}
                        />
                        {errors.address && (
                          <div className="flex items-center gap-1 text-red-500 text-sm">
                            <AlertCircle className="h-4 w-4" />
                            {errors.address.message}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="landmark">Landmark (Optional)</Label>
                          <Input
                            id="landmark"
                            placeholder="e.g., Near Forum Mall"
                            {...register("landmark")}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="pincode">Pincode *</Label>
                          <Input
                            id="pincode"
                            placeholder="e.g., 560034"
                            {...register("pincode", {
                              required: "Pincode is required",
                              pattern: {
                                value: /^[1-9][0-9]{5}$/,
                                message: "Please enter a valid 6-digit pincode"
                              }
                            })}
                          />
                          {errors.pincode && (
                            <div className="flex items-center gap-1 text-red-500 text-sm">
                              <AlertCircle className="h-4 w-4" />
                              {errors.pincode.message}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={prevStep}>
                          Previous
                        </Button>
                        <Button type="button" onClick={nextStep}>
                          Next: Pricing & Amenities
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Pricing & Amenities */}
                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Pricing & Amenities</h3>

                      {stepErrors.step3 && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                          <p className="text-red-700 text-sm">{stepErrors.step3}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="price">Monthly Rent (₹) *</Label>
                          <Input
                            id="price"
                            type="number"
                            min="0"
                            step="100"
                            placeholder="e.g., 15000"
                            {...register("price", {
                              required: "Price is required",
                              min: { 
                                value: 1000, 
                                message: "Minimum rent should be ₹1000" 
                              },
                              max: { 
                                value: 100000, 
                                message: "Maximum rent should be ₹1,00,000" 
                              }
                            })}
                          />
                          {errors.price && (
                            <div className="flex items-center gap-1 text-red-500 text-sm">
                              <AlertCircle className="h-4 w-4" />
                              {errors.price.message}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="securityDeposit">Security Deposit (₹)</Label>
                          <Input
                            id="securityDeposit"
                            type="number"
                            min="0"
                            step="1000"
                            placeholder="e.g., 30000"
                            {...register("securityDeposit", {
                              min: { 
                                value: 0, 
                                message: "Security deposit cannot be negative" 
                              },
                              max: { 
                                value: 500000, 
                                message: "Security deposit too high" 
                              }
                            })}
                          />
                          {errors.securityDeposit && (
                            <div className="flex items-center gap-1 text-red-500 text-sm">
                              <AlertCircle className="h-4 w-4" />
                              {errors.securityDeposit.message}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label>Amenities *</Label>
                        <p className="text-sm text-gray-600 mb-3">Select all amenities available</p>

                        {stepErrors.amenities && (
                          <div className="flex items-center gap-1 text-red-500 text-sm">
                            <AlertCircle className="h-4 w-4" />
                            {stepErrors.amenities}
                          </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {amenitiesList.map(amenity => (
                            <div
                              key={amenity.id}
                              className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                                amenities.includes(amenity.id)
                                  ? "border-orange-500 bg-orange-50"
                                  : "border-gray-200 hover:border-orange-300"
                              }`}
                            >
                              <Checkbox
                                checked={amenities.includes(amenity.id)}
                                onCheckedChange={() => toggleAmenity(amenity.id)}
                                className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                              />
                              <amenity.icon className="h-4 w-4 text-gray-600" />
                              <span className="text-sm cursor-pointer" onClick={() => toggleAmenity(amenity.id)}>
                                {amenity.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={prevStep}>
                          Previous
                        </Button>
                        <Button type="button" onClick={nextStep}>
                          Next: Ownership & Images
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Ownership & Images */}
                  {step === 4 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Ownership & Images</h3>

                      {(stepErrors.step4 || stepErrors.images) && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                          <div className="text-red-700 text-sm">
                            {stepErrors.step4 && <p>{stepErrors.step4}</p>}
                            {stepErrors.images && <p>{stepErrors.images}</p>}
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        <Label>Ownership Type *</Label>
                        <Tabs
                          value={ownershipType}
                          onValueChange={setOwnershipType}
                          className="w-full"
                        >
                          <TabsList className="grid grid-cols-2 mb-6">
                            <TabsTrigger value="self">Self Owned</TabsTrigger>
                            <TabsTrigger value="tenant">I'm a Tenant</TabsTrigger>
                          </TabsList>

                          <TabsContent value="self" className="space-y-4">
                            <p className="text-sm text-gray-600">
                              As the owner, you'll be responsible for managing this listing.
                            </p>
                          </TabsContent>

                          <TabsContent value="tenant" className="space-y-4">
                            <p className="text-sm text-gray-600 mb-4">
                              Please provide the owner's details as you'll need permission to sublet the room.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label htmlFor="ownerName">Owner Name *</Label>
                                <Input
                                  id="ownerName"
                                  placeholder="Owner's full name"
                                  {...register("ownerName", {
                                    required: ownershipType === "tenant" ? "Owner name is required" : false,
                                    pattern: {
                                      value: /^[a-zA-Z\s]+$/,
                                      message: "Owner name should contain only letters"
                                    }
                                  })}
                                />
                                {errors.ownerName && (
                                  <div className="flex items-center gap-1 text-red-500 text-sm">
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.ownerName.message}
                                  </div>
                                )}
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="ownerContact">Owner Contact *</Label>
                                <Input
                                  id="ownerContact"
                                  placeholder="Phone number or email"
                                  {...register("ownerContact", {
                                    required: ownershipType === "tenant" ? "Owner contact is required" : false,
                                    validate: (value) => {
                                      if (ownershipType !== "tenant") return true
                                      const phoneRegex = /^[6-9]\d{9}$/
                                      const emailRegex = /^\S+@\S+\.\S+$/
                                      if (phoneRegex.test(value) || emailRegex.test(value)) {
                                        return true
                                      }
                                      return "Please enter a valid phone number or email"
                                    }
                                  })}
                                />
                                {errors.ownerContact && (
                                  <div className="flex items-center gap-1 text-red-500 text-sm">
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.ownerContact.message}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="permissionDetails">Permission Details</Label>
                              <Textarea
                                id="permissionDetails"
                                placeholder="Describe the permission you have to sublet this room..."
                                rows={3}
                                {...register("permissionDetails", {
                                  minLength: {
                                    value: 10,
                                    message: "Permission details should be at least 10 characters"
                                  }
                                })}
                              />
                              {errors.permissionDetails && (
                                <div className="flex items-center gap-1 text-red-500 text-sm">
                                  <AlertCircle className="h-4 w-4" />
                                  {errors.permissionDetails.message}
                                </div>
                              )}
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>

                      <div className="space-y-4">
                        <Label>Upload Room Images *</Label>
                        <p className="text-sm text-gray-600 mb-3">
                          Add at least 3 photos of your room (max 10). Supported formats: JPG, PNG, WEBP. Max size: 5MB per image.
                        </p>

                        {/* Upload Status */}
                        {uploadingImages && (
                          <div className="flex items-center gap-2 text-orange-600 mb-3">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Uploading images...</span>
                          </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          {/* Show uploaded images preview */}
                          {images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={URL.createObjectURL(image)}
                                alt={`Room ${index + 1}`}
                                className="h-24 w-full object-cover rounded-md"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(index)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                              <Badge className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs">
                                New
                              </Badge>
                            </div>
                          ))}

                          {/* Show already uploaded images (if any) */}
                          {uploadedImageUrls.map((url, index) => (
                            <div key={`uploaded-${index}`} className="relative group">
                              <img
                                src={url}
                                alt={`Uploaded room ${index + 1}`}
                                className="h-24 w-full object-cover rounded-md"
                              />
                              <Badge className="absolute bottom-1 left-1 bg-green-500 text-white text-xs">
                                Uploaded
                              </Badge>
                            </div>
                          ))}

                          {/* Upload button */}
                          {(images.length + uploadedImageUrls.length) < 10 && (
                            <label
                              htmlFor="room-images"
                              className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-orange-500 transition-colors"
                            >
                              <Upload className="h-6 w-6 text-gray-400 mb-1" />
                              <span className="text-sm text-gray-500">Add Image</span>
                              <input
                                id="room-images"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                className="hidden"
                                onChange={handleImageUpload}
                                disabled={uploadingImages}
                              />
                            </label>
                          )}
                        </div>

                        {/* Image count validation */}
                        <div className={`text-sm ${(images.length + uploadedImageUrls.length) < 3 ? 'text-red-500' : 'text-green-600'}`}>
                          {images.length + uploadedImageUrls.length} / 3 images uploaded
                          {(images.length + uploadedImageUrls.length) < 3 && ' (minimum 3 required)'}
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={prevStep}>
                          Previous
                        </Button>
                        <Button
                          type="submit"
                          disabled={loading || uploadingImages}
                        >
                          {(loading || uploadingImages) ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              {uploadingImages ? 'Uploading...' : 'Creating...'}
                            </>
                          ) : (
                            "Submit Room Listing"
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}