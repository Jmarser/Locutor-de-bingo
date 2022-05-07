window.addEventListener("load", () => {

    //Elementos del DOM
    const iniciar = document.getElementById("iniciar");
    const pausar = document.getElementById("pausar");
    const revisar = document.getElementById("revisar");
    const terminar = document.getElementById("terminar");
    const numeros = document.querySelectorAll(".numero");
    const mostrar = document.getElementById("actual");

    let bombo = []; //Array de donde sacaremoslos números
    let tablero = []; // Array donde guardaremos los números que saquemos del bombo 
    let partida; //Variable para el setInterval de cantar las bolas del bombo.
    let revision; //Variable para el setInterval de cantar las bolas del tablero.
    let onOff = false; //variable para pausar el intervalo de cantar el bombo.
    let jugando = false; //variable para determinar si el juego ha empezado o no.
    let revisando = false; //variable para determinar si estamos realizando una revisión
    let timerInterval;

    /* Función con la que reiniciamos los elementos necesarios para la partida */
    const reiniciarJuego = () => {
        //vaciamos los arrays.
        bombo.length = 0;
        tablero.length = 0;

        //quitamos la clase que marca los números del tablero.
        numeros.forEach((numero) => {
            numero.classList.remove("sacado");
        });

        //vaciamos el texto del panel que muestra la bola sacada.
        mostrar.textContent = "";
    }

    //Llenamos el array del bombo con los 90 números.
    const llenarBombo = () => {
        for (let i = 1; i <= 90; i++) {
            bombo.push(i);
        }
    };

    /* Función con la que mezclamos los números del array del bombo, para ellos hacemos un bucle.
    En cada ciclo del bucle cogemos dos números aleatorios del array y los intercambiamos */
    const mezclarBombo = () => {
        for (let i = 0; i <= 500; i++) {
            let al1 = Math.floor(Math.random() * 90);
            let al2 = Math.floor(Math.random() * 90);

            let aux = bombo[al1];
            bombo[al1] = bombo[al2];
            bombo[al2] = aux;
        }
    };

    /* Sacamos las bolas del array del bombo, la marcamos en el tablero y la guardamos en el array
    del tablero. */
    const sacarBolas = () => {
        if (jugando) { //comenzamos a sacar bolas si estamos jugando.
            if (bombo.length != 0) {//sacamos bolas mientras haya bolas en el bombo.

                let actual = bombo.shift();

                numeros.forEach((numero) => {
                    if (numero.getAttribute("data-number") == actual) {
                        numero.classList.add("sacado");
                    }
                });

                mostrar.textContent = actual;

                tablero.push(actual);
                locutor(`El ${actual}`);//cantamos el número.

                //console.log({ bombo, tablero, actual });
            } else {
                terminarPartida();
            }
        }
    };

    let indice = 0; //Variable para hacer la revisión de los números del tablero

    /* Función que lee los números que hay en el array del tablero para comprobar los sacados. */
    const revisarTablero = () => {

        //ordenamos los números del array
        tablero.sort((a, b) => a - b);

        if (indice <= tablero.length - 1) { //sacamos bolas del tablero mientra haya.

            locutor(`El ${tablero[indice]}`);
            indice++;

        } else {//ya no quedan bolas para revisar
            locutor("Terminada revisión");
            revisando = false;
            clearInterval(revision);
            pausarJuego();
        }
    };

    /*El juego ha terminado, por lo que preparamos el tablero para una nueva partida. */
    const terminarPartida = () => {

        if (jugando) {
            jugando = false;
            locutor("Partida finalizada");
            clearInterval(partida);
            reiniciarJuego();
        }
    };

    /*Función con la que hacemos que el navegador nos hable */
    const locutor = (texto) => {
        // let mensaje = new SpeechSynthesisUtterance();
        // mensaje.text = texto;
        // speechSynthesis.speak(mensaje);
        speechSynthesis.speak(new SpeechSynthesisUtterance(texto));
    };

    /*Iniciamos la partida */
    iniciar.addEventListener("click", () => {

        //obtenemos el tiempo indicado en el campo y lo multiplicamos para obtener milisegundos
        timerInterval = parseInt(document.getElementById("tiempo").value) * 1000; //intervalo que tardara en cantar las bolas.

        if (!jugando && !revisando) {
            jugando = true;

            //validamos que si no se ha metido ningún valor en el campo, por defecto tome el valor de 3segundos.
            (timerInterval > 1000) ? timerInterval = timerInterval : timerInterval = 3000;

            llenarBombo();
            mezclarBombo();

            locutor("iniciamos partida");
            partida = setInterval(sacarBolas, timerInterval);
        }
    });

    /*Se pausa el juego pudiendo luego continuar por donde se había detenido. */
    const pausarJuego = () => {
        if (!revisando) {
            if (!onOff) {
                locutor("estas en pausa");
                clearInterval(partida);
                pausar.textContent = "Continuar";
            } else {
                locutor("Reanudamos partida");

                pausar.textContent = "Pausar";
                partida = setInterval(sacarBolas, timerInterval);
            }

            onOff = !onOff; //cambiamos el valor de la variable.
        }
    }

    /*Se realiza una pausa del juego y se comienza con la revisión del tablero */
    const revisandoTablero = () => {
        pausarJuego();
        if (jugando && onOff) {
            revisando = true;
            indice = 0;

            locutor("Iniciamos revisión");
            revision = setInterval(revisarTablero, timerInterval);
        }

    }

    /*Pausamos la partida sin reiniciar ninguno de los valores */
    pausar.addEventListener("click", pausarJuego);

    /*Evento que revisa los números que ya han salido. */
    revisar.addEventListener("click", revisandoTablero);

    /*Finalizamos la partida  */
    terminar.addEventListener("click", terminarPartida);
});
