import { useState, useEffect } from "react";
import "./Pokemon.css";

function Pokemon() {
    const [listaPokemon, setListaPokemon] = useState([]);
    const [pokemones, setPokemones] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [termino, setTermino] = useState("");
    const [cargado, setCargado] = useState(false);
    const [error, setError] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);

    const pokemonPorPagina = 12;

    // OBTENER LISTA DE POKEMON
    useEffect(() => {
        const obtenerLista = async () => {
            try {
                setCargado(true);
                setError("");

                const respuesta = await fetch(
                    "https://pokeapi.co/api/v2/pokemon?limit=1025"
                );

                if (!respuesta.ok) {
                    throw new Error("No se pudieron cargar los Pokémon");
                }

                const datos = await respuesta.json();

                setListaPokemon(datos.results || []);

            } catch (err) {
                setError(err.message);
            } finally {
                setCargado(false);
            }
        };

        obtenerLista();
    }, []);

    // FILTRAR POKEMON POR NOMBRE
    const pokemonFiltrados = listaPokemon.filter((pokemon) =>
        pokemon.name.includes(termino.toLowerCase())
    );

    // PAGINACION
    const totalPaginas = Math.ceil(
        pokemonFiltrados.length / pokemonPorPagina
    );

    const indiceInicial = (paginaActual - 1) * pokemonPorPagina;

    const pokemonPagina = pokemonFiltrados.slice(
        indiceInicial,
        indiceInicial + pokemonPorPagina
    );

    const inicioPaginas = Math.max(
        1,
        Math.min(paginaActual - 2, totalPaginas - 4)
    );

    const paginasVisibles = Array.from(
        { length: Math.min(5, totalPaginas) },
        (_, i) => inicioPaginas + i
    );

    // OBTENER DETALLES DE LA PAGINA ACTUAL
    useEffect(() => {
        let cancelado = false;

        const obtenerDetalles = async () => {
            if (listaPokemon.length === 0) {
                return;
            }

            if (pokemonPagina.length === 0) {
                setPokemones([]);
                return;
            }

            try {
                setCargado(true);
                setError("");

                const detalles = await Promise.all(
                    pokemonPagina.map(async (pokemon) => {
                        const respuesta = await fetch(pokemon.url);

                        if (!respuesta.ok) {
                            throw new Error("Error al obtener un Pokémon");
                        }

                        return await respuesta.json();
                    })
                );

                if (!cancelado) {
                    setPokemones(detalles);
                }

            } catch (err) {
                if (!cancelado) {
                    setError(err.message);
                    setPokemones([]);
                }
            } finally {
                if (!cancelado) {
                    setCargado(false);
                }
            }
        };

        obtenerDetalles();

        return () => {
            cancelado = true;
        };

    }, [listaPokemon, paginaActual, termino]);

    // BUSCADOR
    function buscarPokemon(e) {
        e.preventDefault();

        setPaginaActual(1);
        setTermino(busqueda.trim().toLowerCase());
    }

    return (
        <div className="pokemon-page">

            <h1>Galería Pokémon 🎮</h1>
            <p>Descubre diferentes Pokémon y sus características.</p>

            <form
                className="controles-busqueda"
                onSubmit={buscarPokemon}
            >
                <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar por nombre..."
                />

                <button type="submit">Buscar</button>

                <button
                    type="button"
                    onClick={() => {
                        setBusqueda("");
                        setTermino("");
                        setPaginaActual(1);
                    }}
                >
                    Todos
                </button>
            </form>

            {cargado && <p className="cargando">Cargando Pokémon...</p>}
            {error && <p className="error">{error}</p>}

            {!cargado && !error && pokemonFiltrados.length === 0 && listaPokemon.length > 0 && (
                <p>No se encontraron Pokémon.</p>
            )}

            {!cargado && !error && (
                <div className="pokemon-grid">

                    {pokemones.map((pokemon) => (
                        <div className="pokemon-card" key={pokemon.id}>

                            <img
                                src={
                                    pokemon.sprites.other?.["official-artwork"]?.front_default ||
                                    pokemon.sprites.front_default
                                }
                                alt={pokemon.name}
                            />

                            <div>
                                <small>
                                    N.º {String(pokemon.id).padStart(3, "0")}
                                </small>

                                <h3>
                                    {pokemon.name.charAt(0).toUpperCase() +
                                        pokemon.name.slice(1)}
                                </h3>

                                <div className="pokemon-tipos">
                                    {pokemon.types.map((tipo) => (
                                        <span key={tipo.type.name}>
                                            {tipo.type.name}
                                        </span>
                                    ))}
                                </div>

                                <p>Altura: {pokemon.height / 10} m</p>
                                <p>Peso: {pokemon.weight / 10} kg</p>
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

export default Pokemon;