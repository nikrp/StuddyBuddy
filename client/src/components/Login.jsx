import { useState } from "react";
import { FaEye, FaEyeSlash, FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { toast, Bounce } from "react-toastify";
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Cookies from 'js-cookie';

export function Login({ setLoginMode }) {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        values: {
            emailUsername: "",
            password: "",
        },
        errors: {
            emailUsername: undefined,
            password: undefined,
            form: undefined,
        },
        errorsInForm: false,
        setFormError: (entryName, msg) => {
            setFormData(prevData => {
                const updatedErrors = {
                    ...prevData.errors,
                    [entryName]: msg
                };

                const updatedErrorsInForm = Object.values(updatedErrors).some(error => error !== undefined);
            
                return {
                    ...prevData,
                    errors: updatedErrors,
                    errorsInForm: updatedErrorsInForm
                };
            });            
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            values: {
                ...prevFormData.values,
                [name]: value,
            },
        }));
    };
   
    function isRequiredField(fieldName) {
        const requiredFields = ["emailUsername", "password"];
        return requiredFields.includes(fieldName);
      }
      
      function validateField(fieldName, fieldValue) {
        if (isRequiredField(fieldName) && fieldValue.trim() === "") {
          return "This field is required.";
        }
      
        return undefined;
      }
      
      const handleSubmit = async () => {
        let hasErrors = false;
        const updatedErrors = {};
      
        for (const name in formData.values) {
          if (isRequiredField(name)) {
            const error = validateField(name, formData.values[name]);
            if (error) {
              hasErrors = true;
              updatedErrors[name] = error;
            }
          }
        }
      
        setFormData((prevData) => ({
          ...prevData,
          errors: updatedErrors,
          errorsInForm: hasErrors,
        }));
      
        if (!hasErrors) {
          try {
            const response = await axios.post('http://localhost:5000/users/login', formData.values, { headers: { 'Content-Type': 'application/json' } });
            if (response.data.error) {
                formData.setFormError(response.data.error, "Username or password is incorrect!");
            } else {
                await Cookies.set("username", response.data.username)
                navigate('/dashboard', { replace: true });
            }
          } catch (error) {
            console.error("Error logging in user:", error);
          }
        } else {
          console.log("Please fix the form errors before submitting.");
        }
      };

    return (
        <div className={`w-full flex justify-center flex-col`}>
            <div className={`mb-8 w-10/12 mx-auto`}>
                <div className={`mb-7`}>
                    <p htmlFor="emailUsername" className={`text-xl font-semibold mb-2`}>Email or Username <span className={`text-foreground`}>*</span></p>
                    <input value={formData.values.emailUsername} onChange={handleChange} type="text" name="emailUsername" placeholder="Enter your email address or username" className={`placeholder:text-white w-full rounded-lg text-xl border-none focus:outline-none focus:border-2 bg-[#FFFFFF] text-white px-4 py-2`}/>
                    {formData.errors.emailUsername && <p className={`text-foreground mt-1`}>{formData.errors.emailUsername}</p>}
                </div>
                <div className={`relative`}>
                    <p htmlFor="password" className={`text-xl font-semibold mb-2`}>Password <span className={`text-foreground`}>*</span></p>
                    <input value={formData.values.password} onChange={handleChange} type={passwordVisible ? "text" : "password"} name="password" placeholder={passwordVisible ? "Enter your password" : "•".repeat("Enter your password".length)} className={`placeholder:text-white w-full rounded-lg text-xl border-none focus:outline-none focus:border-2 bg-[#FFFFFF] text-white px-4 py-2`}/>
                    {passwordVisible ? <FaEye className={`cursor-pointer absolute inset-y-0 right-0 mt-[38px] flex items-center pr-4 text-xl text-white hover:fill-foreground hover:opacity-95 transition-all duration-300 ease-out`} size={40} onClick={() => setPasswordVisible(!passwordVisible)} /> : <FaEyeSlash onClick={() => setPasswordVisible(!passwordVisible)} size={40} className={`cursor-pointer absolute inset-y-0 right-0 mt-[38px] flex items-center pr-4 text-xl text-white hover:fill-foreground hover:opacity-95 transition-all duration-300 ease-out`} />}
                    {formData.errors.password && <p className={`text-foreground mt-1`}>{formData.errors.password}</p>}
                </div>
            </div>
            <div className={`w-full flex justify-center`}>
                <button onClick={handleSubmit} className={`bg-foreground text-secondary-bg py-2 text-xl rounded-xl w-10/12 mx-auto mb-3 font-semibold hover:bg-borders focus:outline-none transition-colors duration-300 ease-in-out`}>Login</button>
            </div>
            <div className={`w-10/12 mx-auto flex flex-row justify-between`}>
                <p className={`text-lg font-semibold cursor-pointer hover:text-pale-green transition-colors duration-200 ease-in-out`}>Forgot your password?</p>
                <p className={`text-lg font-semibold`}>Don't Have an Account? <span className={`text-borders cursor-pointer hover:text-foreground transition-colors duration-200 ease-in-out`} onClick={() => setLoginMode(false)}>Register</span></p>
            </div>
        </div>
    )
}

