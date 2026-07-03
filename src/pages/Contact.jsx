import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({ 
    loading: false, 
    success: false, 
    error: '' 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });
    
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setStatus({ loading: false, success: true, error: '' });
      } else {
        setStatus({ loading: false, success: false, error: data.error });
      }
    } catch (err) {
      setStatus({ 
        loading: false, 
        success: false, 
        error: 'Network error. Please make sure the backend is running.' 
      });
    }
  };

  return (
    <div className='min-h-screen bg-black text-white flex items-center justify-center p-6 md:p-12 overflow-hidden relative'>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className='max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10'>
      
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          <div>
            <h1 className='text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500'>
              Ready to Start Your Journey?
            </h1>
            <p className='text-gray-400 text-lg leading-relaxed'>
              Whether you have a question about our AI tourist routes, need help planning your next big trip, or just want to say hello, we’d love to hear from you. Drop us a message and our team will get back to you faster than a direct flight to Delhi!
            </p>
          </div>

          <div className="space-y-4 text-gray-300">
            <div className="flex items-center gap-4">
              <span className="text-teal-400 text-2xl">✈️</span>
              <p>ishaanshukla0317@gmail.com</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <form 
            onSubmit={handleSubmit} 
            className='bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl flex flex-col gap-6 relative'
          >
            <h2 className="text-2xl font-semibold mb-2 text-white">Send us a message</h2>
            
            {status.success && (
              <div className="bg-teal-500/20 border border-teal-500 text-teal-300 px-4 py-3 rounded-lg text-sm">
                Message sent successfully! We'll be in touch soon.
              </div>
            )}
            {status.error && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm">
                {status.error}
              </div>
            )}
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Full Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-transparent border-b border-gray-600 py-2 focus:outline-none focus:border-teal-400 transition-colors text-white placeholder-gray-600"
                placeholder="What should we call you?"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-transparent border-b border-gray-600 py-2 focus:outline-none focus:border-teal-400 transition-colors text-white placeholder-gray-600"
                placeholder="Where can we reach you?"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Subject</label>
              <select 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="bg-transparent border-b border-gray-600 py-2 focus:outline-none focus:border-teal-400 transition-colors text-gray-300 [&>option]:bg-gray-900"
                required
              >
                <option value="" disabled>Select a topic...</option>
                <option value="ai_guide">AI Tourist Guide Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="general">General Question</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Message</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="bg-transparent border-b border-gray-600 py-2 focus:outline-none focus:border-teal-400 transition-colors text-white placeholder-gray-600 resize-none"
                placeholder="Tell us about your next adventure..."
                required
              ></textarea>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={status.loading}
              className={`mt-4 bg-gradient-to-r from-teal-400 to-blue-500 text-black font-bold py-3 px-6 rounded-xl transition-shadow ${status.loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-[0_0_20px_rgba(45,212,191,0.3)]'}`}
            >
              {status.loading ? 'Sending...' : 'Send Message'}
            </motion.button>
          </form>
        </motion.div>

      </div>
    </div>
  );
};

export default Contact;