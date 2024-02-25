import { IoIosNotifications } from "react-icons/io";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import epp from "../assets/empty-profile-pic.jpg";
import collabLearning from "../assets/collab_learning.jpg";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Community() {
    const [discoveredStudyBuddies, setDiscoveredStudyBuddies] = useState([]);
    const [usernameInterests, setUsernameInterests] = useState("");
    const [showUsersResults, setShowUsersResults] = useState(true);
    const [similarInterests, setSimilarInterests] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    const getAllUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/users/get');
            setAllUsers(response.data);
            setDiscoveredStudyBuddies(response.data);
            setSimilarInterests(response.data);
            filterData();
        } catch (e) {
            console.error("Error getting route /users/get:", e);
        }
    }

    const filterData = () => {
        const filteredUserData = allUsers.filter(user => {
            return (user.username.includes(usernameInterests.toLowerCase())) && user.username !== "nickle";
        });
    
        const filteredInterestsData = allUsers.filter(user => {
            return (user.interests.toLowerCase().includes(usernameInterests.toLowerCase())) && user.username !== "nickle";
        });

        console.log(filteredUserData, filteredInterestsData)
    
        setDiscoveredStudyBuddies(filteredUserData);
        setSimilarInterests(filteredInterestsData);
    }
    

    useEffect(() => {
        getAllUsers();
        filterData();
    }, []);

    useEffect(() => {
        filterData();
    }, [usernameInterests]);

    return (
        <div className={`px-36 py-10 w-full`}>
            <div className={`w-full flex justify-end px-20 items-center`}>
                <IoIosNotifications size={45} fill="white" className={`hover:fill-gray-500 transition-all duration-300 ease-in mr-5 cursor-pointer`} />
                <div className={`flex flex-row items-center py-3 px-5 hover:bg-dark rounded-lg cursor-pointer transition-colors duration-300 ease-in-out`}>
                    <img src={epp} alt="empty-profile-pic.jpg" className={`w-11 h-11 rounded-full mr-7`} />
                    <p className={`text-white text-xl font-semibold mr-4`}>Nikhil Pellakuru {/*Put the Username Here*/}</p>
                    <FaChevronDown className={`fill-white`} size={20}/>
                </div>
            </div>
            <hr className={`my-7 border-t-4 border-gray-500 rounded-xl`} />
            <div className={`w-full flex justify-center mb-16`}>
                <div className={`w-3/6 bg-dark px-5 py-2 rounded-full flex flex-row items-center`}>
                    <FaSearch fill="white" size={30} className={`w-1/12`} />
                    <input value={usernameInterests} onChange={(e) => setUsernameInterests(e.target.value)} className={`focus:outline-none border-2 border-dark bg-dark text-white placeholder:text-gray-400 rounded-full px-6 py-3 text-xl w-11/12`} placeholder="Enter a username or some interests"/>
                </div>
            </div>
            <div className={`w-full flex flex-row mb-10`}>
                <button onClick={() => setShowUsersResults(true)} className={`w-fit ${showUsersResults ? "bg-pale-green text-black" : "bg-gray-500 text-white"} text-xl py-2 px-5 rounded-lg mr-2.5 hover:bg-opacity-85 transition-all duration-300 ease-in-out font-semibold`}>Users ({discoveredStudyBuddies.length})</button>
                <button onClick={() => setShowUsersResults(false)} className={`w-fit ${!showUsersResults ? "bg-pale-green text-black" : "bg-gray-500 text-white"} text-xl py-2 px-5 rounded-lg ml-2.5 hover:bg-opacity-85 transition-all duration-300 ease-in-out font-semibold`}>Interests ({similarInterests.length})</button>
            </div>
            <div className={`w-full rounded-3xl border-2 border-gray-500 py-7 px-10`}>
                <p className={`text-4xl font-bold text-white`}>{showUsersResults ? "Users Matching the Entered Username" : "Users With the Same Interests"}</p>
                <hr className={`mt-8 border-t-4 border-gray-500 rounded-lg`} />
                <div className={`flex flex-wrap`}>
                    {showUsersResults ? (
                        discoveredStudyBuddies.map((user, index) => {
                            return (
                                <div key={index} className={`mt-8 w-64 border-2 rounded-lg border-gray-500 px-5 py-2 mr-5`}>
                                    <div className={`w-full px-5 py-5`}><img src={index % 2 ===  0 ? collabLearning : epp} className={`w-44 h-44 rounded-full mr-12 mx-auto object-cover`} /></div>
                                    <div className={`flex flex-col text-white`}>
                                        <p className={`mb-px text-xl font-bold`}>{user.username}</p>
                                        <p className={`mb-5 text-lg`}>{user.fname} {user.lname}</p>
                                        <p className={`text-lg line-clamp-3`}>{user.interests}</p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        similarInterests.map((user, index) => {
                            return (
                                <div key={index} className={`mt-8 w-64 border-2 rounded-lg border-gray-500 px-5 py-2 mr-5`}>
                                    <div className={`w-full px-5 py-5`}><img src={index % 2 ===  0 ? collabLearning : epp} className={`w-44 h-44 rounded-full mr-12 mx-auto object-cover`} /></div>
                                    <div className={`flex flex-col text-white`}>
                                        <p className={`mb-px text-xl font-bold`}>{user.username}</p>
                                        <p className={`mb-5 text-lg`}>{user.fname} {user.lname}</p>
                                        <p className={`text-lg line-clamp-3`}>{user.interests}</p>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    );
}