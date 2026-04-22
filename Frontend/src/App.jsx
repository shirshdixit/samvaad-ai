import './App.css';
import Sidebar from './Sidebar.jsx';
import WindowChat from './WindowChat.jsx';
import Login from './Login.jsx'; 
import { MyContext } from './MyContext.jsx';
import { useState } from 'react';
import { v1 as uuidv1 } from 'uuid';

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  // Auth state
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));

  const login = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    prevChats, setPrevChats,
    newChat, setNewChat,
    allThreads, setAllThreads,
    // Auth
    token, user, login, logout, isAuth: !!token
  };

  if (!token) {                              
    return (
      <MyContext.Provider value={providerValues}>
        <Login />
      </MyContext.Provider>
    );
  }

  return (
    <div className='main'>
      <MyContext.Provider value={providerValues}>
        <Sidebar />
        <WindowChat />
      </MyContext.Provider>
    </div>
  )
}

export default App