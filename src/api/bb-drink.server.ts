import type { BBDrinkProduct } from '@/types/bb-drink'

// 前端直接內建商品資料與圖片（public/products/），不依賴後端 Supabase。
// 圖片放在 public/ 底下，用絕對路徑字串引用即可，不用 import。
const products: BBDrinkProduct[] = [
  {
    id: 'bb-vitality-drink',
    name: 'BB神采速纖飲',
    subtitle: 'B COMPLEX＆COLLAGEN．抗疲勞健康食品認證',
    price: 680,
    image: '/products/bb-drink.png',
    description:
      'bioid BB神采速纖飲，衛部健食字第A00439號「抗疲勞功能」認證。膠原蛋白 × 牛磺酸 × BCAA × 維生素B群，由內而外養出神采自信。經動物實驗結果，有助於延緩運動後疲勞發生。',
    ingredients: ['膠原蛋白', '牛磺酸', '支鏈胺基酸（BCAA）', '綜合維生素B群', '蔓越莓/黑醋栗/覆盆莓濃縮汁'],
    benefits: ['膠原蛋白，美妍Q彈', '牛磺酸，提振精神', 'BCAA支鏈胺基酸補給', '健康食品認證｜抗疲勞功能'],
    flavor: '綜合莓果風味',
    netWeight: '30 mL/包，10 包/盒',
    stock: 100,
    isBestSeller: true,
  },
  {
    id: 'dha',
    name: '菁萃高純度DHA魚油軟膠囊',
    subtitle: 'DHA + EPA 雙效配方',
    price: 980,
    image: '/products/dha-fish-oil.png',
    description:
      '選用嚴選深海小型魚萃取，通過分子蒸餾工序，兼具高純度與黃金比例 DHA + EPA，並取得健康食品認證。每日補給，輕鬆守護健康。',
    ingredients: ['DHA', 'EPA', '抗氧化劑'],
    benefits: ['高純度DHA魚油', 'DHA+EPA複方補給', '健康食品認證', '日常保養新選擇'],
    flavor: '',
    netWeight: '60顆/盒（每日2粒）',
    stock: 100,
    isNew: true,
  },
  {
    id: 'natto-q10',
    name: '晶亮納豆Q10軟膠囊',
    subtitle: '葉黃素 × 納豆 × Q10 複方',
    price: 1280,
    image: '/products/natto-q10.jpg',
    description:
      '專為長時間用眼、需要日常護眼保養的忙碌上班族與3C科技人設計。葉黃素 × 納豆 × Q10 複方，晶亮守護搭配活力補給。',
    ingredients: ['納豆激酶', '葉黃素', '輔酶Q10', 'DHA'],
    benefits: ['葉黃素配方', '納豆萃取物添加', '輔酶Q10添加', '軟膠囊好吞食'],
    flavor: '',
    netWeight: '60顆/盒（每份2顆，共30份）',
    stock: 100,
  },
  {
    id: 'growth-calcium',
    name: '好家庭MAL成長鈣咀嚼錠',
    subtitle: '香濃牛奶風味．每日1錠．維生素D3添加',
    price: 780,
    image: '/products/growth-calcium.png',
    description:
      '為孩子成長黃金期打造的鈣質補給。結合鈣質與維生素D3，幫助鈣質吸收、強健骨骼與牙齒。香濃牛奶風味咀嚼錠，好吃又好吸收。',
    ingredients: ['鈣', '維生素D3'],
    benefits: ['補充成長關鍵鈣質', '維生素D3添加，幫助鈣質吸收', '強健骨骼，穩固牙齒發育', '香濃牛奶風味'],
    flavor: '香濃牛奶風味',
    netWeight: '60錠/盒（每錠1.2公克）',
    stock: 100,
    isBestSeller: true,
  },
  {
    id: 'vitality-metabolism',
    name: '好家庭活力代謝複方膠囊',
    subtitle: '全方位體質調理．優質能量補給',
    price: 1180,
    image: '/products/vitality-metabolism.png',
    description:
      '專為高壓生活與頻繁商務社交的現代人設計，透過嚴選植萃與天然發酵原料，協助調整體質、增強體力。※本產品為營養補充品，非藥品，不具醫療效能。',
    ingredients: ['薑黃', '芝麻素', '米糠萃取', '天然酵母維生素B群', '專利黑胡椒萃取'],
    benefits: ['全方位體質調理', '天然酵母維生素B群，提振精神', '專利黑胡椒萃取，提升吸收率', '薑黃芝麻素植萃抗氧化'],
    flavor: '',
    netWeight: '60粒膠囊/盒',
    stock: 100,
  },
  {
    id: 'night-enzyme',
    name: '好家庭夜酵素複方膠囊',
    subtitle: '睡得好．代謝好．輕鬆好',
    price: 1380,
    image: '/products/night-enzyme.png',
    description:
      '把握夜間黃金修復期，讓身體在睡眠中同步代謝與修護。結合蔬果酵素、益生菌與舒眠因子，睡得好、代謝好、隔日輕鬆好狀態。',
    ingredients: ['綜合蔬果酵素', '乳酸菌', 'GABA', '色胺酸'],
    benefits: ['放鬆舒眠，助你安穩入夢', '夜間代謝，把握修復黃金期', '幫助消化，隔日輕盈有感', '抗氧化保護'],
    flavor: '',
    netWeight: '60粒膠囊/盒',
    stock: 100,
  },
  {
    id: 'cranberry-probiotics',
    name: '好家庭蔓越莓益生菌膠囊',
    subtitle: '150億活菌．女性私密防護配方',
    price: 1280,
    image: '/products/cranberry-probiotics.png',
    description:
      '結合高濃度Cran-Max®蔓越莓與多株專利益生菌，搭配益生元與洛神花、西印度櫻桃美妍植萃，維持私密及腸道菌叢平衡。※本產品非藥品，不能取代藥物治療。',
    ingredients: ['Cran-Max®蔓越莓濃縮粉', '150億活菌', '日本Oryza櫻花乳酸菌', 'ellirose洛神花萃取'],
    benefits: ['維持私密及泌尿道健康', '150億活菌調整菌叢平衡', '女性專屬菌株', '花青素抗氧化美妍'],
    flavor: '',
    netWeight: '60粒膠囊/盒',
    stock: 100,
  },
]

export async function listBBDrinkProducts(): Promise<{ products: BBDrinkProduct[]; configured: boolean }> {
  return { products, configured: true }
}

export async function findBBDrinkProduct(id: string): Promise<BBDrinkProduct | null> {
  return products.find((product) => product.id === id) ?? null
}
