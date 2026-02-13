// ========================================
// 1. VARIABLES GLOBALES - Almacenan datos que usamos en todo el programa
// ========================================

// Guarda el ID del Pokémon que estamos viendo actualmente
// Comienza en 1 (Bulbasaur, el primer Pokémon)
let currentPokemonId = 1;

// Define el total de Pokémon que podemos mostrar (151 = Pokédex original)
// Usamos esto para limitar la navegación (no ir más allá del 151)
const totalPokemons = 151;

// La dirección base de la API de Pokémon
// Con esto hacemos las peticiones: https://pokeapi.co/api/v2/pokemon/1, /2, /3, etc.
const apiBaseUrl = 'https://pokeapi.co/api/v2/pokemon';


// ========================================
// 2. OBTENER ELEMENTOS DEL HTML - Buscamos los elementos por su ID
// ========================================
// document.getElementById() busca un elemento HTML por su ID
// Guardamos estas referencias para usarlas después de forma más rápida

// Variable para la etiqueta <img> donde mostraremos la imagen del Pokémon
const pokemonImage = document.getElementById('pokemonImage');

// Variable para el <h2> donde mostraremos el nombre del Pokémon
const pokemonName = document.getElementById('pokemonName');

// Variable para el <span> donde mostraremos el tipo del Pokémon (fuego, agua, etc)
const pokemonType = document.getElementById('pokemonType');

// Variable para el <span> donde mostraremos la altura del Pokémon
const pokemonHeight = document.getElementById('pokemonHeight');

// Variable para el <span> donde mostraremos el peso del Pokémon
const pokemonWeight = document.getElementById('pokemonWeight');

// Variable para el <p> que muestra el ID del Pokémon (#001, #002, etc)
const pokemonId = document.getElementById('pokemonId');

// Variable para el botón "Anterior"
const prevBtn = document.getElementById('prevBtn');

// Variable para el botón "Siguiente"
const nextBtn = document.getElementById('nextBtn');

// Variable para el botón "Aleatorio"
const randomBtn = document.getElementById('randomBtn');

// Variable para el poder/habilidad del Pokémon
const pokemonPower = document.getElementById('pokemonPower');


// ========================================
// 3. AGREGAR EVENTOS A LOS BOTONES
// ========================================
// addEventListener() significa "espera a que el usuario haga clic en el botón"
// Si hace clic en prevBtn, ejecuta la función previousPokemon()
prevBtn.addEventListener('click', previousPokemon);

// Si hace clic en nextBtn, ejecuta la función nextPokemon()
nextBtn.addEventListener('click', nextPokemon);

// Si hace clic en randomBtn, ejecuta la función randomPokemon()
randomBtn.addEventListener('click', randomPokemon);


// ========================================
// 4. FUNCIÓN PARA OBTENER DATOS DE LA API
// ========================================
// async = Esta función hace trabajos que tardan tiempo (como descargar datos de internet)
// function fetchPokemon(id) = Recibe el número del Pokémon que queremos obtener
async function fetchPokemon(id) {
    try {
        // Hace una petición a la API
        // `${apiBaseUrl}/${id}` convierte https://pokeapi.co/api/v2/pokemon/1
        // fetch() descarga los datos de esa dirección
        // await = "espera a que termine la descarga"
        const response = await fetch(`${apiBaseUrl}/${id}`);
        
        // Verifica si la respuesta fue correcta (código 200 significa ok)
        // Si no es correcta (ej: error 404), lanza un error
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        
        // Convierte los datos que llegaron de JSON a un objeto JavaScript que podemos usar
        // JSON es un formato de texto que la API envía
        // .json() lo convierte para que podamos acceder a sus propiedades
        const data = await response.json();
        
        // Llama la función displayPokemon() que actualiza la pantalla con estos datos
        displayPokemon(data);
        
    } catch (error) {
        // Si ocurre un ERROR (la API no responde, no hay internet, etc)
        // Este bloque captura ese error para que el programa no se quiebre
        console.error('Error al obtener el Pokémon:', error);
        // Muestra un mensaje de error en la pantalla
        pokemonName.textContent = 'Error al cargar';
    }
}


