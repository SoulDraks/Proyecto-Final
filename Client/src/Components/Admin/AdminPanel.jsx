import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../Context/AuthContext'
import './AdminPanel.css'
import ProductsSection from './ProductsSection'
import PromosSection from './PromosSection'
import PedidosSection from './PedidosSection'
import MesasSection from './MesasSection'

function AdminPanel() {
  const { user, isSuperAdmin } = useAuth()
  const [showAdminsSection, setShowAdminsSection] = useState(false)
  const [showProducts, setShowProducts] = useState(true);
  const [showPromos, setShowPromos] = useState(false);
  const [showPedidos, setShowPedidos] = useState(false);
  const [showMesas, setShowMesas] = useState(false);

  // onAction se pasa a las secciones para que el panel pueda reaccionar a cambios (p.ej. recargar admins)
  const onSectionAction = () => {
    // placeholder por si más adelante quieres recargar algo global
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <div className="header-actions">
          {isSuperAdmin && (
            <button className={`btn-toggle ${showAdminsSection ? 'active' : ''}`} onClick={() => setShowAdminsSection(!showAdminsSection)}>
              {showAdminsSection ? 'Ocultar' : 'Gestionar'} Admins
            </button>
          )}

          <button className={`btn-toggle ${showProducts ? 'active' : ''}`} onClick={() => { setShowProducts(true); setShowPromos(false); setShowPedidos(false) }}>
            Productos
          </button>

          <button className={`btn-toggle ${showPromos ? 'active' : ''}`} onClick={() => { setShowPromos(true); setShowProducts(false); setShowPedidos(false); setShowMesas(false) }}>
            Promos
          </button>

          <button className={`btn-toggle ${showPedidos ? 'active' : ''}`} onClick={() => { setShowPedidos(true); setShowPromos(false); setShowProducts(false); setShowMesas(false) }}>
            Pedidos
          </button>

          <button className={`btn-toggle ${showMesas ? 'active' : ''}`} onClick={() => { setShowMesas(true); setShowPromos(false); setShowProducts(false); setShowPedidos(false)}}>
            Mesas
          </button>
        </div>
      </div>

      {showAdminsSection && isSuperAdmin && (
        <div className="admins-section">
          <h2>Gestión de Administradores</h2>
          <p>La UI de admins permanece igual — integrarás tu código existente aquí.</p>
        </div>
      )}

      {showProducts && (
        <ProductsSection onAction={onSectionAction} />
      )}

      {showPromos && (
        <PromosSection onAction={onSectionAction} />
      )}

      {showPedidos && (
        <PedidosSection onAction={onSectionAction} />
      )}

      {showMesas && (
        <MesasSection onAction={onSectionAction} />
      )}
    </div>
  )
}

export default AdminPanel