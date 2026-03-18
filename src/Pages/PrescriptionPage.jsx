import React, { useState } from 'react'
import Header from '../Components/Header';
import '../assets/CSS/Prescription.css';
import { useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Footer from '../Components/Footer';

const PrescriptionPage = ({ consultationId }) => {
    const API = import.meta.env.VITE_API_URL;
    const [activeEdit, setActiveEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    console.log(data, "data")
    const [dataNew, setDataNew] = useState([]);
    const [dataNewMessage, setDataNewMessage] = useState([]);
    const token = localStorage.getItem('token');
    const { doctorId } = useParams();
    const [presData, setPresData] = useState({
        careAdvice: "",
        medicine: "",
    });
    const [selectedConsultation, setSelectedConsultation] = useState(null);
    const fetchDataPatient = () => {
        setLoading(true);
        axios.get(`${API}/doctor/consultation/${doctorId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                setLoading(false);
                setData(res.data.data);
                console.log(res.data.data)
            })
            .catch((err) => {
                console.log("error", err.message);
                setLoading(false);
            })
    }
    useEffect(() => {
        if (doctorId) {
            fetchDataPatient();
        }
    }, [doctorId]);
    const fetchData = () => {
        setLoading(true);
        axios.get(`${API}/doctor/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                setLoading(false);
                setDataNew(res.data.data);
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
    const handleSubmitPrescription = async (e) => {
        e.preventDefault();
        try {
            if (!selectedConsultation) {
                toast.error("Select a consultation first!");
                return;
            }
            const response = await axios.post(`${API}/doctor/prescription`, { consultationId: selectedConsultation, patientId: dataNew?.id, ...presData }, { headers: { Authorization: `Bearer ${token}` } });
            toast.success(response.data.message);
            setPresData({
                careAdvice: "",
                medicine: "",
            });
            setActiveEdit(false);
            fetchDataPatient();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }
    const handleDownload = async (consultationId) => {
        try {
            const res = await axios.get(
                `${API}/doctor/prescription/${consultationId}`
            );
            const pdfUrl = `${API}${res.data.pdfUrl}`;
            window.open(pdfUrl, "_blank");
        } catch (err) {
            toast.error("Prescription not found");
        }
    };
    const handleEdit = async (consultationId) => {
        try {
            const res = await axios.get(
                `${API}/doctor/prescription/${consultationId}`
            );

            setPresData({
                careAdvice: res.data.careAdvice,
                medicine: res.data.medicine
            });

            setSelectedConsultation(consultationId);
            setActiveEdit(true);

        } catch (err) {
            toast.error("No prescription found");
        }
    };
    const handleSend = async (consultationId) => {
        try {
            const res = await axios.put(
                `${API}/doctor/send-prescription/${consultationId}`
            );

            toast.success(res.data.message);
            fetchDataPatient();
        } catch (err) {
            toast.error("Failed to send prescription");
        }
    };
    const fetchDataPatientMessage = (patientId) => {
        setLoading(true);
        axios.get(`${API}/doctor/patient-prescriptions/${patientId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                setLoading(false);
                setDataNewMessage(res.data.data);
                console.log(res.data.data, "message")
            })
            .catch((err) => {
                console.log("error", err.message);
                setLoading(false);
            })
    }
    useEffect(() => {
        if (dataNew?.id) {
            fetchDataPatientMessage(dataNew.id);
        }
    }, [dataNew]);
    return (
        <>
            <Header />
            <div className="popUpEdit">
                <div className="modal prescriptionPage">
                    <h2>Prescription Page</h2>
                    <p>Manage patient consultations and write prescriptions.</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Patient Name</th>
                                <th>Illness</th>
                                <th>Diabetic Status</th>
                                <th>History of Surgery</th>
                                <th>Allergy</th>
                                <th>Others</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        {loading ? (
                            <tbody style={{ height: "200px" }}>
                                <tr><td colSpan={9}>Loading Consultations...</td></tr>
                            </tbody>
                        ) : (
                            <tbody>
                                {data.length === 0 ? (<tr style={{ height: "200px" }}><td colSpan={9}>No Consultations</td></tr>) : (data.map((info) => (
                                    <tr key={info._id}>
                                        <td>{info.patientName}</td>
                                        <td>{info.illness}</td>
                                        <td>{info.diabeticStatus}</td>
                                        <td>{info.surgery}</td>
                                        <td>{info.allergy}</td>
                                        <td>{info.others}</td>
                                        <td>{info.createdAt.split("T")[0].split("-").reverse().join("/")}</td>
                                        <td className={info.isSent ? "completed" : "pending"}>{info.isSent ? "Completed" : "Pending"}</td>
                                        <td>
                                            {!info.isSent ? (
                                                <>
                                                    <button className="prescriptionBtn" onClick={() => { setSelectedConsultation(info._id); setActiveEdit(true) }}>Write Prescription</button>
                                                </>) : (
                                                <>
                                                    <button className="prescriptionBtn" onClick={() => handleSend(info._id)}>Send</button>
                                                    <button className="prescriptionBtn" onClick={() => handleEdit(info._id)}>Edit</button>
                                                    <button className="prescriptionBtn" onClick={() => handleDownload(info._id)}>Download</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                )))}
                            </tbody>
                        )}
                    </table>
                </div>
            </div >
            {activeEdit && (
                <div className="popUpEdit" onClick={() => setActiveEdit(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setActiveEdit(false)}>X</button>
                        <h2>Prescription for Patient</h2>
                        <form onSubmit={handleSubmitPrescription}>
                            <div className='prescriptionForm'>
                                <div className='doctorDetails'>
                                    <h3>Dr. {dataNew?.firstName} {dataNew?.lastName}<span>Date: {new Date().toLocaleDateString()}</span></h3>
                                    <p><strong>Address</strong>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Blanditiis, necessitatibus.</p>
                                </div>
                                <div className='careTaken'>
                                    <div className='careText'>
                                        <label>Care to be taken</label>
                                        <textarea value={presData.careAdvice} onChange={(e) => setPresData({ ...presData, careAdvice: e.target.value })}></textarea>
                                    </div>
                                    <div className='careText'>
                                        <label>Medicine</label>
                                        <textarea value={presData.medicine} onChange={(e) => setPresData({ ...presData, medicine: e.target.value })}></textarea>
                                    </div>
                                </div>
                                <div className='docName'>
                                    <p>Dr. {dataNew?.firstName} {dataNew?.lastName}</p>
                                    <p>Name of Doctor</p>
                                </div>
                            </div>
                            <div className="nameSection">
                                <button className='saveChanges' type='submit'>{loading ? "Generating..." : "Generate Prescription"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <Footer/>
            {/* final */}
        </>
    )
}
export default PrescriptionPage
