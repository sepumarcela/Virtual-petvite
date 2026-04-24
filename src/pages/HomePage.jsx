import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div>
      
      <section className="home-hero">
        <h1>Virtual Pet 🐾</h1>
        <p>Todo lo que tu mascota necesita en un solo lugar</p>

        <Link to="/products">
          <button className="btn btn-accent">Ver productos</button>
        </Link>
      </section>

      <section className="home-section">
        <h2>Categorías</h2>

        <div className="home-cards">
          <div className="home-card">
            🐶
            <h3>Alimentos</h3>
            <p>Comida premium para tus mascotas</p>
          </div>

          <div className="home-card">
            🧸
            <h3>Juguetes</h3>
            <p>Diversión garantizada</p>
          </div>

          <div className="home-card">
            🛁
            <h3>Cuidado</h3>
            <p>Higiene y bienestar</p>
          </div>
        </div>
      </section>

    </div>
  );
}