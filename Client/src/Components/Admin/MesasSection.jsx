import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './AdminPanel.css'

export default function MesasSection({ onAction }) {
  const [mesas, setMesas] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingMesa, setEditingMesa] = useState(null)
  const [formData, setFormData] = useState({ Estado: 'Libre', Personas: 0, ID_Cliente: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadMesas()
  }, [])

  const loadMesas = async () => {
    try {
      const resp = await axios.get('http://localhost:3000/api/obtenermesas')
      setMesas(Array.isArray(resp.data) ? resp.data : [])
    } catch (err) {
      console.error(err)
      setError('Error al cargar mesas')
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingMesa(null)
    setFormData({ Estado: 'Libre', Personas: 0, ID_Cliente: '' })
    setError('')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: name === 'Personas' ? (value === '' ? '' : Number(value)) : value }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (formData.Personas === '' || formData.Personas < 0 || isNaN(formData.Personas)) {
      setError('Personas debe ser un número mayor o igual a 0')
      return
    }

    try {
      if (editingMesa) {
        await axios.post('http://localhost:3000/api/modificarmesa', {
          ID: editingMesa.ID,
          Estado: formData.Estado,
          Personas: formData.Personas,
          ID_Cliente: formData.ID_Cliente || null
        })
        setSuccess('Mesa modificada exitosamente')
      } else {
        await axios.post('http://localhost:3000/api/agregarmesa', {
          Estado: formData.Estado,
          Personas: formData.Personas,
          ID_Cliente: formData.ID_Cliente || null
        })
        setSuccess('Mesa añadida exitosamente')
      }

      resetForm()
      await loadMesas()
      if (onAction) onAction()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.Error || 'Error al guardar la mesa')
    }
  }

  const handleEdit = (mesa) => {
    setEditingMesa(mesa)
    setFormData({ Estado: mesa.Estado || 'Libre', Personas: mesa.Personas ?? 0, ID_Cliente: mesa.ID_Cliente ?? '' })
    setShowForm(true)
    setError('')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta mesa?')) return
    try {
      await axios.post('http://localhost:3000/api/eliminarmesa', { ID: id })
      setSuccess('Mesa eliminada exitosamente')
      await loadMesas()
      if (onAction) onAction()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.Error || 'Error al eliminar la mesa')
    }
  }

  // Alterna estado Libre <-> Ocupado
  const toggleEstado = async (mesa) => {
    const nuevoEstado = (mesa.Estado === 'Ocupado') ? 'Libre' : 'Ocupado'
    try {
      await axios.post('http://localhost:3000/api/modificarmesa', {
        ID: mesa.ID,
        Estado: nuevoEstado,
        Personas: mesa.Personas ?? 0,
        ID_Cliente: mesa.ID_Cliente ?? null
      })
      await loadMesas()
      if (onAction) onAction()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.Error || 'Error al actualizar estado')
    }
  }

  return (
    <div className="products-section">
      {error && <div className="admin-message error">{error}</div>}
      {success && <div className="admin-message success">{success}</div>}

      <div>
        <button className="btn-add" onClick={() => { setShowForm(true); setEditingMesa(null); setFormData({ Estado: 'Libre', Personas: 0, ID_Cliente: '' }) }}>
          Agregar Mesa
        </button>
      </div>

      {showForm && (
        <div className="admin-form-container">
          <div className="admin-form">
            <h2>{editingMesa ? 'Modificar Mesa' : 'Nueva Mesa'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Estado:</label>
                <select name="Estado" value={formData.Estado} onChange={handleChange}>
                  <option value="Libre">Libre</option>
                  <option value="Ocupado">Ocupado</option>
                </select>
              </div>

              <div className="form-group">
                <label>Personas:</label>
                <input type="number" name="Personas" value={formData.Personas} onChange={handleChange} min="0" />
              </div>

              <div className="form-group">
                <label>ID Cliente (opcional):</label>
                <input type="text" name="ID_Cliente" value={formData.ID_Cliente} onChange={handleChange} />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-save">{editingMesa ? 'Modificar' : 'Añadir'}</button>
                <button type="button" className="btn-cancel" onClick={resetForm}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="products-table-container">
        <h2>Mesas</h2>
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Estado</th>
              <th>Personas</th>
              <th>ID Cliente</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mesas.map(mesa => (
              <tr key={mesa.ID}>
                <td>{mesa.ID}</td>
                <td>
                  <button
                    className={`btn-toggle ${mesa.Estado === 'Libre' ? '' : 'active'}`}
                    onClick={() => toggleEstado(mesa)}
                    title={`Cambiar a ${(mesa.Estado === 'Libre') ? 'Ocupado' : 'Libre'}`}>
                    {mesa.Estado}
                  </button>
                </td>
                <td>{mesa.Personas ?? 0}</td>
                <td>{mesa.ID_Cliente ?? '-'}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(mesa)}>Editar</button>
                  <button className="btn-delete" onClick={() => handleDelete(mesa.ID)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
