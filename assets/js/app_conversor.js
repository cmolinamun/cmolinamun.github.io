document.getElementById('convertir').addEventListener('click', mainConvertir);

async function mainConvertir() {
    const monto = document.getElementById('monto').value;
    const moneda = document.getElementById('moneda').value;
    const resultado = document.getElementById('resultado');

    try {
        const tipoCambio = await obtenerTipoCambio(moneda);
        const conversion = (monto / tipoCambio).toFixed(2);

        resultado.innerHTML = `${monto} CLP son ${conversion} ${moneda}`;

        const historial = await obtenerHistorial(moneda);
        mostrarHistorial(historial);
    }
    catch (error) {
        alert('Ocurrió un error al obtener los datos.');
    }
};

async function obtenerTipoCambio(moneda) {
    try {
        const response = await fetch('https://mindicador.cl/api');
        const data = await response.json();
        return data[moneda].valor;
    }
    catch (error) {
        alert('Ocurrió un error al obtener el tipo de cambio.');
        return 0;
    }
}

async function obtenerHistorial(moneda) {
    try {
        const response = await fetch(`https://mindicador.cl/api/${moneda}`);
        const data = await response.json();
        return data.serie;
    }
    catch (error) {
        alert('Ocurrió un error al obtener los datos historicos.');
        return [];
    }
}

let chart = null;

function mostrarHistorial(serie) {
    const canvas = document.getElementById('historial')
    const ctx = canvas.getContext('2d');
    const labels = serie.slice(0, 10).map(dato => dato.fecha.slice(0, 10)).reverse();
    const valores = serie.slice(0, 10).map(dato => dato.valor).reverse();

    if (chart) {
        chart.destroy();
    };


    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ultimos 10 días',
                data: valores
            }]
        }
    }); 
}