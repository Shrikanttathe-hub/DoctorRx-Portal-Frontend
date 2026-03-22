import React, { useState } from 'react';
import "../assets/CSS/SignUpDoctor.css";
import { useNavigate } from "react-router-dom";
import profile from '../assets/Images/NewLogoUser.svg';
import { toast } from 'react-toastify';
import axios from 'axios';

const SignUpDoctor = () => {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [signUpdata, setSignUpData] = useState({
    profileImage: "",
    firstName: "",
    lastName: "",
    specialty: "",
    email: "",
    phoneNumber: "",
    yearsOfExp: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState({
    profileImage: "",
    firstName: "",
    lastName: "",
    specialty: "",
    email: "",
    phoneNumber: "",
    yearsOfExp: "",
    password: "",
    confirmPassword: ""
  });
  const validateSignUpForm = () => {
    let newErrors = {};
    if (!signUpdata.profileImage) newErrors.profileImage = "Profile Picture required";
    if (!signUpdata.firstName.trim()) newErrors.firstName = "First name required";
    if (!signUpdata.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!signUpdata.specialty.trim()) newErrors.specialty = "Specialty is required";
    if (!signUpdata.email.trim()) newErrors.email = "Email is required";
    if (!signUpdata.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!signUpdata.yearsOfExp.trim()) newErrors.yearsOfExp = "Years Of Experience is required";
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
      const doctorData = await axios.post(`${API}/doctor/sign-up`, signUpdata);
      console.log("submit", doctorData);
      setSignUpData({
        profileImage: "",
        firstName: "",
        lastName: "",
        specialty: "",
        email: "",
        phoneNumber: "",
        yearsOfExp: "",
        password: "",
        confirmPassword: ""
      });
      setError({});
      toast.success("Sign Up Successfully");
      localStorage.setItem('token', doctorData.data.token);
      navigate("/doctor-profile");
    }
    catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Something Went Wrong");
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
            <h1>Sign Up Doctor</h1>
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
              <input placeholder='Specialty' value={signUpdata.specialty} onChange={(e) => { setSignUpData({ ...signUpdata, specialty: e.target.value }); setError({ ...error, specialty: '' }); }} />
              {error.specialty && <p className="signUpError">{error.specialty}</p>}
              <input placeholder='Email' type='email' value={signUpdata.email} onChange={(e) => { setSignUpData({ ...signUpdata, email: e.target.value }); setError({ ...error, email: '' }); }} />
              {error.email && <p className="signUpError">{error.email}</p>}
              <input placeholder='Phone Number' type='tel' minLength={10} maxLength={12} required value={signUpdata.phoneNumber} onChange={(e) => { setSignUpData({ ...signUpdata, phoneNumber: e.target.value }); setError({ ...error, phoneNumber: '' }); }} />
              {error.phoneNumber && <p className="signUpError">{error.phoneNumber}</p>}
              <input placeholder='Years of Experience' type='number' step="0.1" value={signUpdata.yearsOfExp} onChange={(e) => { setSignUpData({ ...signUpdata, yearsOfExp: e.target.value }); setError({ ...error, yearsOfExp: '' }); }} />
              {error.yearsOfExp && <p className="signUpError">{error.yearsOfExp}</p>}
              <input placeholder='Password' type='password' required minLength={5} value={signUpdata.password} onChange={(e) => { setSignUpData({ ...signUpdata, password: e.target.value }); setError({ ...error, password: '' }); }} />
              {error.password && <p className="signUpError">{error.password}</p>}
              <input placeholder='Confirm Password' type='password' value={signUpdata.confirmPassword} onChange={(e) => { setSignUpData({ ...signUpdata, confirmPassword: e.target.value }); setError({ ...error, confirmPassword: '' }); }} />
              {error.confirmPassword && <p className="signUpError">{error.confirmPassword}</p>}
              <button type='submit'>SIGN UP</button>
            </form>
          </div>
          <p className='OR'>OR</p>
          <div className='alreadyAccount'>
            <p>Already have an Account?</p>
            <button onClick={() => navigate("/login")}>Login</button>
          </div>
        </div>
      </section>
    </>
  )
}
export default SignUpDoctor
