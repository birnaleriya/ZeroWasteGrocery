// const AboutUs = () => {
//     return (
//         <div>
//             <h1>About Us</h1>
//             <p>Welcome to our website!</p>
//         </div>
//     );
// };

// export default AboutUs;  
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function AboutUs() {
  useEffect(() => {
    document.title = "About Us - Zero Waste Grocery Planner";
  }, []);
  const navigate = useNavigate();
  return (
    <div className="bg-green-50 min-h-screen p-6 md:p-10 text-gray-800">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">About Us</h1>
        <p className="text-lg max-w-2xl mx-auto">
          At <span className="text-green-600 font-semibold">Zero-Waste Grocery Planner</span>, we are on a mission to reduce food waste through smart, AI-powered grocery and meal planning.
        </p>
      </section>

      <section className="grid md:grid-cols-3 gap-6 mb-16">
        {[
          { title: "🌿 Our Mission", desc: "Empower households to make eco-friendly grocery decisions and minimize waste using technology." },
          { title: "🤖 Powered by AI", desc: "Using OCR, and Gemini to generate personalized, waste-free meal plans." },
          { title: "💡 Smart Living", desc: "Track groceries, get smart alerts, and receive real-time meal suggestions to save food and money." }
        ].map((card, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
            <p>{card.desc}</p>
          </motion.div>
        ))}
      </section>


      <section className="text-center bg-green-100 p-8 rounded-xl shadow-inner">
      <h2 className="text-2xl font-bold mb-3">"Every meal saved is a step toward a better planet."</h2>
      <p className="text-md mb-4">Join us in creating a smarter, zero-waste future.</p>
      <button
        onClick={() => navigate('/login')}
        className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
      >
        Get Started
      </button>
    </section>
    </div>
  );
}