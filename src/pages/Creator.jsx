import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Code, 
  Database, 
  Palette, 
  GitBranch, 
  Briefcase, 
  GraduationCap,
  ExternalLink,
  Cpu
} from 'lucide-react';

const Creator = () => {
  const { theme } = useTheme();

  const profileData = {
    name: "Muhammad Rajeel Siddiqui",
    title: "Web Developer",
    summary: "I am a dedicated Front-End Developer with a strong foundation in web technologies, including HTML, CSS, JavaScript, Bootstrap, and React.js. I have a passion for creating user-friendly interfaces and writing clean, efficient, and scalable code.",
    skills: {
      frontend: ["HTML", "CSS", "JavaScript", "Bootstrap", "React.js"],
      backend: ["Node", "Python", "Next.js", "Django", "MERN"],
      databases: ["MySQL", "MongoDB"],
      libraries: ["Zod", "React-hooks-form", "Shadcn", "Aceternity", "DaisyUI"],
      tools: ["Git", "GitHub", "Postman"],
      ai: ["GenAI", "Agentic AI (Basic)"]
    },
    workExperience: [
      {
        company: "MN Enterprises",
        period: "Jan 2025 – Present",
        role: "Full-Stack Developer",
        description: "Developing dynamic web pages using Laravel Blade, Next.js, and the MERN stack."
      },
      {
        company: "Genentech Solutions",
        period: "Oct – Dec 2024",
        role: "Full-Stack Developer",
        description: "Worked as a Full-Stack Developer utilizing Django and Next.js to create RESTful APIs."
      },
      {
        company: "Hakam Techsoul",
        period: "Aug – Sep 2024",
        role: "React Developer",
        description: "Served as a React Developer building static user interfaces and enhancing UX."
      }
    ],
    education: [
      {
        degree: "Diploma in Web Development",
        school: "Aptech",
        status: "In progress"
      },
      {
        degree: "Agentic AI Course",
        school: "PIAIC",
        status: "Currently enrolled"
      },
      {
        degree: "Intermediate (ICS)",
        school: "Completed first year",
        status: "Completed"
      },
      {
        degree: "Hifz-ul-Quran",
        school: "Completed",
        status: "Completed in 2021"
      }
    ],
    portfolio: "https://rajeel-dev.info/"
  };

  const getIconForCategory = (category) => {
    switch (category) {
      case 'frontend': return Palette;
      case 'backend': return Code;
      case 'databases': return Database;
      case 'tools': return GitBranch;
      case 'ai': return Cpu;
      default: return Code;
    }
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-6 md:mb-8 animate-fade-in-up">
        <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-2">
          Creator Overview
        </h1>
        <p className="text-sm md:text-base" style={{ color: 'var(--theme-textSecondary)' }}>
          Portfolio and professional profile
        </p>
      </div>

      {/* Main Content Grid - Dashboard Style */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Name & Title Card */}
          <div 
            className="rounded-2xl p-6"
            style={{ 
              background: 'var(--theme-card)',
              border: '1px solid var(--theme-cardBorder)',
              boxShadow: 'var(--theme-shadow)'
            }}
          >
            <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-2">
              {profileData.name}
            </h2>
            <p className="text-lg" style={{ color: 'var(--theme-primary)' }}>
              {profileData.title}
            </p>
          </div>

          {/* Professional Summary */}
          <div 
            className="rounded-2xl p-6"
            style={{ 
              background: 'var(--theme-card)',
              border: '1px solid var(--theme-cardBorder)',
              boxShadow: 'var(--theme-shadow)'
            }}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--theme-text)' }}>
              <Briefcase size={20} style={{ color: 'var(--theme-primary)' }} />
              Professional Summary
            </h3>
            <p className="leading-relaxed" style={{ color: 'var(--theme-textSecondary)' }}>
              {profileData.summary}
            </p>
          </div>

          {/* Technical Skills */}
          <div 
            className="rounded-2xl p-6"
            style={{ 
              background: 'var(--theme-card)',
              border: '1px solid var(--theme-cardBorder)',
              boxShadow: 'var(--theme-shadow)'
            }}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--theme-text)' }}>
              <Code size={20} style={{ color: 'var(--theme-primary)' }} />
              Technical Skills
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(profileData.skills).map(([category, skills]) => {
                const Icon = getIconForCategory(category);
                return (
                  <div 
                    key={category}
                    className="p-4 rounded-xl"
                    style={{ 
                      background: 'var(--theme-bgSecondary)',
                      border: '1px solid var(--theme-cardBorder)'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Icon size={18} style={{ color: 'var(--theme-primary)' }} />
                      <span className="font-medium capitalize" style={{ color: 'var(--theme-text)' }}>
                        {category === 'frontend' ? 'Frontend' : 
                         category === 'backend' ? 'Backend & Full Stack' :
                         category === 'databases' ? 'Databases' :
                         category === 'tools' ? 'Version Control & API' :
                         category === 'ai' ? 'AI' : category}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 text-sm rounded-full"
                          style={{ 
                            background: 'var(--theme-primaryLight)',
                            color: 'var(--theme-primary)'
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Work Experience */}
          <div 
            className="rounded-2xl p-6"
            style={{ 
              background: 'var(--theme-card)',
              border: '1px solid var(--theme-cardBorder)',
              boxShadow: 'var(--theme-shadow)'
            }}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--theme-text)' }}>
              <Briefcase size={20} style={{ color: 'var(--theme-primary)' }} />
              Work Experience
            </h3>
            
            <div className="space-y-4">
              {profileData.workExperience.map((job, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-xl"
                  style={{ 
                    background: 'var(--theme-bgSecondary)',
                    border: '1px solid var(--theme-cardBorder)'
                  }}
                >
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                    <div>
                      <h4 className="font-semibold" style={{ color: 'var(--theme-text)' }}>
                        {job.company}
                      </h4>
                      <p className="text-sm" style={{ color: 'var(--theme-primary)' }}>
                        {job.role}
                      </p>
                    </div>
                    <span 
                      className="px-3 py-1 text-xs rounded-full"
                      style={{ 
                        background: 'var(--theme-accentLight)',
                        color: 'var(--theme-accent)'
                      }}
                    >
                      {job.period}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--theme-textSecondary)' }}>
                    {job.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Certifications */}
          {/* <div 
            className="rounded-2xl p-6"
            style={{ 
              background: 'var(--theme-card)',
              border: '1px solid var(--theme-cardBorder)',
              boxShadow: 'var(--theme-shadow)'
            }}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--theme-text)' }}>
              <GraduationCap size={20} style={{ color: 'var(--theme-primary)' }} />
              Education & Certifications
            </h3>
            
            <div className="space-y-3">
              {profileData.education.map((edu, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ 
                    background: 'var(--theme-bgSecondary)',
                    border: '1px solid var(--theme-cardBorder)'
                  }}
                >
                  <div>
                    <h4 className="font-medium" style={{ color: 'var(--theme-text)' }}>
                      {edu.degree}
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--theme-textSecondary)' }}>
                      {edu.school}
                    </p>
                  </div>
                  <span 
                    className={`px-3 py-1 text-xs rounded-full ${
                      edu.status === 'In progress' || edu.status === 'Currently enrolled' 
                        ? 'bg-yellow-500/20 text-yellow-500' 
                        : 'bg-green-500/20 text-green-500'
                    }`}
                    style={{ 
                      background: edu.status === 'In progress' || edu.status === 'Currently enrolled' 
                        ? 'rgba(234, 179, 8, 0.2)' 
                        : 'rgba(16, 185, 129, 0.2)',
                      color: edu.status === 'In progress' || edu.status === 'Currently enrolled' 
                        ? '#eab308' 
                        : '#10b981'
                    }}
                  >
                    {edu.status}
                  </span>
                </div>
              ))}
            </div>
          </div> */}

          {/* Portfolio Link */}
          <a 
            href={profileData.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div 
              className="rounded-2xl p-6 flex items-center justify-between group cursor-pointer transition-all duration-300 hover:scale-[1.02]"
              style={{ 
                background: theme.gradient,
                boxShadow: 'var(--theme-glow)'
              }}
            >
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  View Full Portfolio
                </h3>
                <p className="text-white/80 text-sm">
                  {profileData.portfolio}
                </p>
              </div>
              <ExternalLink className="text-white group-hover:translate-x-1 transition-transform" size={24} />
            </div>
          </a>
        </div>

        {/* Right Column - Profile Image */}
        <div className="lg:col-span-1">
          <div 
            className="rounded-2xl p-6 lg:sticky lg:top-24"
            style={{ 
              background: 'var(--theme-card)',
              border: '1px solid var(--theme-cardBorder)',
              boxShadow: 'var(--theme-shadow)'
            }}
          >
            <div className="relative overflow-hidden rounded-2xl">
              <img 
                src="/rajeel.jpg" 
                alt={profileData.name}
                className="w-full h-auto object-cover"
                style={{ 
                  aspectRatio: '3/4',
                  maxHeight: '500px'
                }}
              />
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, var(--theme-card) 0%, transparent 50%)'
                }}
              />
            </div>
            
            <div className="mt-4 text-center">
              <h3 className="font-semibold text-lg" style={{ color: 'var(--theme-text)' }}>
                {profileData.name}
              </h3>
              <p className="text-sm" style={{ color: 'var(--theme-textSecondary)' }}>
                {profileData.title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Creator;
