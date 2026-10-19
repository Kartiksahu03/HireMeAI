import { useEffect, useState } from "react";
import {
  Apple, Battery, Wifi, Search, Github, Linkedin, Mail, ExternalLink, FileUp, PlayCircle,
  Folder, FileText, Sparkles, X, ArrowUpRight, Code2, Send, Bot, UserRound,
  ChevronRight, Clock3, Download, PanelsTopLeft, Globe, Image as ImageIcon,
  CircleHelp, Maximize2, Minimize2
} from "lucide-react";

type WindowName = "about" | "projects" | "resume" | "ask" | "contact" | "jd";
type ChatMessage = { role: "user" | "assistant"; content: string };

const links = {
  github: "https://github.com/Kartiksahu03",
  linkedin: "https://linkedin.com/in/kartik-sahu03",
  email: "kartik.sahu3311@gmail.com",
  profilePhoto: "https://avatars.githubusercontent.com/u/194357611?v=4"
};
const projects = [
  { name: "FrHelp", type: "EdTech platform", description: "A MERN-based learning platform with course enrollment, role-based experiences, payments, and a Groq-powered support assistant.", stack: ["React", "Node.js", "MongoDB", "Groq"], icon: "🤝", color: "lavender", href: "https://frhelp-frontend.vercel.app/", video: "/videos/frhelp-demo.mp4" },
  { name: "Paisa", type: "Personal finance", description: "Expense tracker for logging spending, reviewing financial trends, and exploring AI-supported insights.", stack: ["React", "Redux", "Groq", "MERN"], icon: "₹", color: "mint", href: "https://paisa-expense-tracker.vercel.app/", video: "/videos/paisa-demo.mp4" },
  { name: "AI Chatbot Portfolio", type: "Portfolio & AI assistant", description: "The deployed portfolio experience with a desktop-inspired interface and an assistant for portfolio questions.", stack: ["React", "TypeScript", "RAG", "Groq"], icon: "✦", color: "peach", href: "https://kartik-s-portfolio-tau.vercel.app/" },
  { name: "GitHub Profile Finder", type: "API-powered utility", description: "Search GitHub users and inspect public profile details using the GitHub REST API.", stack: ["HTML", "CSS", "JavaScript", "REST API"], icon: "⌘", color: "lavender", href: "https://github-profile-finder25.netlify.app/" },
  { name: "Shopping Cart", type: "Frontend application", description: "Responsive shopping cart demonstrating product state and cart interactions.", stack: ["React", "Redux Toolkit", "Tailwind"], icon: "🛍", color: "mint", href: "https://kartik-cart.netlify.app/" },
  { name: "Random GIF Finder", type: "API-powered utility", description: "Generate random GIFs and search by tags using the Giphy API.", stack: ["React", "Giphy API", "Hooks"], icon: "🎞", color: "peach", href: "https://random-gif1.netlify.app/" },
  { name: "React Router Demo", type: "Routing & auth", description: "A React authentication and navigation demo with protected routes and responsive forms.", stack: ["React", "React Router", "CSS"], icon: "↪", color: "lavender", href: "https://react-router25.netlify.app/" }
];
const suggestions = ["Tell me about Kartik", "What projects are listed?", "What technologies does he use?"];

function WindowFrame({ title, icon, onClose, children, className = "" }: { title: string; icon?: React.ReactNode; onClose: () => void; children: React.ReactNode; className?: string }) {
  return <section className={`window ${className}`}>
    <header className="window-bar">
      <div className="traffic">
        <button className="dot red" aria-label="Close window" onClick={onClose}><X size={11}/></button>
        <span className="dot yellow"/><span className="dot green"/>
      </div>
      <div className="window-title">{icon}{title}</div>
      <span className="window-spacer"/>
    </header>
    {children}
  </section>;
}

