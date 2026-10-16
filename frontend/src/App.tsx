import { useState } from "react";
import {
  Apple, Battery, Wifi, Search, Github, Linkedin, Mail, ExternalLink,
  Folder, FileText, Terminal, MessageCircle, Sparkles, X, Minus, Maximize2,
  ArrowUpRight, Code2, Send, Bot, UserRound, ChevronRight, BriefcaseBusiness,
  Clock3, Command, Download, Globe, PanelsTopLeft
} from "lucide-react";

type WindowName = "about" | "projects" | "resume" | "ask" | "contact";
type ChatMessage = { role: "user" | "assistant"; content: string };

const projects = [
  { name: "FrHelp", type: "Full-stack web app", description: "A community-focused platform concept built to make asking for and offering help feel simple.", stack: ["React", "Node.js", "MongoDB"], icon: "🤝", color: "lavender" },
  { name: "Paisa", type: "Personal finance", description: "A finance project concept focused on making everyday money tracking easier to understand.", stack: ["JavaScript", "React", "API"], icon: "✳", color: "mint" },
  { name: "AI Chatbot Portfolio", type: "Generative AI", description: "An AI assistant experience that makes portfolio information explorable through natural language.", stack: ["RAG", "Groq", "TypeScript"], icon: "✦", color: "peach" }
];

const suggestions = ["What does Kartik build?", "Tell me about his projects", "What tech does he use?"];

function WindowFrame({ title, icon, onClose, children, className = "" }: { title: string; icon?: React.ReactNode; onClose: () => void; children: React.ReactNode; className?: string }) {
  return <section className={`window ${className}`}>
    <header className="window-bar">
      <div className="traffic"><button className="dot red" aria-label="Close window" onClick={onClose}><X size={9}/></button><span className="dot yellow"/><span className="dot green"/></div>
      <div className="window-title">{icon}{title}</div><span className="window-spacer"/>
    </header>{children}
  </section>;
}

