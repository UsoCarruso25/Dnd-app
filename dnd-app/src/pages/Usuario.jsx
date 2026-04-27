import { useEffect, useState } from "react";

export default function Usuario() {
  const [nombre, setNombre] = useState(() => {
    return localStorage.getItem("nombreUsuario") || "Aventurero";
  });
  const [clase, setClase] = useState(() => {
    return localStorage.getItem("claseUsuario") || "Mago";
  });
  const [editando, setEditando] = useState(false);
  const [stats, setStats] = useState({
    objetosVistos: 0,
    favoritos: 0,
    rarezasEncontradas: {}
  });

  useEffect(() => {
    const favoritos = JSON.parse(localStorage.getItem("favs")) || [];
    const objetosVistos = JSON.parse(localStorage.getItem("objetosVistos")) || [];
    
    const rarezas = {
      comun: 0,
      raro: 0,
      epico: 0,
      legendario: 0
    };
    
    objetosVistos.forEach(item => {
      const rareza = calcularRareza(item.name);
      rarezas[rareza]++;
    });
    
    setStats({
      favoritos: favoritos.length,
      objetosVistos: objetosVistos.length,
      rarezasEncontradas: rarezas
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

  const guardarPerfil = () => {
    localStorage.setItem("nombreUsuario", nombre);
    localStorage.setItem("claseUsuario", clase);
    setEditando(false);
  };

  const clasesDisponibles = ["Guerrero", "Mago", "Picaro", "Clérigo", "Druida", "Bardo"];

  return (
    <div style={styles.container}>
      
      <div style={styles.header}>
        <h1 style={styles.title}>Perfil del Aventurero</h1>
        <p style={styles.subtitle}>Tu identidad en el grimorio</p>
      </div>

      {/* Tarjeta de perfil */}
      <div style={styles.perfilCard}>
        <div style={styles.perfilHeader}>
          <div style={styles.avatar}>
            <div style={styles.avatarInner}>
              {nombre.charAt(0).toUpperCase()}
            </div>
          </div>
          
          {!editando ? (
            <div style={styles.perfilInfo}>
              <h2 style={styles.perfilNombre}>{nombre}</h2>
              <p style={styles.perfilClase}>{clase}</p>
              <button 
                onClick={() => setEditando(true)}
                style={styles.editarBtn}
              >
                editar perfil
              </button>
            </div>
          ) : (
            <div style={styles.editForm}>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre"
                style={styles.input}
              />
              <select
                value={clase}
                onChange={(e) => setClase(e.target.value)}
                style={styles.select}
              >
                {clasesDisponibles.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div style={styles.editButtons}>
                <button onClick={guardarPerfil} style={styles.guardarBtn}>guardar</button>
                <button onClick={() => setEditando(false)} style={styles.cancelarBtn}>cancelar</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div style={styles.statsSection}>
        <h3 style={styles.statsTitle}>Estadísticas de Aventura</h3>
        
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statNumero}>{stats.objetosVistos}</div>
            <div style={styles.statLabel}>objetos descubiertos</div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statNumero}>{stats.favoritos}</div>
            <div style={styles.statLabel}>objetos en colección</div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statNumero}>
              {Object.values(stats.rarezasEncontradas).reduce((a, b) => a + b, 0)}
            </div>
            <div style={styles.statLabel}>total explorado</div>
          </div>
        </div>
      </div>

      {/* Rarezas encontradas */}
      <div style={styles.rarezaSection}>
        <h3 style={styles.rarezaTitle}>Rarezas Descubiertas</h3>
        
        <div style={styles.rarezaGrid}>
          {Object.entries(stats.rarezasEncontradas).map(([rareza, cantidad]) => (
            <div key={rareza} style={styles.rarezaItem}>
              <div style={{
                ...styles.rarezaColor,
                background: getColorPorRareza(rareza)
              }}></div>
              <div style={styles.rarezaInfo}>
                <span style={styles.rarezaNombre}>{rareza}</span>
                <span style={styles.rarezaCantidad}>{cantidad}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logros */}
      <div style={styles.logrosSection}>
        <h3 style={styles.logrosTitle}>Logros Desbloqueados</h3>
        
        <div style={styles.logrosGrid}>
          <div style={{
            ...styles.logroCard,
            opacity: stats.objetosVistos >= 10 ? 1 : 0.3
          }}>
            <span style={styles.logroIcon}></span>
            <span style={styles.logroNombre}>Erudito</span>
            <span style={styles.logroDesc}>Descubrir 10 objetos</span>
          </div>
          
          <div style={{
            ...styles.logroCard,
            opacity: stats.favoritos >= 5 ? 1 : 0.3
          }}>
            <span style={styles.logroIcon}></span>
            <span style={styles.logroNombre}>Coleccionista</span>
            <span style={styles.logroDesc}>Guardar 5 favoritos</span>
          </div>
          
          <div style={{
            ...styles.logroCard,
            opacity: stats.objetosVistos >= 25 ? 1 : 0.3
          }}>
            <span style={styles.logroIcon}></span>
            <span style={styles.logroNombre}>Sabio Arcano</span>
            <span style={styles.logroDesc}>Explorar 25 objetos</span>
          </div>
          
          <div style={{
            ...styles.logroCard,
            opacity: Object.values(stats.rarezasEncontradas).some(v => v > 0) ? 1 : 0.3
          }}>
            <span style={styles.logroIcon}></span>
            <span style={styles.logroNombre}>Aprendiz</span>
            <span style={styles.logroDesc}>Completar primera ronda</span>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div style={styles.accionesSection}>
        <button 
          onClick={() => {
            localStorage.removeItem("objetosVistos");
            window.location.reload();
          }}
          style={styles.resetBtn}
        >
          reiniciar aventura
        </button>
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

  header: {
    textAlign: "center",
    marginBottom: "40px"
  },

  title: {
    fontSize: "2rem",
    fontWeight: "normal",
    letterSpacing: "4px",
    marginBottom: "10px",
    color: "#c8b478"
  },

  subtitle: {
    fontSize: "0.8rem",
    opacity: 0.5,
    fontStyle: "italic"
  },

  perfilCard: {
    maxWidth: "500px",
    margin: "0 auto 40px auto",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "12px",
    padding: "25px",
    borderLeft: "3px solid #c8b478"
  },

  perfilHeader: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    flexWrap: "wrap"
  },

  avatar: {
    width: "80px",
    height: "80px",
    background: "linear-gradient(135deg, #2a1f3d, #1a0f2d)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #c8b478"
  },

  avatarInner: {
    fontSize: "2rem",
    color: "#c8b478",
    fontWeight: "bold"
  },

  perfilInfo: {
    flex: 1
  },

  perfilNombre: {
    fontSize: "1.3rem",
    marginBottom: "5px",
    color: "#c8b478"
  },

  perfilClase: {
    fontSize: "0.8rem",
    opacity: 0.6,
    marginBottom: "10px"
  },

  editarBtn: {
    background: "transparent",
    border: "1px solid #c8b478",
    color: "#c8b478",
    padding: "5px 15px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "0.7rem",
    fontFamily: "'Georgia', serif"
  },

  editForm: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  input: {
    padding: "8px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid #c8b478",
    borderRadius: "6px",
    color: "white",
    fontFamily: "'Georgia', serif"
  },

  select: {
    padding: "8px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid #c8b478",
    borderRadius: "6px",
    color: "white",
    fontFamily: "'Georgia', serif"
  },

  editButtons: {
    display: "flex",
    gap: "10px"
  },

  guardarBtn: {
    background: "#c8b478",
    border: "none",
    padding: "5px 15px",
    borderRadius: "6px",
    cursor: "pointer",
    fontFamily: "'Georgia', serif"
  },

  cancelarBtn: {
    background: "transparent",
    border: "1px solid #c8b478",
    padding: "5px 15px",
    borderRadius: "6px",
    color: "#c8b478",
    cursor: "pointer",
    fontFamily: "'Georgia', serif"
  },

  statsSection: {
    maxWidth: "800px",
    margin: "0 auto 40px auto"
  },

  statsTitle: {
    fontSize: "1.1rem",
    textAlign: "center",
    marginBottom: "20px",
    color: "#c8b478"
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "15px"
  },

  statCard: {
    background: "rgba(255,255,255,0.05)",
    padding: "20px",
    textAlign: "center",
    borderRadius: "8px"
  },

  statNumero: {
    fontSize: "1.8rem",
    color: "#c8b478",
    marginBottom: "8px"
  },

  statLabel: {
    fontSize: "0.7rem",
    opacity: 0.6,
    textTransform: "uppercase"
  },

  rarezaSection: {
    maxWidth: "500px",
    margin: "0 auto 40px auto"
  },

  rarezaTitle: {
    fontSize: "1rem",
    textAlign: "center",
    marginBottom: "20px",
    color: "#c8b478"
  },

  rarezaGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  rarezaItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "rgba(255,255,255,0.05)",
    padding: "10px 15px",
    borderRadius: "8px"
  },

  rarezaColor: {
    width: "20px",
    height: "20px",
    borderRadius: "4px"
  },

  rarezaInfo: {
    flex: 1,
    display: "flex",
    justifyContent: "space-between"
  },

  rarezaNombre: {
    fontSize: "0.8rem",
    textTransform: "capitalize"
  },

  rarezaCantidad: {
    fontSize: "0.8rem",
    color: "#c8b478"
  },

  logrosSection: {
    maxWidth: "800px",
    margin: "0 auto 40px auto"
  },

  logrosTitle: {
    fontSize: "1rem",
    textAlign: "center",
    marginBottom: "20px",
    color: "#c8b478"
  },

  logrosGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px"
  },

  logroCard: {
    background: "rgba(255,255,255,0.05)",
    padding: "15px",
    borderRadius: "8px",
    textAlign: "center",
    transition: "opacity 0.3s ease"
  },

  logroIcon: {
    fontSize: "1.5rem",
    display: "block",
    marginBottom: "8px"
  },

  logroNombre: {
    fontSize: "0.8rem",
    fontWeight: "bold",
    display: "block",
    marginBottom: "5px"
  },

  logroDesc: {
    fontSize: "0.65rem",
    opacity: 0.5
  },

  accionesSection: {
    textAlign: "center"
  },

  resetBtn: {
    background: "transparent",
    border: "1px solid rgba(200,180,120,0.3)",
    color: "#c8b478",
    padding: "8px 25px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "0.7rem",
    fontFamily: "'Georgia', serif"
  }
};