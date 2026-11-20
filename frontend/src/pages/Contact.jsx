import { useState } from 'react';
import { Check, Copy, Mail } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const email = 'ml.portfolio@happieloop-labs.dev';

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      }
    } catch {
      // Fallback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]/90">
      <SectionHeading
        code="04"
        title="CONTACT_&_INQUIRIES"
        rightLabel="ML PORTFOLIO"
        accent="#A855F7"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-5 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-white/10 space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Get in Touch</h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Have questions about the ten Machine Learning implementations, Flask API endpoints, or
            internship documentation? Send a note below.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <div className="px-3 py-2 border border-white/15 bg-white/[0.02] font-mono text-xs text-zinc-200 flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>{email}</span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-2 border border-cyan-400/40 font-mono text-xs text-cyan-300 hover:bg-cyan-400/10 inline-flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'COPIED' : 'COPY'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="lg:col-span-7 p-6 sm:p-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[11px] text-zinc-400 mb-1">NAME</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/15 focus:border-cyan-400 outline-none text-sm text-white"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-zinc-400 mb-1">EMAIL</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/15 focus:border-cyan-400 outline-none text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[11px] text-zinc-400 mb-1">MESSAGE</label>
            <textarea
              rows={4}
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/15 focus:border-emerald-400 outline-none text-sm text-white resize-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="px-5 py-2.5 font-mono text-xs font-bold text-[#0A0A0C] bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 hover:brightness-110 cursor-pointer"
            >
              SEND_MESSAGE
            </button>
            {sent && <span className="font-mono text-xs text-emerald-400">[MESSAGE_LOGGED]</span>}
          </div>
        </form>
      </div>
    </div>
  );
}