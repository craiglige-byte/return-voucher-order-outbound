import React, { useState } from 'react';
import {
  X,
  FileText,
  Download,
  Layers,
  Package,
} from 'lucide-react';
import { SkuSummaryItem } from '../types';

interface SkuSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  skuList: SkuSummaryItem[];
}

const QUICK_TAGS = [
  '全部',
  '元气森林气泡水',
  '外星人电解质水',
  '外星人维生素水',
  '好自在',
  '冰茶',
  '其他',
];

export const SkuSummaryModal: React.FC<SkuSummaryModalProps> = ({
  isOpen,
  onClose,
  skuList,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');

  if (!isOpen) return null;

  // Filtered list based on selected quick tag
  const filteredList = skuList.filter((item) => {
    if (selectedCategory === '全部') return true;
    return item.category === selectedCategory;
  });

  // Grand totals
  const grandTotalPending = filteredList.reduce((acc, item) => acc + item.pendingBottles, 0);

  const handleExport = () => {
    // Generate simple CSV download for pending outbound items
    const headers = ['品项名称', '分类', '规格', '待出库(瓶)'];
    const rows = filteredList.map((item) => [
      `"${item.name}"`,
      `"${item.category}"`,
      `"${item.specification}"`,
      item.pendingBottles,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `返货券按品项待出库汇总_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">按品项汇总</h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/60">
              核销口径
            </span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Tag Category Selection Bar */}
        <div className="px-6 py-3.5 bg-slate-50/80 border-b border-slate-200/80">
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedCategory(tag)}
                className={`px-3.5 py-1.5 text-xs rounded-lg transition-all shrink-0 cursor-pointer ${
                  selectedCategory === tag
                    ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80 font-medium'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* SKU List Container - Display ONLY 待出库 quantity */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-slate-50/30 custom-scrollbar">
          {filteredList.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              所选分类下暂无待出库品项数据
            </div>
          ) : (
            filteredList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 flex items-center justify-between transition-all hover:border-slate-300"
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  {/* Left Icon */}
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    {/* Item Name & Spec */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[15px] font-bold text-slate-800 tracking-tight">
                        {item.name}
                      </h3>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200/60 font-medium">
                        {item.specification}
                      </span>
                    </div>

                    {/* Category Label */}
                    <div className="text-xs text-slate-400 mt-1">
                      品类: <span className="text-slate-600 font-medium">{item.category}</span>
                    </div>
                  </div>
                </div>

                {/* Right Pending Bottles Quantity ONLY */}
                <div className="text-right shrink-0 ml-4">
                  <div className="text-xs text-slate-400 font-medium mb-0.5">待出库</div>
                  <div className="text-xl font-extrabold text-blue-600 tracking-tight">
                    {item.pendingBottles.toLocaleString()} <span className="text-xs font-semibold text-blue-800">瓶</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-4 text-slate-600">
            <div>
              共计 <strong className="text-slate-800">{filteredList.length}</strong> 个品项
            </div>
            <div className="h-3 w-px bg-slate-200" />
            <div>
              待出库总量: <strong className="text-blue-600 text-sm font-bold">{grandTotalPending.toLocaleString()}</strong> 瓶
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={handleExport}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 font-medium transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>导出汇总数据</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-2xs cursor-pointer"
            >
              完成
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
