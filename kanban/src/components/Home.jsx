import React, { useEffect } from "react";
import Lottie from "react-lottie";
import loadinganimation from "../assets/home-animation.json";
import { useSearchParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from "framer-motion";
import {
  FiPlusCircle,
  FiList,
  FiLayout,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiTrello,
  FiCheckCircle
} from "react-icons/fi";

const Home = () => {
  const [searchParams] = useSearchParams();
  const verifyEmailToken = decodeURIComponent(searchParams.get("verify-token"));
  const { user, setUser } = useAuth();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadinganimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (verifyEmailToken && verifyEmailToken !== "null" && verifyEmailToken !== "undefined") {
          const response = await axios.post('/api/verify-email', { token: verifyEmailToken });
          if (response.data.user) {
            setUser(response.data.user);
            toast.success("Account Verified!", {
              position: "top-right",
              autoClose: 5000,
              theme: "dark",
            });
          }
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message, {
          position: "top-right",
          autoClose: 5000,
          theme: "dark",
        });
      }
    };
    verifyEmail();
  }, [verifyEmailToken, setUser]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const stats = [
    { label: "Active Boards", value: "12", icon: <FiTrello color="#4fc3f7" /> },
    { label: "Tasks Completed", value: "85", icon: <FiCheckCircle color="#81c784" /> },
    { label: "Team Members", value: "6", icon: <FiUsers color="#ba68c8" /> },
  ];

  return (
    <div className="dashboard" style={{ minHeight: '100vh', background: 'transparent' }}>
      <ToastContainer />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ maxWidth: '1200px', margin: '0 auto' }}
      >
        {/* Hero Section */}
        <header style={{ marginBottom: '4rem', paddingTop: '2rem' }}>
          <motion.h1 variants={itemVariants} style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#f5f5dc' }}>
            Welcome back, <span style={{ color: '#bbe1fa' }}>{user?.name || 'User'}</span>! 👋
          </motion.h1>
          <motion.p variants={itemVariants} style={{ color: '#aaa', fontSize: '1.2rem', maxWidth: '600px' }}>
            Manage your projects, track your team's progress, and collaborate in one place.
          </motion.p>
        </header>

        {/* Stats Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '4rem'
        }}>
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}
            >
              <div style={{ fontSize: '2rem' }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>{stat.value}</div>
                <div style={{ color: '#888', fontSize: '0.9rem' }}>{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ color: '#fff', marginBottom: '2rem', fontSize: '1.5rem' }}>Quick Actions</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '25px'
          }}>
            <motion.div variants={itemVariants} className="ticket-card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
              <Link to="/add-ticket" id="link" style={{ padding: '0', background: 'transparent' }}>
                <div style={{ padding: '2.5rem', width: '100%', boxSizing: 'border-box' }}>
                  <FiPlusCircle size={48} color="#bbe1fa" style={{ marginBottom: '1.5rem' }} />
                  <h3>Create New Board</h3>
                  <p style={{ color: '#ccc', marginTop: '0.5rem' }}>Start a fresh project and organize your workflow.</p>
                </div>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="ticket-card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
              <Link to="/tickets" id="link" style={{ padding: '0', background: 'transparent' }}>
                <div style={{ padding: '2.5rem', width: '100%', boxSizing: 'border-box' }}>
                  <FiList size={48} color="#bbe1fa" style={{ marginBottom: '1.5rem' }} />
                  <h3>My Projects</h3>
                  <p style={{ color: '#ccc', marginTop: '0.5rem' }}>Jump back into your active boards and tasks.</p>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features / Help Section */}
        <section>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '30px',
            opacity: 0.8
          }}>
            {[
              { title: "Kanban View", icon: <FiLayout />, desc: "Drag and drop tasks across columns." },
              { title: "Team Management", icon: <FiUsers />, desc: "Assign tasks and track contributions." },
              { title: "Analytics", icon: <FiBarChart2 />, desc: "Visualize progress with dynamic charts." },
              { title: "Settings", icon: <FiSettings />, desc: "Configure your personal workspace." }
            ].map((feature, idx) => (
              <motion.div key={idx} variants={itemVariants} style={{ color: '#aaa' }}>
                <div style={{ fontSize: '1.2rem', color: '#bbe1fa', marginBottom: '0.5rem' }}>{feature.icon}</div>
                <h4 style={{ color: '#eee', marginBottom: '0.3rem' }}>{feature.title}</h4>
                <p style={{ fontSize: '0.85rem' }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer Animation */}
        <motion.div
          variants={itemVariants}
          style={{
            marginTop: '6rem',
            display: 'flex',
            justifyContent: 'center',
            paddingBottom: '4rem',
            opacity: 0.3
          }}
        >
          <Lottie
            options={defaultOptions}
            height={150}
            width={150}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
