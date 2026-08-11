import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { SkuSummaryModal } from './components/SkuSummaryModal';
import { OrderTable } from './components/OrderTable';
import { OrderDetailModal } from './components/OrderDetailModal';
import { INITIAL_SKU_SUMMARY, MOCK_ORDERS } from './data/mockData';
import { CouponOutboundOrder, OrderStatus, SkuSummaryItem } from './types';
import { CheckCircle, Info } from 'lucide-react';

export default function App() {
  const [currentMenu, setCurrentMenu] = useState('返货券商品出库');
  const [activeStatus, setActiveStatus] = useState<OrderStatus>('已出库');
  const [skuList, setSkuList] = useState<SkuSummaryItem[]>(INITIAL_SKU_SUMMARY);
  const [orders, setOrders] = useState<CouponOutboundOrder[]>(MOCK_ORDERS);
  const [isSkuSummaryOpen, setIsSkuSummaryOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<CouponOutboundOrder | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Confirm Outbound for single order
  const handleConfirmOutbound = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: '已出库',
            outboundUser: '邓福昌',
            outboundTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
          };
        }
        return ord;
      })
    );

    // Update SKU summary pending vs shipped
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      setSkuList((prev) =>
        prev.map((sku) => {
          const itemInOrd = targetOrder.items.find((i) => i.skuId === sku.id);
          if (itemInOrd) {
            const shiftQty = itemInOrd.bottles;
            return {
              ...sku,
              shippedBottles: sku.shippedBottles + shiftQty,
              pendingBottles: Math.max(0, sku.pendingBottles - shiftQty),
            };
          }
          return sku;
        })
      );
    }

    showToast(`单据 ${targetOrder?.orderNo || ''} 出库成功！`);
  };

  // Batch Outbound
  const handleBatchOutbound = (selectedIds: string[]) => {
    selectedIds.forEach((id) => handleConfirmOutbound(id));
    showToast(`已批量完成 ${selectedIds.length} 笔单据出库处理！`);
  };

  return (
    <div className="flex h-screen bg-[#f4f6f9] font-sans antialiased text-slate-800 overflow-hidden">
      {/* Left Navigation Sidebar */}
      <Sidebar currentMenu={currentMenu} onSelectMenu={setCurrentMenu} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header currentMenu={currentMenu} />

        {/* Scrollable Main Body */}
        <main className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          {currentMenu === '返货券商品出库' ? (
            <div className="max-w-7xl mx-auto space-y-4">
              {/* Metric Cards (Top right modified metric cards per user request) */}
              <MetricCards
                skuList={skuList}
                onOpenSkuSummary={() => setIsSkuSummaryOpen(true)}
              />

              {/* Main Data Table */}
              <OrderTable
                orders={orders}
                activeStatus={activeStatus}
                onChangeStatus={setActiveStatus}
                onSelectOrder={setSelectedOrder}
                onBatchOutbound={handleBatchOutbound}
                onConfirmOutbound={handleConfirmOutbound}
              />
            </div>
          ) : (
            <div className="max-w-7xl mx-auto bg-white rounded-xl p-12 border border-slate-200 text-center shadow-2xs my-8">
              <Info className="w-12 h-12 text-blue-500 mx-auto mb-3 opacity-80" />
              <h2 className="text-lg font-bold text-slate-800">{currentMenu} 模块</h2>
              <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
                当前页面为原型示例，点击左侧菜单栏中的
                <strong className="text-blue-600 font-semibold cursor-pointer underline ml-1" onClick={() => setCurrentMenu('返货券商品出库')}>
                  返货券商品出库
                </strong>
                可体验修改后的【已核销 | 已发放（已出库） | 待发放（待出库）及按品项待出库汇总】功能原型。
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Sku Summary Modal (Matching Screenshot 2 exact requirement) */}
      <SkuSummaryModal
        isOpen={isSkuSummaryOpen}
        onClose={() => setIsSkuSummaryOpen(false)}
        skuList={skuList}
      />

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onConfirmOutbound={handleConfirmOutbound}
      />

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/90 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-2 text-xs animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
