import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ArbitrioProvider } from './context/ArbitrioContext';
import Lista from './components/Lista/Lista';
import Formulario from './components/Formulario/Formulario';

function App() {
  return (
    <ArbitrioProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/lista" />} />
          <Route path="/lista" element={<Lista />} />
          <Route path="/formulario/:id" element={<Formulario />} />
          <Route path="*" element={<Navigate to="/lista" />} />
        </Routes>
      </BrowserRouter>
    </ArbitrioProvider>
  );
}

export default App;
