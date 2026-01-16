import Subscription from '../models/subscription.model.js'
import admin from 'firebase-admin'

// Save token to database
export const subscribe = async (req, res) => {
  const { token } = req.body;
  try {
    const existingSubscription = await Subscription.findOne({ token });
    if (!existingSubscription) {
      const newSubscription = new Subscription({ token });
      await newSubscription.save();
      return res.status(201).json({ message: 'Subscribed successfully' });
    }
    res.status(200).json({ message: 'Already subscribed' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Send notification to all subscribed users
export const sendNotification = async (req, res) => {
  const { title, body } = req.body;
  try {
    const subscriptions = await Subscription.find();
    const tokens = subscriptions.map(sub => sub.token);

    const message = {
      notification: { title, body },
      tokens: tokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    // console.log('multicast response:', JSON.stringify(response, null, 2));

    res.status(200).json({
      message: 'Notifications sent successfully',
      successCount: response.successCount,
      failureCount: response.failureCount,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending notifications' });
  }
};