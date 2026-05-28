// pages/HomePage.jsx

import { Link } from "react-router-dom";

const TEAL = "#3D8A8C";
const DARK_TEAL = "#1E5F61";
const ORANGE = "#D4883B";
const LIGHT_BG = "#F4F7F8";

export default function HomePage() {
  return (
    <div
      style={{
        background: LIGHT_BG,
        minHeight: "100vh",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* HERO */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: "620px",
          display: "flex",
          alignItems: "center",
          padding: "4rem 2rem",
          background:
            "linear-gradient(135deg, rgba(30,95,97,.96), rgba(61,138,140,.88))",
        }}
      >
        {/* FONDO */}
        <img
          src="https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1600&auto=format&fit=crop"
          alt="Mascota"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.2,
          }}
        />

        {/* EFECTOS */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "rgba(255,255,255,.08)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: "1300px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.2fr .8fr",
            gap: "3rem",
            alignItems: "center",
          }}
        >
          {/* TEXTO */}
          <div>
            <span
              style={{
                display: "inline-block",
                background: "rgba(255,255,255,.14)",
                color: "#fff",
                padding: "0.65rem 1.1rem",
                borderRadius: "999px",
                fontWeight: 700,
                fontSize: ".85rem",
                backdropFilter: "blur(10px)",
                marginBottom: "1.5rem",
              }}
            >
              🐾 Todo para consentir a tu mascota
            </span>

            <h1
              style={{
                color: "#fff",
                fontSize: "clamp(3rem, 6vw, 5.5rem)",
                lineHeight: 1,
                fontWeight: 900,
                marginBottom: "1.5rem",
              }}
            >
              El lugar favorito
              <br />
              de perros y gatos
            </h1>

            <p
              style={{
                color: "rgba(255,255,255,.86)",
                fontSize: "1.1rem",
                lineHeight: 1.9,
                maxWidth: "620px",
                marginBottom: "2rem",
              }}
            >
              Encuentra alimentos premium, snacks, juguetes, accesorios y
              productos especializados para el bienestar de tu mascota.
            </p>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <Link to="/products">
                <button
                  style={{
                    background: ORANGE,
                    color: "#fff",
                    border: "none",
                    padding: "1rem 2rem",
                    borderRadius: "18px",
                    fontWeight: 800,
                    fontSize: "1rem",
                    cursor: "pointer",
                    boxShadow: "0 12px 30px rgba(212,136,59,.4)",
                  }}
                >
                  Comprar ahora
                </button>
              </Link>

              <a
                href="/catalogo.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <button
                  style={{
                    background: "rgba(255,255,255,.12)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,.25)",
                    padding: "1rem 2rem",
                    borderRadius: "18px",
                    fontWeight: 700,
                    fontSize: "1rem",
                    cursor: "pointer",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  Ver catálogo
                </button>
              </a>
            </div>
          </div>

          {/* CARD PROMO */}
          <div
            style={{
              background: "rgba(255,255,255,.12)",
              border: "1px solid rgba(255,255,255,.18)",
              borderRadius: "32px",
              padding: "2rem",
              backdropFilter: "blur(14px)",
              color: "#fff",
              boxShadow: "0 14px 40px rgba(0,0,0,.18)",
            }}
          >
            <p
              style={{
                fontSize: ".9rem",
                opacity: 0.8,
                marginBottom: ".6rem",
                letterSpacing: "1px",
              }}
            >
              PROMOCIÓN DESTACADA
            </p>

            <h3
              style={{
                fontSize: "2.3rem",
                lineHeight: 1.2,
                marginBottom: "1rem",
                fontWeight: 900,
              }}
            >
              Hasta 25% OFF
              <br />
              en alimentos premium
            </h3>

            <p
              style={{
                opacity: 0.82,
                lineHeight: 1.8,
                marginBottom: "1.5rem",
              }}
            >
              Aprovecha descuentos especiales en marcas seleccionadas para
              perros y gatos.
            </p>

            <Link to="/products?cat=alimentos">
              <button
                style={{
                  background: "#fff",
                  color: DARK_TEAL,
                  border: `2px solid ${ORANGE}`,
                  padding: "1rem 1.8rem",
                  borderRadius: "18px",
                  fontWeight: 800,
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              >
                Ver ofertas
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          padding: "4rem 2rem",
        }}
      >
        <div
          style={{
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 900,
              color: "#111827",
              marginBottom: ".5rem",
            }}
          >
            Explora categorías
          </h2>

          <p
            style={{
              color: "#6B7280",
            }}
          >
            Encuentra todo para tu mascota
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {[
            {
              name: "Alimentos",
              image:
                "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?q=80&w=1200&auto=format&fit=crop",
              to: "/products?cat=alimentos",
            },

            {
              name: "Snacks",
              image:
                "https://images.pexels.com/photos/5033015/pexels-photo-5033015.jpeg",
              to: "/products?cat=snacks",
            },

            {
              name: "Juguetes",
              image:
                "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?q=80&w=1200&auto=format&fit=crop",
              to: "/products?cat=juguetes",
            },

            {
              name: "Aseo",
              image:
                "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=1200&auto=format&fit=crop",
              to: "/products?cat=aseo",
            },
          ].map((cat) => (
            <Link
              key={cat.name}
              to={cat.to}
              style={{
                textDecoration: "none",
              }}
            >
              <div
                className="category-card"
                style={{
                  position: "relative",
                  height: "280px",
                  borderRadius: "28px",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,.72), transparent 55%)",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    bottom: 24,
                    left: 24,
                    color: "#fff",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.6rem",
                      fontWeight: 900,
                      marginBottom: ".3rem",
                    }}
                  >
                    {cat.name}
                  </h3>

                  <span
                    style={{
                      opacity: 0.88,
                    }}
                  >
                    Ver productos →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      {/* MARCAS PREMIUM */}
      <section
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          padding: "0 2rem 5rem",
        }}
      >
        <div
          style={{
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "2.4rem",
              fontWeight: 900,
              color: "#111827",
              marginBottom: ".7rem",
            }}
          >
            Trabajamos con las mejores marcas
          </h2>

          <p
            style={{
              color: "#6B7280",
              fontSize: "1rem",
            }}
          >
            Calidad premium para el bienestar de tu mascota
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.8rem",
          }}
        >
          {[
            {
              name: "Nutra Nuggets",
              image: "/productos/nutra.png",
            },

            {
              name: "Diamond",
              image: "/productos/diamond.png",
            },

            {
              name: "Hill's",
              image: "/productos/hillis.png",
            },
          ].map((brand) => (
            <div
              key={brand.name}
              style={{
                background: "#fff",
                borderRadius: "28px",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,.06)",
                transition: ".25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 18px 40px rgba(0,0,0,.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.06)";
              }}
            >
              <div
                style={{
                  height: 280,
                  background: "#F8FAFC",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "2rem",
                }}
              >
                <img
                  src={brand.image}
                  alt={brand.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>

              <div
                style={{
                  padding: "1.5rem",
                  textAlign: "center",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 900,
                    color: "#111827",
                    marginBottom: "1rem",
                  }}
                >
                  {brand.name}
                </h3>

                <Link to="/products">
                  <button
                    style={{
                      background: ORANGE,
                      color: "#fff",
                      border: "none",
                      padding: ".95rem 1.5rem",
                      borderRadius: "14px",
                      fontWeight: 800,
                      cursor: "pointer",
                      fontSize: ".95rem",
                      width: "100%",
                    }}
                  >
                    Ver productos
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFICIOS */}
      <section
        style={{
          background: DARK_TEAL,
          padding: "4rem 2rem",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "2rem",
          }}
        >
          {[
            {
              title: "Entrega rápida",
              desc: "Recibe tus productos el mismo día.",
            },
            {
              title: "Pago seguro",
              desc: "Compra fácil y protegida.",
            },
            {
              title: "Productos premium",
              desc: "Las mejores marcas para tu mascota.",
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                color: "#fff",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  fontSize: "1.3rem",
                  marginBottom: ".6rem",
                  fontWeight: 800,
                }}
              >
                {item.title}
              </h3>

              <p
                style={{
                  opacity: 0.8,
                  lineHeight: 1.7,
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
      <a
        href="https://wa.me/573103852168"
        target="_blank"
        rel="noreferrer"
        style={{
          position: "fixed",
          bottom: "26px",
          right: "26px",
          width: "82px",
          height: "82px",
          borderRadius: "50%",
          background: "#25D366",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 12px 35px rgba(37,211,102,.45)",
          zIndex: 9999,
          textDecoration: "none",
          transition: "all .28s ease",
          animation: "whatsappPulse 2s infinite",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/3670/3670051.png"
          alt="WhatsApp"
          style={{
            width: "46px",
            height: "46px",
          }}
        />
      </a>
      {/* FOOTER PREMIUM */}

      <footer
        style={{
          background: "linear-gradient(135deg, #1E6666 0%, #2B7A78 100%)",
          boxShadow: "0 -10px 40px rgba(30,102,102,.12)",
          color: "#fff",
          marginTop: "5rem",
          padding: "4rem 3rem 2rem",
          borderTopLeftRadius: "40px",
          borderTopRightRadius: "40px",
          overflow: "hidden",
        }}
      >
        {/* BENEFICIOS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "2rem",
            marginBottom: "4rem",
            borderBottom: "1px solid rgba(255,255,255,.12)",
            paddingBottom: "3rem",
          }}
        >
          {[
            {
              icon: "🚚",
              title: "Entrega rápida",
              text: "Recibe tus productos el mismo día.",
            },

            {
              icon: "🔒",
              title: "Pago seguro",
              text: "Compra fácil y protegida.",
            },

            {
              icon: "⭐",
              title: "Productos premium",
              text: "Las mejores marcas para tu mascota.",
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                }}
              >
                {item.icon}
              </div>

              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1.4rem",
                    fontWeight: 800,
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    opacity: 0.75,
                    marginTop: ".5rem",
                    lineHeight: 1.6,
                  }}
                >
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CONTENIDO */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1.3fr",
            gap: "3rem",
          }}
        >
          {/* LOGO */}

          <div>
            <h2
              style={{
                fontSize: "2.5rem",
                marginBottom: "1rem",
                color: "#fff",
              }}
            >
              VirtualPet
            </h2>

            <p
              style={{
                opacity: 0.75,
                lineHeight: 1.8,
                maxWidth: "320px",
              }}
            >
              Productos premium para mascotas, accesorios, snacks y las mejores
              marcas para consentir a tu mejor amigo.
            </p>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "1.5rem",
              }}
            >
              {[
                {
                  icon: "https://cdn-icons-png.flaticon.com/512/3046/3046121.png",
                  link: "https://tiktok.com",
                },

                {
                  icon: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
                  link: "https://youtube.com",
                },

                {
                  icon: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
                  link: "https://instagram.com",
                },

                {
                  icon: "https://cdn-icons-png.flaticon.com/512/3670/3670051.png",
                  link: "https://wa.me/573103852168",
                },
              ].map((item) => (
                <a
                  key={item.icon}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={item.icon}
                    alt=""
                    style={{
                      width: "26px",
                      height: "26px",
                    }}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* NAVEGACION */}

          <div>
            <h3
              style={{
                marginBottom: "1.5rem",
                fontSize: "1.3rem",
              }}
            >
              Navegación
            </h3>

            <Link
              to="/"
              style={{
                opacity: 0.75,
                marginBottom: "1rem",
                display: "block",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Inicio
            </Link>

            <Link
              to="/products"
              style={{
                opacity: 0.75,
                marginBottom: "1rem",
                display: "block",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Productos
            </Link>

            <Link
              to="/products"
              style={{
                opacity: 0.75,
                marginBottom: "1rem",
                display: "block",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Categorías
            </Link>

            <Link
              to="/contact"
              style={{
                opacity: 0.75,
                marginBottom: "1rem",
                display: "block",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Contacto
            </Link>
          </div>

          {/* CATEGORIAS */}

          <div>
            <h3
              style={{
                marginBottom: "1.5rem",
                fontSize: "1.3rem",
              }}
            >
              Categorías
            </h3>

            <Link
              to="/products?cat=alimentos"
              style={{
                opacity: 0.75,
                marginBottom: "1rem",
                display: "block",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Alimentos
            </Link>

            <Link
              to="/products?cat=snacks"
              style={{
                opacity: 0.75,
                marginBottom: "1rem",
                display: "block",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Snacks
            </Link>

            <Link
              to="/products?cat=juguetes"
              style={{
                opacity: 0.75,
                marginBottom: "1rem",
                display: "block",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Juguetes
            </Link>

            <Link
              to="/products?cat=aseo"
              style={{
                opacity: 0.75,
                marginBottom: "1rem",
                display: "block",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Aseo
            </Link>
          </div>

          {/* CONTACTO */}

          <div>
            <h3
              style={{
                marginBottom: "1.5rem",
                fontSize: "1.3rem",
              }}
            >
              Contáctanos
            </h3>

            <p style={{ opacity: 0.75 }}>📞 310 385 2168</p>

            <p style={{ opacity: 0.75 }}>✉️ info@virtualpet.com</p>

            <p style={{ opacity: 0.75 }}>📍 Medellín, Colombia</p>
          </div>
        </div>

        {/* COPYRIGHT */}

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,.12)",
            marginTop: "4rem",
            paddingTop: "2rem",
            textAlign: "center",
            opacity: 0.65,
            fontSize: ".95rem",
          }}
        >
          © 2026 VirtualPet — Todos los derechos reservados
        </div>
      </footer>

      <style>{`
        .category-card {
          transition: transform .25s ease;
        }
        .category-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 24px 50px rgba(0,0,0,.18);
}
    

        .product-card {
          transition:
            transform .25s ease,
            box-shadow .25s ease;
        }

        .product-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 24px 50px rgba(0,0,0,.18);
}
          @keyframes whatsappPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(37,211,102,.5);
  }

  70% {
    box-shadow: 0 0 0 18px rgba(37,211,102,0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(37,211,102,0);
  }
}
      `}</style>
    </div>
  );
  <img src="/productos/nutra.png" style={{ width: 300 }} />;
}
