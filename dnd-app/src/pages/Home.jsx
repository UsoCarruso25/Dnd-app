import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const URL = "https://www.dnd5eapi.co/api/2014/magic-items";

export default function Home() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");
  const [isLoading, setIsLoading] = useState(true);
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    fetch(URL)
      .then(res => res.json())
      .then(data => {
        const itemsConRareza = data.results.map(item => ({
          ...item,
          rareza: calcularRareza(item.name),
          poder: Math.floor(Math.random() * 50) + 50
        }));
        setItems(itemsConRareza);
        setIsLoading(false);
      });

    const favs = JSON.parse(localStorage.getItem("favs")) || [];
    setFavoritos(favs);
  }, []);

  const calcularRareza = (nombre) => {
    const hash = nombre.length;
    if (hash % 4 === 0) return "legendario";
    if (hash % 3 === 0) return "epico";
    if (hash % 2 === 0) return "raro";
    return "comun";
  };

  const getColorPorRareza = (rareza) => {
    const colores = {
      comun: "#95a5a6",
      raro: "#27ae60",
      epico: "#8e44ad",
      legendario: "#e67e22"
    };
    return colores[rareza];
  };

  const getPatronRareza = (rareza) => {
    const patrones = {
      comun: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(149,165,166,0.05) 10px, rgba(149,165,166,0.05) 20px)",
      raro: "repeating-linear-gradient(0deg, transparent, transparent 15px, rgba(39,174,96,0.08) 15px, rgba(39,174,96,0.08) 30px)",
      epico: "radial-gradient(circle at 20% 30%, rgba(142,68,173,0.05) 2px, transparent 2px), radial-gradient(circle at 80% 70%, rgba(142,68,173,0.05) 2px, transparent 2px)",
      legendario: "repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(230,126,34,0.1) 20px, rgba(230,126,34,0.1) 40px)"
    };
    return patrones[rareza];
  };

  const esFavorito = (item) => {
    return favoritos.some(fav => fav.index === item.index);
  };

  const toggleFavorito = (item, e) => {
    e.stopPropagation();
    let nuevosFavs;
    if (esFavorito(item)) {
      nuevosFavs = favoritos.filter(fav => fav.index !== item.index);
    } else {
      nuevosFavs = [...favoritos, item];
    }
    setFavoritos(nuevosFavs);
    localStorage.setItem("favs", JSON.stringify(nuevosFavs));
  };

  const itemsFiltrados = items
    .filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
    .filter(i => filter === "todos" || i.rareza === filter);

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Abriendo el grimorio...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      
      {/* Encabezado */}
      <div style={styles.header}>
        <h1 style={styles.title}>Grimorio de Objetos Mágicos</h1>
        <p style={styles.subtitle}>
          {items.length} objetos ancestrales esperan ser descubiertos
        </p>
      </div>

      {/* Barra de búsqueda */}
      <div style={styles.searchContainer}>
        <div style={styles.searchWrapper}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          {search && (
            <button 
              onClick={() => setSearch("")}
              style={styles.clearBtn}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div style={styles.filters}>
        {["todos", "comun", "raro", "epico", "legendario"].map(tipo => (
          <button
            key={tipo}
            onClick={() => setFilter(tipo)}
            style={{
              ...styles.filterBtn,
              background: filter === tipo ? getColorPorRareza(tipo) : "rgba(255,255,255,0.03)",
              borderColor: getColorPorRareza(tipo)
            }}
          >
            {tipo === "todos" ? "todos" : tipo}
          </button>
        ))}
      </div>

      {/* Resultados */}
      <div style={styles.resultsCount}>
        {itemsFiltrados.length === 0 
          ? "ningún objeto encontrado" 
          : `mostrando ${itemsFiltrados.length} ${itemsFiltrados.length === 1 ? "objeto" : "objetos"}`}
      </div>

      {/* Grid de objetos */}
      <div style={styles.grid}>
        {itemsFiltrados.map((item) => (
          <div
            key={item.index}
            style={{
              ...styles.card,
              background: `${getPatronRareza(item.rareza)}, rgba(20,20,35,0.95)`,
              borderLeftColor: getColorPorRareza(item.rareza)
            }}
          >
            <button
              style={{
                ...styles.favBtn,
                color: esFavorito(item) ? "#e67e22" : "rgba(255,255,255,0.3)"
              }}
              onClick={(e) => toggleFavorito(item, e)}
              title={esFavorito(item) ? "quitar de colección" : "guardar en colección"}
            >
              {esFavorito(item) ? "★" : "☆"}
            </button>
            
            <Link to={`/detalle/${item.index}`} style={styles.link}>
              <h3 style={styles.cardTitle}>{item.name}</h3>
            </Link>
            
            <div style={styles.rarezaContainer}>
              <span style={{
                ...styles.rarezaBadge,
                background: getColorPorRareza(item.rareza)
              }}>
                {item.rareza}
              </span>
            </div>
            
            <div style={styles.poderContainer}>
              <div style={styles.poderLabel}>poder arcano</div>
              <div style={styles.poderBarContainer}>
                <div style={{
                  ...styles.poderBar,
                  width: `${item.poder}%`,
                  background: getColorPorRareza(item.rareza)
                }}></div>
              </div>
              <div style={styles.poderValue}>{item.poder}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a0a15 0%, #151525 50%, #0a0a15 100%)",
    color: "#e8e8e8",
    padding: "40px 20px",
    fontFamily: "'Georgia', 'Times New Roman', serif"
  },

  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#0a0a15",
    color: "#e8e8e8"
  },

  spinner: {
    width: "40px",
    height: "40px",
    border: "2px solid rgba(200,180,120,0.2)",
    borderTopColor: "#c8b478",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },

  loadingText: {
    marginTop: "20px",
    fontSize: "0.9rem",
    letterSpacing: "2px"
  },

  header: {
    textAlign: "center",
    marginBottom: "40px"
  },

  title: {
    fontSize: "2.2rem",
    fontWeight: "normal",
    letterSpacing: "4px",
    marginBottom: "15px",
    color: "#c8b478"
  },

  subtitle: {
    fontSize: "0.85rem",
    opacity: 0.5,
    fontStyle: "italic",
    letterSpacing: "1px"
  },

  searchContainer: {
    maxWidth: "500px",
    margin: "0 auto 30px auto"
  },

  searchWrapper: {
    position: "relative",
    width: "100%"
  },

  searchIcon: {
    position: "absolute",
    left: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    opacity: 0.5,
    fontSize: "0.9rem"
  },

  searchInput: {
    width: "100%",
    padding: "12px 40px 12px 40px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(200,180,120,0.2)",
    borderRadius: "30px",
    color: "#e8e8e8",
    fontSize: "0.9rem",
    fontFamily: "'Georgia', serif",
    outline: "none",
    transition: "all 0.3s ease"
  },

  clearBtn: {
    position: "absolute",
    right: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "rgba(255,255,255,0.5)",
    cursor: "pointer",
    fontSize: "0.8rem"
  },

  filters: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "30px",
    flexWrap: "wrap"
  },

  filterBtn: {
    padding: "6px 18px",
    border: "1px solid",
    borderRadius: "30px",
    background: "rgba(255,255,255,0.03)",
    color: "#e8e8e8",
    cursor: "pointer",
    fontSize: "0.75rem",
    transition: "all 0.3s ease",
    textTransform: "lowercase",
    fontFamily: "'Georgia', serif",
    letterSpacing: "1px"
  },

  resultsCount: {
    textAlign: "center",
    fontSize: "0.7rem",
    opacity: 0.4,
    marginBottom: "30px",
    letterSpacing: "1px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "25px",
    maxWidth: "1200px",
    margin: "0 auto"
  },

  card: {
    padding: "25px",
    borderRadius: "8px",
    borderLeft: "4px solid",
    position: "relative",
    backdropFilter: "blur(10px)",
    transition: "transform 0.2s ease"
  },

  link: {
    textDecoration: "none",
    color: "inherit",
    display: "block"
  },

  favBtn: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "none",
    border: "none",
    fontSize: "1.3rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "'Georgia', serif"
  },

  cardTitle: {
    fontSize: "1.2rem",
    marginBottom: "15px",
    fontWeight: "normal",
    letterSpacing: "1px",
    paddingRight: "25px"
  },

  rarezaContainer: {
    marginBottom: "15px"
  },

  rarezaBadge: {
    fontSize: "0.7rem",
    padding: "3px 10px",
    borderRadius: "12px",
    textTransform: "lowercase",
    letterSpacing: "1px"
  },

  poderContainer: {
    marginTop: "15px"
  },

  poderLabel: {
    fontSize: "0.65rem",
    textTransform: "uppercase",
    letterSpacing: "1px",
    opacity: 0.5,
    marginBottom: "6px"
  },

  poderBarContainer: {
    height: "3px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "2px",
    overflow: "hidden",
    marginBottom: "6px"
  },

  poderBar: {
    height: "100%",
    transition: "width 0.5s ease"
  },

  poderValue: {
    fontSize: "0.7rem",
    opacity: 0.6,
    textAlign: "right"
  }
};

// Animaciones
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);