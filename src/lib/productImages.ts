// 健康好夥伴系列商品的本地圖片（products 表的 image_url 尚未上傳圖床時使用）。
// key = products.sku，/shop 與 /bb-drink 共用同一份對照表，確保兩頁視覺一致。
import bbDrink from "@/assets/hp-bb-drink.jpg";
import dhaFishOil from "@/assets/hp-dha-fish-oil.jpg";
import nattoQ10 from "@/assets/hp-natto-q10.jpg";
import growthCalcium from "@/assets/hp-growth-calcium.jpg";
import vitalityMetabolism from "@/assets/hp-vitality-metabolism.jpg";
import nightEnzyme from "@/assets/hp-night-enzyme.jpg";
import cranberryProbiotic from "@/assets/hp-cranberry-probiotic.jpg";
import luteinEyeCare from "@/assets/hp-lutein-eye-care.jpg";
import collagenDrink from "@/assets/hp-collagen-drink.jpg";

export const PRODUCT_IMAGES: Record<string, string> = {
  "bb-drink": bbDrink,
  "dha-fish-oil": dhaFishOil,
  "natto-q10": nattoQ10,
  "growth-calcium": growthCalcium,
  "vitality-metabolism": vitalityMetabolism,
  "night-enzyme": nightEnzyme,
  "cranberry-probiotic": cranberryProbiotic,
  "lutein-eye-care": luteinEyeCare,
  "collagen-drink": collagenDrink,
};

export function productImage(sku: string, imageUrl?: string | null) {
  return PRODUCT_IMAGES[sku] ?? imageUrl ?? undefined;
}
