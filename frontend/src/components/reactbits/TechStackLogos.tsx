import React from "react";
import { LogoItem } from "./LogoLoop";

// Crisp SVG Vector Marks for GitHub, Vercel, TypeScript, HTML, CSS, React, Tailwind, Docker
export const techStackLogos: LogoItem[] = [
  {
    node: (
      <div className="flex items-center gap-2.5 px-4 py-2 rounded-pill backdrop-blur-md bg-white/45 border border-white/65 shadow-2xs font-nineties text-xs uppercase tracking-wider text-ink hover:bg-white/65 transition cursor-pointer">
        <svg className="w-4 h-4 text-ink" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.13c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.2-3.1-.12-.3-.52-1.47.11-3.06 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.82 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.06.75.81 1.2 1.84 1.2 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.07.78 2.16v3.2c0 .31.2.66.79.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
        </svg>
        <span>GitHub</span>
      </div>
    ),
    title: "GitHub",
  },
  {
    node: (
      <div className="flex items-center gap-2.5 px-4 py-2 rounded-pill backdrop-blur-md bg-white/45 border border-white/65 shadow-2xs font-nineties text-xs uppercase tracking-wider text-ink hover:bg-white/65 transition cursor-pointer">
        <svg className="w-4 h-4 text-ink" viewBox="0 0 24 24" fill="currentColor">
          <path d="m12 1.5 11 19H1z" />
        </svg>
        <span>Vercel</span>
      </div>
    ),
    title: "Vercel",
  },
  {
    node: (
      <div className="flex items-center gap-2.5 px-4 py-2 rounded-pill backdrop-blur-md bg-white/45 border border-white/65 shadow-2xs font-nineties text-xs uppercase tracking-wider text-ink hover:bg-white/65 transition cursor-pointer">
        <svg className="w-4 h-4 text-[#3178c6]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1.5 0h21A1.5 1.5 0 0 1 24 1.5v21a1.5 1.5 0 0 1-1.5 1.5h-21A1.5 1.5 0 0 1 0 22.5v-21A1.5 1.5 0 0 1 1.5 0zm10.237 13.904h-2.55v6.527H6.71v-6.527H4.16V11.5h7.577zm8.563 2.822c0 .878-.293 1.576-.879 2.093-.586.517-1.396.776-2.432.776-1.074 0-1.953-.303-2.637-.908v-2.617c.684.732 1.484 1.099 2.402 1.099.41 0 .733-.088.967-.264.234-.176.352-.42.352-.732 0-.254-.088-.459-.264-.615-.176-.156-.479-.313-.908-.469l-.791-.293c-.977-.352-1.68-.781-2.109-1.289-.43-.508-.645-1.152-.645-1.934 0-.859.303-1.553.908-2.08.605-.527 1.416-.791 2.432-.791.957 0 1.777.244 2.461.732v2.461c-.645-.566-1.377-.85-2.197-.85-.371 0-.664.088-.879.264-.215.176-.322.4-.322.674 0 .234.098.43.293.586.195.156.547.332 1.055.527l.732.264c1.016.371 1.738.82 2.168 1.348.43.527.645 1.182.645 1.963z" />
        </svg>
        <span>TypeScript</span>
      </div>
    ),
    title: "TypeScript",
  },
  {
    node: (
      <div className="flex items-center gap-2.5 px-4 py-2 rounded-pill backdrop-blur-md bg-white/45 border border-white/65 shadow-2xs font-nineties text-xs uppercase tracking-wider text-ink hover:bg-white/65 transition cursor-pointer">
        <svg className="w-4 h-4 text-[#e34f26]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1.5 0h21l-1.9 21.4-8.6 2.6-8.6-2.6L1.5 0zm17.4 5.2H5.1l.4 4.5h10.4l-.4 4.8-3.5 1-3.5-1-.2-2.5H5.8l.5 5 5.7 1.6 5.7-1.6.9-9.8.3-4H18.9z" />
        </svg>
        <span>HTML5</span>
      </div>
    ),
    title: "HTML5",
  },
  {
    node: (
      <div className="flex items-center gap-2.5 px-4 py-2 rounded-pill backdrop-blur-md bg-white/45 border border-white/65 shadow-2xs font-nineties text-xs uppercase tracking-wider text-ink hover:bg-white/65 transition cursor-pointer">
        <svg className="w-4 h-4 text-[#1572b6]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1.5 0h21l-1.9 21.4-8.6 2.6-8.6-2.6L1.5 0zm17.4 5.2H5.1l.4 4.5h10.4l-.4 4.8-3.5 1-3.5-1-.2-2.5H5.8l.5 5 5.7 1.6 5.7-1.6.9-9.8.3-4H18.9z" />
        </svg>
        <span>CSS3</span>
      </div>
    ),
    title: "CSS3",
  },
  {
    node: (
      <div className="flex items-center gap-2.5 px-4 py-2 rounded-pill backdrop-blur-md bg-white/45 border border-white/65 shadow-2xs font-nineties text-xs uppercase tracking-wider text-ink hover:bg-white/65 transition cursor-pointer">
        <svg className="w-4 h-4 text-[#61dafb]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm0-9.5C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21.6c-5.302 0-9.6-4.298-9.6-9.6S6.698 2.4 12 2.4s9.6 4.298 9.6 9.6-4.298 9.6-9.6 9.6z" />
        </svg>
        <span>React</span>
      </div>
    ),
    title: "React",
  },
  {
    node: (
      <div className="flex items-center gap-2.5 px-4 py-2 rounded-pill backdrop-blur-md bg-white/45 border border-white/65 shadow-2xs font-nineties text-xs uppercase tracking-wider text-ink hover:bg-white/65 transition cursor-pointer">
        <svg className="w-4 h-4 text-[#38bdf8]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
        </svg>
        <span>Tailwind</span>
      </div>
    ),
    title: "Tailwind",
  },
  {
    node: (
      <div className="flex items-center gap-2.5 px-4 py-2 rounded-pill backdrop-blur-md bg-white/45 border border-white/65 shadow-2xs font-nineties text-xs uppercase tracking-wider text-ink hover:bg-white/65 transition cursor-pointer">
        <svg className="w-4 h-4 text-[#2496ed]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.136a.186.186 0 0 0-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.118a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186H8.1a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.185-.186H5.136a.186.186 0 0 0-.186.185v1.888c0 .102.084.185.186.185m-2.928 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.185-.186H2.208a.186.186 0 0 0-.186.185v1.888c0 .102.084.185.186.185M23.95 9.77a.64.64 0 0 0-.414-.492c-.75-.245-2.274-.325-3.69-.17-.184-.337-.393-.655-.63-.948l-.053-.06c-.636-.71-1.488-1.196-2.534-1.442l-.248-.052-.165.195c-.328.384-.576.812-.734 1.272l-.066.196h-1.922l.066-.196a5.1 5.1 0 0 1 .734-1.272l.165-.195-.248.052c-1.046.246-1.898.732-2.534 1.442l-.053.06c-.237.293-.446.611-.63.948-1.416-.155-2.94-.075-3.69.17a.64.64 0 0 0-.414.492C.01 10.308-.05 11.233.04 12.2c.26 2.802 2.054 4.794 4.896 5.433 1.05.236 2.227.355 3.51.355 1.547 0 2.977-.168 4.248-.5 2.115-.552 3.793-1.637 4.99-3.225.864-.09 1.954-.318 2.83-.87a4.98 4.98 0 0 0 1.92-2.222c.28-.686.326-1.21.116-1.4m-4.57 3.513c-.98 1.306-2.378 2.2-4.154 2.657-1.173.307-2.51.464-3.974.464-1.22 0-2.333-.112-3.307-.333-2.484-.56-4.045-2.22-4.275-4.664-.076-.807-.024-1.564.15-2.26 1.08-.292 2.66-.34 4.23-.135l.235.03.11-.208c.2-.38.43-.728.69-1.034.45-.537 1.05-.898 1.78-1.074.43 1.08 1.25 1.92 2.37 2.41l.24.1.22-.14c.73-.46 1.62-.71 2.58-.71.21 0 .42.01.63.03l.25.03.12-.22c.26-.47.6-.87 1-1.18.52-.4 1.15-.65 1.87-.74.19.4.34.82.46 1.26l.07.26.26-.06c1.57-.36 3.15-.31 4.23-.02-.27 1.63-.98 2.98-2.1 3.82z" />
        </svg>
        <span>Docker</span>
      </div>
    ),
    title: "Docker",
  },
];
