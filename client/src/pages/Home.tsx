/**
 * Home.tsx
 * 大華醫事檢驗所 - 官網首頁
 * LINE OA 連結的落地頁面
 */

import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.js';
import { Badge } from '@/components/ui/badge.js';
import { Separator } from '@/components/ui/separator.js';
import {
  Stethoscope,
  FileSearch,
  CalendarCheck,
  ShieldCheck,
  Clock,
  MapPin,
  Phone,
  ChevronRight,
  Microscope,
  HeartPulse,
  FlaskConical,
  Baby,
  UserCheck,
  Activity,
} from 'lucide-react';

const plans = [
  {
    id: 'health-check-a',
    name: '成人健檢套組',
    description: '血壓、血糖、血脂、肝功能、腎功能等完整檢查',
    price: 3500,
    icon: HeartPulse,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
  },
  {
    id: 'liver-function',
    name: '肝功能檢查',
    description: 'GOT、GPT、膽紅素、白蛋白等肝臟功能評估',
    price: 1200,
    icon: FlaskConical,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
  },
  {
    id: 'blood-sugar',
    name: '血糖檢測',
    description: '空腹血糖、糖化血色素，糖尿病風險評估',
    price: 800,
    icon: Activity,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'prenatal',
    name: '產前檢查',
    description: '唐氏症篩檢、脊髓性肌肉萎縮症、子癇前症等',
    price: 4800,
    icon: Baby,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
  },
  {
    id: 'occupational',
    name: '勞工體檢',
    description: '符合勞動部規定之一般勞工健康檢查',
    price: 1500,
    icon: UserCheck,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  {
    id: 'cancer-screen',
    name: '癌症篩檢',
    description: '腫瘤標記、糞便潛血、子宮頸抹片等',
    price: 5200,
    icon: Microscope,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
];

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-bold">大華醫事檢驗所</h1>
          </div>
          <Button
            size="sm"
            onClick={() => setLocation('/liff/entry?target=dashboard')}
          >
            <FileSearch className="h-4 w-4 mr-1" />
            查詢報告
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 md:py-24">
        <div className="container text-center">
          <Badge variant="secondary" className="mb-4 text-sm">
            專業 · 準確 · 安心
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            大華醫事檢驗所
          </h2>
          <p className="text-lg text-muted-foreground mb-2 max-w-2xl mx-auto">
            提供專業醫事檢驗服務，守護您的健康
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            從 LINE 官方帳號即可查詢報告、預約檢查
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              onClick={() => setLocation('/liff/entry?target=booking')}
            >
              <CalendarCheck className="h-5 w-5 mr-2" />
              立即預約
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLocation('/liff/entry?target=reports')}
            >
              <FileSearch className="h-5 w-5 mr-2" />
              查詢報告
            </Button>
          </div>
        </div>
      </section>

      {/* 檢驗方案 */}
      <section className="container py-12">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold mb-2">檢驗方案</h3>
          <p className="text-muted-foreground">
            選擇適合您的檢驗項目，線上預約免排隊
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card
                key={plan.id}
                className="cursor-pointer hover:shadow-md transition-shadow group"
                onClick={() =>
                  setLocation(`/liff/entry?target=booking&plan=${plan.id}`)
                }
              >
                <CardHeader className="pb-3">
                  <div
                    className={`w-12 h-12 rounded-lg ${plan.bgColor} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}
                  >
                    <Icon className={`h-6 w-6 ${plan.color}`} />
                  </div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {plan.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      NT$ {plan.price.toLocaleString()}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <Separator />

      {/* 特色說明 */}
      <section className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify
