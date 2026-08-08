import { clinicImages } from "./assets";
import { SectionHeader } from "./SectionHeader";

export function ClinicSection() {
  return (
    <section className="clinic-section">
      <div className="container">
        <SectionHeader
          badge="About Us"
          title="大華醫事檢驗所"
          desc="位於彰化市崙平南路 532 號，擁有現代化的檢驗設備與專業的醫事檢驗團隊，致力於為民眾提供最可靠的健康檢查與檢驗服務。"
        />
        <div className="clinic-grid">
          <img src={clinicImages[0]!.src} alt={clinicImages[0]!.alt} />
          <img src={clinicImages[1]!.src} alt={clinicImages[1]!.alt} />
        </div>
        <div className="clinic-grid">
          <img src={clinicImages[2]!.src} alt={clinicImages[2]!.alt} />
          <img src={clinicImages[3]!.src} alt={clinicImages[3]!.alt} />
        </div>
      </div>
    </section>
  );
}