// ========================================
// 5. FUNCIÓN PARA MOSTRAR LOS DATOS EN LA PANTALLA
// ========================================
// Recibe un objeto "pokemon" con todos los datos del Pokémon
function displayPokemon(pokemon) {
    
    // === MOSTRAR LA IMAGEN ANIMADA CON PODER ===
    // Usamos sprites GIF de Showdown que muestran a los Pokémon en pose de ataque
    // La URL es: https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/NUMERO.gif
    // Estos GIFs muestran la animación original del Pokémon usando su poder
    const showdownUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${pokemon.id}.gif`;
    
    // Si la imagen de Showdown no está disponible, fallback a la imagen oficial estática
    // Primero intentamos con el GIF de Showdown, si falla usamos oficial-artwork
    pokemonImage.src = showdownUrl;
    
    // Manejo de error si la imagen GIF no carga
    pokemonImage.onerror = function() {
        // Fallback: usa la imagen oficial estática
        this.src = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
    };
    
    pokemonImage.alt = pokemon.name;
    
    // Reinicia la animación de poder cada vez que carga un nuevo Pokémon
    pokemonImage.style.animation = 'none';
    pokemonImage.classList.remove('power-attack');
    
    // Triggered reflow para reiniciar la animación
    setTimeout(() => {
        pokemonImage.style.animation = 'floatPokemon 3s ease-in-out infinite, pulseGlow 2s ease-in-out infinite';
        // Agrega la clase de ataque para generar efecto de poder
        pokemonImage.classList.add('power-attack');
    }, 10);
    
    // === MOSTRAR EL NOMBRE ===
    // .textContent cambia el texto visible del elemento
    pokemonName.textContent = pokemon.name;
    
    // === MOSTRAR EL TIPO ===
    // pokemon.types es una lista con los tipos (ej: [fuego, volador])
    // .map() transforma cada elemento de la lista
    // type => type.type.name saca solo el nombre del tipo
    // .join(', ') une todos los tipos con una coma y espacio (ej: "fuego, volador")
    const types = pokemon.types.map(type => type.type.name).join(', ');
    pokemonType.textContent = types;
    
    // === MOSTRAR LA ALTURA ===
    // La API devuelve la altura en decímetros, pero queremos mostrarla en metros
    // pokemon.height / 10 convierte decímetros a metros (ej: 10 dm = 1 m)
    // .toFixed(1) redondea a 1 decimal (ej: 1.5)
    // + ' m' agrega la unidad "metros"
    pokemonHeight.textContent = (pokemon.height / 10).toFixed(1) + ' m';
    
    // === MOSTRAR EL PESO ===
    // La API devuelve el peso en hectogramos, pero queremos mostrar en kilogramos
    // pokemon.weight / 10 convierte hectogramos a kilogramos (ej: 100 hg = 10 kg)
    // .toFixed(1) redondea a 1 decimal
    // + ' kg' agrega la unidad "kilogramos"
    pokemonWeight.textContent = (pokemon.weight / 10).toFixed(1) + ' kg';
    
    // === MOSTRAR EL ID CON FORMATO ===
    // pokemon.id es un número (ej: 1, 2, 3)
    // .toString() lo convierte a texto
    // .padStart(3, '0') lo "rellena" con ceros a la izquierda para que tenga 3 dígitos
    // Ejemplo: 1 se convierte en 001, 25 se convierte en 025
    // El ` #${...} ` es una plantilla de texto que agrega la # delante
    pokemonId.textContent = `#${pokemon.id.toString().padStart(3, '0')}`;
    
    // === MOSTRAR EL PODER (HABILIDAD PRINCIPAL) ===
    // Obtiene la habilidad principal del Pokémon
    // pokemon.abilities es una lista de habilidades
    // Seleccionamos la primera [0] y accedemos a su nombre (ability.name)
    if (pokemon.abilities && pokemon.abilities.length > 0) {
        const mainAbility = pokemon.abilities[0].ability.name;
        // Reemplaza guiones con espacios y pone en mayúscula
        pokemonPower.textContent = mainAbility.replace('-', ' ');
    } else {
        pokemonPower.textContent = 'Desconocido';
    }
}


// ========================================
// 6. FUNCIÓN PARA IR AL POKÉMON ANTERIOR
// ========================================
function previousPokemon() {
    // Verifica que no estamos en el primer Pokémon
    // Si currentPokemonId es 1, no podemos retroceder más
    if (currentPokemonId > 1) {
        // Resta 1 al ID del Pokémon actual
        // Ejemplo: si estábamos en el 5, ahora vamos al 4
        currentPokemonId--;
        
        // Llama fetchPokemon() con el nuevo ID para descargar ese Pokémon
        fetchPokemon(currentPokemonId);
    }
}


// ========================================
// 7. FUNCIÓN PARA IR AL POKÉMON SIGUIENTE
// ========================================
function nextPokemon() {
    // Verifica que no hemos llegado al Pokémon número 151 (el límite)
    if (currentPokemonId < totalPokemons) {
        // Suma 1 al ID del Pokémon actual
        // Ejemplo: si estábamos en el 5, ahora vamos al 6
        currentPokemonId++;
        
        // Llama fetchPokemon() con el nuevo ID para descargar ese Pokémon
        fetchPokemon(currentPokemonId);
    }
}


// ========================================
// 8. FUNCIÓN PARA GENERAR UN POKÉMON ALEATORIO
// ========================================
// Esta función genera un número aleatorio entre 1 y 151
function randomPokemon() {
    // Math.random() genera un número entre 0 y 1
    // Multiplicamos por totalPokemons para obtener un rango 0 a 151
    // Math.floor() redondea hacia abajo (convierte 5.9 en 5)
    // Sumamos 1 porque queremos de 1 a 151, no de 0 a 150
    const randomId = Math.floor(Math.random() * totalPokemons) + 1;
    
    // Actualiza el ID del Pokémon actual
    currentPokemonId = randomId;
    
    // Carga el Pokémon aleatorio
    fetchPokemon(randomId);
}


// ========================================
// 9. EJECUTAR AL CARGAR LA PÁGINA
// ========================================
// Esta línea se ejecuta cuando se abre la página
// Carga el Pokémon #1 (Bulbasaur) para que no vea la página vacía
fetchPokemon(currentPokemonId);