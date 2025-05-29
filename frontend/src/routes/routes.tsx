import React, { lazy, Suspense } from "react";
import {
  Navigate,
  RouteObject,
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import DashBoardLayout from "../layouts/DashBoardLayout";
import ProtectedRoute from "./ProtectedRoute";
import { APP_ROUTES } from "../constants/routeConstants";
import { AuthProvider } from "../contexts/AuthContext";

// Lazy load các component để cải thiện performance
const AuthPage = lazy(() => import("../features/auth/AuthPage"));
const Register = lazy(() => import("../features/auth/components/RegisterForm"));

// const ChatPage = lazy(() => import("../features/chat/ChatPage"));
const AdminPage = lazy(() => import("../features/admin/AdminPage"));
import ChatPage from "../features/chat/ChatPage";
import EditProfile from "../features/users/components/Profile";

//Doctor
import DoctorDashboard from "../features/doctor/DoctorDashboard";
import {
  LogsPage,
  LogDetailPage,
} from "../features/doctor/components/Diagnose_diseases ";

// Loading component cho Suspense
const SuspenseFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Create a component that will be displayed at the root
// and wrap it with AuthProvider so that useAuth is available everywhere
const Root = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

// Danh sách các route công khai (không cần đăng nhập)
const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <AuthPage />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <AuthPage />
          </Suspense>
        ),
      },
    ],
  },
];

// Danh sách các route riêng tư (cần đăng nhập)
// const privateRoutes: RouteObject[] = [
//   {
//     path: APP_ROUTES.PRIVATE.DASHBOARD,
//     element: (
//       <ProtectedRoute>
//         <MainLayout />
//       </ProtectedRoute>
//     ),
//     children: [
//       {
//         index: true,
//         element: <Navigate to="/chat" replace />,
//       },
//       {
//         path: "chat",
//         element: (
//           <Suspense fallback={<SuspenseFallback />}>
//             <ChatPage />
//           </Suspense>
//         ),
//       },
//       {
//         path: "chat/:id",
//         element: (
//           <Suspense fallback={<SuspenseFallback />}>
//             <ChatPage />
//           </Suspense>
//         ),
//       },

//     ],
//   },
// ];
const privateRoutes: RouteObject[] = [
  {
    path: APP_ROUTES.PRIVATE.DASHBOARD,
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="home" replace />, // Trang mặc định chuyển về /chat
      },
      {
        path: "home", // Trang danh sách chat, Health Assistant, danh sách bác sĩ
        element: <ChatPage />,
      },
      {
        path: "chat/bot", // Trang chat với bot
        element: <ChatPage />,
      },
      {
        path: "chat/:id", // Trang chat với bác sĩ
        element: <ChatPage />,
      },
      {
        path: "profile/edit", // Thêm route này
        element: <EditProfile />,
      },
    ],
  },
];
// Danh sách các route cho admin
const adminRoutes: RouteObject[] = [
  {
    path: APP_ROUTES.ADMIN.DASHBOARD,
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <DashBoardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <AdminPage />
          </Suspense>
        ),
      },
      {
        path: "users",
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <AdminPage />
          </Suspense>
        ),
      },
    ],
  },
];

// Danh sách các route cho doctor
const doctorRoutes: RouteObject[] = [
  {
    path: APP_ROUTES.DOCTOR.INDEX,
    element: (
      <ProtectedRoute requiredRole="DOCTOR">
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="home" replace />, // Trang mặc định chuyển về /chat
      },
      {
        path: APP_ROUTES.DOCTOR.DASHBOARD,
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <DoctorDashboard />
          </Suspense>
        ),
      },
      {
        path: APP_ROUTES.DOCTOR.DIAGNOSE_DISEASES,
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <LogsPage />
          </Suspense>
        ),
      },
      {
        path: APP_ROUTES.DOCTOR.DIAGNOSE_DISEASES_DETAILS, // Trang chi tiết log
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <LogDetailPage />
          </Suspense>
        ),
      },
    ],
  },
];

// Root routes - Wrap everything with the Root component that provides AuthProvider
const routes: RouteObject[] = [
  {
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Navigate to={APP_ROUTES.PUBLIC.LOGIN} replace />,
      },
      ...publicRoutes,
      ...privateRoutes,
      ...adminRoutes,
      ...doctorRoutes,
      // Catch-all route for 404
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
];

// Create browser router with all routes
const router = createBrowserRouter(routes);

// Export AppRoutes component that can be used in App.tsx
const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
