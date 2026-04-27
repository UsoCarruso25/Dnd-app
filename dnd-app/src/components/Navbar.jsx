import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { path: "/", nombre: "Home" },
    { path: "/original", nombre: "Original" },
    { path: "/favoritos", nombre: "Favoritos" },
    { path: "/info", nombre: "Informacion", },
    { path: "/usuario", nombre: "Usuario" }
  ];

  const estaActivo = (path) => location.pathname === path;

  return (
    <nav style={{
      ...styles.nav,
      background: scrolled 
        ? "rgba(10, 10, 21, 0.95)" 
        : "rgba(10, 10, 21, 0.8)",
      backdropFilter: "blur(10px)",
      borderBottom: scrolled ? "1px solid rgba(200, 180, 120, 0.2)" : "none"
    }}>
      <div style={styles.container}>
        
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoSymbol}>◈</span>
          <span style={styles.logoText}>grimorio</span>
          <span style={styles.logoSymbol}>◈</span>
        </Link>

        {/* Links */}
        <div style={styles.links}>
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                ...styles.link,
                ...(estaActivo(link.path) && styles.linkActivo)
              }}
              onMouseEnter={(e) => {
                if (!estaActivo(link.path)) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.color = "#c8b478";
                }
              }}
              onMouseLeave={(e) => {
                if (!estaActivo(link.path)) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.color = "#e8e8e8";
                }
              }}
            >
              <span style={styles.linkIcon}>{link.icono}</span>
              <span style={styles.linkNombre}>{link.nombre}</span>
              {estaActivo(link.path) && <span style={styles.activoIndicador}></span>}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    transition: "all 0.3s ease",
    fontFamily: "'Georgia', 'Times New Roman', serif"
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "12px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px"
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    fontSize: "1.1rem",
    letterSpacing: "3px",
    color: "#c8b478",
    transition: "opacity 0.3s ease"
  },

  logoSymbol: {
    fontSize: "0.9rem",
    opacity: 0.6
  },

  logoText: {
    fontWeight: "normal",
    textTransform: "lowercase"
  },

  links: {
    display: "flex",
    gap: "5px",
    alignItems: "center",
    flexWrap: "wrap"
  },

  link: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 18px",
    textDecoration: "none",
    color: "#e8e8e8",
    fontSize: "0.85rem",
    letterSpacing: "1px",
    transition: "all 0.2s ease",
    position: "relative",
    borderRadius: "30px"
  },

  linkActivo: {
    color: "#c8b478",
    background: "rgba(200, 180, 120, 0.1)"
  },

  linkIcon: {
    fontSize: "0.9rem",
    opacity: 0.7
  },

  linkNombre: {
    textTransform: "lowercase"
  },

  activoIndicador: {
    position: "absolute",
    bottom: "-2px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "20px",
    height: "2px",
    background: "#c8b478",
    borderRadius: "1px"
  }
};