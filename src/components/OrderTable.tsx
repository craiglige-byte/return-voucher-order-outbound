import React, { useState } from 'react';
import {
  Search,
  RotateCcw,
  Download,
  Eye,
  CheckCircle,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  AlertCircle,
  Truck,
} from 'lucide-react';
import { CouponOutboundOrder, FilterState, OrderStatus } from '../types';

interface OrderTableProps {
  orders: CouponOutboundOrder[];
  activeStatus: OrderStatus;
  onChangeStatus: (status: OrderStatus) => void;
  onSelectOrder: (order: CouponOutboundOrder) => void;
  onBatchOutbound: (selectedIds: string[]) => void;
  onConfirmOutbound: (orderId: string) => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  activeStatus,
  onChangeStatus,
  onSelectOrder,
  onBatchOutbound,
  onConfirmOutbound,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    orderNo: '',
    merchantName: '',
    startDate: '',
    endDate: '',
    receiptType: '',
    status: activeStatus,
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter logic
  const filteredOrders = orders.filter((order) => {
    if (order.status !== activeStatus) return false;
    if (filters.orderNo && !order.orderNo.toLowerCase().includes(filters.orderNo.toLowerCase())) return false;
    if (filters.merchantName && !order.merchantName.toLowerCase().includes(filters.merchantName.toLowerCase())) return false;
    if (filters.receiptType && order.receiptStatus !== filters.receiptType) return false;
    return true;
  });

