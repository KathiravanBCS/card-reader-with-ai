import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import LandingPage from "./LandingPage";
import ScanCamera from "./ScanCamera";
import ScanUpload from "./ScanUpload";
import CardsTable from "./CardsTable";
import CardDetail from "./CardDetail";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "scan-camera", element: <ScanCamera /> },
      { path: "scan-upload", element: <ScanUpload /> },
      { path: "cards", element: <CardsTable /> },
      { path: "card/:id", element: <CardDetail /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
