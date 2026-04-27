import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Detalle() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetch(`https://www.dnd5eapi.co/api/2014/magic-items/${id}`)
      .then(res => res.json())
      .then(setItem);
  }, [id]);

  if (!item) return <p>Cargando...</p>;

  const guardar = () => {
    const favs = JSON.parse(localStorage.getItem("favs")) || [];
    localStorage.setItem("favs", JSON.stringify([...favs, item]));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{item.name}</h2>
      <p>{item.desc?.join(" ")}</p>
      <button onClick={guardar}>Guardar en favoritos</button>
    </div>
  );
}