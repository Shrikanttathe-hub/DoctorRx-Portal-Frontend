import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../assets/CSS/DoctorProfile.css';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import UserImage from '../assets/Images/NewLogoUser.svg';
import axios from 'axios';
import Footer from '../Components/Footer';

const DoctorProfile = ({ placeholder }) => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_URL;

    const fetchData = () => {
        setLoading(true);
        axios.get(`${API}/doctor/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                setLoading(false);
                setData(res.data.data);
                console.log("profile fetched", res);
            })
            .catch((err) => {
                console.log("error", err.message);
                setLoading(false);
            })
    }

    useEffect(() => {
        fetchData();
    }, [])
    return (
        <>
            <Header />
            <section className='profileSection'>
                <div className="container">
                    <div className="mainContent">
                        {data && (
                            loading ? (
                                <div className="loaderSection" style={{ width: "50%", justifySelf: "center", height: "100%" }}>
                                    <p>Loading...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="profileContent">
                                        <div className="profilePicture">
                                            <div className="profileImg">
                                                {data.profileImage ? <img src={data.profileImage} alt='profile Image' /> : <img src={UserImage} alt='profile Image' />}
                                            </div>
                                            <p>Dr. {data?.firstName}  {data?.lastName}</p>
                                        </div>
                                        <div className="profileDetails">
                                            <h1>Welcome Dr. {data.firstName}</h1>
                                            <p><strong>Specialty:</strong> {data.specialty}</p>
                                            <p><strong>Email:</strong>{data.email}</p>
                                            <p><strong>Phone Number:</strong>{data.phoneNumber}</p>
                                            <div className="aboutMe">
                                                <label>Experience</label>
                                                {data.experience ? <p>{data.experience}</p> : ""}
                                            </div>
                                            <button onClick={() => navigate(`/prescription-page/${data.id}`)}>View Prescriptions</button>
                                        </div>
                                    </div>
                                </>
                            )
                        )}
                    </div>
                </div>
            </section >
            <Footer/>
        </>
    )
}
export default DoctorProfile