export function Register({ setLoginMode }) {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [retypePasswordVal, setRetypePasswordVal] = useState("");
    const [formData, setFormData] = useState({
        values: {
            fName: "",
            lName: "",
            username: "",
            email: "",
            password: "",
        },
        errors: {
            fName: undefined,
            lName: undefined,
            username: undefined,
            email: undefined,
            password: undefined,
        },
        errorsInForm: false,
        setFormError: (entryName, msg) => {
            setFormData(prevData => {
                const updatedErrors = {
                    ...prevData.errors,
                    [entryName]: msg
                };

                const updatedErrorsInForm = Object.values(updatedErrors).some(error => error !== undefined);
            
                return {
                    ...prevData,
                    errors: updatedErrors,
                    errorsInForm: updatedErrorsInForm
                };
            });            
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            values: {
                ...prevFormData.values,
                [name]: value,
            },
        }));
    };

      function isRequiredField(fieldName) {
        const requiredFields = ["fName", "email", "username", "password"];
        return requiredFields.includes(fieldName);
      }
      
      function validateField(fieldName, fieldValue) {
        if (isRequiredField(fieldName) && fieldValue.trim() === "") {
          return "This field is required.";
        }
      
        if (fieldName === "email" && !fieldValue.match(/^[\w!#$%&'*+/=?^`{|}~-]+(?:\.[\w!#$%&'*+/=?^`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[a-zA-Z]{2,6}$/)) {
          return "Must be a valid email address.";
        }
      
        if (fieldName === "username" && (fieldValue.length < 6 || fieldValue.length > 14)) {
          return "Username must be between 6 and 14 characters.";
        }
      
        return undefined;
      }
      
      const handleSubmit = async () => {
        let hasErrors = false;
        const updatedErrors = {};
        console.log("HELLO")
      
        for (const name in formData.values) {
          if (isRequiredField(name)) {
            const error = validateField(name, formData.values[name]);
            if (error) {
              hasErrors = true;
              updatedErrors[name] = error;
            }
          }
        }
      
        setFormData((prevData) => ({
          ...prevData,
          errors: updatedErrors,
          errorsInForm: hasErrors,
        }));
      
        if (!hasErrors) {
          try {
            const response = await axios.post('http://localhost:5000/users/register', formData.values, { headers: { 'Content-Type': 'application/json' } });
            if (response.data.error) {
                formData.setFormError(response.data.error, "Already taken, please use another value.");
            } else {
                setLoginMode(true);
                toast.success("Registered! Now just login to see your dashboard!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            }
          } catch (error) {
            console.error("Error registering user:", error);
          }
        } else {
          console.log("Please fix the form errors before submitting.");
        }
      };      

    return (
        <div className={`w-full flex justify-center flex-col`}>
            <div className={`mb-5 w-10/12 mx-auto`}>
                <div className={`mb-7 flex flex-row justify-between`}>
                    <div className={`w-49p`}>
                        <p htmlFor="fName" className={`text-xl font-semibold mb-2`}>First Name <span className={`text-foreground`}>*</span></p>
                        <input value={formData.values.fName} onChange={handleChange} type="text" name="fName" placeholder="Enter your first name" className={`placeholder:text-white w-full rounded-lg text-xl border-none focus:outline-none focus:border-2 bg-[#FFFFFF] text-white px-4 py-2`} />
                        {formData.errors.fName && <p className={`text-foreground mt-1`}>{formData.errors.fName}</p>}
                    </div>
                    <div className={`w-49p`}>
                        <p htmlFor="lName" className={`text-xl font-semibold mb-2`}>Last Name</p>
                        <input value={formData.values.lName} onChange={handleChange} type="text" name="lName" placeholder="Enter your last name" className={`placeholder:text-white w-full rounded-lg text-xl border-none focus:outline-none focus:border-2 bg-[#FFFFFF] text-white px-4 py-2`} />
                    </div>
                </div>
                <div className={`mb-7`}>
                    <p htmlFor="email" className={`text-xl font-semibold mb-2`}>Email <span className={`text-foreground`}>*</span></p>
                    <input value={formData.values.email} onChange={handleChange} type="email" name="email" placeholder="Enter your email" className={`placeholder:text-white w-full rounded-lg text-xl border-none focus:outline-none focus:border-2 bg-[#FFFFFF] text-white px-4 py-2`} />
                    {formData.errors.email && <p className={`text-foreground mt-1`}>{formData.errors.email}</p>}
                </div>
                <div className={`mb-7`}>
                    <p htmlFor="username" className={`text-xl font-semibold mb-2`}>Username <span className={`text-foreground`}>*</span></p>
                    <input value={formData.values.username} onChange={handleChange} type="text" name="username" placeholder="Enter your username" className={`placeholder:text-white w-full rounded-lg text-xl border-none focus:outline-none focus:border-2 bg-[#FFFFFF] text-white px-4 py-2`} />
                    {formData.errors.username && <p className={`text-foreground mt-1`}>{formData.errors.username}</p>}
                </div>
                <div className={`relative mb-7`}>
                    <p htmlFor="password" className={`text-xl font-semibold mb-2`}>Password <span className={`text-foreground`}>*</span></p>
                    <input value={formData.values.password} onChange={handleChange} type={passwordVisible ? "text" : "password"} name="password" placeholder={passwordVisible ? "Enter your password" : "•".repeat("Enter your password".length)} className={`placeholder:text-white w-full rounded-lg text-xl border-none focus:outline-none focus:border-2 bg-[#FFFFFF] text-white px-4 py-2`} />
                    {passwordVisible ? <FaEye className={`cursor-pointer absolute inset-y-0 right-0 mt-[38px] flex items-center pr-4 text-xl text-white hover:fill-pale-green hover:opacity-95 transition-all duration-300 ease-out`} size={40} onClick={() => setPasswordVisible(!passwordVisible)} /> : <FaEyeSlash onClick={() => setPasswordVisible(!passwordVisible)} size={40} className={`cursor-pointer absolute inset-y-0 right-0 mt-[38px] flex items-center pr-4 text-xl text-white hover:fill-pale-green hover:opacity-95 transition-all duration-300 ease-out`} />}
                    {formData.errors.password && <p className={`text-foreground mt-1`}>{formData.errors.password}</p>}
                </div>
                <div className={`relative mb-1`}>
                    <p htmlFor="retypePassword" className={`text-xl font-semibold mb-2`}>Retype Password <span className={`text-foreground`}>*</span></p>
                    <input type="password" onChange={(e) => setRetypePasswordVal(e.target.value)} value={retypePasswordVal} name="retypePassword" placeholder="Retype your password" className={`placeholder:text-white w-full rounded-lg text-xl border-none focus:outline-none focus:border-2 bg-[#FFFFFF] text-white px-4 py-2`} disabled={formData.values.password.length === 0} />
                    {retypePasswordVal === formData.values.password ? <FaCheck className={`absolute inset-y-0 right-0 mt-10 flex items-center pr-4 text-xl text-white fill-foreground`} size={35} /> : <ImCross size={35} className={`absolute inset-y-0 right-0 mt-10 flex items-center pr-4 text-xl text-white fill-red-600`} />}
                </div>
            </div>
            <div className={`w-full flex justify-center`}>
                <button onClick={handleSubmit} className={`bg-foreground text-secondary-bg py-2 text-xl rounded-xl w-10/12 mx-auto mb-3 font-semibold hover:bg-borders focus:outline-none transition-colors duration-300 ease-in-out`}>Register</button>
            </div>
                <p className={`text-lg font-semibold w-10/12 mx-auto`}>Already Have an Account? <span className={`text-borders cursor-pointer hover:text-foreground transition-colors duration-200 ease-in-out`} onClick={() => setLoginMode(true)}>Login</span></p>
        </div>
    )
}
