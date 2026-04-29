const Conversation = require("../models/Conversation");
const User = require("../models/User");
const createNotification = require("../utils/createNotification");

const conversationPopulation = [
    {
        path: "participants",
        select: "name location profilePic",
    },
    {
        path: "messages.sender",
        select: "name location profilePic",
    },
    {
        path: "swapRequest",
        populate: [
            {
                path: "requester",
                select: "name location profilePic",
            },
            {
                path: "offeredClothes",
                select: "title images user",
            },
            {
                path: "requestedClothes",
                select: "title images user",
            },
        ],
    },
];

const buildParticipantKey = (firstUserId, secondUserId) =>
    [String(firstUserId), String(secondUserId)].sort().join(":");

const findOtherParticipant = (conversation, currentUserId) =>
    conversation.participants.find(
        (participant) => String(participant._id || participant.id) !== String(currentUserId)
    );

const normalizeConversation = (conversation, currentUserId) => {
    const otherParticipant = findOtherParticipant(conversation, currentUserId);
    const messages = Array.isArray(conversation.messages)
        ? conversation.messages
        : [];
    const lastMessage = messages[messages.length - 1] || null;

    return {
        ...conversation.toObject(),
        otherParticipant,
        lastMessage,
    };
};

const getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({ participants: req.user })
            .populate(conversationPopulation)
            .sort({ lastMessageAt: -1, createdAt: -1 });

        return res.json(conversations.map((conversation) => normalizeConversation(conversation, req.user)));
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

const getConversationByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        if (String(userId) === String(req.user)) {
            return res.status(400).json({ message: "You cannot message yourself" });
        }

        const otherUser = await User.findById(userId).select("name location profilePic");

        if (!otherUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const participantKey = buildParticipantKey(req.user, userId);
        let conversation = await Conversation.findOne({ participantKey })
            .populate(conversationPopulation);

        if (!conversation) {
            conversation = await Conversation.create({
                participantKey,
                participants: [req.user, userId],
                messages: [],
                lastMessageAt: new Date(),
            });

            conversation = await Conversation.findById(conversation._id)
                .populate(conversationPopulation);
        }

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        return res.json(normalizeConversation(conversation, req.user));
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

const sendMessage = async (req, res) => {
    const { userId } = req.params;
    const { text } = req.body;

    try {
        const trimmedText = typeof text === "string" ? text.trim() : "";

        if (!trimmedText) {
            return res.status(400).json({ message: "Message text is required" });
        }

        if (String(userId) === String(req.user)) {
            return res.status(400).json({ message: "You cannot message yourself" });
        }

        const [otherUser, sender] = await Promise.all([
            User.findById(userId).select("_id"),
            User.findById(req.user).select("name"),
        ]);

        if (!otherUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const participantKey = buildParticipantKey(req.user, userId);
        let conversation = await Conversation.findOne({ participantKey });

        if (!conversation) {
            conversation = new Conversation({
                participantKey,
                participants: [req.user, userId],
                messages: [],
                lastMessageAt: new Date(),
            });
        }

        conversation.messages.push({
            sender: req.user,
            text: trimmedText,
            createdAt: new Date(),
        });
        conversation.lastMessageAt = new Date();

        const savedConversation = await conversation.save();
        const populatedConversation = await Conversation.findById(savedConversation._id)
            .populate(conversationPopulation);

        await createNotification({
            user: userId,
            actor: req.user,
            type: "new_message",
            title: "New Message",
            message: `${sender?.name || "Someone"} sent you a message.`,
            link: `/chat/${req.user}`,
            metadata: {
                conversation: savedConversation._id,
                message: savedConversation.messages[savedConversation.messages.length - 1]?._id,
            },
        });

        return res.status(201).json(normalizeConversation(populatedConversation, req.user));
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getConversations,
    getConversationByUser,
    sendMessage,
};
