
import React from 'react';
import { LayoutDashboard, Library, Settings, ShieldCheck, HelpCircle, Plus } from 'lucide-react';

interface SidebarProps {
  onUploadClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onUploadClick }) => {
  return (
    <nav className="w-16 md:w-20 flex flex-col items-center py-6 border-r border-slate-800 bg-slate-950">
      <div className="mb-10 text-indigo-500">
        <ShieldCheck size={32} />
      </div>

      <div className="flex-1 flex flex-col gap-8 items-center">
        <SidebarItem icon={<LayoutDashboard size={24} />} active label="Dash" />
        <SidebarItem icon={<Library size={24} />} label="Library" />
        <SidebarItem icon={<Settings size={24} />} label="Config" />
      </div>

      <div className="mt-auto flex flex-col gap-6 items-center">
        <button 
          onClick={onUploadClick}
          className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus size={24} />
        </button>
        <SidebarItem icon={<HelpCircle size={22} />} label="Help" />
        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
          <img src="https://picsum.photos/40/40" alt="Avatar" />
        </div>
      </div>
    </nav>
  );
};

const SidebarItem = ({ icon, active = false, label }: { icon: React.ReactNode, active?: boolean, label: string }) => (
  <div className={`group relative flex items-center justify-center p-3 rounded-xl cursor-pointer transition-colors ${active ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
    {icon}
    <span className="absolute left-16 px-2 py-1 ml-2 text-xs font-medium text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
      {label}
    </span>
  </div>
);

export default Sidebar;
