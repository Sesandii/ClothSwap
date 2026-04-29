import React, { Children, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Upload,
  RefreshCw,
  HeartHandshake,
  ArrowRight,
  Star
} from
  'lucide-react';
import { clothes } from '../data/mockData';
import { ClothesCard } from '../components/ClothesCard';
import { getStoredToken } from '../lib/auth';
export function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    if (getStoredToken()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const featuredClothes = clothes.slice(0, 4);
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-white pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489987707023-afc1526ce5fd?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.6
              }}>

              <span className="inline-block py-1 px-3 rounded-full bg-primary-50 text-primary-600 text-sm font-medium mb-6 border border-primary-100">
                Sustainable Fashion Community
              </span>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-warmGray-900 tracking-tight mb-6 leading-tight">
                Swap Your Style,
                <br />
                <span className="text-primary-500 italic">
                  Share Your Wardrobe
                </span>
              </h1>
              <p className="text-xl text-warmGray-600 mb-10 leading-relaxed">
                Refresh your closet without spending a dime. Trade clothes you
                no longer wear for pieces you'll love, while helping the planet.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-white bg-primary-500 hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">

                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-warmGray-700 bg-white border border-warmGray-200 hover:bg-warmGray-50 hover:border-warmGray-300 transition-all shadow-sm">

                  Log In
                </Link>
              </div>
            </motion.div>

            {/* Search Bar in Hero */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.6,
                delay: 0.2
              }}
              className="max-w-2xl mx-auto bg-white p-2 rounded-full shadow-lg border border-warmGray-100 flex items-center">

              <div className="pl-4 text-warmGray-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search for vintage jackets, summer dresses..."
                className="w-full py-3 px-4 bg-transparent border-none focus:outline-none text-warmGray-800 placeholder-warmGray-400" />

              <button className="bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-3 rounded-full font-medium transition-colors">
                Search
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-warmGray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-warmGray-900 mb-4">
              How ClothSwap Works
            </h2>
            <p className="text-lg text-warmGray-600 max-w-2xl mx-auto">
              Four simple steps to a refreshed wardrobe and a more sustainable
              lifestyle.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              margin: '-100px'
            }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">

            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-warmGray-200 z-0"></div>

            {[
              {
                icon: Upload,
                title: '1. Upload',
                desc: 'Snap photos of clothes you no longer wear and add them to your closet.'
              },
              {
                icon: Search,
                title: '2. Browse',
                desc: 'Explore thousands of items from other users in the community.'
              },
              {
                icon: RefreshCw,
                title: '3. Request',
                desc: 'Found something you like? Send a swap request offering your items.'
              },
              {
                icon: HeartHandshake,
                title: '4. Swap',
                desc: 'Once accepted, choose how to exchange and enjoy your new clothes!'
              }].
              map((step, index) =>
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative z-10 flex flex-col items-center text-center">

                  <div className="w-24 h-24 rounded-full bg-white shadow-md border border-warmGray-100 flex items-center justify-center mb-6 text-primary-500">
                    <step.icon size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-warmGray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-warmGray-600">{step.desc}</p>
                </motion.div>
              )}
          </motion.div>
        </div>
      </section>

      {/* Featured Clothes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-warmGray-900 mb-4">
                Fresh Finds
              </h2>
              <p className="text-lg text-warmGray-600">
                Recently added items looking for a new home.
              </p>
            </div>
            <Link
              to="/browse"
              className="hidden sm:flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors">

              View all <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredClothes.map((item) =>
              <ClothesCard key={item.id} {...item} imageUrl={item.images[0]} />
            )}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Link
              to="/browse"
              className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors">

              View all items <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-secondary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-secondary-50">
                Why Swap Instead of Shop?
              </h2>
              <p className="text-secondary-200 text-lg mb-8 leading-relaxed">
                The fashion industry is one of the largest polluters globally.
                By swapping clothes, you're extending their lifecycle and
                reducing waste, all while keeping your style fresh.
              </p>

              <ul className="space-y-6">
                {[
                  {
                    title: 'Eco-Friendly',
                    desc: 'Reduce your carbon footprint and keep textiles out of landfills.'
                  },
                  {
                    title: 'Cost-Effective',
                    desc: "Get 'new to you' clothes without spending any money."
                  },
                  {
                    title: 'Community Driven',
                    desc: 'Connect with fashion lovers in your local area.'
                  }].
                  map((benefit, i) =>
                    <li key={i} className="flex">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-6 h-6 rounded-full bg-secondary-500 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-white">
                          {benefit.title}
                        </h4>
                        <p className="mt-1 text-secondary-200">{benefit.desc}</p>
                      </div>
                    </li>
                  )}
              </ul>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=1000"
                  alt="People swapping clothes"
                  className="w-full h-full object-cover" />

              </div>
              <div className="absolute -bottom-6 -left-6 bg-white text-warmGray-900 p-6 rounded-2xl shadow-xl max-w-xs">
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) =>
                    <Star
                      key={i}
                      size={16}
                      className="fill-yellow-400 text-yellow-400" />

                  )}
                </div>
                <p className="font-medium text-sm italic">
                  "I've completely revamped my wardrobe without spending a dime.
                  The community is amazing!"
                </p>
                <p className="text-xs text-warmGray-500 mt-2">
                  — Sarah, New York
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-serif font-bold text-warmGray-900 mb-6">
            Ready to refresh your closet?
          </h2>
          <p className="text-xl text-warmGray-600 mb-10">
            Join thousands of users who are already swapping their way to a more
            sustainable wardrobe.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full text-white bg-primary-500 hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">

            Create Your Free Account
          </Link>
        </div>
      </section>
    </div>);

}