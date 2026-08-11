import React, { useState } from 'react';
import {
  MessageSquare,
  Wrench,
  PackageCheck,
  CreditCard,
  Users,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  ArrowDownLeft,
  ArrowUpRight,
  FileSpreadsheet,
  CheckSquare,
  Ticket,
  BarChart2,
} from 'lucide-react';

interface SidebarProps {
  currentMenu: string;
  onSelectMenu: (menu: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentMenu, onSelectMenu }) => {
  const [jxcOpen, setJxcOpen] = useState(true);

  const jxcSubmenus = [
    { id: '单据审批状态', label: '单据审批状态', icon: ClipboardList },
    { id: '元气采购入库', label: '元气采购入库', icon: ArrowDownLeft },
    { id: '元气采购退货', label: '元气采购退货', icon: ArrowUpRight },
    { id: '元气销售出库', label: '元气销售出库', icon: PackageCheck },
    { id: '元气销售退货', label: '元气销售退货', icon: ArrowUpRight },
    { id: '自营销售出库', label: '自营销售出库', icon: PackageCheck },
    { id: '自营销售退货', label: '自营销售退货', icon: ArrowUpRight },
    { id: '发起调拨出库', label: '发起调拨出库', icon: PackageCheck },
    { id: '收到调拨入库', label: '收到调拨入库', icon: ArrowDownLeft },
    { id: '其他出库', label: '其他出库', icon: PackageCheck },
    { id: '库存报表', label: '库存报表', icon: BarChart2 },
    { id: '库存盘点', label: '库存盘点', icon: CheckSquare },
    { id: '返货券商品出库', label: '返货券商品出库', icon: Ticket, active: true },
  ];

  return (
    <aside className="w-56 bg-[#001529] text-gray-300 flex flex-col h-screen shrink-0 select-none text-xs border-r border-slate-800">
      {/* Top Brand Logo */}
      <div className="h-12 flex items-center px-4 font-semibold text-sm text-white border-b border-slate-800/60 bg-[#002140]/80">
        <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center mr-2 text-white text-xs font-bold shadow-sm">
          进
        </div>
        <span className="tracking-wide text-slate-100">供应链进销存</span>
      </div>

      {/* Menu List */}
      <div className="flex-1 overflow-y-auto py-2 space-y-1 custom-scrollbar">
        {/* 消息列表 */}
        <button
          onClick={() => onSelectMenu('消息列表')}
          className={`w-full flex items-center px-4 py-2.5 hover:bg-slate-800/60 transition-colors text-left ${
            currentMenu === '消息列表' ? 'text-white font-medium bg-blue-600/20' : 'text-slate-300'
          }`}
        >
          <MessageSquare className="w-4 h-4 mr-2.5 opacity-80" />
          <span>消息列表</span>
        </button>

        {/* 业务工具 */}
        <button
          onClick={() => onSelectMenu('业务工具')}
          className={`w-full flex items-center px-4 py-2.5 hover:bg-slate-800/60 transition-colors text-left ${
            currentMenu === '业务工具' ? 'text-white font-medium bg-blue-600/20' : 'text-slate-300'
          }`}
        >
          <Wrench className="w-4 h-4 mr-2.5 opacity-80" />
          <span>业务工具</span>
        </button>

        {/* 进销存 (Group with accordion) */}
        <div>
          <button
            onClick={() => setJxcOpen(!jxcOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-800/60 text-slate-200 transition-colors"
          >
            <div className="flex items-center">
              <FileSpreadsheet className="w-4 h-4 mr-2.5 text-blue-400" />
              <span className="font-medium text-slate-100">进销存</span>
            </div>
            {jxcOpen ? <ChevronDown className="w-3.5 h-3.5 opacity-70" /> : <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
          </button>

          {jxcOpen && (
            <div className="bg-[#000c17]/60 py-0.5">
              {jxcSubmenus.map((item) => {
                const isSelected = currentMenu === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectMenu(item.id)}
                    className={`w-full flex items-center pl-9 pr-3 py-2 transition-all text-left relative ${
                      isSelected
                        ? 'bg-blue-600 text-white font-medium shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></span>
                    )}
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 费用管理 */}
        <button
          onClick={() => onSelectMenu('费用管理')}
          className={`w-full flex items-center px-4 py-2.5 hover:bg-slate-800/60 transition-colors text-left ${
            currentMenu === '费用管理' ? 'text-white font-medium bg-blue-600/20' : 'text-slate-300'
          }`}
        >
          <CreditCard className="w-4 h-4 mr-2.5 opacity-80" />
          <span>费用管理</span>
        </button>

        {/* 客户管理 */}
        <button
          onClick={() => onSelectMenu('客户管理')}
          className={`w-full flex items-center px-4 py-2.5 hover:bg-slate-800/60 transition-colors text-left ${
            currentMenu === '客户管理' ? 'text-white font-medium bg-blue-600/20' : 'text-slate-300'
          }`}
        >
          <Users className="w-4 h-4 mr-2.5 opacity-80" />
          <span>客户管理</span>
        </button>
      </div>
    </aside>
  );
};
