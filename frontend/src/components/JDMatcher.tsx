import { useState } from "react";
import { Upload, FileUp, CheckCircle2, XCircle, ArrowUpRight, Copy } from "lucide-react";
import * as pdfjs from "pdfjs-dist";

const portfolioSkills = [
  "JavaScript", "TypeScript", "React", "Node.js", "Express", "MongoDB",
  "Redux Toolkit", "REST APIs", "Groq", "Generative AI", "RAG", "HTML", "CSS", "Tailwind CSS"
];

const evidence = [
  "JavaScript", "TypeScript", "React", "Node.js", "Express", "MongoDB",
  "Redux Toolkit", "REST APIs", "Groq", "Generative AI", "RAG", "HTML", "CSS", "Tailwind CSS",
  "MERN stack", "course enrollment", "role-based experiences", "payment integration",
  "expense tracking", "AI-assisted applications", "keyword retrieval"
];

export default function JDMatcher() {
  const [fileName, setFileName] = useState("");
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function extractFile(file: File) {
    setFileName(file.name);
    if (file.type === "text/plain" || /\.(txt|md)$/i.test(file.name)) return file.text();
    if (file.type === "application/pdf" || /\.pdf$/i.test(file.name)) {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
      const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
      const pages: string[] = [];
      for (let n = 1; n <= pdf.numPages; n++) {
        const page = await pdf.getPage(n);
        const content = await page.getTextContent();
        pages.push(content.items.map((item: any) => "str" in item ? item.str : "").join(" "));
      }
      return pages.join("\n");
    }
    throw new Error("Please upload a text-based PDF, TXT, or Markdown file.");
  }

  async function analyze(source?: File) {
    setError("");
    setResult(null);
    setBusy(true);
    try {
      const jd = (source ? await extractFile(source) : text).trim();
      if (jd.length < 80) throw new Error("This job description looks too short. Upload a text-based PDF or paste the full JD.");
      const lower = jd.toLowerCase();
      const requiredSkills = portfolioSkills.filter(skill => lower.includes(skill.toLowerCase()));
      const matched = requiredSkills.filter(skill => evidence.some(item => item.toLowerCase() === skill.toLowerCase()));
      const unverified = requiredSkills.filter(skill => !matched.includes(skill));
      const capabilityTerms = ["frontend", "back-end", "backend", "full-stack", "full stack", "api", "database", "payments", "ai", "retrieval", "responsive", "state management"];
      const evidencedCapabilities = evidence.filter(item => capabilityTerms.some(term => item.toLowerCase().includes(term)) && lower.includes(item.toLowerCase()));
      const score = Math.round((matched.length / Math.max(1, requiredSkills.length)) * 100);
      const structured = {
        sourceFile: fileName || "Pasted job description",
        jobDescriptionText: jd,
        documentedCandidateEvidence: evidence,
        skillsMentionedInJDAndPortfolio: matched,
        skillsMentionedInJDButNotVerifiedInPortfolio: unverified,
        evidenceOverlap: evidencedCapabilities,
        estimatedKeywordMatchPercent: score,
        scoringMethod: "Exact skill-name overlap against documented portfolio technologies. This is not an ATS score, resume parser verdict, or hiring recommendation."
      };
      setText(jd);
      setResult({ ...structured, matched, unverified, score, json: JSON.stringify(structured, null, 2) });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not analyze this job description.");
    } finally {
      setBusy(false);
    }
  }

  return <div className="jd-content">
    <p className="muted">Upload or paste a job description. The tool extracts text, returns a structured JSON summary, and compares the JD's named technologies with documented portfolio evidence.</p>
    <label className="jd-upload"><Upload size={22}/><strong>Upload job description</strong><span>Text-based PDF, TXT, or Markdown</span><input type="file" accept=".pdf,.txt,.md,text/plain,application/pdf" onChange={event => { const file = event.target.files?.[0]; if (file) void analyze(file); }}/></label>
    <label className="jd-label">Or paste the job description<textarea value={text} onChange={event => { setText(event.target.value); setFileName("Pasted job description"); }} placeholder="Paste the complete job description here…" rows={7}/></label>
    <div className="jd-actions"><button className="primary-button" disabled={busy || text.trim().length < 80} onClick={() => void analyze()}>{busy ? "Analyzing…" : "Analyze match"} <ArrowUpRight size={16}/></button>{fileName && <span className="muted">{fileName}</span>}</div>
    {error && <p className="jd-error" role="alert">{error}</p>}
    {result && <div className="jd-results">
      <div className="jd-score"><strong>{result.score}%</strong><span>Estimated technology overlap</span></div>
      <div className="jd-columns">
        <section><h3><CheckCircle2 size={17}/> Matched evidence ({result.matched.length})</h3>{result.matched.length ? result.matched.map((skill: string) => <span className="jd-chip matched" key={skill}>{skill}</span>) : <p className="muted">No exact technology names overlap. Review the JD and portfolio manually.</p>}</section>
        <section><h3><XCircle size={17}/> Not verified ({result.unverified.length})</h3>{result.unverified.length ? result.unverified.map((skill: string) => <span className="jd-chip missing" key={skill}>{skill}</span>) : <p className="muted">No listed technology gaps detected. Other requirements may still be unmet or unverified.</p>}</section>
      </div>
      <h3>Documented candidate evidence</h3><p>{evidence.join(" · ")}</p>
      <div className="json-heading"><strong>Structured JSON output</strong><button className="small-action" onClick={() => void navigator.clipboard?.writeText(result.json)}><Copy size={14}/> Copy JSON</button></div>
      <pre className="jd-json">{result.json}</pre>
      <p className="muted">Important: “Not verified” means the portfolio does not prove that skill; it does not mean Kartik lacks it. The score is an exact-keyword heuristic, not an ATS result or hiring decision.</p>
    </div>}
  </div>;
}
