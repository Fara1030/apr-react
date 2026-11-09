import { useState, useEffect } from "react";
import "./Usuarios.css";

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [cargado, setCargado] = useState(false);
    const [error, setError] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);

    // OBTENER USUARIOS
    useEffect(() => {
        const obtenerUsuarios = async () => {
            try {
                setCargado(true);
                setError("");

                const respuesta = await fetch(
                    "https://randomuser.me/api/?results=60&seed=portalapis&nat=es,mx,us"
                );

                if (!respuesta.ok) {
                    throw new Error("No se pudieron cargar los usuarios");
                }

                const datos = await respuesta.json();

                setUsuarios(datos.results || []);

            } catch (err) {
                setError(err.message);
                setUsuarios([]);
            } finally {
                setCargado(false);
            }
        };

        obtenerUsuarios();
    }, []);

    // BUSCADOR
    const usuariosFiltrados = usuarios.filter((usuario) => {
        const texto = busqueda.toLowerCase();

        const nombre = `${usuario.name.first} ${usuario.name.last}`.toLowerCase();
        const correo = usuario.email.toLowerCase();
        const ciudad = usuario.location.city.toLowerCase();
        const pais = usuario.location.country.toLowerCase();

        return (
            nombre.includes(texto) ||
            correo.includes(texto) ||
            ciudad.includes(texto) ||
            pais.includes(texto)
        );
    });

    // PAGINACION
    const usuariosPorPagina = 8;
    const totalPaginas = Math.ceil(
        usuariosFiltrados.length / usuariosPorPagina
    );

    const indiceInicial = (paginaActual - 1) * usuariosPorPagina;

    const usuariosPagina = usuariosFiltrados.slice(
        indiceInicial,
        indiceInicial + usuariosPorPagina
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
        <div className="usuarios-page">

            <h1>Galería de Usuarios 👥</h1>
            <p>Conoce los perfiles de diferentes usuarios.</p>

            <div className="controles-busqueda">
                <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => {
                        setBusqueda(e.target.value);
                        setPaginaActual(1);
                    }}
                    placeholder="Buscar nombre, correo o ubicación..."
                />

                <button
                    type="button"
                    onClick={() => {
                        setBusqueda("");
                        setPaginaActual(1);
                    }}
                >
                    Limpiar
                </button>
            </div>

            {cargado && <p className="cargando">Cargando usuarios...</p>}
            {error && <p className="error">{error}</p>}

            {!cargado && !error && usuariosFiltrados.length === 0 && (
                <p>No se encontraron usuarios.</p>
            )}

            {!cargado && !error && (
                <div className="usuarios-grid">

                    {usuariosPagina.map((usuario) => (
                        <div className="usuario-card" key={usuario.login.uuid}>

                            <img
                                src={usuario.picture.large}
                                alt={usuario.name.first}
                            />

                            <div>
                                <h3>
                                    {usuario.name.first} {usuario.name.last}
                                </h3>

                                <p>Edad: {usuario.dob.age} años</p>

                                <p>{usuario.email}</p>

                                <p>
                                    {usuario.location.city},{" "}
                                    {usuario.location.country}
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

export default Usuarios;