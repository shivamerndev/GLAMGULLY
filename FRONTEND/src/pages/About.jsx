import { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Award,
  Shield,
  Truck,
  Heart,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  CheckCircle,
  MessageSquare
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">

      <div className="relative overflow-hidden bg-gradient-to-bl from-amber-200/60 via-yellow-200/60 to-orange-200/60 p-4 mb-4 rounded-2xl shadow-lg border border-amber-300/50 flex justify-center items-center">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

        {/* Main content */}
        <div className="relative flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-600 rounded-2xl flex shrink-0 items-center justify-center shadow-md">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-amber-900 mb-1">
              Connect With Us
              <span className="inline-block ml-2 text-amber-600">✨</span>
            </h1>
            <p className="text-amber-700 font-medium">We're here to help and answer any questions</p>
          </div>
        </div>

        {/* Subtle animation line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 rounded-b-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid lg:grid-cols-2 md:gap-12 gap-8 mb-8">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-amber-200/50">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-amber-900 mb-1">Send us a Message</h2>
              <p className="text-amber-700">Fill out the form below and we'll get back to you within 24 hours.</p>
            </div>

            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-green-700 mb-2">Message Sent!</h3>
                <p className="text-green-600">Thank you for contacting us. We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-amber-900 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-400 focus:outline-none transition-colors text-amber-900"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-amber-900 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-400 focus:outline-none transition-colors text-amber-900"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-amber-900 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-400 focus:outline-none transition-colors text-amber-900"
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-amber-900 mb-2">Subject *</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-400 focus:outline-none transition-colors text-amber-900"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Customer Support</option>
                      <option value="orders">Order Related</option>
                      <option value="returns">Returns & Refunds</option>
                      <option value="business">Business Partnership</option>
                      <option value="feedback">Feedback & Suggestions</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-amber-900 mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-400 focus:outline-none transition-colors text-amber-900 resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg">
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact Cards */}
          <div className="grid md:gap-6 gap-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-200/50 hover:shadow-2xl transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-amber-900 mb-2">Call Us</h3>
                  <p className="text-amber-700 mb-1">Customer Support: <a href="tel:+918001234567" className="font-semibold hover:text-amber-800">+91 890-123-4567</a></p>
                  <p className="text-amber-700">Business Inquiries: <a href="tel:+918001234568" className="font-semibold hover:text-amber-800">+91 890-123-4568</a></p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-5 border border-amber-200/50 hover:shadow-2xl transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-amber-900 mb-2">Email Us</h3>
                  <p className="text-amber-700 mb-1">Support: <a href="mailto:support@glamgully.com" className="font-semibold hover:text-amber-800">support@glamgully.com</a></p>
                  <p className="text-amber-700">Business: <a href="mailto:business@glamgully.com" className="font-semibold hover:text-amber-800">business@glamgully.com</a></p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-5 border border-amber-200/50 hover:shadow-2xl transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-amber-900 mb-2">Address</h3>
                  <p className="text-amber-700">
                   Navi Mumbai<br /> Maharastra, India- 800001
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-5 border border-amber-200/50 hover:shadow-2xl transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-amber-900 mb-2">Business Hours</h3>
                  <div className="text-amber-700 space-y-1">
                    <p>EveryDay : 9:00 AM - 7:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="md:mb-16 mb-12">
          <div className="text-center md:mb-12 mb-8">
            <h2 className="md:text-3xl text-2xl font-bold text-amber-900 md:mb-4 mb-2">About GlamGully</h2>
            <p className="md:text-xl text-amber-700 max-w-3xl mx-auto">
              Your trusted partner in fashion and lifestyle, delivering quality products with exceptional service since 2024.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              // { icon: Users, title: '50K+', subtitle: 'Happy Customers', color: 'from-amber-400 to-orange-400' },
              { icon: Award, title: '100+', subtitle: 'Products', color: 'from-amber-500 to-orange-500' },
              { icon: Shield, title: '100%', subtitle: 'Secure Shopping', color: 'from-amber-600 to-orange-600' },
              { icon: Truck, title: '24/7', subtitle: 'Fast Delivery', color: 'from-amber-700 to-orange-700' }
            ].map(({ icon: Icon, title, subtitle, color }) => (
              <div key={title} className="bg-white rounded-2xl shadow-xl p-6 text-center border border-amber-200/50 hover:shadow-2xl transition-all transform hover:scale-105">
                <div className={`w-16 h-16 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-amber-900 mb-1">{title}</h3>
                <p className="text-amber-700">{subtitle}</p>
              </div>
            ))}
          </div>

          {/* Our Story */}
          <div className="bg-white rounded-3xl shadow-2xl md:p-12 py-6 px-4 border border-amber-200/50">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="md:text-2xl text-xl mb-3 font-bold text-amber-900">Our Story</h3>
                <div className="space-y-3 text-sm text-amber-800 leading-relaxed">
                  <p>
                    Founded in 2024, GlamGully started as a small venture with a big dream - to make fashion accessible to everyone.
                    What began as a passion project has now grown into one of India's most trusted online fashion destinations.
                  </p>
                  <p>
                    We believe that everyone deserves to look and feel their best. That's why we carefully curate our collection
                    to bring you the latest trends, timeless classics, and everything in between - all at prices that won't break the bank.
                  </p>
                  <p>
                    Today, we're proud to serve our all customers across India, offering a seamless shopping experience
                    backed by exceptional customer service and fast, reliable delivery.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-r from-amber-200 to-orange-200 rounded-3xl md:p-6 p-3 text-center">
                  <Heart className="w-16 h-16 text-amber-600 mx-auto mb-4" />
                  <h4 className="text-2xl font-bold text-amber-900 mb-4">Our Mission</h4>
                  <p className="text-amber-800">
                    To empower individuals through fashion by providing high-quality, affordable jewellery and accessories
                    that help them express their unique style and personality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid sm:grid-cols-3 gap-4 md:gap-8">
          {[
            {
              icon: Shield,
              title: 'Quality Assurance',
              description: 'Every product goes through rigorous quality checks to ensure you get the best value for your money.'
            },
            {
              icon: Truck,
              title: 'Fast Delivery',
              description: 'Quick and reliable shipping across India with real-time tracking and secure packaging.'
            },
            {
              icon: Heart,
              title: 'Customer First',
              description: 'Your satisfaction is our priority. We\'re here to help with 24/7 support.'
            }
          ].map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-white rounded-2xl shadow-xl p-8 text-center border border-amber-200/50 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Icon className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-4">{title}</h3>
              <p className="text-amber-700 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
        {/* Social Media */}
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl shadow-xl py-4 px-6 border mt-6 border-amber-200/50">
          <h3 className="text-lg font-bold text-amber-900 mb-4">Follow Us</h3>
          <div className="flex gap-4">
            {[
              { icon: Facebook, color: 'hover:text-blue-600', label: 'Facebook' },
              { icon: Instagram, color: 'hover:text-pink-600', label: 'Instagram' },
              // { icon: Twitter, color: 'hover:text-blue-500', label: 'Twitter' },
              { icon: Youtube, color: 'hover:text-red-600', label: 'YouTube' }
            ].map(({ icon: Icon, color, label }) => (
              <a
                key={label}
                href={`https://www.${label.toLocaleLowerCase()}.com/glamgully01`}
                target='_blank'
                className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center text-amber-600 ${color} transition-all hover:scale-110 shadow-md hover:shadow-lg`}
                aria-label={label}>
                <Icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;