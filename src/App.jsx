import { useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar";

import Noticias from "./components/Noticias";
import Perros from "./components/Perros";
import Gatos from "./components/Gatos";
import Productos from "./components/Productos";
import Usuarios from "./components/Usuarios";
import Recetas from "./components/Recetas";
import Pokemon from "./components/Pokemon";

function App() {

    const [seccion, setSeccion] = useState("Inicio");

    const servicios = [
        {
            nombre: "Noticias",
            icono: "📰",
            descripcion: "Consulta las últimas noticias."
        },
        {
            nombre: "Perros",
            icono: "🐶",
            descripcion: "Descubre diferentes razas de perros."
        },
        {
            nombre: "Gatos",
            icono: "🐱",
            descripcion: "Explora imágenes de gatos."
        },
        {
            nombre: "Productos",
            icono: "🛍️",
            descripcion: "Consulta diferentes productos."
        },
        {
            nombre: "Usuarios",
            icono: "👥",
            descripcion: "Conoce diferentes perfiles."
        },
        {
            nombre: "Recetas",
            icono: "🍽️",
            descripcion: "Encuentra recetas de comida."
        },
        {
            nombre: "Pokémon",
            icono: "🎮",
            descripcion: "Descubre diferentes Pokémon."
        }
    ];

    return (

        <div className="app">

            <Navbar
                seccion={seccion}
                cambiarSeccion={setSeccion}
            />

            <main className="contenido">

                {/* PAGINA PRINCIPAL */}

                {seccion === "Inicio" && (

                    <div className="dashboard-home">

                        <div className="bienvenido">

                            <h1>Bienvenido a la galería de APIs</h1>

                            <p>
                                Aquí encontrarás diferentes servicios
                                que permiten consultar información
                                mediante APIs externas.
                            </p>

                        </div>

                        <h2>Nuestros servicios</h2>

                        <div className="dashboard-grid">

                            {servicios.map((servicio) => (

                                <button
                                    className="dashboard-card"
                                    key={servicio.nombre}
                                    onClick={() => setSeccion(servicio.nombre)}
                                >

                                    <span>{servicio.icono}</span>

                                    <h3>{servicio.nombre}</h3>

                                    <p>{servicio.descripcion}</p>

                                    <small>Ver sección →</small>

                                </button>

                            ))}

                        </div>

                    </div>

                )}

                {/* NOTICIAS */}

                {seccion === "Noticias" && <Noticias />}

                {/* PERROS */}

                {seccion === "Perros" && <Perros />}

                {/* GATOS */}

                {seccion === "Gatos" && <Gatos />}

                {/* PRODUCTOS */}

                {seccion === "Productos" && <Productos />}

                {/* USUARIOS */}

                {seccion === "Usuarios" && <Usuarios />}

                {/* RECETAS */}

                {seccion === "Recetas" && <Recetas />}

                {/* POKEMON */}

                {seccion === "Pokémon" && <Pokemon />}

            </main>

        </div>
    );
}

export default App;