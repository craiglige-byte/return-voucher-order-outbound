export type OrderStatus = '待出库' | '已出库';

export type ReceiptStatus = '已签收' | '待签收' | '运输中' | '已拒收';

export interface OrderSKUItem {
  skuId: string;
  skuName: string;
  category: string;
  unit: string; // e.g. 瓶
  bottlesPerBox: number; // e.g. 15
  bottles: number;
  boxes: number;
  unitPrice: number; // 元
  totalAmount: number; // 元
  shippedBottles: number;
  pendingBottles: number;
  clearedBottles: number;
}

export interface CouponOutboundOrder {
  id: string;
  orderNo: string;
  merchantName: string;
  merchantAddress: string;
  bossPhone: string;
  couponCount: number;
  totalBottles: number;
  totalBoxes: number;
  writeOffAmount: number; // 核销费用金额(元)
  receiptStatus: ReceiptStatus;
  orderUser: string;
  orderTime: string;
  driverPhone: string;
  driverName: string;
  receiptUser: string;
  receiptTime: string;
  outboundUser: string;
  outboundTime: string;
  status: OrderStatus;
  items: OrderSKUItem[];
}

export interface SkuSummaryItem {
  id: string;
  name: string;
  category: string;
  specification: string; // e.g. 600ml
  totalBottles: number;
  shippedBottles: number;
  pendingBottles: number;
  clearedBottles: number;
  boxes: number;
  merchantCount: number;
  merchants: {
    merchantName: string;
    pendingBottles: number;
    orderNo: string;
  }[];
}

export interface FilterState {
  orderNo: string;
  merchantName: string;
  startDate: string;
  endDate: string;
  receiptType: string;
  status: OrderStatus;
}
