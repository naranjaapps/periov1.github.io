"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Posicion;
(function (Posicion) {
    Posicion[Posicion["Superior"] = 1] = "Superior";
    Posicion[Posicion["Inferior"] = 2] = "Inferior";
})(Posicion || (Posicion = {}));
var Rectangle = /** @class */ (function () {
    function Rectangle(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    Rectangle.prototype.contains = function (x, y) {
        return this.x <= x && x <= this.x + this.width &&
            this.y <= y && y <= this.y + this.height;
    };
    return Rectangle;
}());
var Linea = /** @class */ (function () {
    function Linea(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    Linea.prototype.redraw = function (context) {
        context.beginPath();
        context.moveTo(this.x1, this.y1);
        context.lineTo(this.x2, this.y2);
        context.lineWidth = 0.2;
        context.stroke();
    };
    return Linea;
}());
var Resultado = /** @class */ (function (_super) {
    __extends(Resultado, _super);
    function Resultado(tipo, x, y, width, height) {
        var _this = _super.call(this, x, y, width, height) || this;
        _this.valor = "14";
        _this.debug = true;
        _this.tipo = tipo;
        return _this;
    }
    Resultado.prototype.redraw = function (context) {
        var color = "#1197EB";
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
    };
    Resultado.prototype.drawTextInBox = function (context, txt, font, x, y, w, h) {
        var fontHeight = 8;
        var hMargin = 2;
        context.font = fontHeight + 'px ' + font;
        context.textAlign = 'left';
        context.textBaseline = 'top';
        if (this.tipo == Tipo.Pieza) {
            context.fillStyle = "#FFFFFF";
        }
        else {
            context.fillStyle = "#1E68BC";
        }
        var txtWidth = context.measureText(txt).width + 2 * hMargin;
        context.save();
        context.translate(x + w / 2, y);
        context.scale(w / txtWidth, h / fontHeight);
        context.translate(hMargin, 0);
        context.fillText(txt, -txtWidth / 2, 0);
        context.restore();
    };
    Resultado.prototype.setValor = function (valor) {
        this.valor = valor;
    };
    return Resultado;
}(Rectangle));
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
var Resultados = /** @class */ (function () {
    function Resultados(tipo, cantidad, border) {
        if (border === void 0) { border = true; }
        this.cantidad = 3;
        this.border = true;
        this.debug = true;
        this._valores = [];
        this.cantidad = cantidad;
        this.border = border;
        this.tipo = tipo;
    }
    Resultados.prototype.setArea = function (x, y, width, height) {
        var ancho = width / this.cantidad;
        for (var v = 0; v < this.cantidad; v++) {
            var area = new Resultado(this.tipo, x + (v * ancho), y, ancho, height);
            this._valores.push(area);
        }
    };
    Resultados.prototype.setValor = function (valor) {
        this._valores[0].setValor(valor);
    };
    Resultados.prototype.setValores = function (value) {
        for (var a = 0; a < this._valores.length; a++) {
            var area = this._valores[a];
            area.setValor(value[a]);
        }
    };
    Resultados.prototype.redraw = function (context) {
        if (this.border) {
            for (var a = 0; a < this._valores.length; a++) {
                var valor = this._valores[a];
                valor.redraw(context);
            }
        }
    };
    return Resultados;
}());
var Datos = /** @class */ (function () {
    function Datos(numero) {
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
    Datos.prototype.nic = function () {
        var nic = ["", "", ""];
        for (var index = 0; index < nic.length; index++) {
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
    };
    Datos.prototype.setArea = function (x, y, width, height) {
        this._area = new Rectangle(x, y, width, height);
    };
    Datos.prototype.redraw = function (context) {
        if (this.debug) {
            context.beginPath();
            context.rect(this._area.x, this._area.y, this._area.width, this._area.height);
            context.stroke();
        }
    };
    Datos.prototype.generarAusenteHTML = function (filaTabla) {
        var celda = document.createElement('TD');
        celda.setAttribute("colspan", "3");
        celda.setAttribute("class", "colinput");
        var ausente = document.createElement('INPUT');
        ausente.setAttribute("type", "checkbox");
        ausente.checked = this.ausente;
        ausente.id = "ausente" + this.numero.toString();
        ausente.setAttribute("class", "colinputausente");
        celda.appendChild(ausente);
        filaTabla.appendChild(celda);
    };
    Datos.prototype.generarMovilidadHTML = function (filaTabla) {
        var celda = document.createElement('TD');
        celda.setAttribute("colspan", "3");
        var selectList = document.createElement("select");
        selectList.id = "movilidad" + this.numero.toString();
        var optVacio = document.createElement('option');
        optVacio.value = "";
        optVacio.innerHTML = "";
        selectList.appendChild(optVacio);
        for (var i = 1; i <= 3; i++) {
            var opt = document.createElement('option');
            opt.value = i.toString();
            opt.innerHTML = i.toString();
            opt.selected = this.movilidad.toString() == i.toString();
            selectList.appendChild(opt);
        }
        selectList.setAttribute("class", "colinput");
        //if (this.ausente) selectList.setAttribute("hidden", this.ausente ? "true" : "false");
        celda.appendChild(selectList);
        filaTabla.appendChild(celda);
    };
    Datos.prototype.generarFaltaEQHTML = function (filaTabla) {
        var celda = document.createElement('TD');
        celda.setAttribute("colspan", "3");
        var selectList = document.createElement("select");
        selectList.id = "faltaEQ" + this.numero.toString();
        var optVacio = document.createElement('option');
        optVacio.value = "";
        optVacio.innerHTML = "";
        selectList.appendChild(optVacio);
        var optAsterisco = document.createElement('option');
        optAsterisco.value = "*";
        optAsterisco.innerHTML = "*";
        optAsterisco.selected = this.faltaEQ;
        selectList.appendChild(optAsterisco);
        selectList.setAttribute("class", "colinput");
        //if (this.ausente) selectList.setAttribute("hidden", this.ausente ? "true" : "false");
        celda.appendChild(selectList);
        filaTabla.appendChild(celda);
    };
    Datos.prototype.generarFurcaClaseHTML = function (filaTabla) {
        for (var f = 0; f < this.furca_clase.length; f++) {
            var furca = this.furca_clase[f];
            var celda = document.createElement('TD');
            var selectList = document.createElement("select");
            selectList.id = "furcaClase" + this.numero.toString() + "_" + f.toString();
            var optVacio = document.createElement('option');
            optVacio.value = "";
            optVacio.innerHTML = "";
            selectList.appendChild(optVacio);
            var optI = document.createElement('option');
            optI.value = "I";
            optI.innerHTML = "I";
            optI.selected = furca == optI.value;
            selectList.appendChild(optI);
            var optII = document.createElement('option');
            optII.value = "II";
            optII.innerHTML = "II";
            optII.selected = furca == optII.value;
            selectList.appendChild(optII);
            var optIII = document.createElement('option');
            optIII.value = "III";
            optIII.innerHTML = "III";
            optIII.selected = furca == optIII.value;
            selectList.appendChild(optIII);
            selectList.setAttribute("class", "colinput");
            //if (this.ausente) selectList.setAttribute("hidden", this.ausente ? "true" : "false");
            celda.appendChild(selectList);
            filaTabla.appendChild(celda);
        }
    };
    Datos.prototype.generarFurcaMMHTML = function (filaTabla) {
        for (var f = 0; f < this.furca_clase.length; f++) {
            var furca = this.furca_mm[f];
            var celda = document.createElement('TD');
            var inputMM = document.createElement('INPUT');
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
    };
    Datos.prototype.generarSupuracionHTML = function (filaTabla) {
        var celda = document.createElement('TD');
        celda.setAttribute("colspan", "3");
        var selectList = document.createElement("select");
        selectList.id = "supuracion" + this.numero.toString();
        var optVacio = document.createElement('option');
        optVacio.value = "";
        optVacio.innerHTML = "";
        selectList.appendChild(optVacio);
        var optAsterisco = document.createElement('option');
        optAsterisco.value = "S";
        optAsterisco.innerHTML = "S";
        optAsterisco.selected = this.supuracion;
        selectList.appendChild(optAsterisco);
        selectList.setAttribute("class", "colinput");
        //if (this.ausente) selectList.setAttribute("hidden", this.ausente ? "true" : "false");
        celda.appendChild(selectList);
        filaTabla.appendChild(celda);
    };
    Datos.prototype.generarNicHTML = function (filaTabla) {
        var values = this.nic();
        for (var f = 0; f < values.length; f++) {
            var nic = values[f];
            var celda = document.createElement('TD');
            var labelNIC = document.createElement('LABEL');
            labelNIC.innerHTML = nic;
            labelNIC.id = "nic" + this.numero.toString() + "_" + f.toString();
            labelNIC.setAttribute("class", "colinput");
            //if (this.ausente) labelNIC.setAttribute("hidden", this.ausente ? "true" : "false");
            celda.appendChild(labelNIC);
            filaTabla.appendChild(celda);
        }
    };
    Datos.prototype.generarPsHTML = function (filaTabla) {
        for (var f = 0; f < this.ps.length; f++) {
            var ps = this.ps[f];
            var celda = document.createElement('TD');
            var inputMM = document.createElement('INPUT');
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
    };
    Datos.prototype.generarUcaMGHTML = function (filaTabla) {
        for (var f = 0; f < this.uca_mg.length; f++) {
            var uca_mg = this.uca_mg[f];
            var celda = document.createElement('TD');
            var inputMG = document.createElement('INPUT');
            inputMG.setAttribute("type", "number");
            inputMG.setAttribute("min", "-10");
            inputMG.setAttribute("max", "10");
            inputMG.setAttribute("value", uca_mg);
            inputMG.id = "uca_mg" + this.numero.toString() + "_" + f.toString();
            inputMG.setAttribute("class", "colinputuca");
            celda.appendChild(inputMG);
            filaTabla.appendChild(celda);
        }
    };
    Datos.prototype.setValueFromTableHtml = function () {
        var ausente = document.getElementById('ausente' + this.numero);
        this.ausente = ausente.checked;
        var movilidad = document.getElementById('movilidad' + this.numero);
        this.movilidad = movilidad.value;
        var faltaEQ = document.getElementById('faltaEQ' + this.numero);
        this.faltaEQ = faltaEQ.value == "*" ? true : false;
        var furca_1 = document.getElementById('furcaClase' + this.numero + "_0");
        var furca_2 = document.getElementById('furcaClase' + this.numero + "_1");
        var furca_3 = document.getElementById('furcaClase' + this.numero + "_2");
        this.furca_clase[0] = furca_1.value;
        this.furca_clase[1] = furca_2.value;
        this.furca_clase[2] = furca_3.value;
        var furca_1_mm = document.getElementById('furcaMM' + this.numero + "_0");
        var furca_2_mm = document.getElementById('furcaMM' + this.numero + "_1");
        var furca_3_mm = document.getElementById('furcaMM' + this.numero + "_2");
        this.furca_mm[0] = furca_1_mm.value;
        this.furca_mm[1] = furca_2_mm.value;
        this.furca_mm[2] = furca_3_mm.value;
        var supuracion = document.getElementById('supuracion' + this.numero);
        this.supuracion = supuracion.value == "S" ? true : false;
        // let nic_1 = document.getElementById('nic' + this.numero + "_0") as HTMLInputElement;
        // let nic_2 = document.getElementById('nic' + this.numero + "_1") as HTMLInputElement;
        // let nic_3 = document.getElementById('nic' + this.numero + "_2") as HTMLInputElement;
        // this.nic[0] = nic_1.value;
        // this.nic[1] = nic_2.value;
        // this.nic[2] = nic_3.value;
        var ps_1 = document.getElementById('ps' + this.numero + "_0");
        var ps_2 = document.getElementById('ps' + this.numero + "_1");
        var ps_3 = document.getElementById('ps' + this.numero + "_2");
        this.ps[0] = ps_1.value;
        this.ps[1] = ps_2.value;
        this.ps[2] = ps_3.value;
        var uca_mg_1 = document.getElementById('uca_mg' + this.numero + "_0");
        var uca_mg_2 = document.getElementById('uca_mg' + this.numero + "_1");
        var uca_mg_3 = document.getElementById('uca_mg' + this.numero + "_2");
        this.uca_mg[0] = uca_mg_1.value;
        this.uca_mg[1] = uca_mg_2.value;
        this.uca_mg[2] = uca_mg_3.value;
    };
    return Datos;
}());
var AreaDatos = /** @class */ (function (_super) {
    __extends(AreaDatos, _super);
    function AreaDatos(numero, posicion, x, y, width, height) {
        var _this = _super.call(this, x, y, width, height) || this;
        _this.debug = true;
        _this.datos = new Datos(numero.toString());
        _this._resultados = [];
        _this.numero = numero;
        _this.posicion = posicion;
        return _this;
    }
    AreaDatos.prototype.calcularSecciones = function () {
        var numero = new Resultados(Tipo.Pieza, 1);
        this._resultados.push(numero);
        var movilidad = new Resultados(Tipo.Movilidad, 1);
        this._resultados.push(movilidad);
        var faltaEQ = new Resultados(Tipo.FaltaEQ, 1);
        this._resultados.push(faltaEQ);
        var furca_clase = new Resultados(Tipo.furcaClase, 3);
        this._resultados.push(furca_clase);
        var furca_mm = new Resultados(Tipo.furcaMM, 3);
        this._resultados.push(furca_mm);
        var supuracion = new Resultados(Tipo.Supuracion, 1);
        this._resultados.push(supuracion);
        var nic = new Resultados(Tipo.Nic, 3);
        this._resultados.push(nic);
        var ps = new Resultados(Tipo.Ps, 3);
        this._resultados.push(ps);
        var uca_mg = new Resultados(Tipo.UCA, 3);
        this._resultados.push(uca_mg);
        var alto = this.height / this._resultados.length;
        for (var r = 0; r < this._resultados.length; r++) {
            var resultado = this._resultados[r];
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
    };
    AreaDatos.prototype.updateValues = function () {
        this._resultados[1].setValor(this.datos.movilidad);
        this._resultados[2].setValor(this.datos.faltaEQ ? "*" : "");
        this._resultados[3].setValores(this.datos.furca_clase);
        this._resultados[4].setValores(this.datos.furca_mm);
        this._resultados[5].setValor(this.datos.supuracion ? "S" : "");
        this._resultados[6].setValores(this.datos.nic());
        this._resultados[7].setValores(this.datos.ps);
        this._resultados[8].setValores(this.datos.uca_mg);
    };
    AreaDatos.prototype.redraw = function (context, ausente) {
        for (var r = 0; r < this._resultados.length; r++) {
            var resultado = this._resultados[r];
            if (r == 0)
                resultado.redraw(context);
            else if (!ausente)
                resultado.redraw(context);
        }
    };
    return AreaDatos;
}(Rectangle));
var AreaGrafico = /** @class */ (function (_super) {
    __extends(AreaGrafico, _super);
    function AreaGrafico(numero, posicion, x, y, width, height) {
        var _this = _super.call(this, x, y, width, height) || this;
        _this.debug = true;
        _this._ps = [0, 0, 0];
        _this._mg = [0, 0, 0];
        _this.datos = new Datos(numero.toString());
        _this._lineas = [];
        _this.numero = numero;
        _this.posicion = posicion;
        return _this;
    }
    AreaGrafico.prototype.calcularSecciones = function () {
        var mitad = this.height / 2;
        var altolinea = mitad / 20;
        for (var l = 0; l < 20; l++) {
            if (this.posicion == Posicion.Superior) {
                this._lineas.push(new Linea(this.x, this.y + (l * altolinea), this.x + this.width, this.y + (l * altolinea)));
            }
            else {
                this._lineas.push(new Linea(this.x, this.y + mitad + (l * altolinea), this.x + this.width, this.y + mitad + (l * altolinea)));
            }
        }
    };
    AreaGrafico.prototype.setMargenGingival = function () {
    };
    AreaGrafico.prototype.setProfundidadSondaje = function () {
    };
    AreaGrafico.prototype.redraw = function (context, ausente) {
        var _this = this;
        if (this.debug) {
            var d_1 = new Image();
            if (this.posicion == Posicion.Superior)
                d_1.src = 'img3/' + this.numero + '.png';
            else
                d_1.src = 'img3/' + this.numero + 'b.png';
            d_1.onload = function () {
                context.drawImage(d_1, _this.x, _this.y, _this.width, _this.height);
                for (var r = 0; r < _this._lineas.length; r++) {
                    var linea = _this._lineas[r];
                    linea.redraw(context);
                }
                if (ausente) {
                    // context.clearRect(this.x, this.y, this.width, this.height);
                    // context.fillStyle = "white";
                    // context.fillRect( this.x, this.y, this.width, this.height);     
                    // context.stroke(); 
                    context.beginPath();
                    context.moveTo(_this.x, _this.y);
                    context.strokeStyle = "black";
                    context.lineWidth = 2;
                    context.lineTo(_this.x + _this.width, _this.y + _this.height);
                    context.stroke();
                    context.beginPath();
                    context.moveTo(_this.x + _this.width, _this.y);
                    context.strokeStyle = "black";
                    context.lineWidth = 2;
                    context.lineTo(_this.x, _this.y + _this.height);
                    context.stroke();
                }
            };
        }
    };
    return AreaGrafico;
}(Rectangle));
var Diente = /** @class */ (function () {
    function Diente(numero, posicion) {
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
    Object.defineProperty(Diente.prototype, "datos", {
        get: function () {
            return this._areaDatos.datos;
        },
        enumerable: false,
        configurable: true
    });
    Diente.prototype.updateValues = function () {
        this._areaDatos.updateValues();
    };
    Diente.prototype.setArea = function (x, y, width, height) {
        var alto = height / 2;
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
    };
    Diente.prototype.redraw = function (context) {
        this._areaDatos.redraw(context, this.ausente);
        this._areaGrafico.redraw(context, this.ausente);
    };
    Diente.prototype.getMargenGenginval = function () {
        var resultado = [];
        var datos = this._areaDatos.datos.uca_mg;
        for (var a = 0; a < datos.length; a++) {
            var valor = datos[a] == "" ? 0 : Number(datos[a]);
            if (this.ausente)
                valor = 0;
            resultado.push(valor);
        }
        return resultado;
    };
    Diente.prototype.getProfundidadSondaje = function () {
        var resultado = [];
        var datos = this._areaDatos.datos.ps;
        for (var a = 0; a < datos.length; a++) {
            var valor = datos[a] == "" ? 0 : Number(datos[a]);
            if (this.ausente)
                valor = 0;
            resultado.push(valor);
        }
        return resultado;
    };
    return Diente;
}());
var Area = /** @class */ (function (_super) {
    __extends(Area, _super);
    function Area(id, x, y, width, height) {
        var _this = _super.call(this, x, y, width, height) || this;
        _this.debug = true;
        _this.id = id;
        _this.dientes = [];
        return _this;
    }
    Area.prototype.setValores = function (objs) {
        for (var d = 0; d < this.dientes.length; d++) {
            var diente = this.dientes[d];
            for (var a = 0; a < objs.length; a++) {
                var obj = objs[a];
                if (diente.numero.toString() == obj.diente && this.id.toString() == obj.area) {
                    diente.ausente = obj.ausente;
                    diente.datos.ausente = obj.ausente;
                    diente.datos.faltaEQ = obj.faltaEQ;
                    diente.datos.movilidad = obj.movilidad;
                    diente.datos.furca_clase[0] = obj.furca_clase1;
                    diente.datos.furca_clase[1] = obj.furca_clase2;
                    diente.datos.furca_clase[2] = obj.furca_clase3;
                    diente.datos.supuracion = obj.supuracion;
                    diente.datos.furca_mm[0] = obj.furca_mm1;
                    diente.datos.furca_mm[1] = obj.furca_mm2;
                    diente.datos.furca_mm[2] = obj.furca_mm3;
                    diente.datos.ps[0] = obj.ps1;
                    diente.datos.ps[1] = obj.ps2;
                    diente.datos.ps[2] = obj.ps3;
                    diente.updateValues();
                    break;
                }
            }
        }
    };
    Area.prototype.getValores = function () {
        var valores = "";
        for (var d = 0; d < this.dientes.length; d++) {
            var diente = this.dientes[d];
            if (valores.length > 0)
                valores += ", ";
            valores += "{";
            valores += "\"area\" : " + this.id.toString();
            valores += ", ";
            valores += "\"diente\" : " + diente.numero.toString();
            valores += ", ";
            valores += "\"ausente\" : " + (diente.datos.ausente ? "true" : "false");
            valores += ", ";
            valores += "\"faltaEQ\" : " + (diente.datos.faltaEQ ? "true" : "false");
            valores += ", ";
            valores += "\"movilidad\" : \"" + diente.datos.movilidad + "\"";
            valores += ", ";
            valores += "\"furca_clase1\" : \"" + diente.datos.furca_clase[0] + "\"";
            valores += ", ";
            valores += "\"furca_clase2\" : \"" + diente.datos.furca_clase[1] + "\"";
            valores += ", ";
            valores += "\"furca_clase3\" : \"" + diente.datos.furca_clase[2] + "\"";
            valores += ", ";
            valores += "\"furca_mm1\" : \"" + diente.datos.furca_mm[0] + "\"";
            valores += ", ";
            valores += "\"furca_mm2\" : \"" + diente.datos.furca_mm[1] + "\"";
            valores += ", ";
            valores += "\"furca_mm3\" : \"" + diente.datos.furca_mm[2] + "\"";
            valores += ", ";
            valores += "\"supuracion\" : " + (diente.datos.supuracion ? "true" : "false");
            valores += ", ";
            valores += "\"ps1\" : \"" + diente.datos.ps[0] + "\"";
            valores += ", ";
            valores += "\"ps2\" : \"" + diente.datos.ps[1] + "\"";
            valores += ", ";
            valores += "\"ps3\" : \"" + diente.datos.ps[2] + "\"";
            valores += ", ";
            valores += "\"uca_mg1\" : \"" + diente.datos.uca_mg[0] + "\"";
            valores += ", ";
            valores += "\"uca_mg2\" : \"" + diente.datos.uca_mg[1] + "\"";
            valores += ", ";
            valores += "\"uca_mg3\" : \"" + diente.datos.uca_mg[2] + "\"";
            valores += "}";
        }
        return valores;
    };
    Area.prototype.calcularSecciones = function () {
        var ancho = this.width / this.dientes.length;
        for (var d = 0; d < this.dientes.length; d++) {
            var diente = this.dientes[d];
            var newX = this.x + (d * ancho);
            diente.setArea(newX, this.y, ancho, this.height);
        }
    };
    Area.prototype.redraw = function (context) {
        var _this = this;
        if (this.debug) {
            for (var r = 0; r < this.dientes.length; r++) {
                var diente = this.dientes[r];
                diente.redraw(context);
            }
            setTimeout(function () {
                var posicion = _this.dientes[0].posicion;
                var mitad_h = _this.height / 2;
                var base_y = posicion == Posicion.Superior ? _this.y + mitad_h + mitad_h / 2 : _this.y + mitad_h / 2;
                var ancho = (_this.width / _this.dientes.length) / 3;
                var mitad_ancho = ancho / 2;
                var alto_punto = mitad_h / 40;
                context.stroke();
                context.beginPath();
                context.lineWidth = 2;
                context.strokeStyle = '#0138FF';
                var x = _this.x;
                var ps_h = 0;
                var puntos_ps = 0;
                for (var r = 0; r < _this.dientes.length; r++) {
                    var diente = _this.dientes[r];
                    var ps = diente.getProfundidadSondaje();
                    var mg = diente.getMargenGenginval();
                    for (var p = 0; p < ps.length; p++) {
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
                var mg_h = 0;
                x = _this.x;
                for (var r = 0; r < _this.dientes.length; r++) {
                    var diente = _this.dientes[r];
                    var mg = diente.getMargenGenginval();
                    for (var m = 0; m < mg.length; m++) {
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
    };
    Area.prototype.generarFilaPiezaHTML = function (tabla) {
        var trA = document.createElement('TR');
        var nombre = document.createElement('TH');
        nombre.innerHTML = "Pieza";
        nombre.setAttribute("class", "filaNombre");
        nombre.setAttribute("class", "colinput");
        trA.appendChild(nombre);
        tabla.appendChild(trA);
        for (var d = 0; d < this.dientes.length; d++) {
            var diente = this.dientes[d];
            var th = document.createElement('TH');
            th.setAttribute("colspan", "3");
            th.setAttribute("class", "colinput");
            th.innerHTML = diente.numero.toString();
            trA.appendChild(th);
        }
    };
    Area.prototype.generarFilaAusenteHTML = function (tabla) {
        var fila = document.createElement('TR');
        var ausente = document.createElement('TH');
        ausente.setAttribute("class", "filaNombre");
        ausente.innerHTML = "Ausente";
        fila.appendChild(ausente);
        for (var d = 0; d < this.dientes.length; d++) {
            var diente = this.dientes[d];
            diente.datos.generarAusenteHTML(fila);
        }
        tabla.appendChild(fila);
    };
    Area.prototype.generarFilaMovilidadHTML = function (tabla) {
        var fila = document.createElement('TR');
        var movilidad = document.createElement('TH');
        movilidad.setAttribute("class", "filaNombre");
        movilidad.innerHTML = "Movilidad";
        fila.appendChild(movilidad);
        for (var d = 0; d < this.dientes.length; d++) {
            var diente = this.dientes[d];
            diente.datos.generarMovilidadHTML(fila);
        }
        tabla.appendChild(fila);
    };
    Area.prototype.generarFilaFaltaEQHTML = function (tabla) {
        var fila = document.createElement('TR');
        var faltaEQ = document.createElement('TH');
        faltaEQ.innerHTML = "FaltaEQ (*)";
        faltaEQ.setAttribute("class", "filaNombre");
        fila.appendChild(faltaEQ);
        for (var d = 0; d < this.dientes.length; d++) {
            var diente = this.dientes[d];
            diente.datos.generarFaltaEQHTML(fila);
        }
        tabla.appendChild(fila);
    };
    Area.prototype.generarFilaFurcaClaseHTML = function (tabla) {
        var fila = document.createElement('TR');
        var furca_clase = document.createElement('TH');
        furca_clase.innerHTML = "Furca (Clase)";
        furca_clase.setAttribute("class", "filaNombre");
        fila.appendChild(furca_clase);
        for (var d = 0; d < this.dientes.length; d++) {
            var diente = this.dientes[d];
            diente.datos.generarFurcaClaseHTML(fila);
        }
        tabla.appendChild(fila);
    };
    Area.prototype.generarFilaFurcaMMHTML = function (tabla) {
        var fila = document.createElement('TR');
        var furca_mm = document.createElement('TH');
        furca_mm.innerHTML = "Furca (mm)";
        furca_mm.setAttribute("class", "filaNombre");
        fila.appendChild(furca_mm);
        for (var d = 0; d < this.dientes.length; d++) {
            var diente = this.dientes[d];
            diente.datos.generarFurcaMMHTML(fila);
        }
        tabla.appendChild(fila);
    };
    Area.prototype.generarFilaSupuracionHTML = function (tabla) {
        var fila = document.createElement('TR');
        var supuracion = document.createElement('TH');
        supuracion.innerHTML = "Supuracion";
        supuracion.setAttribute("class", "filaNombre");
        fila.appendChild(supuracion);
        for (var d = 0; d < this.dientes.length; d++) {
            var diente = this.dientes[d];
            diente.datos.generarSupuracionHTML(fila);
        }
        tabla.appendChild(fila);
    };
    Area.prototype.generarFilaNicHTML = function (tabla) {
        var fila = document.createElement('TR');
        var nic = document.createElement('TH');
        nic.innerHTML = "NIC";
        nic.setAttribute("class", "filaNombre");
        fila.appendChild(nic);
        for (var d = 0; d < this.dientes.length; d++) {
            var diente = this.dientes[d];
            diente.datos.generarNicHTML(fila);
        }
        tabla.appendChild(fila);
    };
    Area.prototype.generarFilaPsHTML = function (tabla) {
        var fila = document.createElement('TR');
        var ps = document.createElement('TH');
        ps.innerHTML = "PS";
        ps.setAttribute("class", "filaNombre");
        fila.appendChild(ps);
        for (var d = 0; d < this.dientes.length; d++) {
            var diente = this.dientes[d];
            diente.datos.generarPsHTML(fila);
        }
        tabla.appendChild(fila);
    };
    Area.prototype.generarFilaUCAHTML = function (tabla) {
        var fila = document.createElement('TR');
        var uca_mg = document.createElement('TH');
        uca_mg.innerHTML = "UCA-MG";
        uca_mg.setAttribute("class", "filaNombre");
        fila.appendChild(uca_mg);
        for (var d = 0; d < this.dientes.length; d++) {
            var diente = this.dientes[d];
            diente.datos.generarUcaMGHTML(fila);
        }
        tabla.appendChild(fila);
    };
    Area.prototype.generarHTML = function (htmlId) {
        var html = document.getElementById(htmlId);
        while (html.firstChild)
            html.removeChild(html.firstChild);
        var form = document.createElement("FORM");
        var tabla = document.createElement("table");
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
    };
    Area.prototype.setValuesFromTableHtml = function () {
        for (var d = 0; d < this.dientes.length; d++) {
            var diente = this.dientes[d];
            diente.datos.setValueFromTableHtml();
            diente.ausente = diente.datos.ausente;
            diente.updateValues();
        }
    };
    return Area;
}(Rectangle));
var Titulo = /** @class */ (function (_super) {
    __extends(Titulo, _super);
    function Titulo(x, y, width, height) {
        var _this = _super.call(this, x, y, width, height) || this;
        _this.debug = true;
        _this.invertido = false;
        _this.captions = ["Pieza", "Movilidad", "FaltaEQ", "furcaClase", "furcaMM", "Supuracion", "Nic", "Ps", "UCA-MG"];
        return _this;
    }
    Titulo.prototype.drawTextInBox = function (context, txt, font, x, y, w, h) {
        var fontHeight = 14;
        context.font = fontHeight + 'px ' + font;
        context.fillText(txt, x / 2, y + 2);
    };
    Titulo.prototype.redraw = function (context) {
        var alto = this.height / this.captions.length;
        for (var d = 0; d < this.captions.length; d++) {
            var caption = this.captions[this.invertido ? this.captions.length - d - 1 : d];
            this.drawTextInBox(context, caption, "Arial", this.x + 2, this.y + (alto * d), this.width, alto);
        }
    };
    return Titulo;
}(Rectangle));
var PeriodontogramaApp = /** @class */ (function () {
    function PeriodontogramaApp() {
        this.debug = true;
        var canvas = document.getElementById('canvas');
        this.context = canvas.getContext("2d");
        this.canvas = canvas;
        this.areas = [];
        this.titulos = [];
        this.calcularArea();
        this.configurarAreas();
        this.redraw();
    }
    PeriodontogramaApp.prototype.calcularArea = function () {
        var ancho_titulo = this.canvas.width / 8;
        var ancho_espacio = 20;
        var ancho_area = (this.canvas.width - ancho_titulo - (ancho_espacio * 2)) / 3;
        var alto_espacio = 20;
        var alto_area = (this.canvas.height - alto_espacio) / 4;
        var mitad_alto = alto_area / 2;
        for (var h = 0; h < 4; h++) {
            var espacio_x = 0;
            var espacio_y = h >= 2 ? alto_espacio : 0;
            for (var w = 0; w < 3; w++) {
                if (w == 1 || w == 2)
                    espacio_x = ancho_espacio;
                var area = new Area(h, ancho_titulo + (espacio_x * w) + (ancho_area * w), (espacio_y) + alto_area * h, ancho_area, alto_area);
                this.areas.push(area);
            }
            var y = 0;
            for (var h_1 = 0; h_1 < 4; h_1++) {
                var espacio_y_1 = h_1 == 2 ? alto_espacio : 0;
                var titulo = new Titulo(5, y + espacio_y_1, ancho_titulo, mitad_alto);
                y += mitad_alto + (h_1 % 2 == 0 ? alto_area + espacio_y_1 : 0);
                titulo.invertido = h_1 % 2 != 0;
                this.titulos.push(titulo);
            }
        }
    };
    PeriodontogramaApp.prototype.configurarAreas = function () {
        //Area Superior izqauierda
        var index = 0;
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
    };
    PeriodontogramaApp.prototype.clic = function (mouseX, mouseY) {
        var redraw = false;
        for (var r = 0; r < this.areas.length; r++) {
            var area = this.areas[r];
            if (area.contains(mouseX, mouseY)) {
                redraw = true;
                this.canvas.dispatchEvent(new CustomEvent("clickArea", {
                    detail: { area: r }
                }));
            }
            // this.context.beginPath();
            // this.context.rect(area.x, area.y, area.width, area.height);
            // this.context.stroke();                
        }
        if (redraw)
            this.redraw();
    };
    PeriodontogramaApp.prototype.getValores = function () {
        var valores = '[';
        for (var a = 0; a < this.areas.length; a++) {
            var area = this.areas[a];
            if (valores.length > 1)
                valores += ",";
            valores += area.getValores();
        }
        valores += "]";
        return valores;
    };
    PeriodontogramaApp.prototype.setValores = function (json) {
        var objs = JSON.parse(json);
        for (var a = 0; a < this.areas.length; a++) {
            var area = this.areas[a];
            area.setValores(objs);
        }
        this.redraw();
    };
    PeriodontogramaApp.prototype.redraw = function () {
        if (this.debug) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.fillStyle = "white";
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            // this.context.beginPath();
            // this.context.rect(0, 0, this.canvas.width, this.canvas.height);
            // this.context.stroke();    
            for (var r = 0; r < this.areas.length; r++) {
                var area = this.areas[r];
                area.redraw(this.context);
            }
            for (var r = 0; r < this.titulos.length; r++) {
                var titulo = this.titulos[r];
                titulo.redraw(this.context);
            }
        }
    };
    return PeriodontogramaApp;
}());
var perioApp = new PeriodontogramaApp();
