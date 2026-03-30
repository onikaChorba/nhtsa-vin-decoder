import './App.css';
import { Header, Footer } from './components';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { HomePage, VariablesPage, VariableDetail } from './pages';

function App() {
  return (
    <HashRouter>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/variables" element={<VariablesPage />} />
          <Route path="/variables/:variableId" element={<VariableDetail />} />
        </Routes>
      </main>

      <Footer />
    </HashRouter>
  )
}

export default App
