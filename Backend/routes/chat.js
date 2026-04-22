import express from 'express';
import Thread from '../models/Thread.js';
import getOllamaResponse from '../utils/ollama.js';
import authMiddleware from "../middleware/auth.js"

const router = express.Router();

//test
router.post("/test", async(req, res) => {
    try{
        const thread = new Thread({
            threadId: "hij",
            title: "Sample Thread 3"
        });

        const response = await thread.save();
        res.send(response);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to save to DB"});
    }
});

//Get all threads
router.get("/", authMiddleware, async(req, res) => {
    try{
        const threads = await Thread.find({ owner: req.userId }).sort({updatedAt : -1});
        res.json(threads);
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to fetch all threads"});
    }
});

//Get a thread
router.get("/:threadId", authMiddleware, async(req, res) => {
    try{
        const thread = await Thread.findOne({threadId: req.params.threadId, owner: req.userId});

        if(!thread){
            return res.status(400).json({error: "Thread is not found"});
        }

        res.json(thread.messages);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch the chat"});
    }
});

//Delete chat
router.delete("/:threadId", authMiddleware, async(req, res) => {
    try{
        const deletedThread = await Thread.findOneAndDelete({threadId: req.params.threadId, owner: req.userId});

        if(!deletedThread){
            return res.status(400).json({error: "Thread is not found"});
        }

        res.status(200).json({success: "Thread deleted successfully"});
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch the chat"});
    }
});

//Provide response
router.post("/chat", authMiddleware, async(req, res) => {
    const {threadId, message} = req.body;
    const owner = req.userId;

    if(!threadId || !message){
        return res.status(400).json({error: "Missing required fields"});
    }

    try{
        let thread = await Thread.findOne({threadId, owner});

        if(!thread){
            //create new
            thread = new Thread({
                threadId,
                owner,
                title: message,
                messages: [{
                    role: "user",
                    content: message
                }]
            });
        } else {
            thread.messages.push({role: "user", content: message});
        }

        const assistantReply = await getOllamaResponse(
            thread.messages.map(({ role, content }) => ({ role, content }))
        );
        thread.messages.push({role: "assistant", content: assistantReply});
        thread.updatedAt = new Date();
        await thread.save();
        res.json({reply: assistantReply});
    } catch(err) {
        console.log(err);
    }
});

export default router;
