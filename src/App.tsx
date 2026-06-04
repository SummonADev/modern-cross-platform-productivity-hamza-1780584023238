import { Routes, Route } from 'react-router-dom';
import { GameProvider } from '@/context/GameContext';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import QuestsPage from '@/pages/QuestsPage';
import ProjectsPage from '@/pages/ProjectsPage';
import HabitsPage from '@/pages/HabitsPage';

function Placeholder({ title, emoji, description }: { title: string; emoji: string; description: string }) {
  return (
    <div className="cozy-card p-10 text-center">
      <div className="text-6xl mb-3">{emoji}</div>
      <h1 className="text-2xl font-bold text-bark mb-2">{title}</h1>
      <p className="text-bark-soft">{description}</p>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quests" element={<QuestsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/habits" element={<HabitsPage />} />
          <Route path="/world" element={<Placeholder title="Your World" emoji="🌍" description="Explore your growing cozy world. More areas unlock as you level up!" />} />
          <Route path="/shop" element={<Placeholder title="Cozy Shop" emoji="🛍️" description="Spend your acorns on lovely things for your character and home." />} />
          <Route path="/achievements" element={<Placeholder title="Achievements" emoji="🏆" description="Little milestones along your gentle journey." />} />
          <Route path="/insights" element={<Placeholder title="Insights" emoji="📊" description="A kind look at your progress over time." />} />
          <Route path="/character" element={<Placeholder title="Your Character" emoji="🧑" description="Customize your avatar and change your name." />} />
          <Route path="*" element={<Placeholder title="Lost in the woods" emoji="🍂" description="This path hasn't been mapped yet." />} />
        </Routes>
      </Layout>
    </GameProvider>
  );
}
