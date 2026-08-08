// api/patient-verify.cjs
// Vercel Serverless Function：接收手機+生日，呼叫 LIS，寫入 patient_mappings

const { createClient } = require("@supabase/supabase-js");

const LIS_ENDPOINT =
  process.env.LIS_ENDPOINT || "http://localhost:4001/lis/verify-patient";

module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { phone, dob, profileId } = req.body;

    if (!phone || !dob || !profileId) {
      return res
        .status(400)
        .json({ error: "phone, dob, and profileId are required" });
    }

    // 1. 呼叫 LIS（或 Mock）
    const lisRes = await fetch(LIS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, dob }),
    });

    const result = await lisRes.json();

    if (lisRes.status !== 200 || !result.found) {
      return res.status(lisRes.status).json({
        success: false,
        message: result.message || "查無資料",
      });
    }

    // 2. 寫入 Supabase patient_mappings
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { error } = await supabase.from("patient_mappings").upsert(
      {
        profile_id: profileId,
        phone,
        birthday: dob,
        patient_id: result.patientId,
        lis_source: result.source || "mock-lis",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "profile_id" }
    );

    if (error) {
      console.error("Supabase error:", error);
      return res
        .status(500)
        .json({ success: false, message: "資料庫寫入失敗" });
    }

    res.json({ success: true, patientId: result.patientId });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ success: false, message: "伺服器錯誤" });
  }
};