export default function App() {
  const [active, setActive] = useState<WindowName>("about");
  const [openWindows, setOpenWindows] = useState<WindowName[]>(["about"]);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: "Hey! 👋 I’m Kartik’s portfolio assistant. Ask me about his projects, skills, or development approach. I’ll stick to the information available in this portfolio." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const open = (name: WindowName) => {
    setActive(name);
    setOpenWindows((prev) => prev.includes(name) ? prev : [...prev, name]);
    setMobileMenu(false);
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
    setLoading(true);
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: trimmed }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The assistant is unavailable right now.");
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: error instanceof Error ? error.message : "Could not reach the assistant. Check that the backend and Groq API key are configured." }]);
    } finally { setLoading(false); }
  };

  const renderWindow = (name: WindowName) => {
    if (name === "about") return <WindowFrame title="Welcome" icon={<PanelsTopLeft size={14}/>} onClose={() => close(name)} className="welcome-window">
      <div className="welcome-content">
        <div className="eyebrow"><span className="status-dot"/> AVAILABLE FOR OPPORTUNITIES</div>
        <div className="hero-grid"><div><p className="hello">Hey there, I'm</p><h1>Kartik<br/><span>Sahu.</span></h1><p className="hero-role">Developer building thoughtful digital experiences.</p><p className="muted">I like turning complex ideas into useful products — from full-stack apps to AI-powered experiences.</p><div className="hero-actions"><button className="primary-button" onClick={() => open("projects")}>Explore my work <ArrowUpRight size={16}/></button><button className="text-button" onClick={() => open("ask")}><Sparkles size={15}/> Ask my AI</button></div></div>
          <div className="avatar-card"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="avatar-core"><Code2 size={47}/></div><span className="float-tag tag-ts">TS</span><span className="float-tag tag-ai">✦ AI</span><span className="float-tag tag-react">⚛</span><div className="avatar-caption"><span>01 / BUILDER</span><span>Curious by default</span></div></div></div>
        <div className="stats-row"><div><strong>01</strong><span>Curious mind</span></div><div><strong>∞</strong><span>Things to learn</span></div><div><strong>AI + Web</strong><span>Areas I explore</span></div></div>
      </div>
    </WindowFrame>;
    if (name === "projects") return <WindowFrame title="Projects" icon={<Folder size={14}/>} onClose={() => close(name)} className="content-window">
      <div className="section-heading"><div><span className="eyebrow">SELECTED WORK</span><h2>Things I've been building<span className="accent">.</span></h2></div><span className="count-pill">03 PROJECTS</span></div>
      <div className="project-list">{projects.map((project, i) => <article className="project-card" key={project.name}><div className={`project-icon ${project.color}`}>{project.icon}</div><div className="project-main"><div className="project-kicker">0{i + 1} / {project.type}</div><h3>{project.name}</h3><p>{project.description}</p><div className="chips">{project.stack.map((tech) => <span key={tech}>{tech}</span>)}</div></div><button className="round-link" aria-label={`Ask about ${project.name}`} onClick={() => { open("ask"); setInput(`Tell me about ${project.name}`); }}><ArrowUpRight size={17}/></button></article>)}</div>
      <p className="footnote">Project summaries are starter copy — verify and replace with your exact project details and links before publishing.</p>
    </WindowFrame>;
    if (name === "resume") return <WindowFrame title="Resume.pdf" icon={<FileText size={14}/>} onClose={() => close(name)} className="content-window resume-window">
      <div className="resume-toolbar"><span><FileText size={15}/> kartik-sahu-resume.pdf</span><span className="count-pill">PREVIEW</span></div>
      <div className="resume-paper"><div className="resume-top"><div><span className="eyebrow">DEVELOPER PORTFOLIO</span><h2>Kartik Sahu</h2><p>Full-stack developer · AI enthusiast</p></div><div className="resume-mark">KS</div></div><div className="resume-rule"/><h3>PROFILE</h3><p>Developer interested in creating practical web products and exploring AI-powered applications.</p><h3>AREAS OF INTEREST</h3><div className="resume-skills"><span>React</span><span>TypeScript</span><span>JavaScript</span><span>Node.js</span><span>RAG</span><span>Generative AI</span></div><h3>SELECTED PROJECTS</h3>{projects.map((p) => <div className="resume-project" key={p.name}><strong>{p.name}</strong><p>{p.description}</p></div>)}<div className="resume-notice">Replace this demo preview with verified details from your actual resume before going live.</div></div>
    </WindowFrame>;
    if (name === "ask") return <WindowFrame title="Ask Me — AI assistant" icon={<Sparkles size={14}/>} onClose={() => close(name)} className="content-window chat-window">
      <div className="chat-intro"><div className="bot-avatar"><Bot size={20}/></div><div><strong>Portfolio Intelligence</strong><p><span className="status-dot"/> Grounded answers · Groq + RAG</p></div><span className="count-pill">BETA</span></div>
      <div className="chat-messages">{messages.map((m, i) => <div className={`chat-message ${m.role}`} key={i}><div className="message-avatar">{m.role === "assistant" ? <Sparkles size={14}/> : <UserRound size={14}/>}</div><div className="message-bubble">{m.content}</div></div>)}{loading && <div className="chat-message assistant"><div className="message-avatar"><Sparkles size={14}/></div><div className="message-bubble typing"><span/><span/><span/></div></div>}</div>
      {messages.length < 3 && <div className="suggestions">{suggestions.map((s) => <button key={s} onClick={() => ask(s)}>{s}<ChevronRight size={13}/></button>)}</div>}
      <form className="chat-form" onSubmit={(e) => { e.preventDefault(); void ask(); }}><input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about skills, projects, experience…" aria-label="Ask the portfolio assistant"/><button type="submit" disabled={loading || !input.trim()} aria-label="Send message"><Send size={16}/></button></form><p className="chat-disclaimer">Answers use retrieved portfolio context. Unknown details should be called out, not guessed.</p>
    </WindowFrame>;
    return <WindowFrame title="Let's connect" icon={<Mail size={14}/>} onClose={() => close(name)} className="content-window">
      <div className="contact-content"><div className="contact-orb"><Mail size={27}/></div><span className="eyebrow">YOUR NEXT TEAMMATE?</span><h2>Let's make something<br/>meaningful<span className="accent">.</span></h2><p className="muted">Have a project, opportunity, or interesting problem? I'd love to hear about it.</p><div className="contact-links"><a href="https://github.com/" target="_blank" rel="noreferrer"><Github size={17}/> GitHub <ArrowUpRight size={14}/></a><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer"><Linkedin size={17}/> LinkedIn <ArrowUpRight size={14}/></a><a href="mailto:hello@example.com"><Mail size={17}/> Email <ArrowUpRight size={14}/></a></div><p className="footnote">Update these placeholder links with your real profiles and email.</p></div>
    </WindowFrame>;
  };

  return <main className="desktop">
    <div className="wallpaper-glow glow-a"/><div className="wallpaper-glow glow-b"/><div className="wallpaper-grid"/>
    <header className="menubar"><div className="menu-left"><Apple size={17} fill="currentColor"/><strong>HireMeAI</strong><span className="menu-divider"/><span>Portfolio</span><span>Window</span><span>Help</span></div><div className="menu-right"><span className="menu-status"><Wifi size={15}/></span><span className="menu-status"><Battery size={16}/></span><span className="clock"><Clock3 size={13}/> Local time</span></div></header>
    <aside className="desktop-shortcuts"><button onClick={() => open("resume")}><span className="desktop-file"><FileText size={24}/></span><span>Resume.pdf</span></button>{projects.map((project) => <button key={project.name} onClick={() => open("projects")}><span className={"desktop-file project-desktop-file " + project.color}>{project.icon}</span><span>{project.name}</span></button>)}<button onClick={() => open("ask")}><span className="desktop-file ai-file"><Sparkles size={24}/></span><span>Ask Me.ai</span></button></aside>
    <div className="window-stage">{openWindows.map((name) => <div key={name} className={`window-layer ${active === name ? "front" : "back"}`} onMouseDown={() => setActive(name)}>{renderWindow(name)}</div>)}</div>
    <div className="desktop-hint"><Command size={13}/> A little desktop. A lot of curiosity.</div>
    <nav className={`dock ${mobileMenu ? "dock-open" : ""}`} aria-label="Portfolio app dock"><button className="dock-app" onClick={() => open("about")} aria-label="Home"><span className="dock-icon home-icon"><PanelsTopLeft size={23}/></span><span className="dock-label">Home</span></button><button className="dock-app" onClick={() => open("projects")} aria-label="Projects"><span className="dock-icon projects-icon"><Folder size={23}/></span><span className="dock-label">Projects</span></button><button className="dock-app" onClick={() => open("resume")} aria-label="Resume"><span className="dock-icon resume-icon"><FileText size={23}/></span><span className="dock-label">Resume</span></button><button className="dock-app" onClick={() => open("ask")} aria-label="AI assistant"><span className="dock-icon ask-icon"><Sparkles size={23}/></span><span className="dock-label">Ask AI</span></button><button className="dock-app" onClick={() => open("contact")} aria-label="Contact"><span className="dock-icon contact-icon"><Mail size={23}/></span><span className="dock-label">Contact</span></button><span className="dock-separator"/><button className="dock-app" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle dock menu"><span className="dock-icon menu-icon"><Search size={21}/></span><span className="dock-label">Menu</span></button></nav>
    <div className="mobile-nav"><span className="mobile-brand"><Sparkles size={16}/> HireMeAI</span><button onClick={() => open("projects")}>Work</button><button onClick={() => open("ask")}>Ask AI</button><button onClick={() => open("contact")}>Contact</button></div>
    <div className="desktop-corner"><span className="corner-dot"/> Built with curiosity <span>✦</span></div>
  </main>;
}
