import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import UserRegistration from './components/UserRegistration'
import Login from './components/Login';

import SetupMFA from './components/SetupMFA';
import VerifyOTP from './components/VerifyOTP';
import Dashboard from './components/Dashboard';
import AllUsers from './components/dashboard/AllUsers';
import AllDevices from './components/dashboard/AllDevices';
import AllData from './components/dashboard/AllData';
import PendingDevices from './components/dashboard/PendingDevices';
import UserDevices from './components/dashboard/UserDevices';
import UserData from './components/dashboard/UserData';
import PendingDataRequests from './components/dashboard/PendingDataRequests';
import ApprovedDataRequests from './components/dashboard/ApprovedDataRequests';



function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/user-registration" element={<UserRegistration />} />
        <Route path="/login" element={<Login />} />
          /* Add protected/admin routes here */
        <Route path="/setup-mfa" element={<SetupMFA />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/users" element={<AllUsers />} />
        <Route path="/dashboard/devices" element={<AllDevices />} />
        <Route path="/dashboard/data" element={<AllData/>} />
        <Route path="/dashboard/pendingDevices" element={<PendingDevices/>} />
        <Route path="/dashboard/userDevices" element={<UserDevices />} />
        <Route path="/dashboard/userData" element={<UserData />} />
        <Route path="/dashboard/pendingDataRequests" element={<PendingDataRequests />} />
        <Route path="/dashboard/approvedDataRequests" element={<ApprovedDataRequests />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}


export default App;
