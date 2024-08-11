import React, { useState } from 'react';
import '../css/Dashboard.css';
import Navbar from './Navbar';
import Home from './Home';

const Dashboard = () => {
    return (
        <div className="dashboard">
            {/* <Navbar /> */}
            <div className="main-content">
                <Home />
            </div>
        </div>
    );
};

export default Dashboard;
