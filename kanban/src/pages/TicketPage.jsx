import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import http from "../api/axios";

import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  FiType,
  FiFileText,
  FiImage,
  FiLayers,
  FiBarChart2,
  FiSend,
  FiCheckCircle,
  FiUploadCloud
} from "react-icons/fi";
import "./TicketPage.css";

const TicketPage = () => {
  const { setTicketHasBeenPosted } = useAuth();
  const { user } = useAuth();

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    description: yup.string().min(8).max(500).required("Description is required"),
    category: yup.string().oneOf([
      "Support / Incident — customer problems and outages.",
      "Service Request / Account — non-incident requests about accounts or access.",
      "Sales / Leads — inbound leads and followups tracked as tickets.",
      "Billing / Payment — invoices, refunds, disputes."
    ], "Please select a category"),
    priority: yup.number().required("Priority is required"),
  });

  const { register, handleSubmit, formState: { errors, isValid }, reset, watch } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange"
  });

  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const selectedLogo = watch("logo");

  const onSubmitHandler = async (data) => {
    const formData = new FormData();
    formData.append('logo', data['logo'][0]);
    formData.append('title', data.title);
    formData.append('category', data.category);
    formData.append('priority', data.priority);
    formData.append('description', data.description);

    setIsUploading(true);
    try {
      await http.post('/api/tickets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: ({ loaded, total }) => {
          setProgress(Math.round((loaded * 100) / total))
        }
      });

      setIsUploading(false);
      reset();
      setTicketHasBeenPosted(true);
    } catch (error) {
      console.log("Error creating ticket");
      setIsUploading(false);
    }
  }

  const categories = [
    'Support / Incident — customer problems and outages.',
    'Service Request / Account — non-incident requests about accounts or access.',
    'Sales / Leads — inbound leads and followups tracked as tickets.',
    'Billing / Payment — invoices, refunds, disputes.'
  ]

  return (
    <div className="create-ticket-page">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Create New Ticket
      </motion.h1>

      {!user.email_verified ? (
        <div className="verification-notice">
          <FiCheckCircle size={48} className="notice-icon" />
          <h3>Please verify your email</h3>
          <p>Check your inbox and verify your account before creating your first ticket.</p>
        </div>
      ) : (
        <div className="create-ticket-container">
          <form className="ticket-form-card" onSubmit={handleSubmit(onSubmitHandler)}>
            <div className="ticket-section">

              <div className="form-field">
                <label htmlFor="title">
                  <FiType className="field-icon" /> Title
                </label>
                <input
                  type="text"
                  className="modern-input"
                  placeholder="e.g. Server Latency Issue"
                  {...register("title")}
                />
                {errors.title && <span className="error-message">{errors.title.message}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="description">
                  <FiFileText className="field-icon" /> Description
                </label>
                <textarea
                  className="modern-textarea"
                  placeholder="Provide detailed information about the issue..."
                  {...register("description")}
                />
                {errors.description && <span className="error-message">{errors.description.message}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="logo">
                  <FiImage className="field-icon" /> Attachment / Logo
                </label>
                <div className="file-upload-wrapper">
                  <input
                    type="file"
                    className="file-upload-input"
                    {...register("logo")}
                  />
                  <div className="file-upload-design">
                    <FiUploadCloud size={20} />
                    <span>{selectedLogo?.[0]?.name || "Click or drag to upload file"}</span>
                  </div>
                </div>
                {errors.logo && <span className="error-message">{errors.logo.message}</span>}
              </div>

              <div className="form-field">
                <label>
                  <FiLayers className="field-icon" /> Category
                </label>
                <select className="modern-select" {...register("category")}>
                  <option value="">Select a category</option>
                  {categories.map((category, i) => (
                    <option key={i} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <span className="error-message">{errors.category.message}</span>}
              </div>

              <div className="form-field">
                <label>
                  <FiBarChart2 className="field-icon" /> Priority Level
                </label>
                <div className="priority-container">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div key={level} className="priority-option">
                      <input
                        id={`priority-${level}`}
                        type="radio"
                        value={level}
                        {...register("priority")}
                      />
                      <label htmlFor={`priority-${level}`} className="priority-label">
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.priority && <span className="error-message">{errors.priority.message}</span>}
              </div>

            </div>

            <button type="submit" className="submit-button" disabled={isUploading}>
              {isUploading ? "Processing..." : (
                <>
                  Submit Ticket <FiSend />
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {isUploading && (
        <div className="upload-progress-container">
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }
            }}
          />
        </div>
      )}
    </div>
  );
}

export default TicketPage;
