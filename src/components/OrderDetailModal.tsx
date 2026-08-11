import React from 'react';
import { X, Building2, Phone, MapPin, Truck, Calendar, User, FileText, CheckCircle2, AlertCircle, Package } from 'lucide-react';
import { CouponOutboundOrder } from '../types';

interface OrderDetailModalProps {
  order: CouponOutboundOrder | null;
  onClose: () => void;
  onConfirmOutbound?: (orderId: string) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onConfirmOutbound,
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-800">出库单详情</h2>
                <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                  {order.orderNo}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-medium ${
                    order.status === '已出库'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">返货券商品出库核心流程明细数据</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Merchant Info Block */}
          <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 text-blue-600">
              <Building2 className="w-4 h-4" />
              商户基础信息
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 pt-1">
              <div><strong className="text-slate-700">商户名称：</strong>{order.merchantName}</div>
              <div><strong className="text-slate-700">老板手机：</strong>{order.bossPhone}</div>
              <div className="sm:col-span-2 flex items-start gap-1">
                <strong className="text-slate-700 shrink-0">商户地址：</strong>
                <span className="text-slate-600">{order.merchantAddress}</span>
              </div>
            </div>
          </div>

          {/* Logistics & Signing Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/80 space-y-1.5">
              <h4 className="font-bold text-slate-700 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-slate-500" />
                配送/司机信息
              </h4>
              <div><strong className="text-slate-700">司机姓名：</strong>{order.driverName}</div>
              <div><strong className="text-slate-700">司机手机：</strong>{order.driverPhone}</div>
              <div><strong className="text-slate-700">出库人员：</strong>{order.outboundUser}</div>
              <div><strong className="text-slate-700">出库时间：</strong>{order.outboundTime || '未出库'}</div>
            </div>

            <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/80 space-y-1.5">
              <h4 className="font-bold text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                签收与费用
              </h4>
              <div><strong className="text-slate-700">签收状态：</strong>
                <span className="bg-emerald-50 text-emerald-700 font-semibold px-1.5 py-0.5 rounded border border-emerald-200/80">
                  {order.receiptStatus}
                </span>
              </div>
              <div><strong className="text-slate-700">签收人员：</strong>{order.receiptUser || '-'}</div>
              <div><strong className="text-slate-700">签收时间：</strong>{order.receiptTime || '-'}</div>
              <div><strong className="text-slate-700">核销费用：</strong><span className="text-blue-600 font-bold">¥{order.writeOffAmount.toFixed(2)}</span></div>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-800 text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                出库商品品项明细 ({order.items.length}项)
              </span>
              <span className="text-slate-500 font-normal">
                含返货券: <strong className="text-slate-800">{order.couponCount}</strong> | 总瓶数: <strong className="text-blue-600">{order.totalBottles}</strong> 瓶 ({order.totalBoxes}箱)
              </span>
            </h3>

            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-600 font-semibold text-[11px] border-b border-slate-200">
                    <th className="p-2.5">品项名称</th>
                    <th className="p-2.5">分类</th>
                    <th className="p-2.5 text-right">瓶数</th>
                    <th className="p-2.5 text-right">箱数</th>
                    <th className="p-2.5 text-right">单价(元)</th>
                    <th className="p-2.5 text-right">小计(元)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="p-2.5 font-medium text-slate-800">{item.skuName}</td>
                      <td className="p-2.5 text-slate-500">{item.category}</td>
                      <td className="p-2.5 text-right font-bold text-slate-800">{item.bottles} 瓶</td>
                      <td className="p-2.5 text-right text-slate-600">{item.boxes} 箱</td>
                      <td className="p-2.5 text-right text-slate-600">¥{item.unitPrice.toFixed(2)}</td>
                      <td className="p-2.5 text-right font-semibold text-blue-600">¥{item.totalAmount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between">
          <div className="text-slate-500 text-xs">
            下单人：{order.orderUser} ({order.orderTime})
          </div>

          <div className="flex items-center space-x-2">
            {order.status === '待出库' && onConfirmOutbound && (
              <button
                onClick={() => {
                  onConfirmOutbound(order.id);
                  onClose();
                }}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                确认完成出库
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
