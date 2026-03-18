import { useState } from 'react'
import './App.css';
import { Route, Routes } from 'react-router-dom';
import SignUpDoctor from './Pages/SignUpDoctor';
import SignInDoctor from './Pages/SignInDoctor';
import Home from './Pages/Home';
import SignUpPatient from './Pages/SignUpPatient';
import SignInPatient from './Pages/SignInPatient';
import DoctorsList from './Pages/DoctorsList';
import DoctorProfile from './Pages/DoctorProfile';
import PrescriptionPage from './Pages/PrescriptionPage';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function App() {


  return (
    <>
      <ToastContainer style={{ zIndex: 999999999999999 }} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-up' element={<SignUpDoctor />} />
        <Route path='/login' element={<SignInDoctor />} />
        <Route path='/sign-up-patient' element={<SignUpPatient />} />
        <Route path='/login-patient' element={<SignInPatient />} />
        <Route path='/doctor-list' element={<DoctorsList/>}  />
        <Route path='/doctor-profile' element={<DoctorProfile />} />
        <Route path='/prescription-page/:doctorId' element={<PrescriptionPage />} />
      </Routes>
    </>
  )
}

export default App
