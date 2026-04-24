import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>VirtualPet 🐾</h2>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Inicio</Link>
        <Link to="/products" style={styles.link}>Productos</Link>
        <Link to="/cart" style={styles.link}>Carrito</Link>
        <Link to="/login" style={styles.link}>Login</Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    background: "#2D6A4F",
    color: "white",
  },

  logo: {
    margin: 0,
  },

  links: {
    display: "flex",
    gap: "20px",
  },

  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
  },
};