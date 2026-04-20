import { Header } from "./components/Header";
import { ComparatorPage } from "./pages/ComparatorPage";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Header />
      <ComparatorPage />
    </div>
  );
}
