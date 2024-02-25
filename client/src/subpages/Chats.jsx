import { IoIosNotifications } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa";
import epp from "../assets/empty-profile-pic.jpg";
import collabLearning from "../assets/collab_learning.jpg";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';

export default function Chats({ socket }) {
    const [currentChat, setCurrentChat] = useState(undefined);
    const [dms, setDms] = useState([]);
    const [msgToSend, setMsgToSend] = useState([]);
    const [groupChats, setGroupChats] = useState([]);

    useEffect(() => {
        // Example: Listening for a "message" event from the server
        socket.on("message", (data) => {
            alert(data);
        });

        const getAllChats = async () => {
            try {
                const response = await axios.post("http://localhost:5000/chats/get", { username: Cookies.get("username") });

                setDms(response.data);
                console.log(dms);
            } catch (e) {
                console.error("Error fetching chats:", e);
            }
        }

        setInterval(() => {
            getAllChats();
        }, 5000);
        getAllChats();
    }, []);

    // Example: Sending a message to the server
    // Example: Sending a message to the server
    const sendAMessage = async (data) => {
        try {
            // Emit the message to the server
            socket.emit("message", data);

            // Update local state immediately to show the sent message
            const updatedMsgData = [...currentChat.msgData, { sender: data.sender, message: data.msg }];
            setCurrentChat({ ...currentChat, msgData: updatedMsgData });
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };


    return (
        <div className={`px-36 py-10 w-full h-full`}>
            <div className={`w-full flex justify-end px-20 items-center`}>
                <IoIosNotifications size={45} fill="white" className={`hover:fill-gray-500 transition-all duration-300 ease-in mr-5 cursor-pointer`} />
                <div className={`flex flex-row items-center py-3 px-5 hover:bg-dark rounded-lg cursor-pointer transition-colors duration-300 ease-in-out`}>
                    <img src={epp} alt="empty-profile-pic.jpg" className={`w-11 h-11 rounded-full mr-7`} />
                    <p className={`text-white text-xl font-semibold mr-4`}>Nikhil Pellakuru {/*Put the Username Here*/}</p>
                    <FaChevronDown className={`fill-white`} size={20}/>
                </div>
            </div>
            <hr className={`my-7 border-t-4 border-gray-500 rounded-xl`} />
            <div className={`flex flex-row w-full h-5/6`}>
                <div className={`w-3/12 border-r-2 border-r-gray-500 h-full px-4 py-2`}>
                    <p className={`text-3xl font-semibold text-pale-green`}>Chats</p>
                    <hr className={`border-t-2 border-gray-500 my-3`} />
                    <p className={`text-xl text-pale-green mb-5`}>Direct Messages</p>
                    <div className={``}>
                        {dms.length === 0 ? <p className={`text-lg text-white`}>No DMs! Create one through the community tab.</p> : (
                            dms.map((dm, index) => {
                                console.log(dm);
                                return (
                                    <div onClick={() => setCurrentChat(dm)} key={index} className={`hover:bg-dark transition-all duration-300 ease-in-out cursor-pointer w-5/6 px-5 py-2 rounded-xl bg-gray-500 mb-4`}>
                                        <p className={`text-lg text-white font-semibold`}>{dm.name.split("_").join(" & ")}</p>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
                <div className={`w-9/12 px-5 py-2 h-full`}>
                    <p className={`text-white font-semibold text-3xl w-full h-1/12`}>{currentChat ? currentChat.name : "No Chat Selected"}</p>
                    <hr className={`border-t-2 border-gray-500 my-3`} />
                    {currentChat && (
                        <div className={`h-full flex justify-center flex-col`}>
                            <div className={`h-[500px] overflow-y-scroll px-10 py-5`}>
                                {currentChat.msgData.map((msg, index) => {
                                    return (
                                        <div className={`w-full flex ${msg.sender === Cookies.get("username") ? 'flex-end bg-pale-green px-10 py-5 rounded-lg ml-auto' : 'bg-secondary-bg px-10 py-5 rounded-lg'} max-w-80 mb-5`}>
                                            <p className={`${msg.sender === Cookies.get("username") ? 'text-right' : 'text-left'} text-lg`}>{msg.message}</p>
                                        </div>
                                    );
                                })}
                            </div>
                            <hr className={`border-t-2 border-gray-500 my-3`} />
                            <input value={msgToSend}  onChange={(e) => setMsgToSend(e.target.value)} type="text" placeholder="Enter your message" className={`focus:outline-none focus:shadow-xl shadow-slate-200 text-xl text-white bg-gray-500 px-5 py-2 rounded-xl h-1/12 mt-8 mx-auto placeholder:text-slate-200`} />
                            <button onClick={() => sendAMessage({ sender: Cookies.get("username"), tableName: currentChat.name, msg: msgToSend })} className={`bg-pale-green px-5 py-2 font-semibold text-black hover:bg-opacity-75 transition-all duration-200 ease-in-out rounded-lg w-fit mx-auto mt-3 text-xl`}>Send</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}