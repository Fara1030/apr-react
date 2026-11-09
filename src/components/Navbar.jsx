import "./Navbar.css";

function Navbar({ seccion, cambiarSeccion }) {

    const opciones = [
        "Inicio",
        "Noticias",
        "Perros",
        "Gatos",
        "Productos",
        "Usuarios",
        "Recetas",
        "Pokémon"
    ];

    return (

        <nav className="navbar">

            <div>
                <span>📦</span> APIs
            </div>

            <div className="nav-links">

                {opciones.map((opcion) => (

                    <button
                        key={opcion}
                        className={seccion === opcion ? "seleccionado" : ""}
                        onClick={() => cambiarSeccion(opcion)}
                    >
                        {opcion}
                    </button>

                ))}

            </div>

        </nav>
    );
}

export default Navbar;