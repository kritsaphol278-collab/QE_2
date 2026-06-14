// app/tracking/page.tsx
import React from "react";
import TrackingClient from "./TrackingClient";

export const metadata = {
  title: "Tracking Order - Nisit Shop Direct",
  description: "Track your academic uniform order status live.",
};

export default function TrackingPage() {
  return <TrackingClient />;
}