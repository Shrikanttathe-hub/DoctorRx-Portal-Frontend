import React from 'react';
import '../assets/CSS/Home.css';
import Header from '../Components/Header';
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/Footer';

const Home = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    return (
        <>
            <Header />
            <section className='homeSection'>
                <h1>Online Prescription</h1>
                {!token ? (<div className="buttonSection">
                    <button onClick={() => navigate("/login")}>Doctor Login</button>
                    <button onClick={() => navigate("/login-patient")}>Patient Login</button>
                </div>) : (<p>DoctorRx is a modern online consultation platform designed to make healthcare easier for everyone. Our platform connects patients with qualified doctors across various specialties. Whether you need medical advice, follow-up consultations, or guidance for your health concerns, DoctorRx provides a simple and secure way to consult doctors anytime, anywhere.</p>)}
            </section>
            <Footer/>
        </>
    )
}

export default Home
