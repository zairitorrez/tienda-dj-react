import React, { useState, useEffect } from 'react'
import styles from './productoApp.module.css'

// Componente para mostrar un producto individual (reutilizable)
const ProductCard = ({ product }) => {
  const { name, price, category, image, available } = product

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={image} alt={name} className={styles.image} />
        <span className={`${styles.status} ${available ? styles.available : styles.soldOut}`}>
          {available ? '✅ Disponible' : '❌ Agotado'}
        </span>
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>
        <span className={styles.category}>{category}</span>
        <p className={styles.price}>{price.toFixed(2)}</p>
      </div>
    </div>
  )
}

// Componente para mostrar el filtro de categorías (reutilizable)
const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className={styles.filterContainer}>
      <button
        className={`${styles.filterButton} ${!selectedCategory ? styles.active : ''}`}
        onClick={() => onCategoryChange('')}
      >
        Todos
      </button>
      {categories.map(category => (
        <button
          key={category}
          className={`${styles.filterButton} ${selectedCategory === category ? styles.active : ''}`}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

// Componente principal
const ProductoApp = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState([])

  // Efecto para cargar los productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // ✅ Ruta CORRECTA para GitHub Pages (db.json en public/)
        const response = await fetch('/tienda-dj-react/db.json')
        const data = await response.json()
        setProducts(data.products)
        setFilteredProducts(data.products)
        
        // Extraer categorías únicas
        const uniqueCategories = [...new Set(data.products.map(p => p.category))]
        setCategories(uniqueCategories)
        setLoading(false)
      } catch (error) {
        console.error('Error cargando productos:', error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Efecto para filtrar productos cuando cambia la categoría seleccionada
  useEffect(() => {
    if (selectedCategory) {
      const filtered = products.filter(p => p.category === selectedCategory)
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [selectedCategory, products])

  // Manejar cambio de categoría
  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
  }

  // Mostrar loading
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Cargando productos...</p>
      </div>
    )
  }

  // Contar productos por estado
  const availableCount = filteredProducts.filter(p => p.available).length
  const soldOutCount = filteredProducts.filter(p => !p.available).length

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>🎧 Tienda DJ</h1>
        <p className={styles.subtitle}>Equipamiento profesional para DJ</p>
      </header>

      <div className={styles.stats}>
        <span>📊 {filteredProducts.length} productos</span>
        <span className={styles.availableStats}>✅ {availableCount} disponibles</span>
        <span className={styles.soldOutStats}>❌ {soldOutCount} agotados</span>
      </div>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {filteredProducts.length === 0 ? (
        <div className={styles.noProducts}>
          <p>No hay productos en esta categoría</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {/* Renderizado dinámico con map() */}
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductoApp