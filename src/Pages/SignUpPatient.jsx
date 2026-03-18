import React, { useState } from 'react'
import "../assets/CSS/SignUpDoctor.css";
import { useNavigate } from "react-router-dom";
import profile from '../assets/Images/NewLogoUser.svg';
import axios from 'axios';
import { toast } from 'react-toastify';

const SignUpPatient = () => {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [signUpdata, setSignUpData] = useState({
    profileImage: "",
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    phoneNumber: "",
    sergery: "",
    illness: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState({
    profileImage: "",
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    phoneNumber: "",
    sergery: "",
    illness: "",
    password: "",
    confirmPassword: ""
  });
  const validateSignUpForm = () => {
    let newErrors = {};
    if (!signUpdata.profileImage) newErrors.profileImage = "Profile Picture is required";
    if (!signUpdata.firstName.trim()) newErrors.firstName = "First name is required";
    if (!signUpdata.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!signUpdata.age.trim()) newErrors.lastName = "Age is required";
    if (!signUpdata.email.trim()) newErrors.email = "Email is required";
    if (!signUpdata.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!signUpdata.sergery.trim()) newErrors.surgery = "History of surgery is required";
    if (!signUpdata.illness.trim()) newErrors.illness = "History of illness is required";
    if (!signUpdata.password.trim()) newErrors.password = "Password is required";
    if (!signUpdata.confirmPassword.trim()) newErrors.confirmPassword = "Confirm password is required";
    if (signUpdata.password && signUpdata.confirmPassword && signUpdata.password !== signUpdata.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  }
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignUpData(prev => ({ ...prev, profileImage: reader.result }));
        setError(prev => ({ ...prev, profileImage: "" }));
      }
      reader.readAsDataURL(file);
    }
  }
  const handleSubmitSignUp = async (e) => {
    e.preventDefault();
    if (!validateSignUpForm()) return;
    try {
      const patientData = await axios.post(`${API}/patient/sign-up`, signUpdata);
      console.log("submit", patientData);
      setSignUpData({
        profileImage: "",
        firstName: "",
        lastName: "",
        age: "",
        email: "",
        phoneNumber: "",
        sergery: "",
        illness: "",
        password: "",
        confirmPassword: ""
      });
      setError({});
      toast.success("Sign Up Successfully");
      localStorage.setItem('token', patientData.data.token);
      navigate("/doctor-list");
    }
    catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
      else {
        toast.error("Server error");
      }
      console.log(error.message, "error message");
    }
  }
  return (
    <>
      <section className="SignUpSection">
        <div className="SignUpForm">
          <div className="container">
            <h1>Sign Up Patient</h1>
            <form onSubmit={handleSubmitSignUp}>
              <div className="profileImg">
                <div className="imageContent">
                  <img src={signUpdata.profileImage || profile} alt='profile' />
                </div>
                <label>Profile Picture</label>
                <input type='file' accept='image/*' onChange={handleImageChange} />
                {error.profileImage && <p className="signUpError">{error.profileImage}</p>}
              </div>
              <input placeholder='First Name' value={signUpdata.firstName} onChange={(e) => { setSignUpData({ ...signUpdata, firstName: e.target.value }); setError({ ...error, firstName: '' }); }} />
              {error.firstName && <p className="signUpError">{error.firstName}</p>}
              <input placeholder='Last Name' value={signUpdata.lastName} onChange={(e) => { setSignUpData({ ...signUpdata, lastName: e.target.value }); setError({ ...error, lastName: '' }); }} />
              {error.lastName && <p className="signUpError">{error.lastName}</p>}
              <input placeholder='Age' type='number' value={signUpdata.age} onChange={(e) => { setSignUpData({ ...signUpdata, age: e.target.value }); setError({ ...error, age: '' }); }} />
              {error.age && <p className="signUpError">{error.age}</p>}
              <input placeholder='Email' type='email' required value={signUpdata.email} onChange={(e) => { setSignUpData({ ...signUpdata, email: e.target.value }); setError({ ...error, email: '' }); }} />
              {error.email && <p className="signUpError">{error.email}</p>}
              <input placeholder='Phone Number' type='tel' minLength={10} maxLength={12} required value={signUpdata.phoneNumber} onChange={(e) => { setSignUpData({ ...signUpdata, phoneNumber: e.target.value }); setError({ ...error, phoneNumber: '' }); }} />
              {error.phoneNumber && <p className="signUpError">{error.phoneNumber}</p>}
              <input placeholder='History of Surgery' value={signUpdata.sergery} onChange={(e) => { setSignUpData({ ...signUpdata, sergery: e.target.value }); setError({ ...error, sergery: '' }); }} />
              {error.sergery && <p className="signUpError">{error.sergery}</p>}
              <input placeholder='History of illness' value={signUpdata.illness} onChange={(e) => { setSignUpData({ ...signUpdata, illness: e.target.value }); setError({ ...error, illness: '' }); }} />
              {error.illness && <p className="signUpError">{error.illness}</p>}
              <input placeholder='Password' type='password' minLength={5} maxLength={10} required value={signUpdata.password} onChange={(e) => { setSignUpData({ ...signUpdata, password: e.target.value }); setError({ ...error, password: '' }); }} />
              {error.password && <p className="signUpError">{error.password}</p>}
              <input placeholder='Confirm Password' type='password' value={signUpdata.confirmPassword} onChange={(e) => { setSignUpData({ ...signUpdata, confirmPassword: e.target.value }); setError({ ...error, confirmPassword: '' }); }} />
              {error.confirmPassword && <p className="signUpError">{error.confirmPassword}</p>}
              <button type='submit'>SIGN UP</button>
            </form>
          </div>
          <p className='OR'>OR</p>
          <div className='alreadyAccount'>
            <p>Already have an Account?</p>
            <button onClick={() => navigate("/login-patient")}>Login</button>
          </div>
        </div>
      </section>
    </>
  )
}
export default SignUpPatient
