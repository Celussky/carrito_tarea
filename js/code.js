const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))


let botonesControlCantidad = document.querySelectorAll(".botonControl")
botonesControlCantidad.forEach(botoncito => {
    botoncito.addEventListener("click", (evento) => {
        let h5Producto = document.querySelector(`#${evento.target.dataset.idCantidad}`)
        let cantidadActual = h5Producto.innerText
        
        if (evento.target.dataset.accion == 'restar') {
            if (cantidadActual > 1) {
                cantidadActual = parseInt(cantidadActual) - 1
            }
        } else {
            cantidadActual = parseInt(cantidadActual) + 1
        }
        h5Producto.innerHTML = cantidadActual
    })
});

let botonesQuitarProducto = document.querySelectorAll('.botonQuitar');
botonesQuitarProducto.forEach(botonQuitar => {
    botonQuitar.addEventListener('click', (e) => {
        let cardProducto = e.target.closest('.cardCarrito');
        cardProducto.remove();
        actualizarResumenCompra();
    });
});

document.querySelector('#btnBorrarCarro').addEventListener('click', () => {
    Swal.fire({
        title: "¿Estás seguro?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, vaciar carrito.",
        cancelButtonText: "Cancelar."
    }).then((result) => {
        if (result.isConfirmed) {
            let productos = document.querySelectorAll('.cardCarrito');
            productos.forEach(producto => producto.remove());
            actualizarResumenCompra();
            Swal.fire({
                title: "Eliminado",
                text: "No hay productos en tu carrito.",
                icon: "success"
            });
        }
    });
});

function actualizarResumenCompra() {
    let totalProductos = document.querySelectorAll('.cardCarrito').length;
    document.querySelector('#totalProductos').innerText = totalProductos;

    let envioPrioritario = document.querySelector('#envioPrioritario');
    let costoEnvio = (envioPrioritario.checked) ? 5000 : 0;

    let precioProductos = calcularPrecioTotalProductos();
    let descuento = (totalProductos > 7) ? precioProductos * 0.3 : 0;
    let totalPagar = precioProductos - descuento + costoEnvio;

    document.querySelector('#totalPagar').innerText = `$ ${totalPagar}`;

}

document.querySelectorAll('input[name="radioMetodoEnvio"]').forEach(inputEnvio => {
    inputEnvio.addEventListener('change', () => {
        actualizarResumenCompra();
    });
});

function calcularPrecioTotalProductos() {
    let precios = document.querySelectorAll('.card-body h6');
    let total = 0;

    precios.forEach(precio => {
        total += parseFloat(precio.innerText.replace('$ ', '').replace('.', ''));
    });

    return total;
}
actualizarResumenCompra();

document.querySelector('.btnPagar').addEventListener('click', () => {
    let metodoPagoSeleccionado = document.querySelector('input[name="radioMetodoPago"]:checked');

    if (!metodoPagoSeleccionado) {
        Swal.fire({
            title: "Error",
            text: "Selecciona un método de pago.",
            icon: "error"
        });
    } else if (metodoPagoSeleccionado.id === 'pagoTC') {
        let inputNumeroTarjeta = document.querySelector('#inputNumeroTarjeta');
        let inputFechaExpiracion = document.querySelector('#inputFechaExpiracion');
        let inputCvv = document.querySelector("#inputCvv");

        if (!inputNumeroTarjeta.value || !inputFechaExpiracion.value || !inputCvv.value) {
            Swal.fire({
                title: "Error",
                text: "Completa los campos de la tarjeta de crédito.",
                icon: "error"
            });
            return;
        } else {
            Swal.fire({
                title: "Listo",
                text: "Tu compra ha sido realizada.",
                icon: "success"
            });
        }
    } else if (metodoPagoSeleccionado.id === 'pagoTransferencia') {
        window.location.href = "https://www.avalpaycenter.com/wps/portal/portal-de-pagos";
    } else if (metodoPagoSeleccionado.id === 'pagoContraentrega') {
        Swal.fire({
            title: "Pago contraentrega",
            text: "Tu pedido será entregado en la dirección proporcionada. Paga al recibir.",
            icon: "info"
        });
        $('#modalPagoContraentrega').modal('show');
    }
});
