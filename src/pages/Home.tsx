import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Utensils, Heart, Shield, Users } from 'lucide-react';

export default function Home() {
  const stats = [
    { label: 'Meals Distributed', value: '10,000+' },
    { label: 'Active Restaurants', value: '250+' },
    { label: 'NGO Partners', value: '120+' },
    { label: 'Cities Covered', value: '15+' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-orange-600 uppercase bg-orange-50 rounded-full">
              Bridging the gap between waste and hunger
            </span>
            <h1 className="text-5xl md:text-7xl font-sans font-bold text-gray-900 mb-8 leading-[1.1] tracking-tight">
              Don't let good food <br />
              <span className="text-orange-600">go to waste.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-12 leading-relaxed">
              We connect surplus food from local restaurants to NGOs feeding those in need. Join our community of giving today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-orange-600 text-white rounded-full font-bold text-lg hover:bg-orange-700 transition-all shadow-xl hover:shadow-orange-200 flex items-center justify-center gap-2"
              >
                Start Giving Food <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/about"
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                Learn How It Works
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400 font-medium text-sm uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why FoodShare Connect?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our platform is designed to make the process of food redistribution as seamless as possible.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Utensils,
                title: "For Restaurants",
                desc: "Easily list surplus food in minutes. Reduce waste and contribute to your local community's welfare.",
                color: "bg-orange-100 text-orange-600"
              },
              {
                icon: Users,
                title: "For NGOs",
                desc: "Discover available food in your area in real-time. Claim and pick up fresh meals for those you serve.",
                color: "bg-blue-100 text-blue-600"
              },
              {
                icon: Shield,
                title: "Safe & Verified",
                desc: "All participating entities are verified. We provide guidelines to ensure food safety and quality handling.",
                color: "bg-green-100 text-green-600"
              }
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact CTA */}
      <section className="py-24 px-4 bg-orange-600 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Heart className="h-16 w-16 text-white mb-8 mx-auto animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
            Ready to make a difference in your city?
          </h2>
          <p className="text-orange-100 text-xl mb-12 max-w-2xl mx-auto">
            Whether you're a restaurant with surplus or an organization with matching needs, there's a place for you here.
          </p>
          <Link
            to="/login"
            className="inline-block px-10 py-5 bg-white text-orange-600 rounded-full font-bold text-xl hover:bg-gray-100 transition-all shadow-2xl"
          >
            Join the Movement Now
          </Link>
        </div>
      </section>
    </div>
  );
}
