document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;

    const cards = Array.from(gallery.querySelectorAll('.card'));
    const thumbs = Array.from(gallery.querySelectorAll('.thumb'));


    // Modal
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modalImg');
    const swapBtn = document.getElementById('swapBtn');
    const printBtn = document.getElementById('printBtn');
    const closeBtn = document.getElementById('closeBtn');


    let activeThumb = null; // referencia a la miniatura que abrió el modal


    function clearHighlights() {
        cards.forEach(c => {
            c.classList.remove('highlight', 'dimmed', 'persist');
        });
    }


    function persistHighlight(card) {
        clearHighlights();
        card.classList.add('highlight', 'persist');
        cards.forEach(c => { if (c !== card) c.classList.add('dimmed'); });
    }


    // Añadimos listeners: hover y click
    thumbs.forEach((img) => {
        const card = img.closest('.card');


        // onMouseOver
        img.addEventListener('mouseover', () => {
            // si está persistida no tocar
            if (card && !card.classList.contains('persist')) {
                card.classList.add('highlight');
                cards.forEach(c => { if (c !== card) c.classList.add('dimmed') });
            }
        });


        // onMouseOut
        img.addEventListener('mouseout', () => {
            // si está persistida mantener
            if (card && !card.classList.contains('persist')) {
                card.classList.remove('highlight');
                cards.forEach(c => c.classList.remove('dimmed'));
            }
        });


        // onClick -> abre modal con opciones (cambiar / imprimir)
        img.addEventListener('click', (e) => {
            e.stopPropagation(); // evitar que el document click cierre inmediatamente
            activeThumb = img;
            if (card) persistHighlight(card);
            modalImg.src = img.src;
            modalImg.dataset.original = img.src;
            modalImg.dataset.alt = img.dataset.alt || '';
            window.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeBtn.click(); } });
        });
    });


    // cuando se hace click fuera de las miniaturas/galería -> volver a la normalidad
    document.addEventListener('click', (e) => {
        // si el click fue dentro de la galería no hacemos nada
        if (!gallery.contains(e.target)) {
            activeThumb = null;
            clearHighlights();
        }
    });


    // opcional: limpiar con ESC
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            activeThumb = null;
            clearHighlights();
        }
    });
});