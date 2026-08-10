import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// 如果你用 TanStack Router（檔案式路由）
// 請在 src/routes/ 下新增：
//   - health-education.tsx
//   - health.tsx
//   - health-topics/$topicId.tsx

// 如果你用 React Router（傳統路由）
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HealthPage from "@/pages/Health";
import HealthEducationPage from "@/pages/HealthEducation";
import HealthTopicDetail from "@/pages/HealthTopicDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/health" element={<HealthPage />} />
        <Route path="/health-education" element={<HealthEducationPage />} />
        <Route path="/health-topics/:topicId" element={<HealthTopicDetail />} />
        {/* 其他現有路由... */}
      </Routes>
    </BrowserRouter>
  );
}
