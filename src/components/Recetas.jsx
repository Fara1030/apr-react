import { useState, useEffect } from "react";
import "./Recetas.css";

function Recetas() {
    const [recetas, setRecetas] = useState([]);
    const [busqueda, setBusqueda] = useState("chicken");
    const [termino, setTermino] = useState("chicken");
    const [cargado, setCargado] = useState(false);
    const [error, setError] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);

    // OBTENER RECETAS
    useEffect(() => {
        const obtenerRecetas = async () => {
            try {
                setCargado(true);
                setError("");

                const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(termino)}`;

                const respuesta = await fetch(url);

                if (!respuesta.ok) {
                    throw new Error("No se pudieron cargar las recetas");
                }

                const datos = await respuesta.json();

                setRecetas(datos.meals || []);
                setPaginaActual(1);

            } catch (err) {
                setError(err.message);
                setRecetas([]);
            } finally {
                setCargado(false);
            }
        };

        obtenerRecetas();
    }, [termino]);

    // BUSCADOR
    function buscarRecetas(e) {
        e.preventDefault();

        setPaginaActual(1);
        setTermino(busqueda.trim());
    }

    // PAGINACION
    const recetasPorPagina = 4;
    const totalPaginas = Math.ceil(recetas.length / recetasPorPagina);
    const indiceInicial = (paginaActual - 1) * recetasPorPagina;

    const recetasPagina = recetas.slice(
        indiceInicial,
        indiceInicial + recetasPorPagina
    );

    const inicioPaginas = Math.max(
        1,
        Math.min(paginaActual - 2, totalPaginas - 4)
    );

    const paginasVisibles = Array.from(
        { length: Math.min(5, totalPaginas) },
        (_, i) => inicioPaginas + i
    );

    return (
        <div className="recetas-page">

            <h1>Galería de Recetas 🍽️</h1>
            <p>Descubre diferentes comidas y preparaciones.</p>

            <form
                className="controles-busqueda"
                onSubmit={buscarRecetas}
            >
                <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar una receta..."
                />

                <button type="submit">Buscar</button>
            </form>

            {cargado && <p className="cargando">Cargando recetas...</p>}
            {error && <p className="error">{error}</p>}

            {!cargado && !error && recetas.length === 0 && (
                <p>No se encontraron recetas.</p>
            )}

            {!cargado && !error && (
                <div className="recetas-grid">

                    {recetasPagina.map((receta) => (
                        <div className="receta-card" key={receta.idMeal}>

                            <img
                                src={receta.strMealThumb}
                                alt={receta.strMeal}
                            />

                            <div>
                                <h3>{receta.strMeal}</h3>

                                <p>
                                    Categoría: {receta.strCategory}
                                </p>

                                <p>
                                    Origen: {receta.strArea}
                                </p>

                                {receta.strSource && (
                                    <a
                                        href={receta.strSource}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Ver preparación
                                    </a>
                                )}
                            </div>

                        </div>
                    ))}

                </div>
            )}

            {/* PAGINACION */}

            {!cargado && !error && totalPaginas > 1 && (
                <div className="paginacion-api">

                    <button
                        disabled={paginaActual === 1}
                        onClick={() => setPaginaActual(paginaActual - 1)}
                    >
                        Anterior
                    </button>

                    {paginasVisibles.map((pagina) => (
                        <button
                            key={pagina}
                            className={paginaActual === pagina ? "pagina-activa" : ""}
                            onClick={() => setPaginaActual(pagina)}
                        >
                            {pagina}
                        </button>
                    ))}

                    <button
                        disabled={paginaActual === totalPaginas}
                        onClick={() => setPaginaActual(paginaActual + 1)}
                    >
                        Siguiente
                    </button>

                </div>
            )}

        </div>
    );
}

export default Recetas;