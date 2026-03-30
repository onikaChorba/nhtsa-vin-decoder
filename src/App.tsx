import './App.css';
import { Header, Footer } from './components';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage, VariablesPage, VariableDetail } from './pages';


function App() {
  return (
    <BrowserRouter>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/variables" element={<VariablesPage />} />
          <Route path="/variables/:variableId" element={<VariableDetail />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  )
}

export default App
