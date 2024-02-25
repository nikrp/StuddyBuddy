import collabImage from"./assets/collab_learning.jpg"
import { useState } from "react";
import { Login, Register } from "./components/Login";

export default function Home() {
    const [loginMode, setLoginMode] = useState(true);

    return (
        <div className={`min-h-screen`}>
            <div className={`fixed top-5 right-2 text-white w-2/12`}>
                <h2 className={`text-3xl font-bold mb-2`}>StuddyBuddy</h2>
                <p className={`text-xl font-semibold`}>Collaborative Learning at its Finest</p>
            </div>
            <div className={`flex flex-row h-screen max-h-screen`}>
                <div className={`bg-secondary-bg flex justify-center items-center w-4/12`}>
                    <div className={`w-10/12 flex justify-center items-center flex-col`}>
                        <h3 className={`font-bold mt-10 text-2xl w-11/12 mb-10 text-center`}>StuddyBuddy is your academic companion.</h3>
                        <img src={collabImage} alt="React Icon" className={`rounded-xl w-7/12 h-96 object-cover mb-10`} />
                        <p className={`text-xl`}>Connect with others and find new ways to study.</p>
                    </div>
                </div>
                <div className={`bg-background flex justify-center items-center w-8/12`}>
                    <div className={`w-8/12 flex flex-col text-white`}>
                        <div className={`mb-7 w-9/12 mx-auto`}>
                            <div className={`flex flex-row justify-center bg-[#FFFFFF] w-5/12 mx-auto px-10 py-2 rounded-lg`}>
                                <h3 className={`text-xl font-semibold mr-1 my-2 ${loginMode ? "bg-white text-black rounded-lg bg-opacity-75" : "hover:bg-gray-300 rounded-lg transition-colors duration-200 ease-in-out"} py-2 px-3 cursor-pointer`} onClick={() => setLoginMode(true)}>Login</h3>
                                <h3 className={`text-xl font-semibold ml-1 my-2 ${!loginMode ? "bg-white text-black rounded-lg bg-opacity-75" : "hover:bg-gray-300 rounded-lg transition-colors duration-200 ease-in-out"} py-2 px-3 cursor-pointer`} onClick={() => setLoginMode(false)}>Register</h3>
                            </div>
                        </div>
                        {loginMode ? <Login setLoginMode={setLoginMode} /> : <Register setLoginMode={setLoginMode} />}
                    </div>
                </div>
            </div>
        </div>
    )
}