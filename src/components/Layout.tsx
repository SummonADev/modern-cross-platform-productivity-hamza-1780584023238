import type { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import StatusBar from '@/components/StatusBar';
import Toast from '@/components/Toast';
import { useGameContext } from '@/context/GameContext';

export default function Layout({ children }: { children: ReactNode }) {
  const { toast } = useGameContext();
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-6xl mx-auto w-full">
        <div className="mb-6">
          <StatusBar />
        </div>
        {children}
      </main>
      <Toast message={toast} />
    </div>
  );
}
