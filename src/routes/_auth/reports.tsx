import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const getReports = createServerFn({ method: "GET" })
  .validator((profileId: unknown) => {
    if (typeof profileId !== "string" || profileId.length === 0) {
      throw new Error("profileId is required");
    }
    return profileId;
  })
  .handler(async ({ data: profileId }) => {
    const { restGetList } = await import("@/lib/supabaseAdmin");
    const reports = await restGetList(
      "reports",
      `profile_id=eq.${profileId}&order=report_date.desc`
    );
    return reports;
  });

export const Route = createFileRoute("/_auth/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const { user } = useAuth();

  const { data: reports, isLoading } = useQuery({
    queryKey: ["reports", user?.profileId],
    queryFn: () => getReports({ data: user!.profileId }),
    enabled: !!user?.profileId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-b-2 border-emerald-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">檢驗報告</h1>
        <p className="text-gray-500">查看您的所有檢驗報告與健康數據</p>
      </div>

      {!reports || reports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">目前沒有報告資料</p>
            <p className="text-sm text-gray-400 mt-1">完成檢查後，報告將自動顯示於此</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report: any) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {report.summary_json?.package ?? report.lis_report_id}
                  </CardTitle>
                  <Badge variant="outline">{report.report_date}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {report.summary_json?.height_cm && (
                    <div>
                      <span className="text-gray-500">身高</span>
                      <p className="font-medium">{report.summary_json.height_cm} cm</p>
                    </div>
                  )}
                  {report.summary_json?.weight_kg && (
                    <div>
                      <span className="text-gray-500">體重</span>
                      <p className="font-medium">{report.summary_json.weight_kg} kg</p>
                    </div>
                  )}
                  {report.summary_json?.bmi && (
                    <div>
                      <span className="text-gray-500">BMI</span>
                      <p className="font-medium">{report.summary_json.bmi}</p>
                    </div>
                  )}
                </div>
                {report.summary_json?.items && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {Object.entries(report.summary_json.items as Record<string, string>).map(
                        ([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-gray-500">{key}</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
