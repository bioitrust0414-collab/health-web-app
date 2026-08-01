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
  tier: "健康金卡會員",
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
  { id: "r1", title: "體脂測量單次體驗", detail: "全門市適用，含專員解說", cost: 300, emoji: "⚖️" },
  { id: "r2", title: "營養師諮詢折 500", detail: "線上或門市皆可使用", cost: 550, emoji: "🥗" },
  { id: "r3", title: "魚油 Omega-3 30 粒", detail: "隨身包裝，體驗份量", cost: 900, emoji: "🐟" },
  { id: "r4", title: "健檢方案折 2,000", detail: "全身健檢專案適用", cost: 1500, emoji: "🏥" },
];

export type Activity = {
  id: string;
  label: string;
  date: string;
  delta: number;
};

export const activities: Activity[] = [
  { id: "a1", label: "購買 魚油 Omega-3", date: "08/01 09:12", delta: 98 },
  { id: "a2", label: "兌換 體脂測量體驗", date: "07/28 15:40", delta: -300 },
  { id: "a3", label: "完成年度健檢回饋", date: "07/22 11:05", delta: 500 },
  { id: "a4", label: "連續 7 日達成步數目標", date: "07/19 19:33", delta: 60 },
  { id: "a5", label: "好友推薦獎勵", date: "07/12 10:20", delta: 150 },
];
