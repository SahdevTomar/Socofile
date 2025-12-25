import { Conversation } from "../models/conversation.model.js";

export const sendMessage = async (req, res) => {
    try {
        
        const senderId = req.id;
        const receiverId = req.params.id;
        const { textMessage: message } = req.body;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        // establish the conversation if not started yet 
        if (!conversation) {
            conversation = await Conversation.create({
                participants:[senderId , receiverId]
            })
        };

        const newMessage = await MessageChannel.create({
            senderId,
            receiverId,
            message
        })

        if (newMessage) conversation.messages.push(newMessage._id);
        await promise.all([conversation.save(), newMessage.save()]);

        return res.status(200).json({
            message: "Message sent successfully",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });
        if (!conversation) {
            return res.sataus(200).json({
                success: true,
                messages:[]
            
            })
        };
        return res.status(200).json({
            success: true,
            messages: conversation?.messages
        })
        
    } catch (error) {
        console.log(error);
    }
}