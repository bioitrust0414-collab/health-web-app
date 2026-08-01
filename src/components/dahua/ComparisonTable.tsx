import { comparisonColumns, comparisonRows } from "@/data/dahua";

export function ComparisonTable() {
  return (
    <section className="table-section">
      <div className="container">
        <h3 className="table-title">大華醫學檢驗中心健康檢查套組項目</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th>檢驗項目</th>
                {comparisonColumns.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map(([label, ...cells]) => (
                <tr key={label}>
                  <td className="font-bold-title">{label}</td>
                  {cells.map((c, i) => (
                    <td key={i}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}