export default function App() {
  const [active, setActive] = useState<WindowName>("about");
  const [openWindows, setOpenWindows] = useState<WindowName[]>(["about"]);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: "Hey! 👋 I’m Kartik’s portfolio assistant. Ask about the information available here. I’ll be clear when a detail or link hasn’t been verified." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  const [now, setNow] = useState(new Date());
  const [maximized, setMaximized] = useState(false);\n  const [chatEnd, setChatEnd] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const open = (name: WindowName) => {
    setActive(name);
    setOpenWindows((prev) => prev.includes(name) ? prev : [...prev, name]);
  };
  const close = (name: WindowName) => {
    const next = openWindows.filter((item) => item !== name);
    setOpenWindows(next);
    if (active === name) setActive(next[next.length - 1] || "about");
  };
  const ask = async (question = input) => {
    const trimmed = question.trim();
    if (!trimmed || loading) return;
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setChatError("");
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `Assistant request failed (${response.status}).`);
      if (typeof data.answer !== "string" || !data.answer.trim()) throw new Error("The assistant returned an empty answer. Please try again.");
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not reach the portfolio assistant.";
      setChatError(message);
      setMessages((prev) => [...prev, { role: "assistant", content: `Sorry — I couldn't answer that right now. ${message} Check that the backend is running and GROQ_API_KEY is set in your root .env file.` }]);
    } finally {
      setLoading(false);
    }
  };

  const openVideo = (project: typeof projects[number]) => { if ("video" in project && project.video) window.open(project.video, "_blank", "noopener,noreferrer"); };\n  const openResume = () => window.open("/files/resume.pdf", "_blank", "noopener,noreferrer");
  const downloadResume = () => {
    const anchor = document.createElement("a");
    anchor.href = "/files/resume.pdf";
    anchor.download = "Kartik-Sahu-Resume.pdf";
    anchor.click();
  };
  const openProject = (project: typeof projects[number]) => {
    if (project.href) window.open(project.href, "_blank", "noopener,noreferrer");
    else {
      open("projects");
      setChatError(`A verified live demo URL for ${project.name} has not been added yet. Add it in frontend/src/App.tsx before publishing.`);
    }
  };

  const renderWindow = (name: WindowName) => {
    if (name === "about") return <WindowFrame title="Welcome" icon={<PanelsTopLeft size={17}/>} onClose={() => close(name)} className="welcome-window">
      <div className="welcome-content">
        <div className="eyebrow"><span className="status-dot"/> PORTFOLIO · OPEN TO OPPORTUNITIES</div>
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="hello">Hey there, I'm</p>
            <h1>Kartik<br/><span>Sahu.</span></h1>
            <p className="hero-role">Developer building useful digital experiences.</p>
            <p className="muted">I enjoy turning ideas into practical web products and exploring AI-powered applications.</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => open("projects")}>Explore projects <ArrowUpRight size={17}/></button>
              <button className="text-button" onClick={() => open("ask")}><Sparkles size={17}/> Ask my AI</button>
            </div>
            <div className="social-links">
              <a href={links.github} target="_blank" rel="noreferrer"><Github size={17}/> GitHub <ExternalLink size={13}/></a>
              <a href={links.linkedin} target="_blank" rel="noreferrer"><Linkedin size={17}/> LinkedIn <ExternalLink size={13}/></a>
              {links.email && <a href={`mailto:${links.email}`}><Mail size={17}/> Email</a>}
            </div>
          </div>
          <div className="profile-art" aria-label="Kartik Sahu developer profile illustration">
            <div className="profile-rings"/><div className="profile-rings profile-rings-two"/>
            <img className="profile-photo" src={links.profilePhoto} alt="Kartik Sahu profile" loading="eager" referrerPolicy="no-referrer" />
            <span className="art-tag tag-code"><Code2 size={16}/> CODE</span>
            <span className="art-tag tag-ai"><Sparkles size={16}/> AI</span>
            <span className="art-tag tag-web"><Globe size={16}/> WEB</span>
            <div className="profile-caption"><span>BUILDER</span><span>CURIOUS BY DEFAULT</span></div>
          </div>
        </div>
        <div className="stats-row"><div><strong>Full-stack</strong><span>Product development</span></div><div><strong>AI + Web</strong><span>Areas of interest</span></div><div><strong>Always</strong><span>Learning by building</span></div></div>
      </div>
    </WindowFrame>;

    if (name === "projects") return <WindowFrame title="Projects" icon={<Folder size={17}/>} onClose={() => close(name)} className="content-window">
      <div className="section-heading"><div><span className="eyebrow">SELECTED WORK</span><h2>Projects & experiments<span className="accent">.</span></h2></div><span className="count-pill">{String(projects.length).padStart(2,"0")} PROJECTS</span></div>
      <div className="project-list">{projects.map((project, i) => <article className="project-card" key={project.name}>
        <div className={`project-icon ${project.color}`}>{project.icon}</div>
        <div className="project-main"><div className="project-kicker">0{i + 1} / {project.type}</div><h3>{project.name}</h3><p>{project.description}</p><div className="chips">{project.stack.map((tech) => <span key={tech}>{tech}</span>)}</div></div>
        <span className="round-link" aria-hidden="true"><ExternalLink size={17}/></span>
      </a>)}</div>
      <p className="footnote">Each project opens its verified live deployment in a new tab.</p>
    </WindowFrame>;

    if (name === "jd") return <WindowFrame title="Job Description Match" icon={<FileUp size={17}/>} onClose={() => close(name)} className="content-window jd-window"><div className="section-heading"><div><span className="eyebrow">RESUME-TO-ROLE ANALYSIS</span><h2>Check the fit<span className="accent">.</span></h2></div><span className="count-pill">JD MATCH</span></div><JDMatcher /></WindowFrame>;\n\n    if (name === "resume") return <WindowFrame title="Resume.pdf" icon={<FileText size={17}/>} onClose={() => close(name)} className="content-window resume-window">
      <div className="resume-toolbar"><span><FileText size={16}/> Kartik-Sahu-Resume.pdf</span><div className="resume-actions"><button className="small-action" onClick={openResume}><ExternalLink size={15}/> Open in new tab</button><button className="small-action accent-action" onClick={downloadResume}><Download size={15}/> Download PDF</button></div></div>
      <div className="resume-empty"><FileText size={38}/><h2>Your resume PDF goes here</h2><p>Place your verified resume in <code>frontend/public/files/resume.pdf</code>. The Resume shortcut will then open this PDF in a new browser tab and enable downloads.</p></div>
    </WindowFrame>;

    if (name === "ask") return <WindowFrame title="Ask Me — AI Assistant" icon={<Sparkles size={17}/>} onClose={() => close(name)} className="content-window chat-window">
      <div className="chat-intro"><div className="bot-avatar"><Bot size={23}/></div><div><strong>Portfolio Intelligence</strong><p><span className="status-dot"/> Grounded answers · Groq + retrieval</p></div><button className="jd-shortcut" onClick={() => open("jd")}><FileUp size={15}/> Match a JD</button><span className="count-pill">AI</span></div>
      <div className="chat-messages">{messages.map((message, i) => <div className={`chat-message ${message.role}`} key={i}><div className="message-avatar">{message.role === "assistant" ? <Sparkles size={16}/> : <UserRound size={16}/>}</div><div className="message-bubble">{message.content}</div></div>)}{loading && <div className="chat-message assistant"><div className="message-avatar"><Sparkles size={16}/></div><div className="message-bubble typing"><span/><span/><span/></div></div>}<div ref={setChatEnd}/></div>
      {messages.length < 3 && <div className="suggestions">{suggestions.map((suggestion) => <button key={suggestion} disabled={loading} onClick={() => void ask(suggestion)}>{suggestion}<ChevronRight size={15}/></button>)}</div>}
      {chatError && <p className="chat-error" role="status">{chatError}</p>}
      <form className="chat-form" onSubmit={(event) => { event.preventDefault(); void ask(); }}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about skills, projects, experience…" aria-label="Ask the portfolio assistant"/><button type="submit" disabled={loading || !input.trim()} aria-label="Send message"><Send size={18}/></button></form>
      <p className="chat-disclaimer">Answers use portfolio context. Unknown details are called out, not guessed.</p>
    </WindowFrame>;

    return <WindowFrame title="Contact" icon={<Mail size={17}/>} onClose={() => close(name)} className="content-window">
      <div className="contact-content"><div className="contact-orb"><Mail size={30}/></div><span className="eyebrow">LET'S CONNECT</span><h2>Let's make something<br/>meaningful<span className="accent">.</span></h2><p className="muted">Have a project, opportunity, or interesting problem? Find me through these profiles.</p><div className="contact-links">
        <a href={links.github} target="_blank" rel="noreferrer"><Github size={18}/> GitHub <ArrowUpRight size={15}/></a>
        <a href={links.linkedin} target="_blank" rel="noreferrer"><Linkedin size={18}/> LinkedIn <ArrowUpRight size={15}/></a>
        {links.email ? <a href={`mailto:${links.email}`}><Mail size={18}/> Email <ArrowUpRight size={15}/></a> : <span className="missing-link">Add your email to enable email contact</span>}
      </div></div>
    </WindowFrame>;
  };

  const timeLabel = now.toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", second: "2-digit" });

  return <main className="desktop">
    <div className="wallpaper-glow glow-a"/><div className="wallpaper-glow glow-b"/><div className="wallpaper-grid"/>
    <header className="menubar">
      <div className="menu-left"><Apple size={20} fill="currentColor"/><strong>Kartik Sahu</strong><span className="menu-divider"/><button onClick={() => open("about")}>Portfolio</button><button onClick={() => open("projects")}>Window</button><button onClick={() => open("contact")}>Help</button></div>
      <div className="menu-right"><span className="menu-status" title="Wi-Fi"><Wifi size={19}/></span><button className="icon-menu" onClick={() => open("projects")} aria-label="Open project list"><Search size={18}/></button><span className="menu-status"><Battery size={19}/></span><span className="clock" title="Local time"><Clock3 size={15}/>{timeLabel}</span></div>
    </header>

    <aside className="desktop-shortcuts" aria-label="Desktop shortcuts">
      {projects.filter((project) => project.name === "FrHelp" || project.name === "Paisa").map((project) => <div className="desktop-project-shortcut" key={project.name}><button className="desktop-project-launch" onClick={() => openProject(project)} title={`Open live ${project.name} project`}><span className={`desktop-file project-desktop-file ${project.color}`}>{project.icon}</span><strong>{project.name}</strong><span className="desktop-project-subtitle">Open live app ↗</span></button>{"video" in project && project.video && <button className="desktop-video-button" onClick={() => openVideo(project)}><PlayCircle size={14}/> Watch walkthrough</button>}</div>)}
    </aside>
    <div className={`window-stage ${maximized ? "maximized" : ""}`}>
      {openWindows.map((name) => <div key={name} className={`window-layer ${active === name ? "front" : "back"}`} onMouseDown={() => setActive(name)}>{renderWindow(name)}</div>)}
      {active && <div className="window-controls"><button title="Minimize active window" aria-label="Minimize active window" onClick={() => close(active)}><Minimize2 size={15}/></button><button title="Toggle window size" aria-label="Toggle window size" onClick={() => setMaximized((value) => !value)}><Maximize2 size={15}/></button></div>}
    </div>
    <div className="desktop-hint"><span className="status-dot"/> Select an app to explore</div>
    <nav className="dock" aria-label="macOS dock">
      <button className="dock-app" onClick={() => open("about")} aria-label="Home" title="Home"><span className="dock-icon home-icon"><PanelsTopLeft size={29}/></span><span className="dock-label">Home</span></button>
      <button className="dock-app" onClick={() => open("projects")} aria-label="Projects" title="Projects"><span className="dock-icon projects-icon"><Folder size={29}/></span><span className="dock-label">Projects</span></button>
      <button className="dock-app" onClick={openResume} aria-label="Resume" title="Resume opens in a new tab"><span className="dock-icon resume-icon"><FileText size={29}/></span><span className="dock-label">Resume</span></button>
      <button className="dock-app ask-dock-app" onClick={() => open("ask")} aria-label="Ask Me AI" title="Ask Me AI"><span className="dock-icon ask-icon"><Sparkles size={29}/></span><span className="dock-label">Ask Me</span></button><button className="dock-app jd-dock-app" onClick={() => open("jd")} aria-label="Job Description Match" title="Upload and match a job description"><span className="dock-icon jd-icon"><FileUp size={27}/></span><span className="dock-label">JD Match</span></button>
      <button className="dock-app" onClick={() => open("contact")} aria-label="Contact" title="Contact"><span className="dock-icon contact-icon"><Mail size={29}/></span><span className="dock-label">Contact</span></button>
      <button className="dock-app" onClick={() => window.open(links.github, "_blank", "noopener,noreferrer")} aria-label="GitHub profile" title="GitHub profile"><span className="dock-icon menu-icon"><Github size={29}/></span><span className="dock-label">GitHub</span></button>
    </nav>
    <div className="mobile-nav"><span className="mobile-brand"><Sparkles size={18}/> HireMeAI</span><button onClick={() => open("projects")}>Projects</button><button onClick={() => open("ask")}>Ask AI</button><button onClick={() => open("contact")}>Contact</button></div>
  </main>;
}
