// 點數、集點卡與兌換獎勵已隨商城一併移除，相關假資料同步清除。
//
// ⚠️ 以下仍是展示用假資料：MemberCard 目前對所有登入者都顯示「陳小綠」與
// 這組固定會員條碼。真實姓名已經可以從 profiles 取得（見 /member 的
// getMemberData），但會員條碼在 schema 中尚無對應欄位，因此整張卡片維持
// 原狀待後續處理。詳見 docs/ROADMAP.md。
export type Member = {
  name: string;
  tier: string;
  memberId: string;
  avatarInitial: string;
};

export const member: Member = {
  name: "陳小綠",
  tier: "健康金卡會員",
  memberId: "8823 4417 0925",
  avatarInitial: "綠",
};
