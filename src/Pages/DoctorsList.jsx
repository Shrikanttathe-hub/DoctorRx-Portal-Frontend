import React, { useEffect, useState } from 'react';
import '../assets/CSS/DoctorList.css';
import Header from '../Components/Header';
import QRcode from '../assets/Images/QRcode.png';
import axios from 'axios';
import { toast } from 'react-toastify';
import Footer from '../Components/Footer';

const DoctorsList = () => {
    const API = import.meta.env.VITE_API_URL;
    const [activeEdit, setActiveEdit] = useState(false);
    const [activeEdit1, setActiveEdit1] = useState(false);
    const [activeEdit2, setActiveEdit2] = useState(false);
    const [data, setData] = useState([]);
    const [dataNew, setDataNew] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');
    const [formData, setFormData] = useState({
        patientName: "",
        illness: "",
        surgery: "",
        diabeticStatus: "",
        allergy: "",
        others: "",
        transactionId: "",
        consent: false
    });
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };
    useEffect(() => {
        const fetchAllDoctors = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API}/doctor/doctors-list`);
                setData(response?.data?.data);
            }
            catch (error) {
                console.error(error, "Doctors not found !")
                toast.error("Error Doctors not loading...")
            }
            finally {
                setLoading(false);
            }
        }
        fetchAllDoctors();
    }, []);
    useEffect(() => {
        if (activeEdit) {
            document.body.style.overflow = "hidden";
        }
        else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [activeEdit]);
    useEffect(() => {
        if (dataNew?.id) {
            localStorage.setItem("PatientId", dataNew.id);
        }
    }, [dataNew]);
    const patientId = localStorage.getItem("PatientId");
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDoctor) {
            toast.error("Doctor not selected");
            return;
        }
        if (!formData.patientName) {
            toast.error("Please enter patient name");
            return;
        }
        try {
            await axios.post(`${API}/doctor/consultation`, {
                doctorId: selectedDoctor._id,
                patientId: patientId,
                ...formData
            });

            toast.success("Consultation Submitted Successfully");
            setActiveEdit2(false);
            setFormData({
                patientName: "",
                illness: "",
                surgery: "",
                diabeticStatus: "",
                allergy: "",
                others: "",
                transactionId: "",
                consent: false
            });
        } catch (error) {
            toast.error("Submission Failed");
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API}/patient/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDataNew(res.data.data);
                localStorage.setItem("PatientId", res.data.data.id);
            } catch (err) {
                console.log("error", err.message);
            } finally {
                setLoading(false);
            }
        }
        if (token) fetchData();
    }, [token]);
    return (
        <>
            <Header />
            <section className='doctorList'>
                <div className="container">
                    <div className="mainSection">
                        <h1>Available Doctor's</h1>
                        <div className="gridCards">
                            {loading ? (<p style={{ color: "black" }}>Loading....</p>) : (data.map((doctor) => (
                                <div className="cards" key={doctor?._id}>
                                    <div className="doctorImg">
                                        {doctor?.profileImage ? (<img src={doctor?.profileImage} alt='doctor Pic' />) : (<img src='https://images.pexels.com/photos/6762866/pexels-photo-6762866.jpeg' alt='doctor Pic' />)}
                                    </div>
                                    <h2>Dr. {doctor?.firstName} {doctor?.lastName}</h2>
                                    <p>{doctor?.specialty}</p>
                                    <div className="button">
                                        <button onClick={() => { setSelectedDoctor(doctor); setActiveEdit(true) }}>Consult</button>
                                    </div>
                                </div>
                            ))
                            )}
                        </div>
                    </div>
                </div>
            </section>
            {activeEdit && (
                <section className='conserdationFrom'>
                    <div className="container">
                        <div className="popUpEdit" onClick={() => setActiveEdit(false)}>
                            <div className="modal" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => setActiveEdit(false)}>X</button>
                                <h2>Consultation Form Step 1</h2>
                                <p>Share your current illness and recent surgery details.</p>
                                <form >
                                    <div className="nameSection">
                                        <div className="inputBox">
                                            <label>Name:</label>
                                            <input
                                                type="text"
                                                name="patientName"
                                                value={formData.patientName}
                                                onChange={handleChange}
                                                placeholder="Example: John Andrew"
                                            />
                                        </div>
                                    </div>
                                    <div className="nameSection">
                                        <div className="inputBox">
                                            <label>Current Illness History</label>
                                            <textarea name='illness' value={formData.illness} onChange={handleChange} placeholder='Describe your illness....' />
                                        </div>
                                    </div>
                                    <div className="nameSection">
                                        <div className="inputBox">
                                            <label>Recent Surgery (Time span)</label>
                                            <input
                                                type="text"
                                                name="surgery"
                                                value={formData.surgery}
                                                onChange={handleChange}
                                                placeholder="Example: Appendix surgery (6 months ago)"
                                            />
                                        </div>
                                    </div>
                                    <div className="nameSection">
                                        <button className='saveChanges' type='button' onClick={() => { setActiveEdit1(true); setActiveEdit(false); }}>Next</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            )}
            {activeEdit1 && (
                <section className='conserdationFrom'>
                    <div className="container">
                        <div className="popUpEdit" onClick={() => setActiveEdit1(false)}>
                            <div className="modal" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => { setActiveEdit1(false); setActiveEdit(true) }}>X</button>
                                <h2>Consultation Form Step 2</h2>
                                <p>Share your Family Medical History.</p>
                                <form>
                                    <div className="nameSection step2">
                                        <h3>Diabetic Status :</h3>
                                        <div className="inputBox">
                                            <label><input type='radio' name='diabeticStatus' value="Diabetic" onChange={handleChange} />Diabetic</label>
                                        </div>
                                        <div className="inputBox">
                                            <label><input type='radio' name='diabeticStatus' value="Non-Diabetic" onChange={handleChange} />Non-Diabetic</label>
                                        </div>
                                    </div>
                                    <div className="nameSection">
                                        <div className="inputBox">
                                            <label>Any Allergies</label>
                                            <input
                                                type="text"
                                                name="allergy"
                                                value={formData.allergy}
                                                onChange={handleChange}
                                                placeholder="Example: Dust allergy"
                                            />
                                        </div>
                                    </div>
                                    <div className="nameSection">
                                        <div className="inputBox">
                                            <label>Others</label>
                                            <input
                                                type="text"
                                                name="others"
                                                value={formData.others}
                                                onChange={handleChange}
                                                placeholder="Other medical history"
                                            />
                                        </div>
                                    </div>
                                    <div className="nameSection">
                                        <button className='saveChanges' type='button' onClick={() => { setActiveEdit1(false); setActiveEdit(true) }}>Back</button>
                                        <button className='saveChanges' type='button' onClick={() => { setActiveEdit2(true); setActiveEdit1(false); }}>Next</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            )}
            {activeEdit2 && (
                <section className='conserdationFrom'>
                    <div className="container">
                        <div className="popUpEdit" onClick={() => setActiveEdit2(false)}>
                            <div className="modal" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => { setActiveEdit2(false); setActiveEdit1(true) }}>X</button>
                                <h2>Consultation Form Step 3</h2>
                                <p>Scan the QR code to make the payment and enter the transaction ID.</p>
                                <form onSubmit={handleSubmit}>
                                    <div className="nameSectionPayment">
                                        <div className="inputBox">
                                            <div className="qrsection">
                                                <p>Scan and Pay using UPI App</p>
                                                <div className="qrImag">
                                                    <img src={QRcode} alt='QR' />
                                                </div>
                                                <p>OR</p>
                                                <h4>UPI ID: sptathe@ybl</h4>
                                            </div>
                                            <div className="paymentDetails">
                                                <p>Pay Using Any App</p>
                                                <p><strong>RS 600</strong></p>
                                                <p className='afterPayment'>(After Payment)</p>
                                                <div className="trasactionId">
                                                    <label>Enter Transaction ID*</label>
                                                    <input type='text' name="transactionId" value={formData.transactionId} onChange={handleChange} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="inputBox">
                                            <h4>CONSENT FOR ONLINE CONSULTATION</h4>
                                            <p>I HAVE UNDERSTOOD THAT THIS IS AN ONLINE CONSULTAION WITHOUT A PHYSICAL CHECKUP OF MY SYMPTOMS THE DOCTOR HENCE RELIES ON MY DESCRIPTION OF THE PROBLEM OR SCANNED REPORTS PROVED BY ME WITH THIS UNDERSTANDING, I HEREBY GIVE MY CONSENT FOR ONLINE CONSULTAION.</p>
                                            <label><input type='checkbox' name='consent' checked={formData.consent} onChange={handleChange} /> YES, I ACCEPT</label>
                                        </div>
                                    </div>
                                    <div className="paymentSubmit">
                                        <button className='saveChanges' type='submit'>Submit Appointment</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            )}
            <Footer/>
        </>
    )
}
export default DoctorsList
