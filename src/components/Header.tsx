import React from 'react';
import { Menu, RefreshCw, Bell, Search } from 'lucide-react';

interface HeaderProps {
  currentMenu: string;
}

export const Header: React.FC<HeaderProps> = ({ currentMenu }) => {
  return (
    <header className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between text-xs shrink-0 z-10 shadow-2xs">
      {/* Left Breadcrumb */}
      <div className="flex items-center space-x-2 text-slate-600">
        <Menu className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600 mr-1" />
        <span className="text-slate-400">进销存</span>
        <span className="text-slate-300">/</span>
        <span className="font-medium text-slate-800">{currentMenu}</span>
      </div>

      {/* Right User & Utility controls */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-slate-500 hover:text-slate-700 cursor-pointer text-xs">
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">实时同步</span>
        </div>

        <div className="h-4 w-px bg-slate-200" />

        <div className="flex items-center space-x-2">
          <span className="text-slate-700 font-medium tracking-tight truncate max-w-[320px]">
            A2604300003_重庆市路易供应链管理有限公司
          </span>
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs border border-blue-500">
            玉
          </div>
        </div>
      </div>
    </header>
  );
};
