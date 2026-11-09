import { useState, useEffect } from "react";
import "./Noticias.css";

function Noticias() {
    const [noticias, setNoticias] = useState([]);
    const [categoria, setCategoria] = useState("general");
    const [cargado, setCargado] = useState(false);
    const [error, setError] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);

    const API_KEY = import.meta.env.VITE_GNEWS_API_KEY;

    const categorias = [
        { nombre: "General", valor: "general", icono: "🌍" },
        { nombre: "Tecnología", valor: "technology", icono: "💻" },
        { nombre: "Deportes", valor: "sports", icono: "⚾" },
        { nombre: "Mundo", valor: "world", icono: "🌎" },
        { nombre: "Nacional", valor: "nation", icono: "🇵🇪" },
        { nombre: "Negocios", valor: "business", icono: "💼" },
        { nombre: "Entretenimiento", valor: "entertainment", icono: "🎬" },
        { nombre: "Ciencia", valor: "science", icono: "🔬" }
    ];

    useEffect(() => {
        const obtenerNoticias = async () => {
            try {
                setCargado(true);
                setError("");
                setNoticias([]);
                setPaginaActual(1);

                if (!API_KEY) {
                    throw new Error("No se encontró la clave de GNews en el archivo .env");
                }

                const url = `https://gnews.io/api/v4/top-headlines?category=${categoria}&lang=es&country=pe&max=10&apikey=${API_KEY}`;

                const respuesta = await fetch(url);
                const datos = await respuesta.json();

                if (!respuesta.ok) {
                    throw new Error("No se pudieron cargar las noticias");
                }

                setNoticias(datos.articles || []);

            } catch (err) {
                setError(err.message);
                setNoticias([]);
            } finally {
                setCargado(false);
            }
        };

        obtenerNoticias();

    }, [categoria]);

    // PAGINACION
    const noticiasPorPagina = 4;

    const totalPaginas = Math.ceil(noticias.length / noticiasPorPagina);

    const indiceInicial = (paginaActual - 1) * noticiasPorPagina;

    const noticiasPagina = noticias.slice(
        indiceInicial,
        indiceInicial + noticiasPorPagina
    );

    return (
        <div className="noticias">

            <h1>Últimas noticias 📰</h1>

            {/* CATEGORIAS */}
            <div className="categoria">

                {categorias.map((item) => (
                    <button
                        key={item.valor}
                        className={categoria === item.valor ? "activo" : ""}
                        onClick={() => setCategoria(item.valor)}
                    >
                        {item.icono} {item.nombre}
                    </button>
                ))}

            </div>

            {cargado && <p className="cargando">Cargando noticias...</p>}

            {error && <p className="error">{error}</p>}

            {!cargado && !error && noticias.length === 0 && (
                <p>No se encontraron noticias.</p>
            )}

            {/* LISTA DE NOTICIAS */}
            {!cargado && !error && (
                <div className="lista-noticias">

                    {noticiasPagina.map((noticia, i) => (

                        <div
                            className="noticias-card"
                            key={noticia.url || i}
                        >

                            <img
                                src={noticia.image || "https://placehold.co/600x400?text=Noticia"}
                                alt={noticia.title}
                            />

                            <div className="noticia-info">

                                <small>{noticia.source?.name}</small>

                                <h3>{noticia.title}</h3>

                                <p>{noticia.description}</p>

                                <a
                                    href={noticia.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Leer más...
                                </a>

                            </div>

                        </div>

                    ))}

                </div>
            )}

            {/* PAGINACION */}
            {!cargado && !error && totalPaginas > 1 && (

                <div className="paginacion">

                    <button
                        onClick={() => setPaginaActual(paginaActual - 1)}
                        disabled={paginaActual === 1}
                    >
                        Anterior
                    </button>

                    {Array.from(
                        { length: totalPaginas },
                        (_, i) => i + 1
                    ).map((pagina) => (

                        <button
                            key={pagina}
                            className={paginaActual === pagina ? "pagina-activa" : ""}
                            onClick={() => setPaginaActual(pagina)}
                        >
                            {pagina}
                        </button>

                    ))}

                    <button
                        onClick={() => setPaginaActual(paginaActual + 1)}
                        disabled={paginaActual === totalPaginas}
                    >
                        Siguiente
                    </button>

                </div>

            )}

        </div>
    );
}

export default Noticias;