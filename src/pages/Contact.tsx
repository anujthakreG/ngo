import React, { useState } from 'react';
import { Mail, MessageSquare, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'motion/react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Logic will be added once backend is ready
  };

  if (submitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-green-50 p-12 rounded-3xl inline-block"
        >
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Message Sent!</h2>
          <p className="text-gray-600 max-w-sm mx-auto">
            Thank you for reaching out. Our team will get back to you within 24 hours.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="mt-8 text-green-600 font-bold hover:underline"
          >
            Send another message
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Get in Touch</h1>
          <p className="text-xl text-gray-600 mb-12">
            Have questions about how to join? Or technical issues with the platform? We're here to help.
          </p>

          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center shrink-0">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Email Us</h3>
                <p className="text-gray-600">support@foodshareconnect.org</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Call Us</h3>
                <p className="text-gray-600">+1 (555) 000-FOOD</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center shrink-0">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Our Office</h3>
                <p className="text-gray-600">123 Community Hub, City Center, 560001</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
              <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all appearance-none bg-white">
                <option>General Inquiry</option>
                <option>Restaurant Partnership</option>
                <option>NGO Registration</option>
                <option>Technical Support</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
              <textarea 
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="How can we help you?"
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="h-5 w-5" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
