import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from './components/layout/PublicLayout.jsx'
import Home from './screens/Home.jsx'
import Diagnostico from './screens/Diagnostico.jsx'
import Resultado from './screens/Resultado.jsx'
import Servicos from './screens/Servicos.jsx'
import ServicoDetalhe from './screens/ServicoDetalhe.jsx'
import Checkout from './screens/Checkout.jsx'
import Obrigado from './screens/Obrigado.jsx'
import Comercial from './screens/Comercial.jsx'
import Admin from './screens/Admin.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/diagnostico" element={<Diagnostico />} />
        <Route path="/resultado" element={<Resultado />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/servico/:id" element={<ServicoDetalhe />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/obrigado" element={<Obrigado />} />
      </Route>
      <Route path="/comercial" element={<Comercial />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
