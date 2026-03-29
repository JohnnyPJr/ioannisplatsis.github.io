import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Github, 
  Linkedin, 
  Mail, 
  Download, 
  ExternalLink, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  User,
  Smartphone,
  Globe,
  Home,
  Sparkles,
  Layers,
  Send,
  Zap,
  Loader2,
  CheckCircle2,
  Sun,
  Moon
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const getAssetUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith('http')) return path;
    // Remove leading slash to make the path relative
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return cleanPath;
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingRef.current) return;

      const sections = ["home", "expertise", "experience", "education", "projects"];
      
      // Check if we are at the top
      if (window.scrollY < 50) {
        setActiveSection("home");
        return;
      }

      // Check if we are at the bottom of the page
      const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 150;
      if (isBottom) {
        setActiveSection("projects");
        return;
      }

      const viewportCenter = window.scrollY + window.innerHeight / 3;
      let currentSection = "home";
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop - 100;
          const bottom = top + element.offsetHeight;
          if (viewportCenter >= top && viewportCenter <= bottom) {
            currentSection = section;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formspreeId = import.meta.env.VITE_FORMSPREE_ID;
    
    if (!formspreeId) {
      // Fallback to mailto if no ID is provided
      const mailtoUrl = `mailto:i.h.platsis@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      window.location.href = mailtoUrl;
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          subject,
          message,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setEmail("");
        setSubject("");
        setMessage("");
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Formspree error:", error);
      alert("Something went wrong. Please try again or email me directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-spot-primary/10 selection:text-spot-primary pb-32">
      {/* Floating Bottom Navigation */}
      <nav className="floating-nav group/nav">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-white/20 shadow-sm mr-2 hidden md:block group-hover/nav:scale-105 transition-transform duration-500">
          <img 
            src={getAssetUrl("JpJ.png")} 
            alt="Ioannis" 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://picsum.photos/seed/ios-dev/100/100";
            }}
          />
        </div>
        {[
          { id: "home", icon: <Home size={18} />, label: "Home" },
          { id: "expertise", icon: <Zap size={18} />, label: "Expertise" },
          { id: "experience", icon: <Briefcase size={18} />, label: "Work" },
          { id: "education", icon: <GraduationCap size={18} />, label: "Education" },
          { id: "projects", icon: <Layers size={18} />, label: "Projects" },
        ].map((item) => (
          <motion.a
            layout
            key={item.id}
            href={`#${item.id}`}
            className={`nav-item group relative flex items-center ${activeSection === item.id ? "active px-4 gap-2" : "px-3 gap-0"}`}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            onClick={(e) => {
              e.preventDefault();
              isScrollingRef.current = true;
              setActiveSection(item.id);
              
              const element = document.getElementById(item.id);
              if (element) {
                const offset = element.offsetTop - 100;
                window.scrollTo({ top: offset, behavior: "smooth" });
              }

              // Allow scroll spy to take over again after the smooth scroll finishes
              setTimeout(() => {
                isScrollingRef.current = false;
              }, 800);
            }}
          >
            <div className="flex-shrink-0">{item.icon}</div>
            <AnimatePresence mode="wait">
              {activeSection === item.id && (
                <motion.span 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                  className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap translate-y-2 group-hover:translate-y-0 shadow-xl">
              {item.label}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
            </span>
          </motion.a>
        ))}
        <div className="w-px h-6 bg-slate-200 mx-1"></div>
        <a 
          href="https://drive.google.com/uc?export=download&id=1dTbGwsplf2h5I2kBT1lTN15hb28tcy7m" 
          target="_blank"
          rel="noopener noreferrer"
          className="nav-item px-3 text-spot-primary hover:bg-spot-primary hover:text-white group relative transition-all duration-300 flex items-center"
        >
          <Download size={18} />
          <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap translate-y-2 group-hover:translate-y-0 shadow-xl">
            Download CV
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
          </span>
        </a>
        
        <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1"></div>
        
        <button 
          onClick={toggleTheme} 
          className="nav-item px-3 text-slate-500 dark:text-slate-400 hover:text-spot-primary group relative transition-all duration-300"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap translate-y-2 group-hover:translate-y-0 shadow-xl">
            {isDarkMode ? "Light Mode" : "Dark Mode"}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
          </span>
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-20 space-y-12">
        {/* Hero Section - Bento Style */}
        <section id="home" className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <motion.div 
            {...fadeIn}
            className="md:col-span-8 material-card p-10 md:p-16 flex flex-col justify-center space-y-8 bg-gradient-to-br from-white to-spot-light/30 dark:from-white/5 dark:to-spot-primary/5"
          >
            <div className="space-y-4">
              <h1 className="text-5xl md:text-8xl font-display font-bold text-slate-900 dark:text-white leading-[0.9] tracking-tight">
                Ioannis H <br />
                <span className="text-spot-primary">Platsis</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-light max-w-2xl leading-relaxed">
                Senior iOS Engineer with experience in multiple large scale Apps. 
                Currently building <span className="text-spot-primary font-semibold">AI automations</span>.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => {
                  const element = document.getElementById('contact');
                  if (element) {
                    const offset = element.offsetTop;
                    window.scrollTo({ top: offset, behavior: 'smooth' });
                  }
                }}
                className="bg-spot-primary text-white px-8 py-4 rounded-full font-bold hover:shadow-xl hover:shadow-spot-primary/20 transition-all flex items-center gap-2 group"
              >
                Let's talk
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              <a 
                href="https://drive.google.com/uc?export=download&id=1dTbGwsplf2h5I2kBT1lTN15hb28tcy7m"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 px-8 py-4 rounded-full font-bold hover:shadow-lg transition-all flex items-center gap-2 group border border-slate-200 dark:border-white/10"
              >
                Download CV
                <Download size={18} className="group-hover:translate-y-1 transition-transform" />
              </a>
              <div className="flex gap-2">
                <a href="https://github.com/JohnnyPJr" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:shadow-lg transition-all">
                  <Github size={22} />
                </a>
                <a href="https://www.linkedin.com/in/ioannis-h-platsis-76966969/" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:shadow-lg transition-all">
                  <Linkedin size={22} />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div 
            {...fadeIn}
            transition={{ delay: 0.2 }}
            className="md:col-span-4 flex items-center justify-center"
          >
            <div className="relative w-full max-w-[320px] aspect-square rounded-full overflow-hidden border-8 border-white dark:border-white/10 shadow-2xl group">
              <img 
                src={getAssetUrl("JpJ.png")} 
                alt="Ioannis H Platsis" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 hover:scale-100"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://picsum.photos/seed/ios-dev/400/400";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            </div>
          </motion.div>
        </section>

        {/* Bento Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Expertise Section (Replacing About Me) */}
          <motion.section 
            id="expertise" 
            {...fadeIn}
            className="md:col-span-12 space-y-8"
          >
            <div className="flex items-center gap-3 px-4 text-spot-primary">
              <Zap size={24} fill="currentColor" className="opacity-20" />
              <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Expertise</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                {
                  title: "iOS Development",
                  icon: <Smartphone className="text-spot-primary" size={24} />,
                  description: "Expert in building high-performance, native applications at scale.",
                  skills: ["Swift", "SwiftUI", "Concurrency", "Unit Testing", "Combine"]
                },
                {
                  title: "Architecture",
                  icon: <Layers className="text-purple-500" size={24} />,
                  description: "Designing modular codebases for global teams and large-scale apps.",
                  skills: ["MVVM", "Clean Architecture", "SOLID", "Design Patterns"]
                },
                {
                  title: "SDK & Frameworks",
                  icon: <Globe className="text-cyan-500" size={24} />,
                  description: "Building robust, reusable frameworks for internal and public distribution.",
                  skills: ["Modularization", "API Design", "SwiftUIFlow", "CI/CD"]
                },
                {
                  title: "AI Automations",
                  icon: <Code2 className="text-orange-500" size={24} />,
                  description: "Leveraging LLMs to build intelligent automations and enhance productivity.",
                  skills: ["LLMs", "Prompt Eng.", "Automation", "Tooling"]
                },
                {
                  title: "Tech Leadership",
                  icon: <User className="text-green-500" size={24} />,
                  description: "Experience leading iOS chapters and defining industry best practices.",
                  skills: ["Mentoring", "Code Review", "Strategy", "Hiring"]
                }
              ].map((item, i) => (
                <div key={i} className="material-card p-8 space-y-4 group flex flex-col">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm">
                    {item.icon}
                  </div>
                  <div className="space-y-2 flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {item.skills.map((skill, j) => (
                      <span key={j} className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 px-2 py-0.5 rounded-md uppercase tracking-tight shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Experience Section (Timeline) */}
          <motion.section 
            id="experience" 
            {...fadeIn}
            className="md:col-span-12 space-y-12"
          >
            <div className="flex items-center gap-3 px-4">
              <Briefcase className="text-spot-primary" size={24} />
              <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Experience</h2>
            </div>
            
            <div className="relative ml-4 md:ml-8 border-l-2 border-slate-200 dark:border-white/10 pl-8 space-y-12">
              {[
                {
                  role: "Senior iOS Engineer",
                  company: "MORO TECH",
                  period: "2022 - Present",
                  logo: "/moro-logo.png",
                  description: "Helped establish the iOS chapter and leading the delivery of key features."
                },
                {
                  role: "Senior iOS Engineer - iOS Tech Lead",
                  company: "VODAFONE",
                  period: "2020 - 2022",
                  logo: "/vodafone-logo.jpg",
                  description: "Stepped into a leadership role, owning the codebase, implementation, and delivery of the MY CU app."
                },
                {
                  role: "Senior iOS Engineer",
                  company: "Advantage FSE",
                  period: "2018 - 2020",
                  logo: "/advantage-logo.png",
                  description: "Focused on building secure, high-stakes mobile banking solutions."
                },
                {
                  role: "iOS Engineer",
                  company: "INTRASOFT International",
                  period: "2017 - 2018",
                  logo: "/intrasoft-logo.png",
                  description: "Delivered robust enterprise-grade iOS apps for large-scale clients."
                },
                {
                  role: "iOS Engineer",
                  company: "Advantage FSE",
                  period: "2015 - 2017",
                  logo: "/advantage-logo.png",
                  description: "My first break into professional development, where it all started."
                }
              ].map((exp, i) => (
                <div key={i} className="relative group flex items-start gap-6">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[41px] top-1.5 w-4 h-4 rounded-full border-4 border-surface bg-spot-primary group-hover:scale-125 transition-transform duration-300 shadow-sm z-10" />
                  
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/5 shadow-sm border border-slate-100 dark:border-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden group-hover:shadow-md transition-shadow">
                    <img 
                      src={getAssetUrl(exp.logo)} 
                      alt={exp.company} 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${exp.company}/100/100`;
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-spot-primary uppercase tracking-wider">
                      {exp.period}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-spot-primary transition-colors">
                      {exp.role}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">{exp.company}</p>
                    <p className="text-slate-400 dark:text-slate-500 text-sm pt-1">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Education Section */}
          <motion.section 
            id="education" 
            {...fadeIn}
            className="md:col-span-12 space-y-8"
          >
            <div className="flex items-center gap-3 px-4">
              <GraduationCap className="text-spot-primary" size={24} />
              <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Education</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  degree: "MSc in Mobile Applications Design",
                  school: "University of Kent, UK",
                  details: "School of Engineering",
                  logo: "/uok-logo.png"
                },
                {
                  degree: "BSc in Informatics and Telecommunications",
                  school: "National and Kapodistrian University of Athens",
                  details: "Department of Informatics and Telecommunications",
                  logo: "/ekpa-logo.jpg"
                }
              ].map((edu, i) => (
                <div key={i} className="material-card p-8 flex gap-6 group">
                  <div className={`w-20 h-20 rounded-2xl bg-white ${edu.school.includes("Kent") ? "dark:bg-white" : "dark:bg-white/5"} shadow-sm border border-slate-100 dark:border-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden group-hover:shadow-md transition-shadow`}>
                    <img 
                      src={getAssetUrl(edu.logo)} 
                      alt={edu.school} 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${edu.school}/100/100`;
                      }}
                    />
                  </div>
                  <div className="space-y-4 flex-1">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-spot-primary transition-colors">
                        {edu.degree}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 font-medium">{edu.school}</p>
                    </div>
                    <p className="text-slate-400 dark:text-slate-500 text-sm italic">{edu.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Projects Bento */}
          <motion.section 
            id="projects" 
            {...fadeIn}
            className="md:col-span-12 space-y-8"
          >
            <div className="flex items-center gap-3 px-4">
              <Layers className="text-spot-primary" size={24} />
              <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Featured Work</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "SwiftUIFlow",
                  tags: ["SDK Design", "SwiftUI", "Open Source"],
                  description: "A robust, reusable framework for modular app integration and navigation in SwiftUI. Available on GitHub.",
                  image: "/swiftui-flow.png",
                  link: "https://github.com/JohnnyPJr/SwiftUIFlow"
                },
                {
                  title: "My CU (Vodafone)",
                  tags: ["RxSwift", "Scale", "160K+ Users"],
                  description: "Lead developer for the My CU app, responsible for code design, architecture, and high-performance features.",
                  image: "/my-cu.png",
                  link: "https://apps.apple.com/gr/app/my-cu/id940514074?l=el"
                },
                {
                  title: "My Toyota",
                  tags: ["SwiftUI", "EV Charging", "IoT"],
                  description: "Contributed to the project architecture and features for Toyota's public EV charging infrastructure.",
                  image: "/my-toyota.png",
                  link: "https://apps.apple.com/gr/app/mytoyota/id1617623127"
                }
              ].map((project, i) => (
                <a 
                  key={i} 
                  href={project.link || "#"} 
                  target={project.link ? "_blank" : undefined}
                  rel={project.link ? "noopener noreferrer" : undefined}
                  className="material-card overflow-hidden group cursor-pointer flex flex-col"
                >
                  <div className="aspect-[16/10] overflow-hidden relative bg-white dark:bg-white/5 flex items-center justify-center">
                    <img 
                      src={getAssetUrl(project.image)} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    {project.link && (
                      <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-slate-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                        <ExternalLink size={18} />
                      </div>
                    )}
                  </div>
                  <div className="p-8 space-y-4 flex-1">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, j) => (
                        <span key={j} className="text-[10px] font-bold text-spot-primary bg-spot-light dark:bg-spot-primary/10 px-2 py-1 rounded-md uppercase tracking-wider">{tag}</span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white group-hover:text-spot-primary transition-colors">{project.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{project.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Footer */}
        <footer id="contact" className="pt-24 pb-12 text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-display font-bold text-slate-900 dark:text-white">Let's build something great.</h2>
            <p className="text-slate-500 dark:text-slate-400">Currently based in Athens, Greece. Open to remote opportunities.</p>
          </div>

          <motion.div 
            {...fadeIn}
            className="max-w-2xl mx-auto material-card p-8 md:p-12 space-y-8"
          >
            <form onSubmit={handleSendEmail} className="space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-spot-primary focus:ring-1 focus:ring-spot-primary outline-none transition-all font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Subject</label>
                  <input 
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-spot-primary focus:ring-1 focus:ring-spot-primary outline-none transition-all font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Message</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me about your project..."
                  rows={4}
                  className="w-full p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-spot-primary focus:ring-1 focus:ring-spot-primary outline-none transition-all resize-none font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={isSubmitting || isSuccess}
                className={`w-full py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 group shadow-lg ${
                  isSuccess 
                    ? "bg-green-500 text-white shadow-green-200" 
                    : "bg-spot-primary text-white shadow-spot-primary/20 hover:shadow-spot-primary/40"
                } disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? (
                  <>
                    Sending...
                    <Loader2 size={20} className="animate-spin" />
                  </>
                ) : isSuccess ? (
                  <>
                    Message Sent!
                    <CheckCircle2 size={20} />
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          <p className="text-slate-400 dark:text-slate-500 text-sm font-medium pt-12">
            © {new Date().getFullYear()} Ioannis H Platsis. Crafted with care.
          </p>
        </footer>
      </main>
    </div>
  );
}
