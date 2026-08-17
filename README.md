# 下游返货券订单出库管理系统

进销存系统下「返货券」出库模块原型，用于展示和处理返货券商品从核销到出库的完整流程。

## 业务链路

```
消费者买饮料中奖 → 门店老板扫码核销 → 经销商从下游取码 → 生成返货券订单 → 确认出库 → 发放乐享券
```

三个层级：

| 层级 | 名称 | 性质 | 是否进入订单列表 |
|------|------|------|------------------|
| ① 码核销 | 经销商待从下游返货 | 码核销记录（未成单） | 否 |
| ② 订单 | 待出库（未发放乐享券） | 返货券订单 | 是 |
| ③ 订单 | 已出库（已发放乐享券） | 返货券订单 | 是 |

## 技术栈

- Vite 6 + React 19 + TypeScript
- Tailwind CSS 4（@tailwindcss/vite）
- lucide-react 图标库
- motion 动效库

## 启动

```bash
npm install
npm run dev      # 默认端口 3000，被占用时自动切换（如 3001）
```

## 构建与部署

```bash
npm run build    # 输出到 dist/
```

GitHub Pages 使用 `docs/` 目录作为静态站点，构建后需将 `dist/` 内容同步到 `docs/`。

## 目录结构

```
src/
├── App.tsx                    # 页面主入口，状态管理与业务逻辑
├── main.tsx                   # React 挂载入口
├── types.ts                   # TypeScript 类型定义
├── index.css                  # 全局样式
├── data/
│   └── mockData.ts            # mock 数据（品项汇总 + 返货券订单）
└── components/
    ├── Sidebar.tsx            # 左侧导航菜单
    ├── Header.tsx             # 顶部面包屑
    ├── MetricCards.tsx        # 顶部两段分栏统计（未生成返货订单 vs 返货券订单）
    ├── OrderTable.tsx         # 订单列表（待出库/已出库 tab）
    ├── OrderDetailModal.tsx   # 订单详情弹窗
    └── SkuSummaryModal.tsx    # 待出库商品统计弹窗
```

## 相关文档

- [PRD](./PRD.md) — 产品需求文档
- [迭代记录](./ITERATION.md) — 版本迭代记录
