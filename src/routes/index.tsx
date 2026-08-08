import { createFileRoute } from "@tanstack/react-router";
import dahuaCss from "@/styles/dahua.css?url";
import { Navbar } from "@/components/dahua/Navbar";
import { HeroSection } from "@/components/dahua/HeroSection";
import { ClinicSection } from "@/components/dahua/ClinicSection";
import { CheckupsSection } from "@/components/dahua/CheckupsSection";
import { GeneSection } from "@/components/dahua/GeneSection";
import { SpecializedSection } from "@/components/dahua/SpecializedSection";
import { ComparisonTable } from "@/components/dahua/ComparisonTable";
import { ProductsSection } from "@/components/dahua/ProductsSection";
import { EducationSection } from "@/components/dahua/EducationSection";
import { BookingSection } from "@/components/dahua/BookingSection";
import { Footer } from "@/components/dahua/Footer";
import { SocialFab } from "@/components/dahua/SocialFab";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "大華醫事檢驗所 - 精準醫學，數據實證" },
      {
        name: "description",
        content:
          "大華醫事檢驗所深耕預防醫學，提供健康檢查、基因檢測、過敏原檢測與專業諮詢，地址：彰化市崙平南路 532 號。",
      },
      { property: "og:title", content: "大華醫事檢驗所 - 精準醫學，數據實證" },
      {
        property: "og:description",
        content: "健康檢查、基因檢測、過敏原檢測與專業諮詢，數據實證的預防醫學夥伴。",
      },
    ],
    links: [{ rel: "stylesheet", href: dahuaCss }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ClinicSection />
      <CheckupsSection />
      <GeneSection />
      <SpecializedSection />
      <ComparisonTable />
      <ProductsSection />
      <EducationSection />
      <BookingSection />
      <Footer />
      <SocialFab />
    </>
  );
}
