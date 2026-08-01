export type Member = {
  name: string;
  tier: string;
  memberId: string;
  points: number;
  stamps: number;
  stampGoal: number;
  pointsToNextTier: number;
  avatarInitial: string;
};

export const member: Member = {
  name: "陳小綠",
  tier: "金卡會員",
  memberId: "8823 4417 0925",
  points: 1280,
  stamps: 7,
  stampGoal: 10,
  pointsToNextTier: 220,
  avatarInitial: "綠",
};

export type Reward = {
  id: string;
  title: string;
  detail: string;
  cost: number;
  emoji: string;
};

export const rewards: Reward[] = [
  { id: "r1", title: "手沖單品咖啡", detail: "任選淺焙豆，內用外帶皆可", cost: 300, emoji: "☕" },
  { id: "r2", title: "季節限定蛋糕", detail: "檸檬乳酪或巴斯克，二選一", cost: 550, emoji: "🍰" },
  { id: "r3", title: "咖啡豆 200g", detail: "當月精選莊園豆", cost: 900, emoji: "🫘" },
  { id: "r4", title: "聯名保溫杯", detail: "限量 200 個，售完為止", cost: 1500, emoji: "🥤" },
];

export type Activity = {
  id: string;
  label: string;
  date: string;
  delta: number;
};

export const activities: Activity[] = [
  { id: "a1", label: "信義門市消費", date: "08/01 09:12", delta: 62 },
  { id: "a2", label: "兌換 手沖單品咖啡", date: "07/28 15:40", delta: -300 },
  { id: "a3", label: "生日禮金加倍", date: "07/22 11:05", delta: 200 },
  { id: "a4", label: "中山門市消費", date: "07/19 19:33", delta: 88 },
  { id: "a5", label: "好友推薦獎勵", date: "07/12 10:20", delta: 150 },
];
