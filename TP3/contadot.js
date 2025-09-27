
        function actualizarContador(){
            const inicio = new Date("2023-07-01T00:00:00");
            const hoy = new Date();

            const diferencia = hoy - inicio;

            const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
            const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
            const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
            const segundos = Math.floor((diferencia / 1000) % 60);

            document.getElementById("contador").textContent = 
                dias + "d " + horas + "h " + minutos + "m " + segundos +"s " ;

        }
        setInterval(actualizarContador, 1000);
        actualizarContador();
    