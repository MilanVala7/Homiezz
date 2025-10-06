import express from 'express';
import {
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
} from '../controllers/roomController.js';
import {
  sendRoomRequest,
  getSentRequests,
  getReceivedRequests,
  acceptRequest,
  rejectRequest
} from '../controllers/requestController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getRoom);
router.get('/cities/available', getAvailableCities);

// Protected routes
router.use(authenticateToken);
router.post('/', createRoom);
router.get('/my-rooms', getMyRooms);
router.post('/upload-images', uploadRoomImagesHandler);

// Request routes
router.post('/:roomId/request', sendRoomRequest);
router.get('/requests/sent', getSentRequests);
router.get('/requests/received', getReceivedRequests);
router.post('/requests/:requestId/accept', acceptRequest);
router.post('/requests/:requestId/reject', rejectRequest);

// Room CRUD routes (should come after specific routes)
router.get('/:id', getRoomById);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);
router.put('/:id/images', updateRoomImages);
router.delete('/:id/images/:imageIndex', deleteRoomImage);

export default router;