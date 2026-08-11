import React from 'react';
import { Layers, CheckCircle2, Eye, ChevronRight, Info } from 'lucide-react';
import { SkuSummaryItem } from '../types';

interface MetricCardsProps {
  skuList: SkuSummaryItem[];
  onOpenSkuSummary: () => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ skuList, onOpenSkuSummary }) => {
  // Calculate totals dynamically from skuList
  const totalPending = skuList.reduce((acc, item) => acc + item.pendingBottles, 0);
  const totalShipped = skuList.reduce((acc, item) => acc + item.shippedBottles, 0);
  const totalCleared = skuList.reduce((acc, item) => acc + item.clearedBottles, 0);
  const totalWrittenOff = totalPending + totalShipped + totalCleared;
  const totalPendingReturn = 1250; // 待返货：经销商尚未与下游批发商/中间商核销的返货券总数

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs mb-5">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        {/* Title & Subtitle Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">返货券商品出库</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-normal bg-blue-50 text-blue-600 border border-blue-200/80">
              每小时拉取一次
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
            <span>支持按商户、单号、签收状态和时间快速筛选，统一处理待出库与已出库单据。</span>
          </p>
        </div>

        {/* 4 Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
          {/* 1. 待返货 */}
          <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-200 transition-all hover:border-slate-300 relative">
            <div className="text-[12px] text-slate-600 font-medium flex items-center justify-between">
              <span>待返货</span>
              <div className="relative flex items-center group/tooltip">
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer" />
                <div className="absolute bottom-full right-0 mb-2 hidden group-hover/tooltip:block z-50 w-60 p-2.5 bg-slate-900/95 text-white text-[11px] rounded-lg shadow-xl leading-relaxed backdrop-blur-xs font-normal pointer-events-none">
                  经销商尚未与下游批发商/中间商核销的返货券总数。
                  <div className="absolute top-full right-1 -mt-1 border-4 border-transparent border-t-slate-900/95"></div>
                </div>
              </div>
            </div>
            <div className="mt-1.5 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-800 tracking-tight">
                {totalPendingReturn.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 font-normal">瓶</span>
            </div>
            <div className="mt-1 text-[10px] text-slate-400 flex items-center justify-between">
              <span className="truncate" title="经销商尚未与下游批发商/中间商核销">经销商尚未与下游批发商/中间商核销</span>
            </div>
          </div>

          {/* 2. 已核销 */}
          <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-200 transition-all hover:border-slate-300 relative">
            <div className="text-[12px] text-slate-600 font-medium flex items-center justify-between">
              <span>已核销</span>
              <div className="relative flex items-center group/tooltip">
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer" />
                <div className="absolute bottom-full right-0 mb-2 hidden group-hover/tooltip:block z-50 w-60 p-2.5 bg-slate-900/95 text-white text-[11px] rounded-lg shadow-xl leading-relaxed backdrop-blur-xs font-normal pointer-events-none">
                  经销商已核销下游的返货券总数，已核销=已发放+待发放。
                  <div className="absolute top-full right-1 -mt-1 border-4 border-transparent border-t-slate-900/95"></div>
                </div>
              </div>
            </div>
            <div className="mt-1.5 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-800 tracking-tight">
                {totalWrittenOff.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 font-normal">瓶</span>
            </div>
            <div className="mt-1 text-[10px] text-slate-400 flex items-center justify-between">
              <span>= 已发放 + 待发放</span>
            </div>
          </div>

          {/* 3. 已发放（已出库） */}
          <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-200 transition-all hover:border-slate-300 relative">
            <div className="text-[12px] text-slate-600 font-medium flex items-center justify-between">
              <span>已发放（已出库）</span>
              <div className="relative flex items-center group/tooltip">
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer" />
                <div className="absolute bottom-full right-0 mb-2 hidden group-hover/tooltip:block z-50 w-60 p-2.5 bg-slate-900/95 text-white text-[11px] rounded-lg shadow-xl leading-relaxed backdrop-blur-xs font-normal pointer-events-none">
                  确认出库后将自动发放乐享券。
                  <div className="absolute top-full right-1 -mt-1 border-4 border-transparent border-t-slate-900/95"></div>
                </div>
              </div>
            </div>
            <div className="mt-1.5 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-800 tracking-tight">
                {totalShipped.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 font-normal">瓶</span>
            </div>
            <div className="mt-1 text-[10px] text-emerald-600 font-medium flex items-center justify-between">
              <span>已自动发放乐享券</span>
            </div>
          </div>

          {/* 4. 待发放（待出库） -> Clickable interactive card for SKU summary */}
          <div className="relative">
            <button
              onClick={onOpenSkuSummary}
              className="w-full h-full bg-gradient-to-br from-blue-50/90 via-blue-50/40 to-white rounded-xl p-3.5 border-2 border-blue-500 hover:border-blue-600 shadow-sm hover:shadow-md transition-all text-left cursor-pointer transform active:scale-98 flex flex-col justify-between"
              title="点击查看每个品项待出库明细"
            >
              {/* Top highlight badge & Info icon */}
              <div className="flex items-center justify-between w-full">
                <div className="text-[12px] text-blue-900 font-semibold">
                  <span>待发放（待出库）</span>
                </div>

                <div className="relative flex items-center group/tooltip" onClick={(e) => e.stopPropagation()}>
                  <Info className="w-3.5 h-3.5 text-blue-500 hover:text-blue-700 transition-colors cursor-pointer" />
                  <div className="absolute bottom-full right-0 mb-2 hidden group-hover/tooltip:block z-50 w-64 p-2.5 bg-slate-900/95 text-white text-[11px] rounded-lg shadow-xl leading-relaxed backdrop-blur-xs font-normal pointer-events-none">
                    经销商已核销下游，但尚未确认出库发放成乐享券的返货券总数。
                    <div className="absolute top-full right-1 -mt-1 border-4 border-transparent border-t-slate-900/95"></div>
                  </div>
                </div>
              </div>

              <div className="mt-1.5 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-blue-700 tracking-tight">
                  {totalPending.toLocaleString()}
                </span>
                <span className="text-[11px] text-blue-600 font-medium">瓶</span>
              </div>

              <div className="mt-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 flex items-center justify-between pt-1 border-t border-blue-100/80">
                <span className="flex items-center gap-1">
                  按品项汇总明细
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-blue-500" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
