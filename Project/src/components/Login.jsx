import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
    const [otp, setOtp] = useState('')
    const [otpp,setOtpp]=useState('')
    const otpClick = useRef()
    const navigate = useNavigate();
    const [authInput, changeAuthInput] = useState({ email: "", password: "" });
    const [passwordType, changePasswordType] = useState("password");
    const showPass = (e) => {
        const checked = e.target.checked;
        if (checked) {
            changePasswordType("text");
        } else {
            changePasswordType("password");
        }
    };
 const setGenerateOtp=(otp)=>{
alert(otp);
setOtpp(otp)
 }
    const loginUser = async (e) => {
        e.preventDefault();
        const data = {
            email: authInput.email,
            password: authInput.password,
        };
        await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((value) => {
                return value.json();
            })
            .then((response) => {
                if (response.success) {
                    // save the auth token and redirect
                    setGenerateOtp(generateRandomOTP())
                    otpClick.current.click()
                } else {
                    props.showAlert("danger", "Invalid credentials");
                }
            });
    };
    function generateRandomOTP(length = 6) {
        const characters = '0123456789'; // Use digits 0-9 for OTP
        let otp = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            otp += characters.charAt(randomIndex);
        }

        return otp;
    }

    const onChange = (e) => {
        changeAuthInput({ ...authInput, [e.target.name]: e.target.value });
    };
    const handleOtp= async ()=>{
        if(otp==otpp){
            const data = {
                email: authInput.email,
                password: authInput.password,
            };
            await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
                .then((value) => {
                    return value.json();
                })
                .then((response) => {
                    if (response.success) {
                        // save the auth token and redirect
                        localStorage.setItem("token", response.authToken);
                        props.showAlert("success", "You are successfully Logged in");
                        navigate('/')
                    } else {
                        props.showAlert("danger", "Invalid credentials");
                    }
                });
        }
        else{
            alert('enter correct otp')
            navigate('/login')
        }

    }
    return (
        <div className="container mt-5">
            <form onSubmit={loginUser}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email address
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        aria-describedby="emailHelp"
                        autoComplete="on"
                        value={authInput.email}
                        onChange={onChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        type={passwordType}
                        className="form-control"
                        id="password"
                        name="password"
                        autoComplete="off"
                        value={authInput.password}
                        onChange={onChange}
                    />
                </div>
                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="exampleCheck1"
                        onChange={showPass}
                    />
                    <label className="form-check-label" htmlFor="exampleCheck1">
                        Show password
                    </label>
                </div>
                <button type="submit" className="btn btn-primary">
                    LogIn
                </button>
            </form>
            {/*  */}
            <button
                type="button"
                style={{ display: "none" }}
                data-bs-toggle="modal"
                ref={otpClick}
                data-bs-target="#exampleModal"
            >
                <i class="fa-solid fa-plus"></i>
            </button>
            <div
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">
                                Add a note
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            {/*  */}
                            <input type="text" placeholder="enter the otp" value={otp} onChange={(e)=>{
                                setOtp(e.target.value)
                            }} />
                            {/*  */}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Close
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-dismiss="modal"
                                onClick={handleOtp}
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/*  */}
        </div>
    );
};

export default Login;
