import { IoIosNotifications } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa";
import { MdAddTask, MdClose, MdDelete, MdOutlineTaskAlt } from "react-icons/md";
import epp from "../assets/empty-profile-pic.jpg";
import axios from 'axios';
import { useEffect, useState } from "react";

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
    const [taskName, setTaskName] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskPriority, setTaskPriority] = useState("Urgent");
    const [taskDueDate, setTaskDueDate] = useState(new Date());

    const completeTask = async (taskId) => {
        try {
            const response = await axios.post("http://localhost:5000/tasks/complete", { id:taskId });
            collectAllTasks();
        } catch (e) {
            console.error(e);
        }
    }

    const createTask = async () => {
        try {
            const response = await axios.post("http://localhost:5000/tasks/create", {name: taskName, description: taskDescription, priority: taskPriority, dueDate: taskDueDate});
            closeAddTaskModal();
            collectAllTasks();
            setTaskName(""); setTaskDescription(""); setTaskPriority("Urgent"); setTaskDueDate(new Date()); // Clear all existing dat in the create task modal/form.
        } catch (e) {
            console.error(e);
        }
    }

    const collectAllTasks = async () => {
        try {
            const response = await axios.post("http://localhost:5000/tasks/get", {username:'nickle'});
            setTasks(response.data);
            console.log(response.data);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        collectAllTasks();
    }, []);

    const closeAddTaskModal = () => {
        const theModal = document.getElementById("add-task-modal");
        const theInnerModal = document.getElementById("add-task-modal-inner");
        theModal.classList.add(["animate-opacity-change-op"]);
        theInnerModal.classList.add(["animate-shrink"]);

        setTimeout(() => {
            theModal.classList.remove(["animate-opacity-change-op"]);
            theInnerModal.classList.add(["animate-shrink"]);

            setAddTaskModalOpen(false);
        }, 200);
    }

    return (
        <div className={`px-36 py-10 w-full`}>
            <div className={`w-full flex justify-end px-20 items-center`}>
                <IoIosNotifications size={45} fill="white" className={`hover:fill-gray-500 transition-all duration-300 ease-in mr-5 cursor-pointer`} />
                <div className={`flex flex-row items-center py-3 px-5 hover:bg-dark rounded-lg cursor-pointer traw2nsition-colors duration-300 ease-in-out`}>
                    <img src={epp} alt="empty-profile-pic.jpg" className={`w-11 h-11 rounded-full mr-7`} />
                    <p className={`text-white text-xl font-semibold mr-4`}>Nikhil Pellakuru {/*Put the Username Here*/}</p>
                    <FaChevronDown className={`fill-white`} size={20}/>
                </div>
            </div>
            <hr className={`my-7 border-t-4 border-gray-500 rounded-xl`} />
            <div className={`bg-dark rounded-lg px-10 py-5 mx-auto w-4/6`}>
                <div className={`flex flex-row items-center`}>
                    <h1 className={`font-bold text-3xl text-borders mr-auto`}>Tasks</h1>
                    <MdAddTask size={35} fill="black" className={`cursor-pointer hover:fill-foreground transition-colors duration-300 ease-in-out`} onClick={() => setAddTaskModalOpen(true)}/>
                </div>
                <hr className={`my-4 border-t-4 border-gray-500 rounded-xl`} />
                <div>
                    {tasks.length > 0 ? (tasks.map((task, index) => {
                        console.log(task.priority);
                        return (
                            <div className={`flex flex-row items-center py-3`}>
                                <div key={index} className={`w-full flex flex-row justify-between mr-10`}>
                                    <p className={`text-lg font-semibold ${task.priority === "Urgent" ? "text-red-400" : task.priority === "important" ? "text-amber-500" : "text-borders"}`}>{task.taskname}</p>
                                    <p className={`text-lg font-semibold text-white`}>{new Date(task.duedate).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                                <MdOutlineTaskAlt onClick={() => completeTask(task.id)} size={35} className={`hover:fill-foreground transition-all duration-200 ease-in-out cursor-pointer`} fill="black" />
                            </div>
                        );
                    })) : <p className={`py-3 text-xl font-semibold text-white`}>No tasks to complete! Add some more through the button with a task symbol and a '+' sign!</p>}
                </div>
            </div>
            {addTaskModalOpen && (
                <div id="add-task-modal" className={`fixed w-screen h-screen bg-black bg-opacity-50 top-0 left-0 flex justify-center items-center animate-opacity-change`}>
                    <div id="add-task-modal-inner" className={`bg-[#FFFFFF] w-2/6 h-3/5 rounded-lg px-5 py-4 animate-grow`}>
                        <div className={`flex flex-row items-center`}>
                            <p className={`font-bold text-3xl mr-auto`}>Add Task</p>
                            <MdClose size={35} className={`cursor-pointer hover:fill-dark transition-colors duration-300 ease-in-out`} onClick={() => closeAddTaskModal()} />
                        </div>
                        <hr className={`my-4 border-t-4 border-slate-800 rounded-xl`} />
                        <div className={`mb-2 mt-10`}>
                            <p className={`font-semibold text-lg`}>Task Name</p>
                            <input value={taskName} onChange={(e) => setTaskName(e.target.value) } placeholder="Enter the name of your task" className={`focus:outline-none w-full border-2 border-dark rounded-lg opacity-100 text-lg px-2 py-1`} />
                            <p className={`w-full text-lg ${taskName.length > 40 ? "text-red-400" : "text-black"}`}>{taskName.length}/40</p>
                        </div>
                        <div className={`mb-2`}>
                            <p className={`font-semibold text-lg`}>Task Description</p>
                            <textarea value={taskDescription}  onChange={(e) => setTaskDescription(e.target.value)} name="taskDescription" rows={3} placeholder="Enter a description of your task" className={`focus:outline-none w-full border-2 border-dark px-2 py-1 rounded-lg text-lg`}></textarea>
                        </div>
                        <div className={`flex flex-row justify-between h-12 mb-16`}>
                            <div className={`w-5/12 h-full`}>
                                <p className={`font-semibold text-lg`}>Priority</p>
                                <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)} name="priority" id="priority" className={`focus:outline-none border-2 border-dark px-2 py-1 rounded-lg text-lg w-full h-full`}>
                                    <option value={`urgent`} className={`text-red-400`}>Urgent</option>
                                    <option value={`important`} className={`text-amber-500`}>Important</option>
                                    <option value={`deffered`} className={`text-borders`}>Deffered</option>
                                </select>
                            </div>
                            <div className={`w-5/12 h-full`}>
                                <p className={`font-semibold text-lg`}>Due Date</p>
                                <input value={taskDueDate}  onChange={(e) => setTaskDueDate(e.target.value)} type="date" name="dueDate" className={`focus:outline-none border-2 border-dark px-2 py-1 rounded-lg text-lg w-full h-full`}/>
                            </div>
                        </div>
                        <button onClick={createTask} className={`w-full px-5 py-2 bg-pale-green border-none rounded-lg text-xl font-semibold hover:bg-opacity-75 transition-all duration-300 ease-in-out`}>Add</button>
                    </div>
                </div>
            )}
        </div>
    )
}