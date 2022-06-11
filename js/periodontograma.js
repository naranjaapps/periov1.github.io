"use strict";
var Posicion;
(function (Posicion) {
    Posicion[Posicion["Superior"] = 1] = "Superior";
    Posicion[Posicion["Inferior"] = 2] = "Inferior";
})(Posicion || (Posicion = {}));
class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    contains(x, y) {
        return this.x <= x && x <= this.x + this.width &&
            this.y <= y && y <= this.y + this.height;
    }
}
class Linea {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    redraw(context) {
        context.beginPath();
        context.moveTo(this.x1, this.y1);
        context.lineTo(this.x2, this.y2);
        context.lineWidth = 0.2;
        context.stroke();
    }
}
class Resultado extends Rectangle {
    constructor(tipo, x, y, width, height) {
        super(x, y, width, height);
        this.valor = "14";
        this.debug = true;
        this.tipo = tipo;
    }
    redraw(context) {
        let color = "#1197EB";
        if (this.debug) {
            if (this.tipo == Tipo.Pieza) {
                context.beginPath();
                context.fillStyle = color;
                //context.rect(this.x, this.y, this.width, this.height);
                context.fillRect(this.x, this.y, this.width, this.height);
                context.stroke();
            }
            else {
                context.beginPath();
                context.strokeStyle = '#1197EB';
                context.lineWidth = 0.5;
                context.rect(this.x, this.y, this.width, this.height);
                context.stroke();
            }
        }
        context.fillStyle = color;
        this.drawTextInBox(context, this.valor, "Arial", this.x + 2, this.y + 2, this.width - 4, this.height - 4);
    }
    drawTextInBox(context, txt, font, x, y, w, h) {
        let fontHeight = 8;
        let hMargin = 2;
        context.font = fontHeight + 'px ' + font;
        context.textAlign = 'left';
        context.textBaseline = 'top';
        if (this.tipo == Tipo.Pieza) {
            context.fillStyle = "#FFFFFF";
        }
        else {
            context.fillStyle = "#1E68BC";
        }
        let txtWidth = context.measureText(txt).width + 2 * hMargin;
        context.save();
        context.translate(x + w / 2, y);
        context.scale(w / txtWidth, h / fontHeight);
        context.translate(hMargin, 0);
        context.fillText(txt, -txtWidth / 2, 0);
        context.restore();
    }
    setValor(valor) {
        this.valor = valor;
    }
}
var Tipo;
(function (Tipo) {
    Tipo[Tipo["Pieza"] = 1] = "Pieza";
    Tipo[Tipo["Movilidad"] = 2] = "Movilidad";
    Tipo[Tipo["FaltaEQ"] = 3] = "FaltaEQ";
    Tipo[Tipo["furcaClase"] = 4] = "furcaClase";
    Tipo[Tipo["furcaMM"] = 5] = "furcaMM";
    Tipo[Tipo["Supuracion"] = 6] = "Supuracion";
    Tipo[Tipo["Nic"] = 7] = "Nic";
    Tipo[Tipo["Ps"] = 8] = "Ps";
    Tipo[Tipo["UCA"] = 9] = "UCA";
})(Tipo || (Tipo = {}));
class Resultados {
    constructor(tipo, cantidad, border = true) {
        this.cantidad = 3;
        this.border = true;
        this.debug = true;
        this._valores = [];
        this.cantidad = cantidad;
        this.border = border;
        this.tipo = tipo;
    }
    setArea(x, y, width, height) {
        let ancho = width / this.cantidad;
        for (let v = 0; v < this.cantidad; v++) {
            let area = new Resultado(this.tipo, x + (v * ancho), y, ancho, height);
            this._valores.push(area);
        }
    }
    setValor(valor) {
        this._valores[0].setValor(valor);
    }
    setValores(value) {
        for (let a = 0; a < this._valores.length; a++) {
            let area = this._valores[a];
            area.setValor(value[a]);
        }
    }
    redraw(context) {
        if (this.border) {
            for (let a = 0; a < this._valores.length; a++) {
                let valor = this._valores[a];
                valor.redraw(context);
            }
        }
    }
}
class Datos {
    constructor(numero) {
        this.numero = "16";
        this.ausente = false;
        this.faltaEQ = false;
        this.movilidad = "";
        this.furca_clase = ["", "", ""];
        this.furca_mm = ["", "", ""];
        this.supuracion = false;
        //public nic: string[] =  ["", "", ""];
        this.ps = ["", "", ""];
        this.uca_mg = ["", "", ""];
        this.ss = ["", "", ""];
        this.placa = ["", "", ""];
        this.debug = true;
        this.numero = numero;
        this._area = new Rectangle(0, 0, 0, 1);
    }
    nic() {
        let nic = ["", "", ""];
        for (let index = 0; index < nic.length; index++) {
            if (this.ps[index] != "" || this.uca_mg[index] != "") {
                if (this.ps[index] != "" || this.uca_mg[index] != "")
                    nic[index] = (Number(this.ps[index]) + Number(this.uca_mg[index])).toString();
                else if (this.ps[index] != "")
                    nic[index] = this.ps[index];
                else
                    nic[index] = this.uca_mg[index];
            }
        }
        return nic;
    }
    setArea(x, y, width, height) {
        this._area = new Rectangle(x, y, width, height);
    }
    redraw(context) {
        if (this.debug) {
            context.beginPath();
            context.rect(this._area.x, this._area.y, this._area.width, this._area.height);
            context.stroke();
        }
    }
    generarAusenteHTML(filaTabla) {
        let celda = document.createElement('TD');
        celda.setAttribute("colspan", "3");
        celda.setAttribute("class", "colinput");
        let ausente = document.createElement('INPUT');
        ausente.setAttribute("type", "checkbox");
        ausente.checked = this.ausente;
        ausente.id = "ausente" + this.numero.toString();
        ausente.setAttribute("class", "colinputausente");
        celda.appendChild(ausente);
        filaTabla.appendChild(celda);
    }
    generarMovilidadHTML(filaTabla) {
        let celda = document.createElement('TD');
        celda.setAttribute("colspan", "3");
        let selectList = document.createElement("select");
        selectList.id = "movilidad" + this.numero.toString();
        let optVacio = document.createElement('option');
        optVacio.value = "";
        optVacio.innerHTML = "";
        selectList.appendChild(optVacio);
        for (let i = 1; i <= 3; i++) {
            let opt = document.createElement('option');
            opt.value = i.toString();
            opt.innerHTML = i.toString();
            opt.selected = this.movilidad.toString() == i.toString();
            selectList.appendChild(opt);
        }
        selectList.setAttribute("class", "colinput");
        //if (this.ausente) selectList.setAttribute("hidden", this.ausente ? "true" : "false");
        celda.appendChild(selectList);
        filaTabla.appendChild(celda);
    }
    generarFaltaEQHTML(filaTabla) {
        let celda = document.createElement('TD');
        celda.setAttribute("colspan", "3");
        let selectList = document.createElement("select");
        selectList.id = "faltaEQ" + this.numero.toString();
        let optVacio = document.createElement('option');
        optVacio.value = "";
        optVacio.innerHTML = "";
        selectList.appendChild(optVacio);
        let optAsterisco = document.createElement('option');
        optAsterisco.value = "*";
        optAsterisco.innerHTML = "*";
        optAsterisco.selected = this.faltaEQ;
        selectList.appendChild(optAsterisco);
        selectList.setAttribute("class", "colinput");
        //if (this.ausente) selectList.setAttribute("hidden", this.ausente ? "true" : "false");
        celda.appendChild(selectList);
        filaTabla.appendChild(celda);
    }
    generarFurcaClaseHTML(filaTabla) {
        for (let f = 0; f < this.furca_clase.length; f++) {
            let furca = this.furca_clase[f];
            let celda = document.createElement('TD');
            let selectList = document.createElement("select");
            selectList.id = "furcaClase" + this.numero.toString() + "_" + f.toString();
            let optVacio = document.createElement('option');
            optVacio.value = "";
            optVacio.innerHTML = "";
            selectList.appendChild(optVacio);
            let optI = document.createElement('option');
            optI.value = "I";
            optI.innerHTML = "I";
            optI.selected = furca == optI.value;
            selectList.appendChild(optI);
            let optII = document.createElement('option');
            optII.value = "II";
            optII.innerHTML = "II";
            optII.selected = furca == optII.value;
            selectList.appendChild(optII);
            let optIII = document.createElement('option');
            optIII.value = "III";
            optIII.innerHTML = "III";
            optIII.selected = furca == optIII.value;
            selectList.appendChild(optIII);
            selectList.setAttribute("class", "colinput");
            //if (this.ausente) selectList.setAttribute("hidden", this.ausente ? "true" : "false");
            celda.appendChild(selectList);
            filaTabla.appendChild(celda);
        }
    }
    generarFurcaMMHTML(filaTabla) {
        for (let f = 0; f < this.furca_clase.length; f++) {
            let furca = this.furca_mm[f];
            let celda = document.createElement('TD');
            let inputMM = document.createElement('INPUT');
            inputMM.setAttribute("type", "number");
            inputMM.setAttribute("min", "0");
            inputMM.setAttribute("max", "10");
            inputMM.setAttribute("value", furca);
            inputMM.id = "furcaMM" + this.numero.toString() + "_" + f.toString();
            inputMM.setAttribute("class", "colinputfurcamm");
            //if (this.ausente) inputMM.setAttribute("hidden", this.ausente ? "true" : "false");
            celda.appendChild(inputMM);
            filaTabla.appendChild(celda);
        }
    }
    generarSupuracionHTML(filaTabla) {
        let celda = document.createElement('TD');
        celda.setAttribute("colspan", "3");
        let selectList = document.createElement("select");
        selectList.id = "supuracion" + this.numero.toString();
        let optVacio = document.createElement('option');
        optVacio.value = "";
        optVacio.innerHTML = "";
        selectList.appendChild(optVacio);
        let optAsterisco = document.createElement('option');
        optAsterisco.value = "S";
        optAsterisco.innerHTML = "S";
        optAsterisco.selected = this.supuracion;
        selectList.appendChild(optAsterisco);
        selectList.setAttribute("class", "colinput");
        //if (this.ausente) selectList.setAttribute("hidden", this.ausente ? "true" : "false");
        celda.appendChild(selectList);
        filaTabla.appendChild(celda);
    }
    generarNicHTML(filaTabla) {
        let values = this.nic();
        for (let f = 0; f < values.length; f++) {
            let nic = values[f];
            let celda = document.createElement('TD');
            let labelNIC = document.createElement('LABEL');
            labelNIC.innerHTML = nic;
            labelNIC.id = "nic" + this.numero.toString() + "_" + f.toString();
            labelNIC.setAttribute("class", "colinput");
            //if (this.ausente) labelNIC.setAttribute("hidden", this.ausente ? "true" : "false");
            celda.appendChild(labelNIC);
            filaTabla.appendChild(celda);
        }
    }
    generarPsHTML(filaTabla) {
        for (let f = 0; f < this.ps.length; f++) {
            let ps = this.ps[f];
            let celda = document.createElement('TD');
            let inputMM = document.createElement('INPUT');
            inputMM.setAttribute("type", "number");
            inputMM.setAttribute("min", "0");
            inputMM.setAttribute("max", "20");
            inputMM.setAttribute("value", ps);
            inputMM.id = "ps" + this.numero.toString() + "_" + f.toString();
            inputMM.setAttribute("class", "colinputps");
            //if (this.ausente) inputMM.setAttribute("hidden", this.ausente ? "true" : "false");
            celda.appendChild(inputMM);
            filaTabla.appendChild(celda);
        }
    }
    generarUcaMGHTML(filaTabla) {
        for (let f = 0; f < this.uca_mg.length; f++) {
            let uca_mg = this.uca_mg[f];
            let celda = document.createElement('TD');
            let inputMG = document.createElement('INPUT');
            inputMG.setAttribute("type", "number");
            inputMG.setAttribute("min", "-10");
            inputMG.setAttribute("max", "10");
            inputMG.setAttribute("value", uca_mg);
            inputMG.id = "uca_mg" + this.numero.toString() + "_" + f.toString();
            inputMG.setAttribute("class", "colinputuca");
            //if (this.ausente) inputMG.setAttribute("hidden", this.ausente ? "true" : "false");
            celda.appendChild(inputMG);
            filaTabla.appendChild(celda);
        }
    }
    setValueFromTableHtml() {
        let ausente = document.getElementById('ausente' + this.numero);
        this.ausente = ausente.checked;
        let movilidad = document.getElementById('movilidad' + this.numero);
        this.movilidad = movilidad.value;
        let faltaEQ = document.getElementById('faltaEQ' + this.numero);
        this.faltaEQ = faltaEQ.value == "*" ? true : false;
        let furca_1 = document.getElementById('furcaClase' + this.numero + "_0");
        let furca_2 = document.getElementById('furcaClase' + this.numero + "_1");
        let furca_3 = document.getElementById('furcaClase' + this.numero + "_2");
        this.furca_clase[0] = furca_1.value;
        this.furca_clase[1] = furca_2.value;
        this.furca_clase[2] = furca_3.value;
        let furca_1_mm = document.getElementById('furcaMM' + this.numero + "_0");
        let furca_2_mm = document.getElementById('furcaMM' + this.numero + "_1");
        let furca_3_mm = document.getElementById('furcaMM' + this.numero + "_2");
        this.furca_mm[0] = furca_1_mm.value;
        this.furca_mm[1] = furca_2_mm.value;
        this.furca_mm[2] = furca_3_mm.value;
        let supuracion = document.getElementById('supuracion' + this.numero);
        this.supuracion = supuracion.value == "S" ? true : false;
        // let nic_1 = document.getElementById('nic' + this.numero + "_0") as HTMLInputElement;
        // let nic_2 = document.getElementById('nic' + this.numero + "_1") as HTMLInputElement;
        // let nic_3 = document.getElementById('nic' + this.numero + "_2") as HTMLInputElement;
        // this.nic[0] = nic_1.value;
        // this.nic[1] = nic_2.value;
        // this.nic[2] = nic_3.value;
        let ps_1 = document.getElementById('ps' + this.numero + "_0");
        let ps_2 = document.getElementById('ps' + this.numero + "_1");
        let ps_3 = document.getElementById('ps' + this.numero + "_2");
        this.ps[0] = ps_1.value;
        this.ps[1] = ps_2.value;
        this.ps[2] = ps_3.value;
        let uca_mg_1 = document.getElementById('uca_mg' + this.numero + "_0");
        let uca_mg_2 = document.getElementById('uca_mg' + this.numero + "_1");
        let uca_mg_3 = document.getElementById('uca_mg' + this.numero + "_2");
        this.uca_mg[0] = uca_mg_1.value;
        this.uca_mg[1] = uca_mg_2.value;
        this.uca_mg[2] = uca_mg_3.value;
    }
}
class AreaDatos extends Rectangle {
    constructor(numero, posicion, x, y, width, height) {
        super(x, y, width, height);
        this.debug = true;
        this.datos = new Datos(numero.toString());
        this._resultados = [];
        this.numero = numero;
        this.posicion = posicion;
    }
    calcularSecciones() {
        let numero = new Resultados(Tipo.Pieza, 1);
        this._resultados.push(numero);
        let movilidad = new Resultados(Tipo.Movilidad, 1);
        this._resultados.push(movilidad);
        let faltaEQ = new Resultados(Tipo.FaltaEQ, 1);
        this._resultados.push(faltaEQ);
        let furca_clase = new Resultados(Tipo.furcaClase, 3);
        this._resultados.push(furca_clase);
        let furca_mm = new Resultados(Tipo.furcaMM, 3);
        this._resultados.push(furca_mm);
        let supuracion = new Resultados(Tipo.Supuracion, 1);
        this._resultados.push(supuracion);
        let nic = new Resultados(Tipo.Nic, 3);
        this._resultados.push(nic);
        let ps = new Resultados(Tipo.Ps, 3);
        this._resultados.push(ps);
        let uca_mg = new Resultados(Tipo.UCA, 3);
        this._resultados.push(uca_mg);
        let alto = this.height / this._resultados.length;
        for (let r = 0; r < this._resultados.length; r++) {
            let resultado = this._resultados[r];
            if (this.posicion == Posicion.Superior) {
                resultado.setArea(this.x, this.y + (r * alto), this.width, alto);
            }
            else {
                resultado.setArea(this.x, this.y + this.height - ((r + 1) * alto), this.width, alto);
            }
        }
        numero.setValor(this.numero.toString());
        movilidad.setValor(this.datos.movilidad);
        faltaEQ.setValor(this.datos.faltaEQ ? "*" : "");
        furca_clase.setValores(this.datos.furca_clase);
        furca_mm.setValores(this.datos.furca_mm);
        supuracion.setValor(this.datos.supuracion ? "S" : "");
        nic.setValores(this.datos.nic());
        ps.setValores(this.datos.ps);
        uca_mg.setValores(this.datos.uca_mg);
    }
    updateValues() {
        this._resultados[1].setValor(this.datos.movilidad);
        this._resultados[2].setValor(this.datos.faltaEQ ? "*" : "");
        this._resultados[3].setValores(this.datos.furca_clase);
        this._resultados[4].setValores(this.datos.furca_mm);
        this._resultados[5].setValor(this.datos.supuracion ? "S" : "");
        this._resultados[6].setValores(this.datos.nic());
        this._resultados[7].setValores(this.datos.ps);
        this._resultados[8].setValores(this.datos.uca_mg);
    }
    redraw(context) {
        for (let r = 0; r < this._resultados.length; r++) {
            let resultado = this._resultados[r];
            if (r == 0)
                resultado.redraw(context);
            else if (!this.datos.ausente)
                resultado.redraw(context);
        }
    }
}
class AreaGrafico extends Rectangle {
    constructor(numero, posicion, x, y, width, height) {
        super(x, y, width, height);
        this.debug = true;
        this._ps = [0, 0, 0];
        this._mg = [0, 0, 0];
        this.datos = new Datos(numero.toString());
        this._lineas = [];
        this.numero = numero;
        this.posicion = posicion;
    }
    calcularSecciones() {
        let mitad = this.height / 2;
        let altolinea = mitad / 20;
        for (let l = 0; l < 20; l++) {
            if (this.posicion == Posicion.Superior) {
                this._lineas.push(new Linea(this.x, this.y + (l * altolinea), this.x + this.width, this.y + (l * altolinea)));
            }
            else {
                this._lineas.push(new Linea(this.x, this.y + mitad + (l * altolinea), this.x + this.width, this.y + mitad + (l * altolinea)));
            }
        }
    }
    setMargenGingival() {
    }
    setProfundidadSondaje() {
    }
    redraw(context) {
        if (this.debug) {
            let d = new Image();
            if (this.posicion == Posicion.Superior)
                d.src = 'img3/' + this.numero + '.png';
            else
                d.src = 'img3/' + this.numero + 'b.png';
            d.onload = () => {
                context.drawImage(d, this.x, this.y, this.width, this.height);
                for (let r = 0; r < this._lineas.length; r++) {
                    let linea = this._lineas[r];
                    linea.redraw(context);
                }
            };
        }
    }
}
class Diente {
    constructor(numero, posicion) {
        this.ausente = false;
        this.debug = true;
        this.numero = numero;
        this.ausente = false;
        this.implante = false;
        this.movilidad = 0;
        this.posicion = posicion;
        this._areaDatos = new AreaDatos(this.numero, this.posicion, 0, 0, 0, 1);
        this._areaGrafico = new AreaGrafico(this.numero, this.posicion, 0, 0, 0, 1);
    }
    get datos() {
        return this._areaDatos.datos;
    }
    updateValues() {
        console.log(this);
        this._areaDatos.updateValues();
    }
    setArea(x, y, width, height) {
        let alto = height / 2;
        if (this.posicion == Posicion.Superior) {
            this._areaDatos = new AreaDatos(this.numero, this.posicion, x, y, width, alto);
            this._areaGrafico = new AreaGrafico(this.numero, this.posicion, x, y + alto, width, alto);
        }
        else {
            this._areaDatos = new AreaDatos(this.numero, this.posicion, x, y + alto, width, alto);
            this._areaGrafico = new AreaGrafico(this.numero, this.posicion, x, y, width, alto);
        }
        this._areaDatos.calcularSecciones();
        this._areaGrafico.calcularSecciones();
    }
    redraw(context) {
        this._areaDatos.redraw(context);
        if (!this.ausente) {
            this._areaGrafico.redraw(context);
        }
    }
    getMargenGenginval() {
        let resultado = [];
        let datos = this._areaDatos.datos.uca_mg;
        for (let a = 0; a < datos.length; a++) {
            let valor = datos[a] == "" ? 0 : Number(datos[a]);
            resultado.push(valor);
        }
        return resultado;
    }
    getProfundidadSondaje() {
        let resultado = [];
        let datos = this._areaDatos.datos.ps;
        for (let a = 0; a < datos.length; a++) {
            let valor = datos[a] == "" ? 0 : Number(datos[a]);
            resultado.push(valor);
        }
        return resultado;
    }
}
class Area extends Rectangle {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.debug = true;
        this.dientes = [];
    }
    calcularSecciones() {
        let ancho = this.width / this.dientes.length;
        for (let d = 0; d < this.dientes.length; d++) {
            let diente = this.dientes[d];
            let newX = this.x + (d * ancho);
            diente.setArea(newX, this.y, ancho, this.height);
        }
    }
    redraw(context) {
        if (this.debug) {
            for (let r = 0; r < this.dientes.length; r++) {
                let diente = this.dientes[r];
                diente.redraw(context);
            }
            setTimeout(() => {
                let posicion = this.dientes[0].posicion;
                let mitad_h = this.height / 2;
                let base_y = posicion == Posicion.Superior ? this.y + mitad_h + mitad_h / 2 : this.y + mitad_h / 2;
                let ancho = (this.width / this.dientes.length) / 3;
                let mitad_ancho = ancho / 2;
                let alto_punto = mitad_h / 40;
                context.stroke();
                context.beginPath();
                context.lineWidth = 2;
                context.strokeStyle = '#0138FF';
                let x = this.x;
                let ps_h = 0;
                let puntos_ps = 0;
                for (let r = 0; r < this.dientes.length; r++) {
                    let diente = this.dientes[r];
                    let ps = diente.getProfundidadSondaje();
                    let mg = diente.getMargenGenginval();
                    for (let p = 0; p < ps.length; p++) {
                        puntos_ps = mg[p] - ps[p];
                        ps_h = alto_punto * puntos_ps * (posicion == Posicion.Superior ? 1 : -1);
                        if (r == 0 && p == 0) {
                            x += mitad_ancho;
                            context.moveTo(x, base_y + ps_h);
                        }
                        else {
                            x += ancho;
                            context.lineTo(x, base_y + ps_h);
                        }
                    }
                }
                context.stroke();
                context.beginPath();
                context.lineWidth = 2;
                context.strokeStyle = '#FF0000';
                let mg_h = 0;
                x = this.x;
                for (let r = 0; r < this.dientes.length; r++) {
                    let diente = this.dientes[r];
                    let mg = diente.getMargenGenginval();
                    for (let m = 0; m < mg.length; m++) {
                        mg_h = alto_punto * mg[m] * (posicion == Posicion.Superior ? 1 : -1);
                        if (r == 0 && m == 0) {
                            x += mitad_ancho;
                            context.moveTo(x, base_y + mg_h);
                        }
                        else {
                            x += ancho;
                            context.lineTo(x, base_y + mg_h);
                        }
                    }
                }
                context.stroke();
            }, 500);
            context.beginPath();
            context.strokeStyle = '#1197EB';
            context.rect(this.x, this.y, this.width, this.height);
            context.stroke();
        }
    }
    generarFilaPiezaHTML(tabla) {
        let trA = document.createElement('TR');
        let nombre = document.createElement('TH');
        nombre.innerHTML = "Pieza";
        nombre.setAttribute("class", "filaNombre");
        nombre.setAttribute("class", "colinput");
        trA.appendChild(nombre);
        tabla.appendChild(trA);
        for (let d = 0; d < this.dientes.length; d++) {
            let diente = this.dientes[d];
            let th = document.createElement('TH');
            th.setAttribute("colspan", "3");
            th.setAttribute("class", "colinput");
            th.innerHTML = diente.numero.toString();
            trA.appendChild(th);
        }
    }
    generarFilaAusenteHTML(tabla) {
        let fila = document.createElement('TR');
        let ausente = document.createElement('TH');
        ausente.setAttribute("class", "filaNombre");
        ausente.innerHTML = "Ausente";
        fila.appendChild(ausente);
        for (let d = 0; d < this.dientes.length; d++) {
            let diente = this.dientes[d];
            diente.datos.generarAusenteHTML(fila);
        }
        tabla.appendChild(fila);
    }
    generarFilaMovilidadHTML(tabla) {
        let fila = document.createElement('TR');
        let movilidad = document.createElement('TH');
        movilidad.setAttribute("class", "filaNombre");
        movilidad.innerHTML = "Movilidad";
        fila.appendChild(movilidad);
        for (let d = 0; d < this.dientes.length; d++) {
            let diente = this.dientes[d];
            diente.datos.generarMovilidadHTML(fila);
        }
        tabla.appendChild(fila);
    }
    generarFilaFaltaEQHTML(tabla) {
        let fila = document.createElement('TR');
        let faltaEQ = document.createElement('TH');
        faltaEQ.innerHTML = "FaltaEQ (*)";
        faltaEQ.setAttribute("class", "filaNombre");
        fila.appendChild(faltaEQ);
        for (let d = 0; d < this.dientes.length; d++) {
            let diente = this.dientes[d];
            diente.datos.generarFaltaEQHTML(fila);
        }
        tabla.appendChild(fila);
    }
    generarFilaFurcaClaseHTML(tabla) {
        let fila = document.createElement('TR');
        let furca_clase = document.createElement('TH');
        furca_clase.innerHTML = "Furca (Clase)";
        furca_clase.setAttribute("class", "filaNombre");
        fila.appendChild(furca_clase);
        for (let d = 0; d < this.dientes.length; d++) {
            let diente = this.dientes[d];
            diente.datos.generarFurcaClaseHTML(fila);
        }
        tabla.appendChild(fila);
    }
    generarFilaFurcaMMHTML(tabla) {
        let fila = document.createElement('TR');
        let furca_mm = document.createElement('TH');
        furca_mm.innerHTML = "Furca (mm)";
        furca_mm.setAttribute("class", "filaNombre");
        fila.appendChild(furca_mm);
        for (let d = 0; d < this.dientes.length; d++) {
            let diente = this.dientes[d];
            diente.datos.generarFurcaMMHTML(fila);
        }
        tabla.appendChild(fila);
    }
    generarFilaSupuracionHTML(tabla) {
        let fila = document.createElement('TR');
        let supuracion = document.createElement('TH');
        supuracion.innerHTML = "Supuracion";
        supuracion.setAttribute("class", "filaNombre");
        fila.appendChild(supuracion);
        for (let d = 0; d < this.dientes.length; d++) {
            let diente = this.dientes[d];
            diente.datos.generarSupuracionHTML(fila);
        }
        tabla.appendChild(fila);
    }
    generarFilaNicHTML(tabla) {
        let fila = document.createElement('TR');
        let nic = document.createElement('TH');
        nic.innerHTML = "NIC";
        nic.setAttribute("class", "filaNombre");
        fila.appendChild(nic);
        for (let d = 0; d < this.dientes.length; d++) {
            let diente = this.dientes[d];
            diente.datos.generarNicHTML(fila);
        }
        tabla.appendChild(fila);
    }
    generarFilaPsHTML(tabla) {
        let fila = document.createElement('TR');
        let ps = document.createElement('TH');
        ps.innerHTML = "PS";
        ps.setAttribute("class", "filaNombre");
        fila.appendChild(ps);
        for (let d = 0; d < this.dientes.length; d++) {
            let diente = this.dientes[d];
            diente.datos.generarPsHTML(fila);
        }
        tabla.appendChild(fila);
    }
    generarFilaUCAHTML(tabla) {
        let fila = document.createElement('TR');
        let uca_mg = document.createElement('TH');
        uca_mg.innerHTML = "UCA-MG";
        uca_mg.setAttribute("class", "filaNombre");
        fila.appendChild(uca_mg);
        for (let d = 0; d < this.dientes.length; d++) {
            let diente = this.dientes[d];
            diente.datos.generarUcaMGHTML(fila);
        }
        tabla.appendChild(fila);
    }
    generarHTML(htmlId) {
        let html = document.getElementById(htmlId);
        while (html.firstChild)
            html.removeChild(html.firstChild);
        let form = document.createElement("FORM");
        let tabla = document.createElement("table");
        tabla.id = "periodontoTABLE";
        if (this.dientes[0].posicion == Posicion.Superior) {
            this.generarFilaPiezaHTML(tabla);
            this.generarFilaAusenteHTML(tabla);
            this.generarFilaMovilidadHTML(tabla);
            this.generarFilaFaltaEQHTML(tabla);
            this.generarFilaFurcaClaseHTML(tabla);
            this.generarFilaFurcaMMHTML(tabla);
            this.generarFilaSupuracionHTML(tabla);
            this.generarFilaNicHTML(tabla);
            this.generarFilaPsHTML(tabla);
            this.generarFilaUCAHTML(tabla);
        }
        else {
            this.generarFilaUCAHTML(tabla);
            this.generarFilaPsHTML(tabla);
            this.generarFilaNicHTML(tabla);
            this.generarFilaSupuracionHTML(tabla);
            this.generarFilaFurcaMMHTML(tabla);
            this.generarFilaFurcaClaseHTML(tabla);
            this.generarFilaFaltaEQHTML(tabla);
            this.generarFilaMovilidadHTML(tabla);
            this.generarFilaAusenteHTML(tabla);
            this.generarFilaPiezaHTML(tabla);
        }
        form.appendChild(tabla);
        // Append the table to the body
        html.appendChild(form);
    }
    setValuesFromTableHtml() {
        for (let d = 0; d < this.dientes.length; d++) {
            let diente = this.dientes[d];
            diente.datos.setValueFromTableHtml();
            diente.ausente = diente.datos.ausente;
            diente.updateValues();
        }
    }
}
class Titulo extends Rectangle {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.debug = true;
        this.invertido = false;
        this.captions = ["Pieza", "Movilidad", "FaltaEQ", "furcaClase", "furcaMM", "Supuracion", "Nic", "Ps", "UCA-MG"];
    }
    drawTextInBox(context, txt, font, x, y, w, h) {
        let fontHeight = 14;
        context.font = fontHeight + 'px ' + font;
        context.fillText(txt, x / 2, y + 2);
    }
    redraw(context) {
        let alto = this.height / this.captions.length;
        for (let d = 0; d < this.captions.length; d++) {
            let caption = this.captions[this.invertido ? this.captions.length - d - 1 : d];
            this.drawTextInBox(context, caption, "Arial", this.x + 2, this.y + (alto * d), this.width, alto);
        }
    }
}
class PeriodontogramaApp {
    constructor() {
        this.debug = true;
        this.pressEventHandler = (e) => {
            let mouseX = e.changedTouches ?
                e.changedTouches[0].pageX :
                e.pageX;
            let mouseY = e.changedTouches ?
                e.changedTouches[0].pageY :
                e.pageY;
            mouseX -= this.canvas.offsetLeft;
            mouseY -= this.canvas.offsetTop;
            if (this.debug) {
                for (let r = 0; r < this.areas.length; r++) {
                    let area = this.areas[r];
                    if (area.contains(mouseX, mouseY)) {
                        this.canvas.dispatchEvent(new CustomEvent("clickArea", {
                            detail: { area: r }
                        }));
                    }
                    this.context.beginPath();
                    this.context.rect(area.x, area.y, area.width, area.height);
                    this.context.stroke();
                }
            }
            this.redraw();
        };
        let canvas = document.getElementById('canvas');
        this.context = canvas.getContext("2d");
        this.canvas = canvas;
        this.areas = [];
        this.titulos = [];
        this.calcularArea();
        this.configurarAreas();
        this.redraw();
        this.createUserEvents();
    }
    calcularArea() {
        let ancho_titulo = this.canvas.width / 8;
        let ancho_espacio = 20;
        let ancho_area = (this.canvas.width - ancho_titulo - (ancho_espacio * 2)) / 3;
        let alto_espacio = 20;
        let alto_area = (this.canvas.height - alto_espacio) / 4;
        let mitad_alto = alto_area / 2;
        for (let h = 0; h < 4; h++) {
            let espacio_x = 0;
            let espacio_y = h >= 2 ? alto_espacio : 0;
            for (let w = 0; w < 3; w++) {
                if (w == 1 || w == 2)
                    espacio_x = ancho_espacio;
                let area = new Area(ancho_titulo + (espacio_x * w) + (ancho_area * w), (espacio_y) + alto_area * h, ancho_area, alto_area);
                this.areas.push(area);
            }
            let y = 0;
            for (let h = 0; h < 4; h++) {
                let espacio_y = h == 2 ? alto_espacio : 0;
                let titulo = new Titulo(5, y + espacio_y, ancho_titulo, mitad_alto);
                y += mitad_alto + (h % 2 == 0 ? alto_area + espacio_y : 0);
                titulo.invertido = h % 2 != 0;
                this.titulos.push(titulo);
            }
        }
    }
    configurarAreas() {
        //Area Superior izqauierda
        let index = 0;
        this.areas[index].dientes.push(new Diente(18, Posicion.Superior));
        this.areas[index].dientes.push(new Diente(17, Posicion.Superior));
        this.areas[index].dientes.push(new Diente(16, Posicion.Superior));
        this.areas[index].dientes.push(new Diente(15, Posicion.Superior));
        this.areas[index].dientes.push(new Diente(14, Posicion.Superior));
        this.areas[index].calcularSecciones();
        index++;
        this.areas[index].dientes.push(new Diente(13, Posicion.Superior));
        this.areas[index].dientes.push(new Diente(12, Posicion.Superior));
        this.areas[index].dientes.push(new Diente(11, Posicion.Superior));
        this.areas[index].dientes.push(new Diente(21, Posicion.Superior));
        this.areas[index].dientes.push(new Diente(22, Posicion.Superior));
        this.areas[index].dientes.push(new Diente(23, Posicion.Superior));
        this.areas[index].calcularSecciones();
        index++;
        this.areas[index].dientes.push(new Diente(24, Posicion.Superior));
        this.areas[index].dientes.push(new Diente(25, Posicion.Superior));
        this.areas[index].dientes.push(new Diente(26, Posicion.Superior));
        this.areas[index].dientes.push(new Diente(27, Posicion.Superior));
        this.areas[index].dientes.push(new Diente(28, Posicion.Superior));
        this.areas[index].calcularSecciones();
        //Area Superior izqauierda
        index++;
        this.areas[index].dientes.push(new Diente(18, Posicion.Inferior));
        this.areas[index].dientes.push(new Diente(17, Posicion.Inferior));
        this.areas[index].dientes.push(new Diente(16, Posicion.Inferior));
        this.areas[index].dientes.push(new Diente(15, Posicion.Inferior));
        this.areas[index].dientes.push(new Diente(14, Posicion.Inferior));
        this.areas[index].calcularSecciones();
        index++;
        this.areas[index].dientes.push(new Diente(13, Posicion.Inferior));
        this.areas[index].dientes.push(new Diente(12, Posicion.Inferior));
        this.areas[index].dientes.push(new Diente(11, Posicion.Inferior));
        this.areas[index].dientes.push(new Diente(21, Posicion.Inferior));
        this.areas[index].dientes.push(new Diente(22, Posicion.Inferior));
        this.areas[index].dientes.push(new Diente(23, Posicion.Inferior));
        this.areas[index].calcularSecciones();
        index++;
        this.areas[index].dientes.push(new Diente(24, Posicion.Inferior));
        this.areas[index].dientes.push(new Diente(25, Posicion.Inferior));
        this.areas[index].dientes.push(new Diente(26, Posicion.Inferior));
        this.areas[index].dientes.push(new Diente(27, Posicion.Inferior));
        this.areas[index].dientes.push(new Diente(28, Posicion.Inferior));
        this.areas[index].calcularSecciones();
        //Area Superior izqauierda
        index++;
        this.areas[index].dientes.push(new Diente(48, Posicion.Superior));
        this.areas[index].dientes.push(new Diente(47, Posicion.Superior));
        this.areas[index].dientes.push(new Diente(46, Posicion.Superior));
        this.areas[index].dientes.push(new Diente(45, Posicion.Superior));
        this.areas[index].dientes.push(new Diente(44, Posicion.Superior));
        this.areas[index].calcularSecciones();
        index++;
        this.areas[index].dientes.push(new Diente(43, Posicion.Superior));
        this.areas[index].dientes.push(new Diente(42, Posicion.Superior));
        this.areas[index].dientes.push(new Diente(41, Posicion.Superior));
        this.areas[index].dientes.push(new Diente(31, Posicion.Superior));
        this.areas[index].dientes.push(new Diente(32, Posicion.Superior));
        this.areas[index].dientes.push(new Diente(33, Posicion.Superior));
        this.areas[index].calcularSecciones();
        index++;
        this.areas[index].dientes.push(new Diente(34, Posicion.Superior));
        this.areas[index].dientes.push(new Diente(35, Posicion.Superior));
        this.areas[index].dientes.push(new Diente(36, Posicion.Superior));
        this.areas[index].dientes.push(new Diente(37, Posicion.Superior));
        this.areas[index].dientes.push(new Diente(38, Posicion.Superior));
        this.areas[index].calcularSecciones();
        //Area Superior izqauierda
        index++;
        this.areas[index].dientes.push(new Diente(48, Posicion.Inferior));
        this.areas[index].dientes.push(new Diente(47, Posicion.Inferior));
        this.areas[index].dientes.push(new Diente(46, Posicion.Inferior));
        this.areas[index].dientes.push(new Diente(45, Posicion.Inferior));
        this.areas[index].dientes.push(new Diente(44, Posicion.Inferior));
        this.areas[index].calcularSecciones();
        index++;
        this.areas[index].dientes.push(new Diente(43, Posicion.Inferior));
        this.areas[index].dientes.push(new Diente(42, Posicion.Inferior));
        this.areas[index].dientes.push(new Diente(41, Posicion.Inferior));
        this.areas[index].dientes.push(new Diente(31, Posicion.Inferior));
        this.areas[index].dientes.push(new Diente(32, Posicion.Inferior));
        this.areas[index].dientes.push(new Diente(33, Posicion.Inferior));
        this.areas[index].calcularSecciones();
        index++;
        this.areas[index].dientes.push(new Diente(34, Posicion.Inferior));
        this.areas[index].dientes.push(new Diente(35, Posicion.Inferior));
        this.areas[index].dientes.push(new Diente(36, Posicion.Inferior));
        this.areas[index].dientes.push(new Diente(37, Posicion.Inferior));
        this.areas[index].dientes.push(new Diente(38, Posicion.Inferior));
        this.areas[index].calcularSecciones();
    }
    createUserEvents() {
        let canvas = this.canvas;
        canvas.addEventListener("mousedown", this.pressEventHandler);
    }
    redraw() {
        if (this.debug) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // this.context.beginPath();
            // this.context.rect(0, 0, this.canvas.width, this.canvas.height);
            // this.context.stroke();    
            for (let r = 0; r < this.areas.length; r++) {
                let area = this.areas[r];
                area.redraw(this.context);
            }
            for (let r = 0; r < this.titulos.length; r++) {
                let titulo = this.titulos[r];
                titulo.redraw(this.context);
            }
        }
    }
}
var perioApp = new PeriodontogramaApp();
