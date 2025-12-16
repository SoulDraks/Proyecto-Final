import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './AdminPanel.css'

function PromosSection({ onAction }) {
    const [promos, setPromos] = useState([])
    const [allProducts, setAllProducts] = useState([])
    const [editingPromo, setEditingPromo] = useState(null)
    const [editingProducts, setEditingProducts] = useState([]) // cada item: { ID, Nombre, Precio, Imagen, Stock, Descripcion, Cantidad }
    const [selectedProductToAdd, setSelectedProductToAdd] = useState('')
    const [formData, setFormData] = useState({ Nombre: '', Precio: '', Imagen: null })
    const [imagePreview, setImagePreview] = useState(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        async function init() {
            await loadPromos()
            await loadAllProducts()
        }
        init()
    }, [])

    const ensureDataUrl = (maybeBase64) => {
        if (!maybeBase64) return null
        if (maybeBase64.startsWith && maybeBase64.startsWith('data:')) return maybeBase64
        return `data:image/png;base64,${maybeBase64}`
    }

    const loadPromos = async () => {
        try {
            const resp = await axios.get('http://localhost:3000/api/obtenerpromos')
            const lista = (resp.data || []).map(promo => ({
                ...promo,
                Imagen: ensureDataUrl(promo.Imagen),
                Productos: (promo.Productos || []).map(prod => ({
                    ...prod,
                    Imagen: ensureDataUrl(prod.Imagen),
                    Cantidad: prod.Cantidad
                }))
            }))
            setPromos(lista)
        } catch (err) {
            console.error('Error cargar promos', err)
            setError('Error al cargar promos')
            setPromos([])
        }
    }

    const loadAllProducts = async () => {
        try {
            const resp = await axios.get('http://localhost:3000/api/obtenerproductos')
            const productos = (resp.data || []).map(p => ({
                ID: p.ID,
                Nombre: p.Nombre,
                Imagen: ensureDataUrl(p.Imagen),
                Precio: p.Precio,
                Stock: p.Stock,
                Descripcion: p.Descripcion
            }))
            setAllProducts(productos)
        } catch (err) {
            console.warn('No se pudo cargar /api/obtenerproductos, reconstruyendo desde /api/obtenerpromos')
            const flat = []
            promos.forEach(p => {
                (p.Productos || []).forEach(prod => flat.push({
                    ID: prod.ID,
                    Nombre: prod.Nombre,
                    Imagen: ensureDataUrl(prod.Imagen),
                    Precio: prod.Precio,
                    Stock: prod.Stock,
                    Descripcion: prod.Descripcion
                }))
            })
            const uniq = Object.values(flat.reduce((acc, cur) => { acc[cur.ID] = acc[cur.ID] || cur; return acc }, {}))
            setAllProducts(uniq)
        }
    }

    const resetForm = () => {
        setEditingPromo(null)
        setEditingProducts([])
        setSelectedProductToAdd('')
        setFormData({ Nombre: '', Precio: '', Imagen: null })
        setImagePreview(null)
        setError('')
        setShowForm(false)
    }

    const handleChange = (e) => {
        if (e.target.name === 'Imagen') {
            const file = e.target.files[0]
            setFormData({ ...formData, Imagen: file })
            if (file) {
                const reader = new FileReader()
                reader.onloadend = () => setImagePreview(reader.result)
                reader.readAsDataURL(file)
            } else {
                setImagePreview(null)
            }
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value })
        }
        setError(''); setSuccess('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(''); setSuccess('')

        if (!formData.Nombre || formData.Nombre.toString().trim() === '' || formData.Precio === '' || formData.Precio == null) {
            setError('Nombre y Precio son obligatorios')
            return
        }

        try {
            const fd = new FormData()
            fd.append('Nombre', formData.Nombre)
            fd.append('Precio', formData.Precio)

            const productosPayload = editingProducts.map(p => ({ ID: p.ID, Cantidad: p.Cantidad }))
            if (productosPayload.length) fd.append('Productos', JSON.stringify(productosPayload))

            if (editingPromo) {
                fd.append('ID', editingPromo.ID)
                if (formData.Imagen) fd.append('Imagen', formData.Imagen)

                await axios.post('http://localhost:3000/api/modificarpromo', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
                setSuccess('Promo modificada exitosamente')
            } else {
                if (!formData.Imagen) {
                    setError('La imagen es obligatoria para nuevas promos')
                    return
                }
                fd.append('Imagen', formData.Imagen)
                await axios.post('http://localhost:3000/api/anadirpromo', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
                setSuccess('Promo añadida exitosamente')
                setShowForm(false)
            }

            resetForm()
            await loadPromos()
            await loadAllProducts()
            if (onAction) onAction()
            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.Error || 'Error al guardar promo')
        }
    }

    const handleEdit = (promo) => {
        setEditingPromo(promo)
        setFormData({ Nombre: promo.Nombre || '', Precio: promo.Precio || '', Imagen: null })
        setImagePreview(promo.Imagen || null)
        const prods = (promo.Productos || []).map(p => ({
            ID: p.ID,
            Nombre: p.Nombre,
            Precio: p.Precio,
            Imagen: p.Imagen,
            Stock: p.Stock,
            Descripcion: p.Descripcion,
            Cantidad: p.Cantidad
        }))
        setEditingProducts(prods)
        setError('')
        setSelectedProductToAdd('')
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar esta promo?')) return
        try {
            await axios.post('http://localhost:3000/api/eliminarpromo', { ID: id })
            setSuccess('Promo eliminada exitosamente')
            await loadPromos(); await loadAllProducts()
            if (onAction) onAction()
            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.Error || 'Error al eliminar promo')
        }
    }

    const handleAddProductToEditing = () => {
        if (!selectedProductToAdd) return
        const prod = allProducts.find(p => String(p.ID) === String(selectedProductToAdd))
        if (!prod) return
        if (editingProducts.find(p => String(p.ID) === String(prod.ID))) return
        setEditingProducts([...editingProducts, { ...prod, Cantidad: 1 }])
        setSelectedProductToAdd('')
    }

    const handleRemoveProductFromEditing = (id) => {
        setEditingProducts(editingProducts.filter(p => String(p.ID) !== String(id)))
    }

    const handleChangeCantidad = (id, value) => {
        const v = Math.max(1, Number(value) || 1)
        setEditingProducts(editingProducts.map(p => p.ID === id ? { ...p, Cantidad: v } : p))
    }
    const availableProductsForAdd = allProducts.filter(p => !editingProducts.find(ep => String(ep.ID) === String(p.ID)))
    return (
        <div className="promos-section">
            {error && <div className="admin-message error">{error}</div>}
            {success && <div className="admin-message success">{success}</div>}

            <div>
                <button className="btn-add" onClick={() => {
                    setShowForm(true)
                    setEditingPromo(null)
                    setEditingProducts([])
                    setFormData({ Nombre: '', Precio: '', Imagen: null })
                    setImagePreview(null)
                }}>Agregar Promo</button>
            </div>

            {showForm && (
                <div className="admin-form-container">
                    <div className="admin-form">
                        <h2>{editingPromo ? 'Modificar Promo' : 'Nueva Promo'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Nombre:</label>
                                <input type="text" name="Nombre" value={formData.Nombre} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Precio:</label>
                                <input type="number" name="Precio" step="0.01" value={formData.Precio} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label>Productos asociados:</label>
                                <div className="products-table associated-products" style={{ marginTop: 8 }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead style={{ display: 'table-header-group' }}>
                                            <tr>
                                                <th style={{ padding: '0.6rem' }}>Imagen</th>
                                                <th style={{ padding: '0.6rem' }}>Nombre</th>
                                                <th style={{ padding: '0.6rem' }}>Precio</th>
                                                <th style={{ padding: '0.6rem' }}>Cantidad</th>
                                                <th style={{ padding: '0.6rem', width: 120 }}>Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {editingProducts.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} style={{ padding: '0.8rem', color: '#bbb' }}>No hay productos asociados</td>
                                                </tr>
                                            )}

                                            {editingProducts.map(prod => (
                                                <tr key={prod.ID} style={{ background: 'transparent' }}>
                                                    <td style={{ padding: '0.6rem' }}>
                                                        {prod.Imagen
                                                            ? <img src={prod.Imagen} alt={prod.Nombre} className="product-thumb" />
                                                            : <div style={{ width: 60, height: 60, background: '#222', borderRadius: 8 }} />}
                                                    </td>
                                                    <td style={{ padding: '0.6rem' }}>
                                                        <div className="description-cell" title={prod.Descripcion || prod.Nombre}>
                                                            {prod.Nombre}
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '0.6rem' }}>
                                                        {prod.Precio != null ? `$${prod.Precio}` : '-'}
                                                    </td>
                                                    <td style={{ padding: '0.6rem' }}>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={prod.Cantidad}
                                                            onChange={e => handleChangeCantidad(prod.ID, e.target.value)}
                                                            style={{ width: 80 }}
                                                        />
                                                    </td>
                                                    <td style={{ padding: '0.6rem' }}>
                                                        <button type="button" className="btn-delete" onClick={() => handleRemoveProductFromEditing(prod.ID)}>Quitar</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
                                    <select
                                        value={selectedProductToAdd}
                                        onChange={e => setSelectedProductToAdd(e.target.value)}
                                        className="form-select"
                                        style={{ flex: 1 }}
                                    >
                                        <option value="">-- Seleccionar producto para agregar --</option>
                                        {availableProductsForAdd.map(p => (
                                            <option key={p.ID} value={p.ID}>{p.Nombre} {p.Precio != null ? `- $${p.Precio}` : ''}</option>
                                        ))}
                                    </select>
                                    <button type="button" className="btn-save" onClick={handleAddProductToEditing}>Agregar</button>
                                </div>
                            </div>

                            {imagePreview && (
                                <div className="image-preview-container">
                                    <img src={imagePreview} alt="Vista previa" className="image-preview" />
                                </div>
                            )}

                            <div className="form-group">
                                <label>Imagen {editingPromo && '(opcional)'}:</label>
                                <input type="file" name="Imagen" accept="image/*" onChange={handleChange} required={!editingPromo} />
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-save">{editingPromo ? 'Modificar' : 'Añadir'}</button>
                                <button type="button" className="btn-cancel" onClick={resetForm}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="products-table-container">
                <h2>Promos</h2>
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {promos.map(promo => (
                            <tr key={promo.ID}>
                                <td>{promo.ID}</td>
                                <td>
                                    {promo.Imagen ? <img src={promo.Imagen} alt={promo.Nombre} className="product-thumb" /> : <div style={{ width: 60, height: 60, background: '#222', borderRadius: 8 }} />}
                                </td>
                                <td>{promo.Nombre}</td>
                                <td>${promo.Precio}</td>
                                <td>
                                    <button className="btn-edit" onClick={() => handleEdit(promo)}>Editar</button>
                                    <button className="btn-delete" onClick={() => handleDelete(promo.ID)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PromosSection
