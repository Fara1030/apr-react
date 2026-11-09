import { useState, useEffect } from "react";
import "./Productos.css";

function Productos() {
    const [productos, setProductos] = useState([]);
    const [cargado, setCargado] = useState(false);
    const [error, setError] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const [total, setTotal] = useState(0);

    const productosPorPagina = 8;

    // OBTENER PRODUCTOS
    useEffect(() => {
        const obtenerProductos = async () => {
            try {
                setCargado(true);
                setError("");

                const saltar = (paginaActual - 1) * productosPorPagina;

                const respuesta = await fetch(
                    `https://dummyjson.com/products?limit=${productosPorPagina}&skip=${saltar}`
                );

                if (!respuesta.ok) {
                    throw new Error("No se pudieron cargar los productos");
                }

                const datos = await respuesta.json();

                setProductos(datos.products || []);
                setTotal(datos.total || 0);

            } catch (err) {
                setError(err.message);
                setProductos([]);
            } finally {
                setCargado(false);
            }
        };

        obtenerProductos();
    }, [paginaActual]);

    // PAGINACION
    const totalPaginas = Math.ceil(total / productosPorPagina);

    const inicioPaginas = Math.max(
        1,
        Math.min(paginaActual - 2, totalPaginas - 4)
    );

    const paginasVisibles = Array.from(
        { length: Math.min(5, totalPaginas) },
        (_, i) => inicioPaginas + i
    );

    return (
        <div className="productos-page">

            <h1>Galería de Productos 🛍️</h1>
            <p>Explora diferentes productos disponibles.</p>

            {cargado && <p className="cargando">Cargando productos...</p>}
            {error && <p className="error">{error}</p>}

            {!cargado && !error && productos.length === 0 && (
                <p>No se encontraron productos.</p>
            )}

            {!cargado && !error && (
                <div className="productos-grid">

                    {productos.map((producto) => (
                        <div className="producto-card" key={producto.id}>

                            <img
                                src={producto.thumbnail}
                                alt={producto.title}
                            />

                            <div>
                                <h3>{producto.title}</h3>

                                <p>{producto.description}</p>

                                <h4>Precio: ${producto.price}</h4>

                                <small>
                                    ⭐ Calificación: {producto.rating}
                                </small>
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

export default Productos;