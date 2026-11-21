import { useState } from 'react';
import { Check, Copy, Mail } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const email = 'soumyabhakuni456@gmail.com';

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Unable to copy email automatically; please copy it manually.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const trimmedMessage = form.message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setError('Please fill in your name, email, and message.');
      return;
    }

    setError('');
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 3500);
  };

  return (
    <div className="max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]/90">
      <SectionHeading
        code="04"
        title="CONTACT_&_INQUIRIES"
        rightLabel="ML PORTFOLIO"
        accent="#A855F7"
      />

      <div className="p-6 sm:p-8 border-b border-white/10 space-y-6">
        {/* 01. Overview & 02. Objective / Problem Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-purple-400">
              01 // OVERVIEW
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Provides direct email access and an inquiry form for questions regarding the ten
              Machine Learning laboratory modules, Flask API endpoints, and internship documentation.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-purple-400">
              02 // OBJECTIVE & PROBLEM STATEMENT
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Offer a frictionless contact channel with one-click address copying, input
              validation, and clear feedback so reviewers, collaborators, or recruiters can reach
              out cleanly.
            </p>
          </div>
        </div>

        {/* 03. Channel & Payload Scope, 04. Client Behavior & 05. Workflow / Methodology */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
              03 // CONTACT CHANNEL & SCOPE
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Direct correspondence routes to{' '}
              <span className="text-white">soumyabhakuni456@gmail.com</span>, covering lab
              implementations, model evaluation, backend routes, and portfolio feedback.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
              04 // CLIENT VALIDATION & STATE
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Sanitizes and validates non-empty <span className="text-white">name</span>,{' '}
              <span className="text-white">email</span>, and <span className="text-white">message</span>{' '}
              fields client-side, resets inputs on submission, and manages clipboard copy feedback.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-purple-400">
              05 // WORKFLOW & METHODOLOGY
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Copy <span className="text-white">soumyabhakuni456@gmail.com</span> with one click
              or compose a structured note in the form below to log a local confirmation state.
            </p>
          </div>
        </div>
      </div>

      {/* 06 & 07 // Interactive Demo & Direct Contact Panel */}
      <div className="border-b border-white/10">
        <div className="px-6 sm:px-8 pt-6 font-mono text-[10px] uppercase tracking-wider text-purple-400">
          06 & 07 // INTERACTIVE CONTACT CHANNEL & DIRECT EMAIL PANEL
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-white/10 space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Get in Touch</h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Have questions about the ten Machine Learning implementations, Flask API endpoints, or
              internship documentation? Send a note or reach out directly by email.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <a
                href={`mailto:${email}`}
                className="px-3 py-2 border border-white/15 bg-white/[0.02] hover:border-cyan-400/50 font-mono text-xs text-zinc-200 flex items-center gap-2 transition-colors"
              >
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="break-all">{email}</span>
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-2 border border-cyan-400/40 font-mono text-xs text-cyan-300 hover:bg-cyan-400/10 inline-flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copied ? 'COPIED' : 'COPY'}
              </button>
            </div>

            <div className="p-3 border border-white/10 bg-white/[0.02] font-mono text-[11px] text-zinc-400">
              STATUS: <span className="text-emerald-400">DIRECT_INBOX_READY</span> · RESPONSE_MODE:{' '}
              <span className="text-cyan-300">ASYNC_EMAIL</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="lg:col-span-7 p-6 sm:p-8 space-y-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[11px] text-zinc-400 mb-1">NAME</label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });
                    if (error) setError('');
                  }}
                  className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/15 focus:border-cyan-400 outline-none text-sm text-white"
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] text-zinc-400 mb-1">EMAIL</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    if (error) setError('');
                  }}
                  className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/15 focus:border-cyan-400 outline-none text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[11px] text-zinc-400 mb-1">MESSAGE</label>
              <textarea
                rows={4}
                required
                placeholder="Ask about a specific ML lab (Tasks 01–10), dataset, API route, or report..."
                value={form.message}
                onChange={(e) => {
                  setForm({ ...form, message: e.target.value });
                  if (error) setError('');
                }}
                className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/15 focus:border-emerald-400 outline-none text-sm text-white resize-none"
              />
            </div>

            {error && (
              <div className="p-3 border border-amber-500/40 bg-amber-500/5 font-mono text-xs text-amber-200">
                {error}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="px-5 py-2.5 font-mono text-xs font-bold text-[#0A0A0C] bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 hover:brightness-110 cursor-pointer"
              >
                SEND_MESSAGE
              </button>
              {sent && (
                <span className="font-mono text-xs text-emerald-400">
                  [MESSAGE_LOGGED] — Reach out directly at {email} if immediate delivery is needed.
                </span>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* 08. Channel Specs & 09 / 10. Key Findings & Conclusion */}
      <div className="p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-wider text-purple-400">
            08 // COMMUNICATION CHANNEL SUMMARY
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3 border border-white/10 bg-white/[0.02]">
              <div className="text-[10px] text-zinc-400">PRIMARY ADDRESS</div>
              <div className="text-cyan-300 mt-1 break-all">{email}</div>
            </div>
            <div className="p-3 border border-white/10 bg-white/[0.02]">
              <div className="text-[10px] text-zinc-400">FORM MODE</div>
              <div className="text-emerald-300 mt-1">CLIENT_VALIDATED_DRAFT</div>
            </div>
            <div className="p-3 border border-white/10 bg-white/[0.02]">
              <div className="text-[10px] text-zinc-400">TOPICS COVERED</div>
              <div className="text-amber-300 mt-1">TASKS_01_TO_10 & FLASK_API</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
              09 // KEY FINDINGS
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Pairing a direct <span className="text-white">mailto:</span> link and clipboard copy
              button with non-empty field validation prevents silent form resets when a user leaves
              the message blank and gives an immediate fallback address.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-purple-400">
              10 // CONCLUSION
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              The contact view now provides clear direct email access to{' '}
              <span className="text-white">{email}</span> alongside a validated inquiry form
              consistent with the rest of the portfolio interface.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}