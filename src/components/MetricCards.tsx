import React from 'react';
import { Info, ChevronRight, ScanLine, Package } from 'lucide-react';
import { SkuSummaryItem } from '../types';

interface MetricCardsProps {
  skuList: SkuSummaryItem[];
  onOpenSkuSummary: () => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ skuList, onOpenSkuSummary }) => {
  // 订单层级：待出库 / 已出库，动态从 skuList 汇总
  const totalPending = skuList.reduce((acc, item) => acc + item.pendingBottles, 0); // 待出库
  const totalShipped = skuList.reduce((acc, item) => acc + item.shippedBottles, 0); // 已出库

  // 码层级：待返货 = 消费者扫码核销、经销商尚未取码成单，独立于下方订单列表
  const totalPendingReturn = 1250; // 待返货：暂写死，后续接入码核销记录接口

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs mb-5">
      {/* 标题行 */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">下游返货券订单出库</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-normal bg-blue-50 text-blue-600 border border-blue-200/80">
              每小时拉取一次
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
            <span>支持按商户、单号、签收状态和时间快速筛选，统一处理待出库与已出库单据。</span>
          </p>
        </div>
      </div>

      {/* 两段分组分栏：码层级（未成单） vs 订单层级（成单） */}
      <div className="mt-5 flex flex-col lg:flex-row items-stretch gap-4 lg:gap-0">
        {/* 左段：核销环节（未成单） */}
        <div className="lg:pr-6 flex flex-col">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
            <ScanLine className="w-3.5 h-3.5" />
            <span>未生成返货订单</span>
          </div>

          <div className="bg-slate-50/90 rounded-xl p-3.5 border border-dashed border-slate-300 flex-1 relative min-w-[200px]">
            <div className="text-[12px] text-slate-600 font-medium flex items-center justify-between">
              <span>经销商待从下游返货</span>
              <div className="relative flex items-center group/tooltip">
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer" />
                <div className="absolute bottom-full right-0 mb-2 hidden group-hover/tooltip:block z-50 w-60 p-2.5 bg-slate-900/95 text-white text-[11px] rounded-lg shadow-xl leading-relaxed backdrop-blur-xs font-normal pointer-events-none">
                  消费者扫码核销后、经销商尚未取码成单的返货券总数。尚未生成返货券订单，不在下方订单列表中。
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
              <span className="truncate" title="消费者已核销，经销商尚未从下游取码生成返货订单">消费者已核销，经销商尚未从下游取码生成返货订单</span>
            </div>
          </div>
        </div>

        {/* 分隔线 */}
        <div className="hidden lg:block w-px bg-slate-200" />

        {/* 右段：返货券订单（成单） */}
        <div className="lg:pl-6 flex-1 flex flex-col">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
            <Package className="w-3.5 h-3.5" />
            <span>返货券订单</span>
            <span className="ml-1 px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold normal-case">{`${(totalPending + totalShipped).toLocaleString()} 瓶`}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
            {/* 待出库（可点击看品项汇总） */}
            <div className="relative">
              <button
                onClick={onOpenSkuSummary}
                className="w-full h-full bg-gradient-to-br from-blue-50/90 via-blue-50/40 to-white rounded-xl p-3.5 border-2 border-blue-500 hover:border-blue-600 shadow-sm hover:shadow-md transition-all text-left cursor-pointer transform active:scale-98 flex flex-col justify-between"
                title="点击查看每个品项待出库明细"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="text-[12px] text-blue-900 font-semibold">
                    <span>待出库-未发放乐享券</span>
                  </div>
                  <div className="relative flex items-center group/tooltip" onClick={(e) => e.stopPropagation()}>
                    <Info className="w-3.5 h-3.5 text-blue-500 hover:text-blue-700 transition-colors cursor-pointer" />
                    <div className="absolute top-full right-0 mt-2 hidden group-hover/tooltip:block z-50 w-64 p-2.5 bg-slate-900/95 text-white text-[11px] rounded-lg shadow-xl leading-relaxed backdrop-blur-xs font-normal pointer-events-none">
                      经销商已取码生成返货券订单、但尚未确认出库的返货券总数。确认出库后将自动发放乐享券。
                      <div className="absolute bottom-full right-1 -mb-1 border-4 border-transparent border-b-slate-900/95"></div>
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
                  <span className="flex items-center gap-1">按品项汇总待出库数量</span>
                  <ChevronRight className="w-3.5 h-3.5 text-blue-500" />
                </div>
              </button>
            </div>

            {/* 已出库 */}
            <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-200 flex-1 relative">
              <div className="text-[12px] text-slate-600 font-medium flex items-center justify-between">
                <span>已出库-已发放乐享券</span>
                <div className="relative flex items-center group/tooltip">
                  <Info className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer" />
                  <div className="absolute bottom-full right-0 mb-2 hidden group-hover/tooltip:block z-50 w-60 p-2.5 bg-slate-900/95 text-white text-[11px] rounded-lg shadow-xl leading-relaxed backdrop-blur-xs font-normal pointer-events-none">
                    已确认出库、并自动发放乐享券的返货券总数。
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
              <div className="mt-1 text-[10px] text-slate-400 font-medium flex items-center justify-between">
                <span>已自动发放乐享券</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
