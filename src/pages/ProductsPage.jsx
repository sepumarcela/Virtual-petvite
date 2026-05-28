// pages/ProductsPage.jsx

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { PRODUCTOS_DATA } from "../data/productosData";
import Swal from "sweetalert2";
import FichaTecnicaModal from "../components/ui/FichaTecnicaModal";

const CAT_PLACEHOLDER = {
  alimentos: { emoji: "🍖", bg: "linear-gradient(135deg, #FFF3E0, #FFE0B2)" },
  snacks: { emoji: "🦴", bg: "linear-gradient(135deg, #FFF8E1, #FFECB3)" },
  juguetes: { emoji: "🧸", bg: "linear-gradient(135deg, #E8F5E9, #C8E6C9)" },
  aseo: { emoji: "🛁", bg: "linear-gradient(135deg, #E3F2FD, #BBDEFB)" },
  collares: { emoji: "🐕", bg: "linear-gradient(135deg, #F3E5F5, #E1BEE7)" },
  comederos: { emoji: "🥣", bg: "linear-gradient(135deg, #E0F7FA, #B2EBF2)" },
  transporte: { emoji: "🧳", bg: "linear-gradient(135deg, #FBE9E7, #FFCCBC)" },
  default: { emoji: "🐾", bg: "linear-gradient(135deg, #F0F4F0, #E0E8E0)" },
};

const CATEGORIES = [
  { id: "alimentos", name: "Alimentos" },
  { id: "snacks", name: "Snacks" },
  { id: "juguetes", name: "Juguetes" },
  { id: "aseo", name: "Aseo y Cuidado" },
  { id: "collares", name: "Collares y Traillas" },
  { id: "comederos", name: "Comederos y Bebederos" },
  { id: "transporte", name: "Transporte" },
];

const INGREDIENT_ICONS = [
  { keys: ["pollo", "chicken"], emoji: "🐔", label: "Pollo" },
  {
    keys: ["pescado", "fish", "salmón", "salmon", "trucha"],
    emoji: "🐟",
    label: "Pescado",
  },
  { keys: ["arroz", "rice"], emoji: "🌾", label: "Arroz" },
  { keys: ["huevo", "egg"], emoji: "🥚", label: "Huevo" },
  { keys: ["cordero", "lamb"], emoji: "🐑", label: "Cordero" },
  { keys: ["pavo", "turkey"], emoji: "🦃", label: "Pavo" },
  { keys: ["res", "carne", "beef"], emoji: "🥩", label: "Carne" },
  { keys: ["avena", "oat"], emoji: "🌿", label: "Avena" },
];

