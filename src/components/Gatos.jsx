import { useState, useEffect } from "react";
import "./Gatos.css";

function Gatos() {
    const [gatos, setGatos] = useState([]);
    const [razas, setRazas] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [razaSeleccionada, setRazaSeleccionada] = useState("");
    const [cargado, setCargado] = useState(false);
    const [error, setError] = useState("");
    const [errorRazas, setErrorRazas] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);

    const API_KEY = import.meta.env.VITE_CAT_API_KEY;

    // OBTENER RAZAS
    useEffect(() => {
        const obtenerRazas = async () => {
            try {
                if (!API_KEY) {
                    throw new Error("Falta la clave de TheCatAPI en el archivo .env");
                }

                const respuesta = await fetch(
                    "https://api.thecatapi.com/v1/breeds",
                    {
                        headers: {
                            "x-api-key": API_KEY
                        }
                    }
                );

                if (!respuesta.ok) {
                    throw new Error("No se pudieron cargar las razas");
                }

                const datos = await respuesta.json();
                setRazas(datos);

            } catch (err) {
                setErrorRazas(err.message);
            }
        };

        obtenerRazas();
    }, []);

    // OBTENER IMAGENES
    useEffect(() => {
        const obtenerGatos = async () => {
            try {
                setCargado(true);
                setError("");

                if (!API_KEY) {
                    throw new Error("Configura tu clave de TheCatAPI en el archivo .env");
                }

                let url;

                if (razaSeleccionada) {
                    url = `https://api.thecatapi.com/v1/images/search?limit=30&breed_ids=${razaSeleccionada}&include_breeds=1`;
                } else {
                    url = "https://api.thecatapi.com/v1/images/search?limit=30&has_breeds=1&include_breeds=1";
                }

                const respuesta = await fetch(url, {
                    headers: {
                        "x-api-key": API_KEY
                    }
                });

                if (!respuesta.ok) {
                    throw new Error("No se pudieron cargar los gatos");
                }

                const datos = await respuesta.json();
                setGatos(datos || []);
                setPaginaActual(1);

            } catch (err) {
                setError(err.message);
                setGatos([]);
            } finally {
                setCargado(false);
            }
        };

        obtenerGatos();
    }, [razaSeleccionada]);

    // BUSCADOR
    function buscarGatos(e) {
        e.preventDefault();

        const raza = razas.find(
            (item) => item.name.toLowerCase() === busqueda.trim().toLowerCase()
        );

        if (!busqueda.trim()) {
            setError("");
            setRazaSeleccionada("");
            setPaginaActual(1);
            return;
        }

        if (!raza) {
            setError("No se encontró esa raza. Selecciona una de la lista.");
            setGatos([]);
            return;
        }

        setRazaSeleccionada(raza.id);
        setPaginaActual(1);
    }

    // PAGINACION
    const gatosPorPagina = 4;
    const totalPaginas = Math.ceil(gatos.length / gatosPorPagina);
    const indiceInicial = (paginaActual - 1) * gatosPorPagina;

    const gatosPagina = gatos.slice(
        indiceInicial,
        indiceInicial + gatosPorPagina
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
        <div className="gatos-page">

            <h1>Galería de Gatos 🐱</h1>
            <p>Descubre diferentes razas de gatos.</p>

            <form className="controles-busqueda" onSubmit={buscarGatos}>
                <input
                    list="lista-razas-gatos"
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar por raza..."
                />

                <datalist id="lista-razas-gatos">
                    {razas.map((raza) => (
                        <option key={raza.id} value={raza.name} />
                    ))}
                </datalist>

                <button type="submit">Buscar</button>

                <button
                    type="button"
                    onClick={() => {
                        setBusqueda("");
                        setRazaSeleccionada("");
                        setError("");
                        setPaginaActual(1);
                    }}
                >
                    Todas
                </button>
            </form>

            {errorRazas && <p className="error">{errorRazas}</p>}
            {cargado && <p className="cargando">Cargando gatos...</p>}
            {error && <p className="error">{error}</p>}

            {!cargado && !error && gatos.length === 0 && (
                <p>No se encontraron gatos.</p>
            )}

            {!cargado && !error && (
                <div className="gatos-grid">

                    {gatosPagina.map((gato, i) => (
                        <div className="gato-card" key={gato.id || i}>

                            <img
                                src={gato.url}
                                alt={gato.breeds?.[0]?.name || "Gato"}
                            />

                            <div>
                                <h3>
                                    {gato.breeds?.[0]?.name || "Gato"}
                                </h3>

                                <p>
                                    {gato.breeds?.[0]?.origin || "Origen desconocido"}
                                </p>
                            </div>

                        </div>
                    ))}

                </div>
            )}

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

export default Gatos;