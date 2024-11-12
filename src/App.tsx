import React from 'react';
import { Scene } from './components/Scene';
import { FinanceOverlay } from './components/visualizations/FinanceOverlay';
import { SalesOverlay } from './components/visualizations/SalesOverlay';
import { ProductOverlay } from './components/visualizations/ProductOverlay';
import { AIChat } from './components/chat/AIChat';
import { PerformanceMonitor } from './components/PerformanceMonitor';

export default function App() {
  return (
    <div className="w-full h-screen bg-black">
      <Scene />
      <FinanceOverlay />
      <SalesOverlay />
      <ProductOverlay />
      <AIChat />
      <PerformanceMonitor />
    </div>
  );
}