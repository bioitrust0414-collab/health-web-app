export type Package = {
  id: string;
  name: string;
  icon: string;
  desc: string;
  items: string[];
};

export const packages: Record<"general" | "special", Package[]> = {
  general: [
    {
      id: "basic",
      name: "DH1 新生活健康檢查",
      icon: "💚",
      desc: "涵蓋血液、尿液、肝腎功能、三高等基礎項目，適合首次健檢或年度例行篩檢。",
      items: [
        "血液常規（15項）",
        "尿液常規（16項）",
        "肝功能（GOT / GPT 等 6 項）",
        "膽道功能（T-Bil / D-Bil 等）",
        "酒精性肝炎（r-GT）",
        "腎功能（BUN / Cre）",
        "痛風（UA）",
        "膽固醇",
        "中性脂肪",
        "血糖（AC sugar）",
        "胰臟（α-amylase）",
        "心肌酵素（CPK）",
      ],
    },
    {
      id: "happy",
      name: "DH2 幸福型健康檢查",
      icon: "❤️",
      desc: "在基礎項目之上，增加心血管硬化指數分析、早期肝癌篩檢與糖化血色素。",
      items: [
        "包含 DH1 全部項目",
        "高密度膽固醇（HDL-C）",
        "低密度膽固醇（LDL-C）",
        "血管硬化指數",
        "肝癌篩檢（AFP）",
        "糖化血色素（HbA1c）",
      ],
    },
    {
      id: "refined",
      name: "DH3 精緻型健康檢查",
      icon: "🔬",
      desc: "進一步加入 B 型、C 型肝炎篩檢、甲狀腺功能分析、類風濕性關節炎與高敏感度發炎指標。",
      items: [
        "包含 DH2 全部項目",
        "B 型肝炎表面抗原／抗體（HBsAg / HBsAb）",
        "C 型肝炎抗體（Anti-HCV）",
        "甲狀腺功能（T4 / TSH）",
        "類風濕關節炎（RA）",
        "高敏感度發炎指標（hsCRP）",
      ],
    },
    {
      id: "premium",
      name: "DH5 尊榮型健康檢查",
      icon: "👑",
      desc: "最完整的全方位健檢，包含胃幽門桿菌篩檢、過敏體質分析、荷爾蒙檢查與全套防癌腫瘤標記篩檢。",
      items: [
        "包含 DH3 全部項目",
        "胃幽門桿菌（HP）",
        "過敏性體質（IgE）",
        "糞便潛血（FOBT）",
        "心肌梗塞風險（Homocysteine）",
        "荷爾蒙（Hormone）",
        "全套防癌腫瘤標記篩檢",
      ],
    },
    {
      id: "elite",
      name: "DHA 菁英型健康檢查",
      icon: "🧬",
      desc: "針對心血管與代謝深入分析，加入胰島素阻抗、骨質疏鬆風險、全套腫瘤標記等高階指標。",
      items: [
        "肝膽功能（GOT / GPT / TP / ALB 等）",
        "酒精／藥物性肝炎（r-GT）",
        "腎功能（BUN / Cre / eGFR）",
        "胰島素阻抗",
        "心血管風險（hsCRP / NT-PRO BNP）",
        "腫瘤標記",
        "維他命 D",
        "可體松（Cortisol）",
        "發炎指標（ESR）",
        "Ferritin / Folate / B12",
        "抗核抗體（ANA）",
      ],
    },
    {
      id: "antiage",
      name: "DH12 抗衰老健康檢查",
      icon: "🌿",
      desc: "結合基礎健檢與抗老荷爾蒙、性荷爾蒙結合球蛋白等指標，全面評估身體老化狀態。",
      items: [
        "包含 DH2 全部項目",
        "雄性激素（Testosterone）",
        "雌性激素（Estrogen）",
        "抗老壓力荷爾蒙（DHEA-S）",
        "甲狀腺（TSH）",
        "性荷爾蒙結合球蛋白（SHBG）",
      ],
    },
  ],
  special: [
    {
      id: "premarital",
      name: "DH6 婚前甜蜜健康檢查",
      icon: "💕",
      desc: "為準新人設計，包含地中海型貧血評估、傳染病篩檢、蠶豆症，以及男女性別專屬項目。",
      items: [
        "地中海型貧血評估",
        "血液／尿液常規",
        "肝腎功能、痛風、血脂、血糖",
        "B 型／C 型肝炎",
        "梅毒（VDRL）",
        "愛滋病毒（HIV）",
        "血型（ABO / Rh）",
        "蠶豆症",
        "♂ 男性：精液分析",
        "♀ 女性：德國麻疹抗體",
      ],
    },
    {
      id: "cancer",
      name: "DH7 防癌健康檢查",
      icon: "🛡️",
      desc: "針對男女不同器官的腫瘤標記進行專屬篩檢，早期發現潛在癌症風險。",
      items: [
        "♂ 男性：AFP、CEA、PSA、CA-199、CA72-4、CYFRA21-1、EBV-IgA、β-HCG",
        "♀ 女性：AFP、CEA、CA-199、CA72-4、CYFRA21-1、CA-125、CA-153、β-HCG",
      ],
    },
    {
      id: "liver",
      name: "DH8 肝臟組合檢查",
      icon: "🧡",
      desc: "針對肝炎病毒、肝功能與肝癌標記進行全面篩檢，適合有肝炎家族史或需定期追蹤者。",
      items: [
        "肝膽功能 9 項（GOT / GPT / TP / ALB / GLO / A/G / Alk-P / T-Bil / D-Bil）",
        "酒精性肝炎（r-GT）",
        "B 型肝炎（HBsAg / HBeAg / HBsAb）",
        "C 型肝炎（Anti-HCV）",
        "肝癌篩檢（AFP）",
        "A 型肝炎抗體（HAV-IgG）",
      ],
    },
    {
      id: "std",
      name: "DH9 性病組合檢查",
      icon: "🔒",
      desc: "提供全面的性傳染病篩檢，包含梅毒、愛滋病毒、疱疹、披衣菌、淋病等。",
      items: [
        "梅毒（VDRL / TPHA）",
        "愛滋病毒抗體（HIV Ab）",
        "疱疹第二型（HSV II IgG）",
        "披衣菌（Chlamydia IgG）",
        "淋病（Gonozyme）",
        "尿液常規",
      ],
    },
    {
      id: "fertility",
      name: "DH10 好孕連連組合檢查",
      icon: "👶",
      desc: "備孕前的重要指標分析，男女分別提供精準的生育力評估。",
      items: [
        "♂ 男性：精液分析、睪固酮（Testosterone）",
        "♀ 女性：血液／尿液常規、濾泡刺激素（FSH）、黃體刺激素（LH）、泌乳激素（Prolactin）、甲狀腺（T4 / TSH）、抗穆勒氏管荷爾蒙（AMH）",
      ],
    },
  ],
};

