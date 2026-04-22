import "./WindowChat.css";
import Chat from './Chat.jsx';
import { MyContext } from './MyContext.jsx';
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from 'react-spinners';
import api from "./api.js";

export default function WindowChat() {
    const { prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats, setNewChat, logout , user} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const getReply = async () => {
        setNewChat(false);
        setLoading(true);

        try {
            const res = await api.post("thread/chat", {
                message: prompt,
                threadId: currThreadId,
            });
            setReply(res.data.reply);  // ← res.data not res.json()
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (prompt && reply) {
            setPrevChats(prevChats => {
                return [...prevChats, {
                    role: 'user',
                    content: prompt
                }, {
                    role: "assistant",
                    content: reply
                }]
            })
        }

        setPrompt("");
    }, [reply]);

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>Samvaad AI <i className="fa-solid fa-angle-down"></i> </span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user" ></i></span>
                </div>
            </div>
            {
                isOpen &&
                <div className="dropDown">
                    <div className="dropDownItem">{user?.name}</div>
                    <div className="dropDownItem"><i class="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i class="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownItem" onClick={logout}><i class="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                </div>
            }
            <Chat></Chat>
            <ScaleLoader color="#fff" loading={loading}>

            </ScaleLoader>

            <div className="chatInput">
                <div className="inputBox">
                    <input
                        placeholder="Ask Anything"
                        value={prompt} onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}>

                    </input>
                    <div id="submit"><i className="fa-regular fa-paper-plane" onClick={getReply}></i></div>
                </div>
                <p className="info">
                    Samvaad is AI and can make mistakes. Please double-check responses.
                </p>
            </div>
        </div>
    )
};