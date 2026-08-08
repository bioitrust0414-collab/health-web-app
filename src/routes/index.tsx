import { MemberCta } from "@/components/home/MemberCta";

// ... 保留現有所有 import ...

function Index() {
  return (
    <>
      {/* 你現有的所有 section：HeroSection、ClinicSection 等 */}
      <HeroSection />
      <ClinicSection />
      {/* ... 其他現有區塊 ... */}

      {/* ✅ 新增：會員召喚區塊 */}
      <MemberCta />

      <Footer />
      <SocialFab />
    </>
  );
}
