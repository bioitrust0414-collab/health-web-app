export type Metric = {
  id: string;
  label: string;
  value: string;
  unit: string;
  status: "normal" | "watch" | "high";
  hint: string;
};

export const dailyMetrics: Metric[] = [
  { id: "steps", label: "今日步數", value: "8,420", unit: "步", status: "normal", hint: "目標 10,000 步" },
  { id: "sleep", label: "昨夜睡眠", value: "7.2", unit: "小時", status: "normal", hint: "深睡 1.6 小時" },
  { id: "hr", label: "靜止心率", value: "68", unit: "bpm", status: "normal", hint: "近 7 日平均 70" },
  { id: "weight", label: "體重", value: "63.4", unit: "kg", status: "watch", hint: "BMI 22.8 · 較上月 +0.6" },
];

export const weeklySteps = [
  { day: "一", steps: 6200 },
  { day: "二", steps: 9100 },
  { day: "三", steps: 7400 },
  { day: "四", steps: 11200 },
  { day: "五", steps: 8600 },
  { day: "六", steps: 12400 },
  { day: "日", steps: 8420 },
];

export type LabResult = {
  id: string;
  name: string;
  value: number;
  unit: string;
  reference: string;
  status: "normal" | "watch" | "high";
  trend: number[];
};

export const labResults: LabResult[] = [
  {
    id: "glucose",
    name: "飯前血糖",
    value: 96,
    unit: "mg/dL",
    reference: "70 – 99",
    status: "normal",
    trend: [92, 94, 98, 95, 96],
  },
  {
    id: "cholesterol",
    name: "總膽固醇",
    value: 214,
    unit: "mg/dL",
    reference: "< 200",
    status: "high",
    trend: [188, 196, 203, 209, 214],
  },
  {
    id: "hdl",
    name: "高密度膽固醇",
    value: 52,
    unit: "mg/dL",
    reference: "> 40",
    status: "normal",
    trend: [48, 50, 51, 50, 52],
  },
  {
    id: "bp",
    name: "血壓（收縮）",
    value: 128,
    unit: "mmHg",
    reference: "< 120",
    status: "watch",
    trend: [118, 122, 125, 126, 128],
  },
  {
    id: "hba1c",
    name: "醣化血色素",
    value: 5.4,
    unit: "%",
    reference: "< 5.7",
    status: "normal",
    trend: [5.6, 5.5, 5.5, 5.4, 5.4],
  },
];

export type ReportFile = {
  id: string;
  title: string;
  clinic: string;
  date: string;
  itemCount: number;
};

export const reportFiles: ReportFile[] = [
  { id: "f1", title: "2026 年度全身健檢", clinic: "康悅健檢中心", date: "2026/07/18", itemCount: 62 },
  { id: "f2", title: "血脂追蹤複檢", clinic: "仁生內科診所", date: "2026/04/02", itemCount: 12 },
  { id: "f3", title: "2025 年度全身健檢", clinic: "康悅健檢中心", date: "2025/07/09", itemCount: 58 },
];

import fishOilImg from "@/assets/hp-dha-fish-oil.jpg";
import probioticImg from "@/assets/hp-cranberry-probiotic.jpg";
import bpMonitorImg from "@/assets/hp-natto-q10.jpg";
import checkupImg from "@/assets/service-checkup.jpg";
import dietitianImg from "@/assets/service-dietitian.jpg";
import coachingImg from "@/assets/service-coaching.jpg";

export type Product = {
  id: string;
  name: string;
  detail: string;
  price: number;
  kind: "physical" | "service";
  tag: string;
  image: string;
};

export const products: Product[] = [
  { id: "p1", name: "魚油 Omega-3 90 粒", detail: "高濃度 EPA/DHA，血脂偏高首選", price: 980, kind: "physical", tag: "熱銷", image: fishOilImg },
  { id: "p2", name: "膳食纖維益生菌", detail: "30 日份，餐前沖泡", price: 760, kind: "physical", tag: "回購率高", image: probioticImg },
  { id: "p3", name: "藍牙血壓計", detail: "自動同步 App 紀錄", price: 2280, kind: "physical", tag: "裝置", image: bpMonitorImg },
  { id: "p4", name: "全身健檢方案", detail: "含 62 項檢查與醫師解說", price: 12800, kind: "service", tag: "可預約", image: checkupImg },
  { id: "p5", name: "營養師 1 對 1 諮詢", detail: "50 分鐘線上諮詢，含飲食計畫", price: 1500, kind: "service", tag: "線上", image: dietitianImg },
  { id: "p6", name: "12 週控糖課程", detail: "每週任務＋教練追蹤", price: 5600, kind: "service", tag: "訂閱", image: coachingImg },
];