export const geneTests = [
  { name: "全基因圖譜掃描", desc: "涵蓋 40 種疾病、18 項癌症基因", highlight: true },
  { name: "癌症預防基因檢測", desc: "男性 18 項 / 女性 19 項", highlight: false },
  { name: "慢性病預防基因檢測", desc: "14 項慢性病基因", highlight: false },
  { name: "心血管疾病預防基因", desc: "11 項心血管基因", highlight: false },
  { name: "兒童天生潛能基因", desc: "10 項潛能基因", highlight: false },
  { name: "體重管理基因", desc: "肥胖與減重體質基因", highlight: false },
  { name: "逆齡美妍基因", desc: "皮膚修護與抗老因子", highlight: false },
  { name: "喚時淨白基因", desc: "白皙與環境抗壓係數", highlight: false },
];

export const comparisonRows: Array<[string, ...string[]]> = [
  ["肝膽功能檢查", "V", "V", "V", "V", "V", "-", "V", "V"],
  ["酒精性及藥物性", "V", "V", "V", "V", "V", "-", "V", "V"],
  ["血液常規檢查", "V", "V", "V", "V", "V", "-", "V", "V"],
  ["尿液常規檢查", "V", "V", "V", "V", "V", "-", "V", "V"],
  ["腎功能檢查", "V", "V", "V", "V", "V", "-", "V", "V"],
  ["痛風檢查(UA)", "V", "V", "V", "V", "V", "-", "V", "V"],
  ["血糖/糖尿病", "V", "V", "V", "V", "V", "-", "V", "V"],
  ["血脂肪/膽固醇", "V", "V", "V", "V", "V", "-", "V", "V"],
  ["心肌酵素(CPK)", "V", "V", "V", "V", "V", "-", "V", "V"],
  ["胰臟功能(Amylase)", "V", "V", "V", "V", "V", "-", "V", "V"],
  ["肝癌篩檢(AFP)", "-", "V", "V", "V", "-", "V", "V", "V"],
  ["B型肝炎檢查", "-", "-", "V", "V", "V", "-", "V", "V"],
  ["C型肝炎檢查", "-", "-", "V", "V", "V", "-", "V", "V"],
  ["甲狀腺功能檢查", "-", "-", "V", "V", "V", "-", "V", "V"],
  ["腫瘤標記防癌篩", "-", "-", "-", "V", "-", "V", "-", "V"],
  ["賀爾蒙檢查/激素", "-", "-", "-", "V", "-", "-", "-", "V"],
  ["胃幽門桿菌篩檢", "-", "-", "-", "V", "-", "-", "-", "V"],
  ["維他命D", "-", "-", "-", "-", "-", "-", "V", "V"],
];

export const comparisonColumns = ["DH1", "DH2", "DH3", "DH5", "DH6", "DH7", "DHA", "DHB"];

export const bookingOptions: Array<{ label: string; values: string[] }> = [
  {
    label: "── 基礎與進階健康檢查 ──",
    values: [
      "新生活健康檢查",
      "幸福型健康檢查",
      "精緻型健康檢查",
      "尊榮型健康檢查",
      "菁英型健康檢查",
      "抗衰老健康檢查",
    ],
  },
  {
    label: "── 特定族群健康檢查 ──",
    values: [
      "婚前甜蜜健康檢查",
      "防癌健康檢查",
      "肝臟組合檢查",
      "性病組合檢查",
      "好孕連組合檢查",
    ],
  },
  {
    label: "── 基因檢測 ──",
    values: [
      "全基因圖譜掃描",
      "癌症預防基因檢測",
      "慢性病預防基因檢測",
      "心血管疾病預防基因",
      "兒童天生潛能基因",
      "體重管理基因",
      "逆齡美妍基因",
      "喚時淨白基因",
    ],
  },
  {
    label: "── 過敏原檢測 ──",
    values: [
      "急性過敏原檢測 66 項（IgE）",
      "急慢性過敏原檢測 110 項（IgE + IgG）",
      "慢性過敏原檢測 101 項（IgG）",
      "急慢性過敏原檢測 224 項",
    ],
  },
  {
    label: "── 專項檢驗 ──",
    values: ["五大營養素檢測"],
  },
  {
    label: "──────────────",
    values: ["其他 / 不確定，需要諮詢"],
  },
];
