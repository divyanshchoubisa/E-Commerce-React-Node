import React, { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom';

const SignUp = () =>{

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const [error, setError ] = useState(false);

    useEffect(() => {
        const auth = localStorage.getItem('user');
        if(auth){
            navigate('/')
        }
    })

    const collectData = async () =>{
        
        if(!name || !password || !email){
            setError(true)
            return false;
        }

        let result = await fetch('http://localhost:5000/register', {
            method: 'post',
            body:JSON.stringify({name, email, password}),
            headers:{
                'Content-Type':'application/json'
            },
        })
        result = await result.json()
        localStorage.setItem("user", JSON.stringify(result.result));
        localStorage.setItem("token", JSON.stringify(result.auth));
        //console.warn(result)
        navigate('/')
        
    }

    return(
        <div className="register">
            <h1>Sign Up</h1>
            <input className="inputBox" type="text" value={name} onChange={(e) => {
                setName(e.target.value)
            }} placeholder="Enter Name" />
            { error && !name && <span className='invalid-input'>Enter Valid Name</span> }

            <input className="inputBox" type="text" value={email} onChange={(e) => {
                setEmail(e.target.value)}} placeholder="Enter Email" />
            { error && !email && <span className='invalid-input'>Enter Valid Email</span> }
            
            <input className="inputBox" type="password" value={password} onChange={(e) => {
                setPassword(e.target.value)}} placeholder="Enter Password" />  
            { error && !password && <span className='invalid-input'>Enter Valid Password</span> }    
            
            <button onClick={collectData}  className="appButton" type="Button">SignUp</button>  
        </div>
    )
}

export default SignUp;