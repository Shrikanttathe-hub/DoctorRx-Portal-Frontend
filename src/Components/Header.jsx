import React from 'react';
import '../assets/CSS/Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("PatientId");
    toast.success("Log Out Successfully !");
    navigate('/');
  }
  return (
    <>
      <header>
        <div className="container">
          <div className="row">
            <Link to="/"><div >DoctorRx Portal</div></Link>
            <div>
              <nav>
                <ul>
                  <li>Home</li>
                  <li>About</li>
                  <li>Blog</li>
                </ul>
              </nav>
            </div>
            <div>
              {token ? (<button onClick={handleLogout}>Log Out</button>) : ("")}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
