import { FaUser, FaTasks } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { RiGlobalLine } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import ProfileAccount from "./subpages/ProfileAccount";
import Tasks from "./subpages/Tasks";
import { useState } from "react";
import Community from "./subpages/Community";
import Chats from "./subpages/Chats";

export default function Dashboard({ socket }) {
    const params = useParams();
    const navigate = useNavigate();
    const [dashbordHovered, setDashboardHovered] = useState(false);
    const [chatHovered, setChatHovered] = useState(false);
    const [globalHovered, setGlobalHovered] = useState(false);
    const [tasksHovered, setTasksHovered] = useState(false);

    return (
        <div className={`min-h-screen flex`}>
            <div className={`min-h-screen bg-foreground w-1/12 py-20`}>
                <div className={`w-5/6 mx-auto`}>
                    <div className={`mb-10 relative group`}>
                        <div onMouseEnter={() => setDashboardHovered(true)} onMouseLeave={() => setDashboardHovered(false)} onClick={() => navigate("/dashboard", { replace: true })} className={`flex w-16 h-16 mx-auto justify-center items-center rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${!params.subpage ? "bg-pale-green hover:pale-green" : "hover:bg-gray-500"}`}>
                            <FaUser fill={!params.subpage ? "black" : "white"} size={30}/>
                        </div>
                        {dashbordHovered && <p className={`bg-gray-500 text-[#FFFFFF] absolute top-3 left-full -ml-5 mt-1 w-fit h-fit px-4 py-1 font-semibold rounded-md`}>Dashboard</p>}
                    </div>
                    <div className={`mb-10 relative group`}>
                        <div onMouseEnter={() => setChatHovered(true)} onMouseLeave={() => setChatHovered(false)} onClick={() => navigate("/dashboard/chat", { replace: true })} className={`w-16 h-16 mx-auto flex justify-center items-center cursor-pointer rounded-full transition-colors duration-300 ease-in-out ${params.subpage === "chat" ? "bg-pale-green" : "hover:bg-gray-500"}`}>
                            <FaMessage fill={params.subpage === "chat" ? "black" : "white"} size={30}/>
                        </div>
                        {chatHovered && <p className={`bg-gray-500 text-[#FFFFFF] absolute top-3 left-full -ml-5 mt-1 w-fit h-fit px-4 py-1 font-semibold rounded-md`}>Chat</p>}
                    </div>
                    <div className={`mb-10 relative group`}>
                        <div onMouseEnter={() => setGlobalHovered(true)} onMouseLeave={() => setGlobalHovered(false)} onClick={() => navigate("/dashboard/global", { replace: true })} className={`w-16 h-16 mx-auto flex justify-center items-center cursor-pointer rounded-full mb-10 transition-colors duration-300 ease-in-out ${params.subpage === "global" ? "bg-pale-green" : "hover:bg-gray-500"}`}>
                            <RiGlobalLine fill={params.subpage === "global" ? "black" : "white"} size={35}/>
                        </div>
                        {globalHovered && <p className={`bg-gray-500 text-[#FFFFFF] absolute top-3 left-full -ml-5 mt-1 w-[158%] px-4 py-1 font-semibold rounded-md`}>Search for Study Buddies</p>}
                    </div>
                    <div className={`relative group`}>
                        <div onMouseEnter={() => setTasksHovered(true)} onMouseLeave={() => setTasksHovered(false)} onClick={() => navigate("/dashboard/tasks", { replace: true })} className={`w-16 h-16 mx-auto flex justify-center items-center cursor-pointer rounded-full mb-10 transition-colors duration-300 ease-in-out ${params.subpage === "tasks" ? "bg-pale-green" : "hover:bg-gray-500"}`}>
                            <FaTasks fill={params.subpage === "tasks" ? "black" : "white"} size={30}/>
                        </div>
                        {tasksHovered && <p className={`bg-gray-500 text-[#FFFFFF] absolute top-3 left-full -ml-5 mt-1 w-fit h-fit px-4 py-1 font-semibold rounded-md`}>Tasks</p>}
                    </div>
                </div>
            </div>
            <div className={`min-h-screen bg-background w-full`}>
                {!params.subpage ? <ProfileAccount/> : params.subpage === "tasks" ? <Tasks /> : params.subpage === "global" ? <Community /> : <Chats socket={socket} />}
            </div>
        </div>
    )
}