function getIngredients(description) {
  if (!description) return [];

  const desc = description.toLowerCase();

  return INGREDIENT_ICONS.filter((ing) =>
    ing.keys.some((k) => desc.includes(k)),
  ).slice(0, 6);
}
function ProductImg({ product, height = 220 }) {
  const ph = CAT_PLACEHOLDER[product.categoryId] || CAT_PLACEHOLDER.default;

  const imgSrc = `/productos/${product.id}.jpg`;

  return (
    <div
      style={{
        height,
        overflow: "hidden",
        background: ph.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <img
        src={imgSrc}
        alt={product.name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />

      <img
        src="/logo.png"
        alt="VirtualPet"
        style={{
          width: 90,
          opacity: 0.15,
          position: "absolute",
        }}
      />
    </div>
  );
}
function ProductCard({ product, onVerFicha, onAddToCart }) {
  const ingredients = getIngredients(product.description);

  return (
    <div
      className="product-card"
      style={{
        background: "#fff",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 8px 28px rgba(0,0,0,0.06)",
        border: "1px solid rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        transition: "transform .22s ease, box-shadow .22s ease",
      }}
    >
      {/* IMAGEN */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        <ProductImg product={product} height={220} />

        {/* PREMIUM */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            background: "#fff",
            color: "#1E5F61",
            padding: "0.45rem 0.8rem",
            borderRadius: "999px",
            fontSize: "0.72rem",
            fontWeight: 800,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            zIndex: 5,
          }}
        >
          ✨ Premium
        </div>

        {/* DEGRADADO */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.15), transparent 45%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* CONTENIDO */}
      <div
        style={{
          padding: "1.2rem",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "0.8rem",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 800,
                color: "#3D8A8C",
                textTransform: "uppercase",
                letterSpacing: ".5px",
              }}
            >
              {product.brand}
            </span>

            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                lineHeight: 1.3,
                margin: "0.35rem 0",
                color: "#1A1A1A",
              }}
            >
              {product.name}
            </h3>
          </div>

          <span
            style={{
              background: "#E8F7F0",
              color: "#0F6E56",
              padding: "4px 10px",
              borderRadius: "999px",
              fontSize: "0.68rem",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            Disponible
          </span>
        </div>

        {product.presentation && (
          <span
            style={{
              color: "#6B7280",
              fontSize: "0.8rem",
              marginBottom: "0.7rem",
            }}
          >
            📦 {product.presentation}
          </span>
        )}

        <p
          style={{
            color: "#6B7280",
            fontSize: "0.85rem",
            lineHeight: 1.6,
            marginBottom: "1rem",
            flex: 1,
          }}
        >
          {product.description?.slice(0, 100)}...
        </p>

        {ingredients.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginBottom: "1rem",
            }}
          >
            {ingredients.map((ing) => (
              <div
                key={ing.label}
                style={{
                  background: "#F8F9FA",
                  borderRadius: "10px",
                  padding: "0.35rem 0.6rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                }}
              >
                <span>{ing.emoji}</span>
                <span>{ing.label}</span>
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          <span
            style={{
              fontSize: "1.7rem",
              fontWeight: 900,
              color: "#1E5F61",
            }}
          >
            {product.price && !isNaN(Number(product.price))
              ? `$${Number(product.price).toLocaleString("es-CO")}`
              : "Consultar"}{" "}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.7rem",
          }}
        >
          <button
            onClick={() => onAddToCart(product)}
            style={{
              flex: 1,
              border: "none",
              background: "linear-gradient(135deg, #1E5F61, #3D8A8C)",
              color: "#fff",
              borderRadius: "16px",
              padding: "1rem",
              fontWeight: 800,
              cursor: "pointer",
              fontSize: "0.92rem",
              boxShadow: "0 8px 18px rgba(30,95,97,0.22)",
            }}
          >
            🛒 Agregar
          </button>

          <button
            onClick={() => onVerFicha(product)}
            style={{
              border: "1px solid #1E5F61",
              background: "#fff",
              color: "#1E5F61",
              borderRadius: "16px",
              padding: "1rem",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            Ver ficha
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [fichaOpen, setFichaOpen] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const { addItem } = useCart();

  useEffect(() => {
    const catFromUrl = searchParams.get("cat");

    if (catFromUrl) setSelectedCat(catFromUrl);
  }, []);

  const handleCatChange = (value) => {
    setSelectedCat(value);

    if (value) setSearchParams({ cat: value });
    else setSearchParams({});
  };

  const handleAddToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: null,
    });

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: `${product.name} agregado al carrito`,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <div
      style={{
        background: "#F4F7F8",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      {/* FILTROS */}
      <div
        style={{
          background: "#fff",
          borderRadius: "28px",
          padding: "1rem",
          marginBottom: "2rem",
          display: "flex",
          gap: "1rem",
          boxShadow: "0 8px 22px rgba(0,0,0,0.04)",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            border: "1px solid #E5E7EB",
            borderRadius: "16px",
            padding: "1rem",
            fontSize: "1rem",
          }}
        />

        <select
          value={selectedCat}
          onChange={(e) => handleCatChange(e.target.value)}
          style={{
            minWidth: 260,
            border: "2px solid #D4883B",
            borderRadius: "16px",
            padding: "1rem",
            fontSize: "1rem",
            fontWeight: 600,
          }}
        >
          <option value="">Todas las categorías</option>

          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* GRID */}
      {
  PRODUCTOS_DATA
    .filter((product) => {
      const text = search.toLowerCase();

      const matchesSearch =
        !search ||
        product.name
          ?.toLowerCase()
          .includes(text) ||
        product.brand
          ?.toLowerCase()
          .includes(text) ||
        product.description
          ?.toLowerCase()
          .includes(text);

      const matchesCategory =
        !selectedCat ||
        product.categoryId === selectedCat;

      return matchesSearch && matchesCategory;
    })
    .map((product) => (
      <ProductCard
        key={`${product.id}-${product.name}-${product.categoryId}`}
        product={product}
        onVerFicha={setFichaOpen}
        onAddToCart={handleAddToCart}
      />
    ))
}

      {fichaOpen && (
        <FichaTecnicaModal
          product={fichaOpen}
          onClose={() => setFichaOpen(null)}
        />
      )}

      <style>{`
        .product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 42px rgba(0,0,0,0.12);
        }
      `}</style>
    </div>
  );
}
