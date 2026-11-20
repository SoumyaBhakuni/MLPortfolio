import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { fetchHealth } from '../services/api';

export default function Navbar() {
  const [apiOnline, setApiOnline] = useState(null);

  useEffect(() => {
    let active = true;
    fetchHealth()
      .then(() => {
        if (active) setApiOnline(true);
      })
      .catch(() => {
        if (active) setApiOnline(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const navClass = ({ isActive }) =>
    `transition-colors ${
      isActive ? 'text-cyan-400 font-semibold' : 'text-zinc-300 hover:text-cyan-400'
    }`;

  return (
    <>
      <div className="relative z-20 border-b border-white/10 bg-[#0A0A0C]/95 backdrop-blur-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-7 flex items-center justify-between text-[11px] tracking-wider text-zinc-400 font-mono">
          <div className="flex items-center gap-3">
            <span className={apiOnline === false ? 'text-amber-400' : 'text-emerald-400'}>
              {apiOnline === false ? '[API_OFFLINE_CHECK_5000]' : '[SYS_OK]'}
            </span>
            <span className="hidden sm:inline text-zinc-600">//</span>
            <span className="hidden sm:inline">FLASK_ML_LAB: READY</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-cyan-400 hidden md:inline">HAPPIELOOP_ML_INTERNSHIP</span>
            <span className="text-zinc-400">[10_LABS]</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0A0A0C]/85 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="font-mono text-lg sm:text-xl font-bold tracking-tight flex items-center gap-1"
          >
            <span className="text-white">&lt;ML.</span>
            <span className="bg-gradient-to-r from-amber-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent">
              Lab/&gt;
            </span>
          </Link>

          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 font-mono text-xs tracking-widest"
          >
            <NavLink to="/" end className={navClass}>
              00_HOME
            </NavLink>
            <NavLink to="/about" className={navClass}>
              01_ABOUT
            </NavLink>
            <NavLink to="/projects" className={navClass}>
              02_PROJECTS
            </NavLink>
            <NavLink to="/internship" className={navClass}>
              03_INTERNSHIP
            </NavLink>
            <NavLink to="/contact" className={navClass}>
              04_CONTACT
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/projects/eda"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 font-mono text-[11px] tracking-wider text-zinc-300 border border-white/15 hover:border-cyan-400/60 hover:text-cyan-300 transition-colors"
            >
              TASK_01_EDA
            </Link>

            <Link
              to="/contact"
              className="relative inline-flex items-center justify-center px-4 py-2 font-mono text-xs font-semibold tracking-wider text-white bg-[#0A0A0C] hover:bg-white/5 transition-all"
              style={{
                border: '1px solid transparent',
                backgroundImage:
                  'linear-gradient(#0A0A0C, #0A0A0C), linear-gradient(90deg, #22D3EE, #10B981, #F59E0B, #A855F7)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box'
              }}
            >
              GET IN TOUCH
            </Link>
          </div>
        </div>

        <div className="flex md:hidden items-center justify-around border-t border-white/10 py-2 px-2 font-mono text-[10px] tracking-wider bg-[#0A0A0C]">
          <NavLink to="/" end className={navClass}>00_HOME</NavLink>
          <NavLink to="/about" className={navClass}>01_ABOUT</NavLink>
          <NavLink to="/projects" className={navClass}>02_LABS</NavLink>
          <NavLink to="/internship" className={navClass}>03_INTERN</NavLink>
          <NavLink to="/contact" className={navClass}>04_CONTACT</NavLink>
        </div>
      </header>
    </>
  );
}