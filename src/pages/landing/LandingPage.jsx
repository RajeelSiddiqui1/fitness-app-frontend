// src/pages/landing/LandingPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Float, MeshDistortMaterial } from '@react-three/drei';
import { 
  Dumbbell, 
  Utensils, 
  TrendingUp, 
  Users, 
  ChevronRight,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  Star,
  ArrowRight,
  Activity,
  Shield,
  Zap,
  CheckCircle,
  Play,
  Award,
  Heart,
  Target
} from 'lucide-react';
import GlassCard from '../../components/GlassCard';

// Three.js Animated Sphere Component
const AnimatedSphere = ({ color = "#667eea", position = [0, 0, 0], scale = 1 }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <Sphere ref={meshRef} position={position} scale={scale}>
        <MeshDistortMaterial 
          color={color} 
          attach="material" 
          distort={0.4} 
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
};

// Animated Background Component
const ThreeBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <AnimatedSphere color="#667eea" position={[-2, 1, -2]} scale={0.5} />
        <AnimatedSphere color="#764ba2" position={[2, -1, -1]} scale={0.4} />
        <AnimatedSphere color="#f093fb" position={[0, 2, -3]} scale={0.3} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState('');

  const features = [
    {
      icon: Dumbbell,
      title: 'Workout Tracking',
      description: 'Track your workouts with detailed logs including sets, reps, weights, and categories. Monitor your progress over time.',
      color: '#3b82f6',
      image: null
    },
    {
      icon: Utensils,
      title: 'Nutrition Management',
      description: 'Monitor your daily nutrition intake with calories, protein, carbs, and fats tracking. Achieve your dietary goals.',
      color: '#10b981',
      image: null
    },
    {
      icon: TrendingUp,
      title: 'Progress Analytics',
      description: 'Visualize your fitness journey with detailed charts and progress tracking. Stay motivated with visual insights.',
      color: '#8b5cf6',
      image: null
    },
    {
      icon: Users,
      title: 'Social Features',
      description: 'Connect with friends, share progress, and get motivated together. Join a community of fitness enthusiasts.',
      color: '#f59e0b',
      image: null
    },
    {
      icon: Shield,
      title: 'Privacy Control',
      description: 'Choose who can see your fitness data with customizable privacy settings. Your data, your rules.',
      color: '#ef4444',
      image: null
    },
    {
      icon: Zap,
      title: 'Quick Add',
      description: 'Easily log workouts and meals with our fast and intuitive interface. Save time while staying organized.',
      color: '#06b6d4',
      image: null
    }
  ];

  const stats = [
    { value: '10K+', label: 'Active Users', icon: Users },
    { value: '500K+', label: 'Workouts Logged', icon: Activity },
    { value: '1M+', label: 'Meals Tracked', icon: Utensils },
    { value: '4.9', label: 'App Rating', icon: Star }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Fitness Enthusiast',
      rating: 5,
      text: 'R-Fit has completely transformed my fitness journey. The workout tracking is intuitive and the progress charts keep me motivated!'
    },
    {
      name: 'Mike Chen',
      role: 'Personal Trainer',
      rating: 5,
      text: 'As a trainer, I recommend R-Fit to all my clients. The nutrition tracking and progress analytics are exceptional.'
    },
    {
      name: 'Emma Davis',
      role: 'Yoga Instructor',
      rating: 5,
      text: 'The best fitness app I have ever used. Beautiful design and all the features I need in one place.'
    }
  ];

  const benefits = [
    { icon: Target, title: 'Goal Tracking', desc: 'Set and track your fitness goals' },
    { icon: Heart, title: 'Health Monitoring', desc: 'Monitor your health metrics' },
    { icon: Award, title: 'Achievements', desc: 'Earn rewards for your progress' },
    { icon: Play, title: 'Quick Start', desc: 'Get started in minutes' }
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert('Thank you for subscribing!');
      setEmail('');
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      {/* Three.js Background */}
      <ThreeBackground />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Zap size={22} className="text-white animate-pulse" />
              </div>
              <span className="text-xl font-bold" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>R-Fit</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('features')} className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: '#374151' }}>Features</button>
              <button onClick={() => scrollToSection('about')} className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: '#374151' }}>About</button>
              <button onClick={() => scrollToSection('testimonials')} className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: '#374151' }}>Testimonials</button>
              <button onClick={() => scrollToSection('contact')} className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: '#374151' }}>Contact</button>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-sm font-medium rounded-xl transition-all hover:bg-gray-100"
                style={{ color: '#374151' }}
              >
                Log In
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="px-4 py-2 text-sm font-medium rounded-xl text-white transition-all hover:opacity-90 transform hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)' }}
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl"
              style={{ color: '#374151' }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
            <div className="px-4 py-4 space-y-3">
              <button onClick={() => scrollToSection('features')} className="block w-full text-left py-2 text-sm font-medium" style={{ color: '#374151' }}>Features</button>
              <button onClick={() => scrollToSection('about')} className="block w-full text-left py-2 text-sm font-medium" style={{ color: '#374151' }}>About</button>
              <button onClick={() => scrollToSection('testimonials')} className="block w-full text-left py-2 text-sm font-medium" style={{ color: '#374151' }}>Testimonials</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-2 text-sm font-medium" style={{ color: '#374151' }}>Contact</button>
              <div className="pt-3 border-t space-y-2" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                <button 
                  onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                  className="block w-full text-left py-2 text-sm font-medium"
                  style={{ color: '#374151' }}
                >
                  Log In
                </button>
                <button 
                  onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}
                  className="block w-full text-center py-2 text-sm font-medium rounded-xl text-white"
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in-up" style={{ background: 'rgba(102, 126, 234, 0.1)', color: '#667eea' }}>
              <Zap size={16} />
              <span>Start Your Fitness Journey Today</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 animate-fade-in-up" style={{ color: '#1f2937', lineHeight: '1.1' }}>
              Your Complete{' '}
              <span style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Fitness Companion
              </span>
            </h1>
            <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ color: '#6b7280', animationDelay: '0.2s' }}>
              Track workouts, monitor nutrition, analyze progress, and connect with friends. 
              Everything you need to achieve your fitness goals in one beautiful app.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <button 
                onClick={() => navigate('/register')}
                className="flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-2xl transition-all hover:scale-105 hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)' }}
              >
                Quick Start
                <ArrowRight size={20} className="animate-bounce" />
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-2xl transition-all hover:scale-105 border-2"
                style={{ borderColor: '#e5e7eb', color: '#374151' }}
              >
                Explore Features
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <GlassCard 
                  key={index}
                  className="p-4 animate-fade-in-up"
                  style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', animationDelay: `${0.6 + index * 0.1}s` }}
                >
                  <stat.icon size={24} className="mx-auto mb-2" style={{ color: '#667eea' }} />
                  <p className="text-2xl font-bold" style={{ color: '#1f2937' }}>{stat.value}</p>
                  <p className="text-xs" style={{ color: '#6b7280' }}>{stat.label}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Alternating Layout */}
      <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#1f2937' }}>
              Amazing Features
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#6b7280' }}>
              Everything you need to transform your fitness journey
            </p>
          </div>

          <div className="space-y-20">
            {features.slice(0, 4).map((feature, index) => (
              <div 
                key={index} 
                className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}
              >
                {/* Image Side */}
                <div className="flex-1 w-full">
                  <GlassCard 
                    className="p-8 h-80 flex items-center justify-center"
                    style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)' }}
                  >
                    <div className="text-center">
                      <div 
                        className="w-32 h-32 mx-auto rounded-3xl flex items-center justify-center mb-4 animate-pulse"
                        style={{ background: `${feature.color}20` }}
                      >
                        <feature.icon size={48} style={{ color: feature.color }} />
                      </div>
                      <div className="flex justify-center gap-2 mt-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} fill="#fbbf24" stroke="#fbbf24" />
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                </div>

                {/* Content Side */}
                <div className="flex-1 w-full">
                  <div className={`${index % 2 === 1 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                    <div 
                      className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
                      style={{ background: `${feature.color}20` }}
                    >
                      <feature.icon size={24} style={{ color: feature.color }} />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: '#1f2937' }}>
                      {feature.title}
                    </h3>
                    <p className="text-lg" style={{ color: '#6b7280' }}>
                      {feature.description}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {[1, 2, 3].map((item) => (
                        <li key={item} className="flex items-center gap-3">
                          <CheckCircle size={20} style={{ color: feature.color }} />
                          <span style={{ color: '#6b7280' }}>Benefit {item} of {feature.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <GlassCard 
                key={index}
                className="p-6 text-center hover:scale-105 transition-transform duration-300"
                style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)' }}
              >
                <div 
                  className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)' }}
                >
                  <benefit.icon size={32} style={{ color: '#667eea' }} />
                </div>
                <h4 className="font-semibold mb-2" style={{ color: '#1f2937' }}>{benefit.title}</h4>
                <p className="text-sm" style={{ color: '#6b7280' }}>{benefit.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ color: '#1f2937' }}>
                About R-Fit
              </h2>
              <div className="space-y-4" style={{ color: '#6b7280' }}>
                <p>
                  R-Fit is a comprehensive fitness tracking application designed to help you achieve your health and wellness goals. 
                  We believe that tracking your fitness journey should be simple, beautiful, and motivating.
                </p>
                <p>
                  Our app combines workout tracking, nutrition management, and progress analytics all in one place. 
                  With social features, you can connect with friends and stay motivated together.
                </p>
                <p>
                  Whether you're just starting your fitness journey or you're a seasoned athlete, R-Fit has the tools 
                  you need to track your progress and achieve your goals.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <GlassCard key={index} className="p-4 text-center" style={{ background: 'rgba(255, 255, 255, 0.8)' }}>
                    <p className="text-3xl font-bold" style={{ color: '#667eea' }}>{stat.value}</p>
                    <p className="text-sm" style={{ color: '#6b7280' }}>{stat.label}</p>
                  </GlassCard>
                ))}
              </div>
            </div>
            <div className="relative">
              <GlassCard className="p-8" style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)' }}>
                <div className="rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '300px' }}>
                  <div className="p-8 flex items-center justify-center h-full min-h-[300px]">
                    <div className="text-center text-white">
                      <Activity size={80} className="mx-auto mb-4 animate-pulse" />
                      <p className="text-2xl font-semibold">Track Your Progress</p>
                      <p className="text-sm opacity-80">Beautiful analytics and insights</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-xl animate-bounce" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }} />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-xl animate-pulse" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Developer Profile Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#1f2937' }}>
              Meet the Creator
            </h2>
            <p className="text-lg" style={{ color: '#6b7280' }}>
              The creative mind behind R-Fit
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Developer Info - Left Side */}
            <div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#1f2937' }}>
                Muhammad Rajeel Siddiqui
              </h3>
              <p className="text-lg font-medium mb-6" style={{ color: '#667eea' }}>
                Web Developer
              </p>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-2" style={{ color: '#1f2937' }}>Professional Summary</h4>
                <p className="text-sm" style={{ color: '#6b7280' }}>
                  I am a dedicated Front-End Developer with a strong foundation in web technologies, including HTML, CSS, JavaScript, Bootstrap, and React.js. I have a passion for creating user-friendly interfaces and writing clean, efficient, and scalable code.
                </p>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-2" style={{ color: '#1f2937' }}>Technical Skills</h4>
                <div className="space-y-2 text-sm" style={{ color: '#6b7280' }}>
                  <p><strong style={{ color: '#1f2937' }}>Frontend:</strong> HTML, CSS, JavaScript, Bootstrap, React.js</p>
                  <p><strong style={{ color: '#1f2937' }}>Backend & Full Stack:</strong> Node, Python, Next.js, Django, MERN</p>
                  <p><strong style={{ color: '#1f2937' }}>Databases:</strong> MySQL, MongoDB</p>
                  <p><strong style={{ color: '#1f2937' }}>Libraries & UI:</strong> Zod, React-hooks-form, Shadcn, Aceternity, DaisyUI</p>
                  <p><strong style={{ color: '#1f2937' }}>Version Control & API:</strong> Git, GitHub, Postman</p>
                  <p><strong style={{ color: '#1f2937' }}>AI:</strong> GenAI, Agentic AI (Basic)</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-2" style={{ color: '#1f2937' }}>Work Experience</h4>
                <div className="space-y-3 text-sm" style={{ color: '#6b7280' }}>
                  <div>
                    <p className="font-medium" style={{ color: '#1f2937' }}>MN Enterprises</p>
                    <p>Jan 2025 – Present: Developing dynamic web pages using Laravel Blade, Next.js, and the MERN stack.</p>
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: '#1f2937' }}>Genentech Solutions</p>
                    <p>Oct – Dec 2024: Worked as a Full-Stack Developer utilizing Django and Next.js to create RESTful APIs.</p>
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: '#1f2937' }}>Hakam Techsoul</p>
                    <p>Aug – Sep 2024: Served as a React Developer building static user interfaces and enhancing UX.</p>
                  </div>
                </div>
              </div>

             

              <a 
                href="https://rajeel-dev.info/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium rounded-xl transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                Visit Portfolio
                <ArrowRight size={18} />
              </a>
            </div>

            {/* Developer Image - Right Side */}
            <div className="relative">
              <GlassCard className="p-2" style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)' }}>
                <div className="rounded-xl overflow-hidden">
                  <img 
                    src="/rajeel.jpg" 
                    alt="Muhammad Rajeel Siddiqui" 
                    className="w-full h-auto object-cover"
                    style={{ minHeight: '400px' }}
                  />
                </div>
              </GlassCard>
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 px-4 py-2 rounded-xl shadow-lg" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <p className="text-white font-semibold text-sm">Web Developer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#1f2937' }}>
              What Our Users Say
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#6b7280' }}>
              Join thousands of satisfied users who have transformed their fitness journey with R-Fit
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <GlassCard 
                key={index}
                className="p-6 hover:scale-105 transition-transform duration-300"
                style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)' }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#fbbf24" stroke="#fbbf24" />
                  ))}
                </div>
                <p className="mb-4" style={{ color: '#6b7280' }}>
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#1f2937' }}>{testimonial.name}</p>
                    <p className="text-xs" style={{ color: '#6b7280' }}>{testimonial.role}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#1f2937' }}>
              Get In Touch
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#6b7280' }}>
              Have questions? We'd love to hear from you!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-semibold mb-6" style={{ color: '#1f2937' }}>Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(102, 126, 234, 0.1)' }}>
                    <Mail size={20} style={{ color: '#667eea' }} />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: '#1f2937' }}>Email</p>
                    <p className="text-sm" style={{ color: '#6b7280' }}>support@rfit.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(102, 126, 234, 0.1)' }}>
                    <Phone size={20} style={{ color: '#667eea' }} />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: '#1f2937' }}>Phone</p>
                    <p className="text-sm" style={{ color: '#6b7280' }}>+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(102, 126, 234, 0.1)' }}>
                    <MapPin size={20} style={{ color: '#667eea' }} />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: '#1f2937' }}>Address</p>
                    <p className="text-sm" style={{ color: '#6b7280' }}>123 Fitness Street, Health City, HC 12345</p>
                  </div>
                </div>
              </div>

            
            </div>

            {/* Contact Form */}
            <GlassCard className="p-8" style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)' }}>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>Name</label>
                    <input 
                      type="text" 
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl text-gray-900 border  focus:outline-none focus:ring-2"
                      style={{ borderColor: '#e5e7eb', background: 'white' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>Email</label>
                    <input 
                      type="email" 
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-xl text-gray-900  border focus:outline-none focus:ring-2"
                      style={{ borderColor: '#e5e7eb', background: 'white' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>Subject</label>
                  <input 
                    type="text" 
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 rounded-xl text-gray-900  border focus:outline-none focus:ring-2"
                    style={{ borderColor: '#e5e7eb', background: 'white' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>Message</label>
                  <textarea 
                    placeholder="Your message..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl text-gray-900 border focus:outline-none focus:ring-2 resize-none"
                    style={{ borderColor: '#e5e7eb', background: 'white' }}
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 text-white font-medium rounded-xl transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                >
                  Send Message
                </button>
              </form>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassCard className="p-12 text-center" style={{ background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)', backdropFilter: 'blur(20px)' }}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#1f2937' }}>
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg mb-8" style={{ color: '#6b7280' }}>
              Join thousands of users who have already transformed their fitness with R-Fit
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/register')}
                className="flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-2xl transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)' }}
              >
                Get Started Free
                <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-2xl transition-all hover:scale-105 border-2"
                style={{ borderColor: '#667eea', color: '#667eea' }}
              >
                Log In
              </button>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12" style={{ background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <Zap size={22} className="text-white" />
                </div>
                <span className="text-xl font-bold" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>R-Fit</span>
              </div>
              <p className="text-sm max-w-md" style={{ color: '#6b7280' }}>
                Your complete fitness companion for tracking workouts, nutrition, and progress. 
                Join thousands of users achieving their fitness goals.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4" style={{ color: '#1f2937' }}>Quick Links</h4>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('features')} className="text-sm hover:opacity-70" style={{ color: '#6b7280' }}>Features</button></li>
                <li><button onClick={() => scrollToSection('about')} className="text-sm hover:opacity-70" style={{ color: '#6b7280' }}>About</button></li>
                <li><button onClick={() => scrollToSection('testimonials')} className="text-sm hover:opacity-70" style={{ color: '#6b7280' }}>Testimonials</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="text-sm hover:opacity-70" style={{ color: '#6b7280' }}>Contact</button></li>
              </ul>
            </div>

            {/* Auth Links */}
            <div>
              <h4 className="font-semibold mb-4" style={{ color: '#1f2937' }}>Account</h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('/login')} className="text-sm hover:opacity-70" style={{ color: '#6b7280' }}>Log In</button></li>
                <li><button onClick={() => navigate('/register')} className="text-sm hover:opacity-70" style={{ color: '#6b7280' }}>Sign Up</button></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center" style={{ borderColor: '#e5e7eb' }}>
            <p className="text-sm" style={{ color: '#9ca3af' }}>© 2024 R-Fit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
