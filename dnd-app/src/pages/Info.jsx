import { useEffect, useState } from "react";
import miImagen from "../assets/Gemini_Generated_Image_750gu1750gu1750g.png";

const URL = "https://www.dnd5eapi.co/api/2014/magic-items";

export default function Info() {
  const [totalItems, setTotalItems] = useState(null);
  const [rarezaStats, setRarezaStats] = useState({});
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(URL)
      .then(res => res.json())
      .then(data => {
        const items = data.results;
        setTotalItems(items.length);
        
        const stats = {
          comun: 0,
          raro: 0,
          epico: 0,
          legendario: 0
        };
        
        items.forEach(item => {
          const rareza = calcularRareza(item.name);
          stats[rareza]++;
        });
        
        setRarezaStats(stats);
        setUltimaActualizacion(new Date().toLocaleDateString());
        setIsLoading(false);
      });
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
      comun: "#9e9e9e",
      raro: "#4caf50",
      epico: "#9c27b0",
      legendario: "#ff9800"
    };
    return colores[rareza];
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Cargando carta...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      
      <div style={styles.card}>
        <div style={styles.cardBorder}>
          <div style={styles.cardInner}>
            
            <div style={styles.atributo}>
              <span style={styles.atributoText}>✦ MAGIA ✦</span>
            </div>
            
            <div style={styles.nombreContainer}>
              <h1 style={styles.nombre}>Compendio Arcano</h1>
            </div>
            
            <div style={styles.nivelContainer}>
              <div style={styles.nivel}>
                <span style={styles.nivelLabel}>NIVEL</span>
                <span style={styles.nivelEstrellas}>✧✧✧✧✧✧✧✧✧✧</span>
                <span style={styles.nivelNumero}>10</span>
              </div>
            </div>

            {/* IMAGEN DENTRO DEL MARCO CON BORDE DORADO */}
            <div style={styles.arteContainer}>
              <div style={styles.arte}>
                <img 
                  src={miImagen} 
                  alt="D&D"
                  style={styles.arteImagen}
                />
              </div>
            </div>
            
            <div style={styles.descripcionContainer}>
              <div style={styles.descripcionBorder}>
                <p style={styles.descripcionText}>
                  Esta carta representa la conexión con la API oficial de Dungeons & Dragons 5e, 
                  una fuente de conocimiento ancestral que contiene informacion sobre hechizos, 
                  monstruos, objetos magicos y mas del universo de los Calabozos y Dragones.
                </p>
              </div>
            </div>
          
            <div style={styles.infoContainer}>
              <div style={styles.infoLeft}>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>OBJETOS</span>
                  <span style={styles.infoValue}>{totalItems}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>CONSULTA</span>
                  <span style={styles.infoValue}>{ultimaActualizacion}</span>
                </div>
              </div>
              <div style={styles.infoRight}>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>METODO</span>
                  <span style={styles.infoValue}>GET</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>FORMATO</span>
                  <span style={styles.infoValue}>JSON</span>
                </div>
              </div>
            </div>
            
            <div style={styles.rarezaContainer}>
              <div style={styles.rarezaTitulo}>DISTRIBUCION POR RAREZA</div>
              {Object.entries(rarezaStats).map(([rareza, cantidad]) => (
                <div key={rareza} style={styles.rarezaFila}>
                  <span style={{
                    ...styles.rarezaNombre,
                    color: getColorPorRareza(rareza)
                  }}>{rareza}</span>
                  <div style={styles.rarezaBarraContainer}>
                    <div style={{
                      ...styles.rarezaBarra,
                      width: `${(cantidad / totalItems) * 100}%`,
                      background: getColorPorRareza(rareza)
                    }}></div>
                  </div>
                  <span style={styles.rarezaCantidad}>{cantidad}</span>
                </div>
              ))}
            </div>
      
            <div style={styles.cardFooter}>
              <div style={styles.footerLeft}>
                <span>1ª EDICION</span>
              </div>
              <div style={styles.footerRight}>
                <span>✦ D&D ✦</span>
              </div>
            </div>
            
            <div style={styles.cardCode}>
              <span>DD-API-001</span>
            </div>
            
          </div>
        </div>
      </div>
      
      <div style={styles.creditosCard}>
        <div style={styles.creditosBorder}>
          <div style={styles.creditosInner}>
            <span style={styles.creditosIcon}>◈</span>
            <span style={styles.creditosText}>Julian Ricardo Viloria Hoyos</span>
            <span style={styles.creditosIcon}>◈</span>
          </div>
        </div>
      </div>
      
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'Times New Roman', serif"
  },

  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#1a1a2e",
    color: "#ffd700"
  },

  spinner: {
    width: "50px",
    height: "50px",
    border: "3px solid rgba(255,215,0,0.2)",
    borderTopColor: "#ffd700",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },

  loadingText: {
    marginTop: "25px",
    fontSize: "1rem",
    letterSpacing: "2px",
    color: "#ffd700"
  },

  card: {
    maxWidth: "550px",
    width: "100%",
    margin: "0 auto 30px auto",
    position: "relative"
  },

  cardBorder: {
    background: "#2a1f3d",
    padding: "12px",
    borderRadius: "12px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.5)",
    border: "1px solid #ffd700"
  },

  cardInner: {
    background: "linear-gradient(135deg, #f5f0e0 0%, #e8dcc8 100%)",
    borderRadius: "8px",
    padding: "15px",
    position: "relative",
    overflow: "hidden"
  },

  atributo: {
    textAlign: "right",
    marginBottom: "10px"
  },

  atributoText: {
    fontSize: "0.7rem",
    letterSpacing: "2px",
    color: "#9b59b6",
    fontWeight: "bold",
    background: "rgba(155,89,182,0.1)",
    padding: "2px 8px",
    borderRadius: "4px"
  },

  nombreContainer: {
    borderBottom: "2px solid #2a1f3d",
    paddingBottom: "8px",
    marginBottom: "10px"
  },

  nombre: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    color: "#2a1f3d",
    textTransform: "uppercase",
    letterSpacing: "1px",
    margin: 0
  },

  nivelContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "15px"
  },

  nivel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(0,0,0,0.05)",
    padding: "3px 10px",
    borderRadius: "15px"
  },

  nivelLabel: {
    fontSize: "0.6rem",
    fontWeight: "bold",
    color: "#2a1f3d"
  },

  nivelEstrellas: {
    fontSize: "0.7rem",
    color: "#ffd700",
    textShadow: "0 0 2px #ff8c00"
  },

  nivelNumero: {
    fontSize: "0.8rem",
    fontWeight: "bold",
    color: "#2a1f3d"
  },

  arteContainer: {
    marginBottom: "15px"
  },

  arte: {
    background: "linear-gradient(135deg, #2a1f3d 0%, #1a0f2d 100%)",
    borderRadius: "8px",
    padding: "8px",
    border: "2px solid #ffd700",
    minHeight: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  arteImagen: {
    width: "auto",
    height: "auto",
    maxWidth: "100%",
    maxHeight: "180px",
    objectFit: "contain",
    borderRadius: "4px",
    display: "block"
  },

  descripcionContainer: {
    marginBottom: "15px"
  },

  descripcionBorder: {
    border: "1px solid #2a1f3d",
    borderRadius: "6px",
    padding: "12px",
    background: "rgba(255,255,255,0.5)"
  },

  descripcionText: {
    fontSize: "0.75rem",
    lineHeight: "1.5",
    color: "#2a1f3d",
    margin: 0,
    textAlign: "justify"
  },

  infoContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
    padding: "10px",
    background: "rgba(0,0,0,0.05)",
    borderRadius: "6px"
  },

  infoLeft: {
    flex: 1
  },

  infoRight: {
    flex: 1,
    textAlign: "right"
  },

  infoRow: {
    marginBottom: "5px"
  },

  infoLabel: {
    fontSize: "0.6rem",
    fontWeight: "bold",
    color: "#2a1f3d",
    letterSpacing: "1px",
    marginRight: "8px"
  },

  infoValue: {
    fontSize: "0.7rem",
    color: "#9b59b6",
    fontWeight: "bold"
  },

  rarezaContainer: {
    background: "rgba(0,0,0,0.05)",
    borderRadius: "6px",
    padding: "10px",
    marginBottom: "15px"
  },

  rarezaTitulo: {
    fontSize: "0.6rem",
    fontWeight: "bold",
    letterSpacing: "1px",
    color: "#2a1f3d",
    marginBottom: "8px",
    textAlign: "center"
  },

  rarezaFila: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "6px"
  },

  rarezaNombre: {
    fontSize: "0.65rem",
    fontWeight: "bold",
    textTransform: "lowercase",
    width: "70px"
  },

  rarezaBarraContainer: {
    flex: 1,
    height: "6px",
    background: "rgba(0,0,0,0.1)",
    borderRadius: "3px",
    overflow: "hidden"
  },

  rarezaBarra: {
    height: "100%",
    transition: "width 0.5s ease"
  },

  rarezaCantidad: {
    fontSize: "0.65rem",
    color: "#2a1f3d",
    width: "30px",
    textAlign: "right"
  },

  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    borderTop: "1px solid #2a1f3d",
    paddingTop: "8px",
    marginBottom: "5px"
  },

  footerLeft: {
    fontSize: "0.55rem",
    fontWeight: "bold",
    color: "#2a1f3d",
    letterSpacing: "1px"
  },

  footerRight: {
    fontSize: "0.55rem",
    fontWeight: "bold",
    color: "#9b59b6",
    letterSpacing: "1px"
  },

  cardCode: {
    textAlign: "right",
    fontSize: "0.5rem",
    color: "#2a1f3d",
    letterSpacing: "1px",
    borderTop: "1px solid #2a1f3d",
    paddingTop: "5px"
  },

  creditosCard: {
    maxWidth: "550px",
    width: "100%",
    margin: "0 auto"
  },

  creditosBorder: {
    background: "#2a1f3d",
    padding: "8px",
    borderRadius: "10px",
    border: "1px solid #ffd700"
  },

  creditosInner: {
    background: "linear-gradient(135deg, #f5f0e0 0%, #e8dcc8 100%)",
    borderRadius: "6px",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px"
  },

  creditosIcon: {
    color: "#ffd700",
    fontSize: "0.8rem"
  },

  creditosText: {
    fontSize: "0.7rem",
    letterSpacing: "1px",
    color: "#2a1f3d",
    fontWeight: "bold"
  }
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);