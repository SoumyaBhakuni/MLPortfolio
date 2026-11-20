import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative z-10 max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]">
      <div className="px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px] text-zinc-500">
        <div>
          &lt;ML.Lab/&gt; — Interactive Machine Learning Laboratory • Happieloop Technologies (10 Jul – 9 Aug 2026)
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/projects" className="hover:text-cyan-400 transition-colors">
            ALL_10_LABS
          </Link>
          <Link to="/internship" className="hover:text-amber-400 transition-colors">
            INTERNSHIP
          </Link>
          <Link to="/contact" className="hover:text-purple-400 transition-colors">
            CONTACT
          </Link>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}