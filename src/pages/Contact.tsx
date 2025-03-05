
import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <section className="py-16 bg-gradient-to-b from-maronaut-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto glass-panel p-8 animate-fade-in">
              <h1 className="text-3xl font-bold text-maronaut-700 mb-6 text-center">Contact Us</h1>
              <p className="text-maronaut-600 mb-8 text-center">
                Have questions or feedback about Maronaut? We'd love to hear from you!
              </p>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-maronaut-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border border-maronaut-200 rounded-lg focus:ring-2 focus:ring-maronaut-500 focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-maronaut-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-maronaut-200 rounded-lg focus:ring-2 focus:ring-maronaut-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-maronaut-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 border border-maronaut-200 rounded-lg focus:ring-2 focus:ring-maronaut-500 focus:border-transparent"
                    placeholder="What's this about?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-maronaut-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full px-4 py-2 border border-maronaut-200 rounded-lg focus:ring-2 focus:ring-maronaut-500 focus:border-transparent"
                    placeholder="Tell us how we can help..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full md:w-auto px-6 py-3 bg-maronaut-500 text-white font-medium rounded-lg hover:bg-maronaut-600 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
