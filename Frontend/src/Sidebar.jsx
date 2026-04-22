import './Sidebar.css';
import { useContext, useEffect } from 'react';
import { MyContext } from './MyContext';
import { v1 as uuidv1 } from 'uuid';
import api from './api.js';

export default function Sidebar() {

    const { allThreads, setAllThreads, setCurrThreadId, currThreadId, setNewChat, setPrompt, reply, setReply, setPrevChats } = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const res = await api.get("/thread");
            const filteredData = res.data.map(thread => ({ threadId: thread.threadId, title: thread.title }));
            setAllThreads(filteredData);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getAllThreads();
    }, [reply]);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    };

    const getChats = async (threadId) => {
        try {
            const res = await api.get(`/thread/${threadId}`);
            setNewChat(false);
            setPrevChats(res.data);
            setCurrThreadId(threadId);
            setPrompt("");
            setReply(null);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteThread = async (threadId) => {
        try {
            await api.delete(`/thread/${threadId}`);  // ← no need to read response here
            getAllThreads();
            if (threadId === currThreadId) {
                createNewChat();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <section className='sidebar'>
            <button onClick={createNewChat}>
                <i className="fa-solid fa-pen-to-square"></i>&nbsp;&nbsp;&nbsp;
                <span>Create a new chat</span>
            </button>

            <ul className='history'>
                {
                    allThreads?.map((thread, idx) => (
                        <li onClick={() => getChats(thread.threadId)} key={idx} className={thread.threadId === currThreadId ? "highlighted" : " "}>
                            <span className='threadTitle'>{thread.title}</span>
                            <i
                                className="fa-regular fa-trash-can deleteIcon"
                                onClick={(e) => {
                                    e.stopPropagation(); // ✅ stops click from reaching the <li>
                                    deleteThread(thread.threadId);
                                }}
                            />
                        </li>
                    ))
                }
            </ul>

            <div className='sign'>
                <p>Upgrade your plan!</p>
            </div>

        </section>
    )
}
