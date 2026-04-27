import { useEffect, useState } from "react";

const URL = "https://www.dnd5eapi.co/api/2014/magic-items";

export default function Original() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [juegoActivo, setJuegoActivo] = useState(false);
  const [preguntaActual, setPreguntaActual] = useState(null);
  const [puntuacion, setPuntuacion] = useState(0);
  const [ronda, setRonda] = useState(1);
  const [mensaje, setMensaje] = useState("");
  const [opciones, setOpciones] = useState([]);
  const [respuestaBloqueada, setRespuestaBloqueada] = useState(false);

  useEffect(() => {
    fetch(URL)
      .then(res => res.json())
      .then(data => {
        const itemsConDatos = data.results.slice(0, 30).map(item => ({
          ...item,
          rareza: calcularRareza(item.name),
          poder: Math.floor(Math.random() * 100) + 1
        }));
        setItems(itemsConDatos);
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
      comun: "#95a5a6",
      raro: "#27ae60",
      epico: "#8e44ad",
      legendario: "#e67e22"
    };
    return colores[rareza];
  };

  const iniciarJuego = () => {
    setJuegoActivo(true);
    setPuntuacion(0);
    setRonda(1);
    setMensaje("");
    generarPregunta(1);
  };

  const generarPregunta = (rondaActual) => {
    if (!items.length) return;
    
    // Seleccionar objeto aleatorio
    const objetoCorrecto = items[Math.floor(Math.random() * items.length)];
    
    // Generar opciones (1 correcta + 3 aleatorias)
    const otrasOpciones = items
      .filter(i => i.index !== objetoCorrecto.index)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    const todasOpciones = [objetoCorrecto, ...otrasOpciones];
    const opcionesMezcladas = todasOpciones.sort(() => 0.5 - Math.random());
    
    // Determinar tipo de pregunta según la ronda
    const tiposPregunta = ["rareza", "poder", "nombre"];
    const tipo = tiposPregunta[(rondaActual - 1) % 3];
    
    let pregunta = {};
    
    if (tipo === "rareza") {
      pregunta = {
        texto: `¿Cuál es la rareza de "${objetoCorrecto.name}"?`,
        respuesta: objetoCorrecto.rareza,
        tipo: "rareza"
      };
    } else if (tipo === "poder") {
      pregunta = {
        texto: `¿Cuánto poder arcano tiene "${objetoCorrecto.name}"?`,
        respuesta: objetoCorrecto.poder,
        tipo: "poder",
        rango: obtenerRangoPoder(objetoCorrecto.poder)
      };
    } else {
      pregunta = {
        texto: `¿Cuál de estos objetos tiene mayor poder arcano?`,
        respuesta: obtenerMayorPoder(opcionesMezcladas),
        tipo: "comparacion",
        objetos: opcionesMezcladas
      };
    }
    
    setPreguntaActual(pregunta);
    setOpciones(opcionesMezcladas);
    setRespuestaBloqueada(false);
  };

  const obtenerRangoPoder = (poder) => {
    if (poder < 33) return "bajo";
    if (poder < 66) return "medio";
    return "alto";
  };

  const obtenerMayorPoder = (objetos) => {
    return objetos.reduce((max, obj) => obj.poder > max.poder ? obj : max, objetos[0]);
  };

  const verificarRespuesta = (respuestaUsuario) => {
    if (respuestaBloqueada) return;
    
    setRespuestaBloqueada(true);
    let correcto = false;
    
    if (preguntaActual.tipo === "rareza") {
      correcto = respuestaUsuario === preguntaActual.respuesta;
    } else if (preguntaActual.tipo === "poder") {
      correcto = respuestaUsuario === preguntaActual.rango;
    } else {
      correcto = respuestaUsuario.index === preguntaActual.respuesta.index;
    }
    
    if (correcto) {
      const puntosGanados = Math.floor(Math.random() * 20) + 10;
      setPuntuacion(prev => prev + puntosGanados);
      setMensaje(`¡Correcto! +${puntosGanados} puntos`);
      
      setTimeout(() => {
        if (ronda < 10) {
          setRonda(prev => prev + 1);
          generarPregunta(ronda + 1);
        } else {
          setMensaje(`¡Juego completado! Puntuación final: ${puntuacion + puntosGanados}`);
          setJuegoActivo(false);
        }
      }, 1500);
    } else {
      setMensaje(`Incorrecto. Fin del juego. Puntuación final: ${puntuacion}`);
      setTimeout(() => {
        setJuegoActivo(false);
      }, 2000);
    }
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Preparando el juego...</p>
      </div>
    );
  }

  if (!juegoActivo) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>El Desafío del Grimorio</h1>
          <p style={styles.subtitle}>Pon a prueba tu conocimiento arcano</p>
        </div>
        
        <div style={styles.statsPanel}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>récord</span>
            <span style={styles.statValue}>
              {localStorage.getItem("recordGrimorio") || 0}
            </span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>preguntas</span>
            <span style={styles.statValue}>10</span>
          </div>
        </div>
        
        <div style={styles.reglasContainer}>
          <h3 style={styles.reglasTitulo}>⚜️ reglas del desafío ⚜️</h3>
          <ul style={styles.reglasLista}>
            <li> 10 rondas de conocimiento mágico</li>
            <li> Preguntas sobre rareza, poder y comparaciones</li>
            <li> Cada acierto suma puntos según la dificultad</li>
            <li> Un error y el juego termina</li>
            <li> ¿Podrás superar tu propio récord?</li>
          </ul>
        </div>
        
        <button 
          onClick={iniciarJuego}
          style={styles.iniciarBtn}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          iniciar desafío
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.gameHeader}>
        <div style={styles.gameStats}>
          <div style={styles.rondaBadge}>
            ronda {ronda}/10
          </div>
          <div style={styles.puntuacionBadge}>
            puntuación: {puntuacion}
          </div>
        </div>
        
        <div style={styles.barraProgreso}>
          <div style={{
            ...styles.progresoFill,
            width: `${(ronda / 10) * 100}%`
          }}></div>
        </div>
      </div>
      
      <div style={styles.preguntaContainer}>
        <p style={styles.preguntaTexto}>{preguntaActual?.texto}</p>
      </div>
      
      <div style={styles.opcionesContainer}>
        {preguntaActual?.tipo === "rareza" && (
          <div style={styles.botonesRareza}>
            {["comun", "raro", "epico", "legendario"].map(rareza => (
              <button
                key={rareza}
                onClick={() => verificarRespuesta(rareza)}
                disabled={respuestaBloqueada}
                style={{
                  ...styles.rarezaBtn,
                  background: respuestaBloqueada ? "rgba(255,255,255,0.05)" : getColorPorRareza(rareza),
                  opacity: respuestaBloqueada ? 0.5 : 1
                }}
              >
                {rareza}
              </button>
            ))}
          </div>
        )}
        
        {preguntaActual?.tipo === "poder" && (
          <div style={styles.botonesPoder}>
            {["bajo", "medio", "alto"].map(rango => (
              <button
                key={rango}
                onClick={() => verificarRespuesta(rango)}
                disabled={respuestaBloqueada}
                style={{
                  ...styles.poderBtn,
                  opacity: respuestaBloqueada ? 0.5 : 1
                }}
              >
                {rango}
              </button>
            ))}
          </div>
        )}
        
        {preguntaActual?.tipo === "comparacion" && (
          <div style={styles.botonesComparacion}>
            {opciones.map(obj => (
              <button
                key={obj.index}
                onClick={() => verificarRespuesta(obj)}
                disabled={respuestaBloqueada}
                style={{
                  ...styles.comparacionBtn,
                  borderLeftColor: getColorPorRareza(obj.rareza),
                  opacity: respuestaBloqueada ? 0.5 : 1
                }}
              >
                <div style={styles.comparacionNombre}>{obj.name}</div>
                <div style={styles.comparacionRareza}>{obj.rareza}</div>
                <div style={styles.comparacionPoder}>poder: {obj.poder}</div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {mensaje && (
        <div style={styles.mensajeContainer}>
          <p style={styles.mensaje}>{mensaje}</p>
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
    fontFamily: "'Georgia', 'Times New Roman', serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
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
    fontSize: "0.9rem"
  },

  header: {
    textAlign: "center",
    marginBottom: "40px"
  },

  title: {
    fontSize: "2rem",
    fontWeight: "normal",
    letterSpacing: "4px",
    marginBottom: "15px",
    color: "#c8b478"
  },

  subtitle: {
    fontSize: "0.85rem",
    opacity: 0.6,
    fontStyle: "italic"
  },

  statsPanel: {
    display: "flex",
    gap: "20px",
    marginBottom: "40px",
    justifyContent: "center"
  },

  statCard: {
    background: "rgba(255,255,255,0.03)",
    padding: "15px 30px",
    borderRadius: "8px",
    textAlign: "center",
    minWidth: "120px"
  },

  statLabel: {
    display: "block",
    fontSize: "0.7rem",
    textTransform: "uppercase",
    letterSpacing: "2px",
    marginBottom: "8px",
    opacity: 0.5
  },

  statValue: {
    display: "block",
    fontSize: "1.5rem",
    color: "#c8b478"
  },

  reglasContainer: {
    maxWidth: "400px",
    marginBottom: "40px",
    padding: "25px",
    background: "rgba(255,255,255,0.03)",
    borderRadius: "8px",
    borderLeft: "3px solid #c8b478"
  },

  reglasTitulo: {
    fontSize: "0.9rem",
    fontWeight: "normal",
    letterSpacing: "2px",
    marginBottom: "15px",
    color: "#c8b478",
    textAlign: "center"
  },

  reglasLista: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    fontSize: "0.8rem",
    lineHeight: "1.8",
    opacity: 0.8
  },

  iniciarBtn: {
    background: "transparent",
    border: "2px solid #c8b478",
    color: "#c8b478",
    padding: "12px 40px",
    fontSize: "1rem",
    letterSpacing: "3px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontFamily: "'Georgia', serif"
  },

  gameHeader: {
    width: "100%",
    maxWidth: "600px",
    marginBottom: "40px"
  },

  gameStats: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px"
  },

  rondaBadge: {
    fontSize: "0.8rem",
    opacity: 0.6,
    letterSpacing: "1px"
  },

  puntuacionBadge: {
    fontSize: "0.8rem",
    color: "#c8b478",
    letterSpacing: "1px"
  },

  barraProgreso: {
    height: "2px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "1px",
    overflow: "hidden"
  },

  progresoFill: {
    height: "100%",
    background: "#c8b478",
    transition: "width 0.3s ease"
  },

  preguntaContainer: {
    maxWidth: "600px",
    marginBottom: "40px",
    textAlign: "center"
  },

  preguntaTexto: {
    fontSize: "1.3rem",
    lineHeight: "1.6",
    letterSpacing: "1px"
  },

  opcionesContainer: {
    width: "100%",
    maxWidth: "600px",
    marginBottom: "30px"
  },

  botonesRareza: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "15px"
  },

  rarezaBtn: {
    padding: "15px",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontSize: "0.9rem",
    letterSpacing: "2px",
    cursor: "pointer",
    transition: "transform 0.2s ease",
    textTransform: "lowercase",
    fontFamily: "'Georgia', serif"
  },

  botonesPoder: {
    display: "flex",
    gap: "15px",
    justifyContent: "center"
  },

  poderBtn: {
    flex: 1,
    padding: "15px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(200,180,120,0.3)",
    borderRadius: "8px",
    color: "#e8e8e8",
    fontSize: "0.9rem",
    letterSpacing: "2px",
    cursor: "pointer",
    transition: "transform 0.2s ease",
    textTransform: "lowercase",
    fontFamily: "'Georgia', serif"
  },

  botonesComparacion: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  comparacionBtn: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",
    background: "rgba(255,255,255,0.03)",
    borderLeft: "3px solid",
    borderRight: "none",
    borderTop: "none",
    borderBottom: "none",
    borderRadius: "8px",
    color: "#e8e8e8",
    cursor: "pointer",
    transition: "transform 0.2s ease",
    textAlign: "left",
    fontFamily: "'Georgia', serif"
  },

  comparacionNombre: {
    fontSize: "0.9rem",
    flex: 2
  },

  comparacionRareza: {
    fontSize: "0.7rem",
    opacity: 0.6,
    flex: 1,
    textTransform: "lowercase"
  },

  comparacionPoder: {
    fontSize: "0.7rem",
    color: "#c8b478",
    flex: 1,
    textAlign: "right"
  },

  mensajeContainer: {
    position: "fixed",
    bottom: "30px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(0,0,0,0.9)",
    padding: "12px 24px",
    borderRadius: "30px",
    border: "1px solid #c8b478",
    animation: "slideUp 0.3s ease"
  },

  mensaje: {
    margin: 0,
    fontSize: "0.85rem",
    letterSpacing: "1px"
  }
};

// Animaciones
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
`;
document.head.appendChild(styleSheet);