import { IoIosNotifications } from "react-icons/io";
import { FaChevronDown, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import epp from "../assets/empty-profile-pic.jpg";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';

export default function ProfileAccount() {
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const [currentDay, setCurrentDay] = useState(new Date());
    const [displayMonthYear, setDisplayMonthYear] = useState(`${months[currentDay.getMonth()]} ${currentDay.getFullYear()}`);
    const [selectedDay, setSelectedDay] = useState(new Date().getDate());
    const [secondaryBox, setSecondaryBox] = useState(`${months[currentDay.getMonth()]} ${selectedDay}, ${currentDay.getFullYear()}`);
    const [allTasks, setAllTasks] = useState([]);
    const [sortedTasks, setSortedTasks] = useState(allTasks);

    const collectTasks = async () => {
        try {
            const response = await axios.post("http://localhost:5000/tasks/get", { username: "nickle" });

            setAllTasks(response.data);
        } catch (e) {
            console.error("Error fetching all tasks:", e);
        }
    }

    useEffect(() => {
        collectTasks();
    }, []);

    useEffect(() => {
        const newFilteredTasks = allTasks.filter(task => {
            const taskDueDate = new Date(task.duedate);
            const currentDayUTC = new Date(currentDay.toISOString().slice(0, 10)); // Convert currentDay to UTC
            const taskDueDateUTC = new Date(taskDueDate.toISOString().slice(0, 10)); // Convert taskDueDate to UTC
            console.log(`${months[parseInt(task.duedate.split("-")[1]) - 1]} ${task.duedate.split("-")[2].split("T")[0]}, ${task.duedate.split("-")[0]}`);

            return `${months[parseInt(task.duedate.split("-")[1]) - 1]} ${parseInt(task.duedate.split("-")[2].split("T")[0])}, ${task.duedate.split("-")[0]}` === secondaryBox;
        });

        setSortedTasks(newFilteredTasks);
    }, [secondaryBox]);

    useEffect(() => {
        const newFilteredTasks = allTasks.filter(task => {
            console.log(`${months[parseInt(task.duedate.split("-")[1]) - 1]} ${task.duedate.split("-")[2].split("T")[0]}, ${task.duedate.split("-")[0]}`);

            return `${months[parseInt(task.duedate.split("-")[1]) - 1]} ${parseInt(task.duedate.split("-")[2].split("T")[0])}, ${task.duedate.split("-")[0]}` === secondaryBox;
        });

        setSortedTasks(newFilteredTasks);
    }, [allTasks]);

    useEffect(() => {
        setSecondaryBox(`${months[currentDay.getMonth()]} ${selectedDay}, ${currentDay.getFullYear()}`);
    }, [selectedDay]);

    const changeDisplayDate = (mode) => {
        const updatedDay = new Date(currentDay);
        if (mode === "left") {
            updatedDay.setMonth(updatedDay.getMonth() - 1);
        } else {
            updatedDay.setMonth(updatedDay.getMonth() + 1);
        }

        setCurrentDay(updatedDay);
        setDisplayMonthYear(`${months[updatedDay.getMonth()]} ${updatedDay.getFullYear()}`);
    }

    function getDatesForWeekday(year, month, weekday) {
        const dates = [];
        const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get total days in the month
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            if (date.getDay() === weekday) {
                dates.push(date.getDate());
            }
        }
    
        const firstDayOfMonth = new Date(year, month, 1);
        const options = { weekday: 'short' };
        const firstDayAbbreviation = firstDayOfMonth.toLocaleDateString('en-US', options);
    
        if (dates[0] > 1 && weekdays.indexOf(firstDayAbbreviation) > weekdays.indexOf(weekdays[weekday])) {
            dates.unshift(0);
        }
        
        return dates;
    }    

    return (
        <div className={`px-36 py-10 w-full`}>
            <div className={`w-full flex justify-end px-20 items-center`}>
                <IoIosNotifications size={45} fill="white" className={`hover:fill-borders transition-all duration-300 ease-in mr-5 cursor-pointer`} />
                <div className={`flex flex-row items-center py-3 px-5 hover:bg-foreground group rounded-lg cursor-pointer transition-colors duration-300 ease-in-out`}>
                    <img src={epp} alt="empty-profile-pic.jpg" className={`w-11 h-11 rounded-full mr-7`} />
                    <p className={`text-white text-xl font-semibold mr-4 group-hover:text-[#FFFFFF]`}>Nikhil Pellakuru {/*Put the Username Here*/}</p>
                    <FaChevronDown className={`fill-white group-hover:fill-[#FFFFFF]`} size={20}/>
                </div>
            </div>
            <hr className={`my-7 border-t-4 border-gray-500 rounded-xl`} />
            <h1 className={`text-white text-4xl font-bold mb-3 text-center`}>Welcome {Cookies.get("username")}!</h1>
            <p className={`text-white text-xl font-semibold mb-10 text-center`}>View your stats and analytics.</p>
            <div className="flex flex-row justify-between">
                <div className={`w-2/6 bg-dark px-5 py-5 rounded-xl`}>
                        <div className={`flex flex-row px-4 items-center mb-3`}>
                            <p className={`text-white font-semibold text-2xl mr-auto`}>{displayMonthYear}</p>
                            <FaChevronLeft onClick={() => changeDisplayDate("left")} fill="white" size={25} className={`mr-3 cursor-pointer hover:fill-pale-green transition-colors duration-200 ease-linear`} />
                            <FaChevronRight onClick={() => changeDisplayDate("right")} fill="white" size={25} className={`cursor-pointer hover:fill-pale-green transition-colors duration-200 ease-linear`} />
                        </div>
                        <hr className={`my-5 border-t-4 border-gray-500 rounded-2xl w-[95%] mx-auto`} />
                        <div className={`flex flex-row justify-between px-4`}>
                            {weekdays.map((weekday, index) => {
                                return (
                                    <div key={index}>
                                        <p className={`text-xl text-white font-semibold`}>{weekday}</p>
                                        {getDatesForWeekday(currentDay.getFullYear(), currentDay.getMonth(), index).map((dateNum, indexTwo) => {
                                            return (
                                                <p
                                                    onClick={() => setSelectedDay(dateNum)}
                                                    key={indexTwo}
                                                    className={`${dateNum === 0 && "opacity-0"} mt-2 text-xl font-semibold rounded-full border-2 w-12 h-12 mx-auto flex transition-colors duration-300 ease-in-out items-center justify-center cursor-pointer ${
                                                        selectedDay === dateNum && months[currentDay.getMonth()] === secondaryBox.split(" ")[0] && currentDay.getMonth() === currentDay.getMonth() && currentDay.getFullYear() === currentDay.getFullYear() 
                                                            ? "bg-foreground hover:bg-opacity-75 text-black border-borders" 
                                                            : "text-white border-foreground hover:bg-pale-green"
                                                    }`}
                                                >
                                                    {dateNum}
                                                </p>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                </div>
                <div className="w-3/5 bg-dark px-3 py-5 rounded-xl">
                    <p className={`text-white font-semibold text-2xl px-6 mr-auto`}>{secondaryBox}</p>
                    <hr className={`my-5 border-t-4 border-gray-500 rounded-2xl w-[95%] mx-auto`} />
                    <div className={`px-6`}>
                        {sortedTasks.length > 0 ? (
                            sortedTasks.map((task, index) => {
                                return (
                                    <div key={index} className={`w-full flex flex-row justify-between mt-5`}>
                                        <p className={`text-lg font-semibold ${task.priority === "Urgent" ? "text-red-400" : task.priority === "important" ? "text-amber-300" : "text-pale-green"}`}>{task.taskname}</p>
                                        <p className={`text-lg font-semibold text-white`}>{new Date(task.duedate).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                    </div>
                                );
                            })
                        ) : <p className={`text-white font-semibold text-lg`}>You're free on this day! Add new tasks from the <Link className={`text-foreground cursor-pointer hover:text-borders transition-all duration-200 ease-in-out`} to={`/dashboard/tasks`}>Tasks</Link> tab!</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}