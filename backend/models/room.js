import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: String
  },
  location: {
    lat: Number,
    lng: Number
  },
  price: { type: Number, required: true },
  amenities: [String],
  images: [String],
  availableBeds: { type: Number, default: 1 },
  currentRoommates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isVacant: { type: Boolean, default: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Additional metadata for your form fields
  metadata: {
    propertyType: String,
    bedrooms: Number,
    bathrooms: Number,
    area: String,
    landmark: String,
    ownershipType: { type: String, enum: ['self', 'tenant'], default: 'self' },
    ownerDetails: {
      ownerName: String,
      ownerContact: String,
      permissionDetails: String
    },
    securityDeposit: Number
  }
}, { timestamps: true });

const Room = mongoose.model('Room', RoomSchema);
export default Room;