  const handleReset = () => {
    setFilters({
      orderNo: '',
      merchantName: '',
      startDate: '',
      endDate: '',
      receiptType: '',
      status: activeStatus,
    });
    setSelectedIds([]);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOrders.map((o) => o.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleExport = () => {
    const headers = [
      '单号', '商户名称', '商户地址', '老板手机号', '含返货券数量', '数量合计(瓶)',
      '数量合计(箱)', '核销费用金额(元)', '签收状态', '下单人', '下单时间',
      '司机手机号', '司机姓名', '签收人', '签收时间', '出库人', '出库时间'
    ];
    const rows = filteredOrders.map((o) => [
      `"${o.orderNo}"`, `"${o.merchantName}"`, `"${o.merchantAddress}"`, `"${o.bossPhone}"`,
      o.couponCount, o.totalBottles, o.totalBoxes, o.writeOffAmount, `"${o.receiptStatus}"`,
      `"${o.orderUser}"`, `"${o.orderTime}"`, `"${o.driverPhone}"`, `"${o.driverName}"`,
      `"${o.receiptUser}"`, `"${o.receiptTime}"`, `"${o.outboundUser}"`, `"${o.outboundTime}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `返货券出库单据_${activeStatus}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
      {/* Top Tab Bar & Export Button */}
      <div className="px-5 pt-3 pb-0 border-b border-slate-200 flex items-center justify-between bg-white">
        {/* Status Tabs */}
        <div className="flex space-x-6 text-sm font-semibold text-slate-600">
          <button
            onClick={() => {
              onChangeStatus('待出库');
              setSelectedIds([]);
            }}
            className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeStatus === '待出库'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>待出库</span>
          </button>

          <button
            onClick={() => {
              onChangeStatus('已出库');
              setSelectedIds([]);
            }}
            className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeStatus === '已出库'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>已出库</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 pb-2">
          {activeStatus === '待出库' && selectedIds.length > 0 && (
            <button
              onClick={() => {
                onBatchOutbound(selectedIds);
                setSelectedIds([]);
              }}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>批量确认出库 ({selectedIds.length})</span>
            </button>
          )}

          <button
            onClick={handleExport}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出</span>
          </button>
        </div>
      </div>

      {/* Filter Form Bar matching Screenshot 1 */}
      <div className="p-4 bg-slate-50/50 border-b border-slate-200/80 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 items-end">
          {/* 单号 */}
          <div>
            <label className="block text-slate-600 font-medium mb-1">单号</label>
            <input
              type="text"
              value={filters.orderNo}
              onChange={(e) => setFilters({ ...filters, orderNo: e.target.value })}
              placeholder="请输入出库单号"
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* 商户名称 */}
          <div>
            <label className="block text-slate-600 font-medium mb-1">商户名称</label>
            <input
              type="text"
              value={filters.merchantName}
              onChange={(e) => setFilters({ ...filters, merchantName: e.target.value })}
              placeholder="请搜索选择商户"
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* 下单时间 */}
          <div>
            <label className="block text-slate-600 font-medium mb-1">下单时间</label>
            <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full text-[11px] focus:outline-none bg-transparent"
              />
              <span>~</span>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full text-[11px] focus:outline-none bg-transparent"
              />
            </div>
          </div>

          {/* 签收类型 */}
          <div>
            <label className="block text-slate-600 font-medium mb-1">签收类型</label>
            <select
              value={filters.receiptType}
              onChange={(e) => setFilters({ ...filters, receiptType: e.target.value })}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
            >
              <option value="">请选择全类型</option>
              <option value="已签收">已签收</option>
              <option value="待签收">待签收</option>
              <option value="运输中">运输中</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {}}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded-md transition-colors cursor-pointer shadow-2xs flex items-center justify-center space-x-1"
            >
              <Search className="w-3.5 h-3.5" />
              <span>查询</span>
            </button>
            <button
              onClick={handleReset}
              className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 font-medium py-1.5 px-3 rounded-md transition-colors cursor-pointer flex items-center justify-center"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Helper Banner matching Screenshot 1 */}
      <div className="px-5 py-2 bg-slate-50/90 border-b border-slate-200/60 text-slate-500 text-[11px] flex items-center justify-between">
        <span>
          {activeStatus === '已出库'
            ? '可查看已完成出库的返货券商品单据'
            : '可处理及确认待出库的返货券商品单据'}
        </span>
        <span className="text-slate-400">显示 {filteredOrders.length} 条记录</span>
      </div>

      {/* Main Table View */}
      <div className="overflow-x-auto custom-scrollbar flex-1">
        <table className="w-full text-left border-collapse text-[11px] whitespace-nowrap">
          <thead>
            <tr className="bg-slate-100/90 text-slate-700 font-semibold border-b border-slate-200/90">
              <th className="p-3 w-10 text-center">
                <button
                  onClick={handleSelectAll}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {selectedIds.length > 0 && selectedIds.length === filteredOrders.length ? (
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="p-3">商户名称</th>
              <th className="p-3 max-w-xs">商户地址</th>
              <th className="p-3">老板手机号</th>
              <th className="p-3 text-right">含返货券数量</th>
              <th className="p-3 text-right">数量合计(瓶)</th>
              <th className="p-3 text-right">数量合计(箱)</th>
              <th className="p-3 text-right">核销费用金额(元)</th>
              <th className="p-3 text-center">签收状态</th>
              <th className="p-3">下单人</th>
              <th className="p-3">下单时间</th>
              <th className="p-3">司机手机号</th>
              <th className="p-3">司机姓名</th>
              <th className="p-3">签收人</th>
              <th className="p-3">签收时间</th>
              <th className="p-3">出库人</th>
              <th className="p-3">出库时间</th>
              <th className="p-3 text-center sticky right-0 bg-slate-100 border-l border-slate-200 shadow-xs">
                操作
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={18} className="p-12 text-center text-slate-400">
                  暂无匹配的出库单据数据
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const isSelected = selectedIds.includes(order.id);
                return (
                  <tr
                    key={order.id}
                    className={`hover:bg-blue-50/30 transition-colors ${
                      isSelected ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <td className="p-3 text-center">
                      <button
                        onClick={() => toggleSelectOne(order.id)}
                        className="text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    <td className="p-3 font-semibold text-slate-800">
                      {order.merchantName}
                    </td>

                    <td
                      className="p-3 text-slate-600 max-w-xs truncate"
                      title={order.merchantAddress}
                    >
                      {order.merchantAddress}
                    </td>

                    <td className="p-3 text-slate-600 font-mono">
                      {order.bossPhone}
                    </td>

                    <td className="p-3 text-right font-medium text-slate-800">
                      {order.couponCount}
                    </td>

                    <td className="p-3 text-right font-bold text-blue-600">
                      {order.totalBottles.toFixed(1)}
                    </td>

                    <td className="p-3 text-right text-slate-600">
                      {order.totalBoxes.toFixed(2)}
                    </td>

                    <td className="p-3 text-right font-semibold text-slate-800">
                      {order.writeOffAmount.toFixed(2)}
                    </td>

                    <td className="p-3 text-center">
                      <span className="inline-block bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium border border-emerald-200/80">
                        {order.receiptStatus}
                      </span>
                    </td>

                    <td className="p-3 text-slate-600">
                      {order.orderUser || '-'}
                    </td>

                    <td className="p-3 text-slate-500 font-mono text-[10px]">
                      {order.orderTime}
                    </td>

                    <td className="p-3 text-slate-600 font-mono">
                      {order.driverPhone}
                    </td>

                    <td className="p-3 text-slate-700 font-medium">
                      {order.driverName}
                    </td>

                    <td className="p-3 text-slate-600">
                      {order.receiptUser || '-'}
                    </td>

                    <td className="p-3 text-slate-500 font-mono text-[10px]">
                      {order.receiptTime || '-'}
                    </td>

                    <td className="p-3 text-slate-700">
                      {order.outboundUser}
                    </td>

                    <td className="p-3 text-slate-500 font-mono text-[10px]">
                      {order.outboundTime || '-'}
                    </td>

                    {/* Operation Action Sticky Cell */}
                    <td className="p-3 text-center sticky right-0 bg-white border-l border-slate-200 space-x-2 shadow-xs">
                      <button
                        onClick={() => onSelectOrder(order)}
                        className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors"
                      >
                        查看详情
                      </button>

                      {order.status === '待出库' && (
                        <button
                          onClick={() => onConfirmOutbound(order.id)}
                          className="text-emerald-600 hover:text-emerald-800 font-medium cursor-pointer transition-colors"
                        >
                          确认出库
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
        <div>
          共 {filteredOrders.length} 条记录，第 1 / 1 页
        </div>
        <div className="flex items-center space-x-1">
          <button disabled className="p-1 text-slate-300 cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 py-0.5 bg-blue-600 text-white font-medium rounded text-xs">
            1
          </span>
          <button disabled className="p-1 text-slate-300 cursor-not-allowed">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
