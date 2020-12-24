//variables

const formulario = document.querySelector('#agregar-gasto');
const listadoGasto = document.querySelector('#gastos')
let presupuesto;



//listeners
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', cargarFormulario);
}

//clases
class Presupuesto {
    constructor (presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }
    nuevoGasto(gasto) {
       this.gastos = [...this.gastos, gasto];
       this.calcularResto();
       
    }
    calcularResto() {
        const restanto = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0 );
        this.restante = this.presupuesto - restanto;
        document.querySelector('#restante').textContent = this.restante; //ideal que este en el apartado de UI para mejor orden.
    }
    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id != id);
        this.calcularResto();
    }
    
}

class UI {
    insertarPresupuesto(monto) {
        const {presupuesto, restante} = monto;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }
    insertarAlerta(mensaje, tipo) {
        const mensajeDiv = document.createElement('div');
        mensajeDiv.classList.add('text-center', 'alert');
        if(tipo === 'error') {
            mensajeDiv.classList.add('alert-danger');
        } else {
            mensajeDiv.classList.add('alert-success');
        }
        mensajeDiv.textContent = mensaje;

        //insertar en HTML

        document.querySelector('.primario').insertBefore(mensajeDiv, formulario);
        setTimeout( () => {
            mensajeDiv.remove();
        }, 1700);

       
    }
    limpiarHTML() {
        while (listadoGasto.firstChild) {
            listadoGasto.removeChild(listadoGasto.firstChild);
        }
    }
    insertarGasto(gastos) {
        this.limpiarHTML();
        gastos.forEach( gasto => {
            const {cantidad, nombre, id} = gasto;

            //crear LI
            const gastado = document.createElement('li');
            gastado.className = 'list-group-item d-flex justify-content-between align-items-center';
            gastado.dataset.id = id;


            //Agregar html
            gastado.innerHTML = `${nombre} <span class='badge badge-primary badge-pill'> $${cantidad} </span>`;

            //Agregar btn
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            gastado.appendChild(btnBorrar);
            btnBorrar.textContent = 'Borrar';
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            
            //agregar HTML
            listadoGasto.appendChild(gastado);
        })
    }
    comprobarPresupuesto(presupuestoObj) {
        const {presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');

        if((presupuesto/4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if ((presupuesto/2) > restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        if(restante <= 0) {
            ui.insertarAlerta('Se agoto el monto', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }


    }
    
}
const ui = new UI();




//funciones
function preguntarPresupuesto() {
    presupuestoUsuario = prompt('Cual es su presupuesto?');
    
    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    }
    
    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.insertarPresupuesto(presupuesto);

}

function cargarFormulario(e) {
    e.preventDefault();
    let nombre = document.querySelector('#gasto').value;
    let cantidad = Number(document.querySelector('#cantidad').value);


    if(nombre === '' || cantidad === '') {
        ui.insertarAlerta('Todos los campos son obligatorios', 'error');
        return;
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.insertarAlerta('Ingrese monto gasto valido', 'error');
        return;
    }
    const gasto = {nombre, cantidad, id: Date.now()};
    presupuesto.nuevoGasto(gasto);
    ui.insertarAlerta('Gasto insertado Correctamente');
    formulario.reset();
    
    const {gastos} = presupuesto;
    ui.insertarGasto(gastos);

    ui.comprobarPresupuesto(presupuesto);
   
    
}

function eliminarGasto(id) {
    presupuesto.eliminarGasto(id); //se puede hacer directamente en la funcion de llamado. no recomendable. aca se puede adjuntar funciones con ui mas ordenado
    const {gastos} = presupuesto;
    ui.insertarGasto(gastos); 
    ui.comprobarPresupuesto(presupuesto);
}