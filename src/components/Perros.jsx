import { useState, useEffect } from "react";
import "./Perros.css";

function Perros() {
    const [perros, setPerros] = useState([]);
    const [razas, setRazas] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [razaSeleccionada, setRazaSeleccionada] = useState("random");
    const [cargado, setCargado] = useState(false);
    const [error, setError] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);

    // OBTENER LISTA DE RAZAS
    useEffect(() => {
        const obtenerRazas = async () => {
            try {
                const respuesta = await fetch(
                    "https://dog.ceo/api/breeds/list/all"
                );

                if (!respuesta.ok) {
                    throw new Error("No se pudieron cargar las razas");
                }

                const datos = await respuesta.json();

                const lista = Object.entries(datos.message).flatMap(
                    ([raza, subrazas]) => {
                        const opciones = [
                            {
                                nombre: raza,
                                ruta: raza
                            }
                        ];

                        subrazas.forEach((subraza) => {
                            opciones.push({
                                nombre: `${subraza} ${raza}`,
                                ruta: `${raza}/${subraza}`
                            });
                        });

                        return opciones;
                    }
                );

                setRazas(lista);

            } catch (err) {
                setError(err.message);
            }
        };

        obtenerRazas();
    }, []);

    // OBTENER IMAGENES
    useEffect(() => {
        const obtenerPerros = async () => {
            try {
                setCargado(true);
                setError("");

                let url;

                if (razaSeleccionada === "random") {
                    url = "https://dog.ceo/api/breeds/image/random/30";
                } else {
                    url = `https://dog.ceo/api/breed/${razaSeleccionada}/images/random/30`;
                }

                const respuesta = await fetch(url);

                if (!respuesta.ok) {
                    throw new Error("No se pudieron cargar los perros");
                }

                const datos = await respuesta.json();

                if (datos.status !== "success") {
                    throw new Error("No se encontraron imágenes");
                }

                setPerros(datos.message || []);
                setPaginaActual(1);

            } catch (err) {
                setError(err.message);
                setPerros([]);
            } finally {
                setCargado(false);
            }
        };

        obtenerPerros();
    }, [razaSeleccionada]);

    // BUSCADOR
    function buscarPerros(e) {
        e.preventDefault();

        if (!busqueda.trim()) {
            setError("");
            setRazaSeleccionada("random");
            setPaginaActual(1);
            return;
        }

        const raza = razas.find(
            (item) => item.nombre.toLowerCase() === busqueda.trim().toLowerCase()
        );

        if (!raza) {
            setError("Raza no encontrada. Selecciona una de la lista.");
            setPerros([]);
            return;
        }

        setError("");
        setRazaSeleccionada(raza.ruta);
        setPaginaActual(1);
    }

    // OBTENER NOMBRE DE LA RAZA
    function obtenerRaza(perro) {
        const nombre = perro.split("/")[4] || "Perro";

        return nombre
            .replace(/-/g, " ")
            .split(" ")
            .map((palabra) =>
                palabra.charAt(0).toUpperCase() + palabra.slice(1)
            )
            .join(" ");
    }

    // PAGINACION
    const perrosPorPagina = 4;
    const totalPaginas = Math.ceil(perros.length / perrosPorPagina);
    const indiceInicial = (paginaActual - 1) * perrosPorPagina;

    const perrosPagina = perros.slice(
        indiceInicial,
        indiceInicial + perrosPorPagina
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
        <div className="perros-page">

            <h1>Galería de Perros 🐶</h1>
            <p>Descubre diferentes razas de perros.</p>

            <form className="controles-busqueda" onSubmit={buscarPerros}>

                <input
                    list="lista-razas-perros"
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar por raza..."
                />

                <datalist id="lista-razas-perros">
                    {razas.map((raza) => (
                        <option key={raza.ruta} value={raza.nombre} />
                    ))}
                </datalist>

                <button type="submit">Buscar</button>

                <button
                    type="button"
                    onClick={() => {
                        setBusqueda("");
                        setError("");
                        setRazaSeleccionada("random");
                        setPaginaActual(1);
                    }}
                >
                    Todas
                </button>

            </form>

            {cargado && <p className="cargando">Cargando perros...</p>}
            {error && <p className="error">{error}</p>}

            {!cargado && !error && perros.length === 0 && (
                <p>No se encontraron perros.</p>
            )}

            {!cargado && !error && (
                <div className="perros-grid">

                    {perrosPagina.map((perro, indice) => (
                        <article className="perro-card" key={perro}>

                            <img
                                src={perro}
                                alt={obtenerRaza(perro)}
                            />

                            <div className="perro-info">
                                <h3>{obtenerRaza(perro)}</h3>

                                <p>
                                    Perro {indiceInicial + indice + 1}
                                </p>
                            </div>

                        </article>
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

export default Perros;