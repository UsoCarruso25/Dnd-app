import { useEffect, useState } from "react";

export default function Favoritos() {
  const [favs, setFavs] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("favs")) || [];
    setFavs(data);
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

  const getDescripcion = (item) => {
    const descripciones = {
      comun: "Un objeto modesto que has guardado con cariño.",
      raro: "Un hallazgo especial que merece un lugar en tu colección.",
      epico: "Una joya arcana. Pocos tienen el privilegio de poseerlo.",
      legendario: "Un objeto de leyenda. El destino lo puso en tu camino."
    };
    return descripciones[item.rareza];
  };

  const eliminarFavorito = (item) => {
    const nuevosFavs = favs.filter(fav => fav.index !== item.index);
    setFavs(nuevosFavs);
    localStorage.setItem("favs", JSON.stringify(nuevosFavs));
  };

  const vaciarFavoritos = () => {
    if (confirm("¿Deseas liberar todos los objetos de tu colección?")) {
      setFavs([]);
      localStorage.setItem("favs", JSON.stringify([]));
    }
  };

  return (
    <div style={styles.container}>
      {/* Encabezado */}
      <div style={styles.header}>
        <h1 style={styles.title}>Mi Colección Arcana</h1>
        <p style={styles.subtitle}>
          {favs.length === 0 
            ? "Aún no has guardado ningún objeto mágico" 
            : `Has reunido ${favs.length} ${favs.length === 1 ? "objeto" : "objetos"} en tu colección`}
        </p>
      </div>

      {/* Botón vaciar colección */}
      {favs.length > 0 && (
        <div style={styles.vaciarContainer}>
          <button 
            onClick={vaciarFavoritos}
            style={styles.vaciarBtn}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            liberar colección
          </button>
        </div>
      )}

      {/* Grid de favoritos */}
      {favs.length === 0 ? (
        <div style={styles.emptyContainer}>
          <div style={styles.emptyIcon}>📖</div>
          <p style={styles.emptyText}>No hay objetos en tu colección</p>
          <p style={styles.emptyHint}>Vuelve al grimorio y guarda los objetos que te llamen la atención</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {favs.map((item) => {
            const rareza = calcularRareza(item.name);
            return (
              <div
                key={item.index}
                style={{
                  ...styles.card,
                  background: `${getPatronRareza(rareza)}, rgba(20,20,35,0.95)`,
                  borderLeftColor: getColorPorRareza(rareza)
                }}
                onClick={() => setSelected(item)}
              >
                <button
                  style={styles.eliminarBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    eliminarFavorito(item);
                  }}
                  title="Liberar objeto"
                >
                  ✕
                </button>
                
                <h3 style={styles.cardTitle}>{item.name}</h3>
                
                <div style={styles.rarezaContainer}>
                  <span style={{
                    ...styles.rarezaBadge,
                    background: getColorPorRareza(rareza)
                  }}>
                    {rareza}
                  </span>
                </div>
                
                <div style={styles.favoritoFecha}>
                  <span style={styles.fechaLaberinto}>⚜️</span>
                  <span style={styles.fechaText}>en tu colección</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de detalles */}
      {selected && (
        <div style={styles.modalOverlay} onClick={() => setSelected(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.pergamino}>
              <div style={styles.pergaminoContent}>
                <div style={styles.pergaminoHeader}>
                  <h2>{selected.name}</h2>
                  <span style={{
                    ...styles.modalRareza,
                    background: getColorPorRareza(calcularRareza(selected.name))
                  }}>
                    {calcularRareza(selected.name)}
                  </span>
                </div>
                
                <p style={styles.descripcion}>{getDescripcion({ rareza: calcularRareza(selected.name) })}</p>
                
                <div style={styles.modalAcciones}>
                  <button
                    onClick={() => {
                      eliminarFavorito(selected);
                      setSelected(null);
                    }}
                    style={styles.liberarBtn}
                  >
                    liberar objeto
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    style={styles.cerrarBtn}
                  >
                    cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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

  header: {
    textAlign: "center",
    marginBottom: "50px"
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
    opacity: 0.6,
    fontStyle: "italic",
    letterSpacing: "1px"
  },

  vaciarContainer: {
    display: "flex",
    justifyContent: "flex-end",
    maxWidth: "1200px",
    margin: "0 auto 30px auto"
  },

  vaciarBtn: {
    background: "transparent",
    border: "1px solid rgba(200,180,120,0.3)",
    color: "#c8b478",
    padding: "6px 15px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "0.7rem",
    letterSpacing: "1px",
    transition: "all 0.3s ease",
    fontFamily: "'Georgia', serif"
  },

  emptyContainer: {
    textAlign: "center",
    padding: "80px 20px",
    maxWidth: "400px",
    margin: "0 auto"
  },

  emptyIcon: {
    fontSize: "4rem",
    marginBottom: "20px",
    opacity: 0.3
  },

  emptyText: {
    fontSize: "1.1rem",
    marginBottom: "10px",
    opacity: 0.7
  },

  emptyHint: {
    fontSize: "0.8rem",
    opacity: 0.4,
    fontStyle: "italic"
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
    cursor: "pointer",
    transition: "all 0.3s ease",
    position: "relative",
    backdropFilter: "blur(10px)"
  },

  eliminarBtn: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "rgba(0,0,0,0.5)",
    border: "none",
    color: "#c8b478",
    width: "24px",
    height: "24px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
    marginBottom: "20px"
  },

  rarezaBadge: {
    fontSize: "0.7rem",
    padding: "3px 10px",
    borderRadius: "12px",
    textTransform: "lowercase",
    letterSpacing: "1px"
  },

  favoritoFecha: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.7rem",
    opacity: 0.4,
    marginTop: "15px"
  },

  fechaLaberinto: {
    fontSize: "0.8rem"
  },

  fechaText: {
    letterSpacing: "0.5px"
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.85)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(4px)"
  },

  modal: {
    maxWidth: "450px",
    width: "90%",
    animation: "slideUp 0.3s ease"
  },

  pergamino: {
    background: "#f5f0e0",
    color: "#2a2418",
    borderRadius: "4px",
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
  },

  pergaminoContent: {
    padding: "30px"
  },

  pergaminoHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "10px",
    borderBottom: "1px solid #d4c9b0",
    paddingBottom: "15px"
  },

  modalRareza: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.7rem",
    textTransform: "lowercase",
    color: "white"
  },

  descripcion: {
    fontSize: "0.9rem",
    lineHeight: "1.6",
    marginBottom: "25px",
    fontStyle: "italic"
  },

  modalAcciones: {
    display: "flex",
    gap: "15px",
    justifyContent: "center"
  },

  liberarBtn: {
    flex: 1,
    padding: "10px",
    background: "transparent",
    border: "1px solid #c0392b",
    color: "#c0392b",
    cursor: "pointer",
    fontSize: "0.8rem",
    letterSpacing: "1px",
    transition: "all 0.3s ease",
    fontFamily: "'Georgia', serif"
  },

  cerrarBtn: {
    flex: 1,
    padding: "10px",
    background: "transparent",
    border: "1px solid #2a2418",
    color: "#2a2418",
    cursor: "pointer",
    fontSize: "0.8rem",
    letterSpacing: "1px",
    transition: "all 0.3s ease",
    fontFamily: "'Georgia', serif"
  }
};

// Animaciones
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(styleSheet);