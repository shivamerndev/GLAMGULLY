import express from 'express'
import { subscribe, sendNotification } from '../controllers/notification.controller.js'
const router = express.Router();

// Route to save user subscription token
router.post('/subscribe', subscribe);

// Route to send a notification (This can be triggered by any event)
router.post('/send-notification', sendNotification);

export default router;