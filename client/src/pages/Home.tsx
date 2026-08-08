import { useLocation } from 'wouter';

export default function Home() {
  const [, setLocation] = useLocation();

  const plans = [
    { id: 'health-check-a', name: '成人健檢套組', price: 3500 },
    { id: 'liver-function', name: '肝功能檢查', price: 1200 },
    { id: 'blood-sugar', name: '血糖檢測', price: 800 },
    { id: 'prenatal', name: '產前檢查', price: 4800 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold">大華醫事檢驗所</h1>
          <button
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm"
            onClick={() => setLocation('/liff/entry?target=dashboard')}
          >
            查詢報告
          </button>
        </div>
      </header>

      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">大華醫事檢驗所</h2>
          <p className="text-lg text-muted-foreground mb-8">提供專業醫事檢驗服務，守護您的健康</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium"
              onClick={() => setLocation('/liff/entry?target=booking')}
            >
              立即預約
            </button>
            <button
              className="px-6 py-3 border rounded-md font-medium"
              onClick={() => setLocation('/liff/entry?target=reports')}
            >
              查詢報告
            </button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold mb-2">檢驗方案</h3>
          <p className="text-muted-foreground">選擇適合您的檢驗項目，線上預約免排隊</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-card border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setLocation(`/liff/entry?target=booking&plan=${plan.id}`)}
            >
              <h4 className="font-semibold mb-2">{plan.name}</h4>
              <p className="text-lg font-bold text-primary">NT$ {plan.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t bg-card py-8 text-center text-sm text-muted-foreground">
        <p>大華醫事檢驗所 &copy; 2026</p>
        <p className="mt-1">台中市西屯區大華路 100 號 | (04) 1234-5678</p>
      </footer>
    </div>
  );
}
