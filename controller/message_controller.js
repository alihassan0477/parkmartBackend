const Message = require('../Model/message_model');

exports.getChats = async (req, res) => {
  const userId = req.params.userId;

  try {
    const chats = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { receiverId: userId }],
        },
      },
      {
        $project: {
          receiverId: {
            $cond: [{ $eq: ['$senderId', userId] }, '$receiverId', '$senderId'],
          },
          content: 1,
          timestamp: 1,
        },
      },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: '$receiverId',
          latestMessage: { $first: '$content' },
          timestamp: { $first: '$timestamp' },
        },
      },
      // Lookup in users
      {
        $lookup: {
          from: 'users',
          let: { id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$_id', { $toObjectId: '$$id' }] },
              },
            },
            { $project: { username: 1 } },
          ],
          as: 'userInfo',
        },
      },
      // Lookup in sellers
      {
        $lookup: {
          from: 'sellers',
          let: { id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$_id', { $toObjectId: '$$id' }] },
              },
            },
            { $project: { name: 1 } },
          ],
          as: 'sellerInfo',
        },
      },
      // Combine user/seller name
      {
        $addFields: {
          name: {
            $cond: [
              { $gt: [{ $size: '$userInfo' }, 0] },
              { $arrayElemAt: ['$userInfo.username', 0] },
              { $arrayElemAt: ['$sellerInfo.name', 0] },
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
          receiverId: '$_id',
          latestMessage: 1,
          timestamp: 1,
          name: 1,
        },
      },
      { $sort: { timestamp: -1 } },
    ]);

    res.status(200).json(chats);
  } catch (error) {
    console.error('Error in getChats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMessages = async (req, res) => {
  const { user1, user2 } = req.params;

  const messages = await Message.find({
    $or: [
      { senderId: user1, receiverId: user2 },
      { senderId: user2, receiverId: user1 },
    ],
  }).sort({ timestamp: 1 });

  res.json(messages);
};
