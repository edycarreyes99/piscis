import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { promise } from 'protractor';
import { reject } from 'q';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
//import { AngularFireDatabase} from 'angularfire2/database';
import { InjectFlags } from '@angular/core/src/render3/di';
import * as _ from 'lodash';
import { DocumentSnapshot } from '@firebase/firestore-types';
import { MatDialog } from '@angular/material';
declare var Plotly: any;

@Injectable()
export class AuthService {
  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    private af: AngularFireDatabase,
    private dialog: MatDialog,
  ) { }
  //variables de Historial-page
  contacto = null;
  chart = false;
  temperatura = null;
  contactoEditar = null;
  contactoAgregar = false;
  banderita = false;
  temperaturas: any;
  temperaturasFiltradas: any;
  temperaturasFiltradasGrafico: any;
  arrayx = [];
  arrayy = [];
  numeroElemento =[];
  numeroElementoFiltrado=[];
  //propiedades del filtrado
  ano: string;
  mes: string;
  dia: string;
  filtro = true;
  //reglas de filtros activos
  filtros = {}
  //terminan variables de Historial-Page

  //funciones de filtrado para el Historial-Page
  extraerDatos() {
    this.af.list('/contactos').snapshotChanges()
      .map(temperaturas => {
        let values = temperaturas.map(c => ({
          key: c.payload.key, ...c.payload.val()
        }))
        return temperaturas.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      })
      .subscribe(temperaturas => {
        this.temperaturas = temperaturas;
        //console.log(Object.values(this.temperaturas));
      })
  }

  //funcion para aplicar cada uno de los filtros al seleccionarlos
  aplicarFiltros() {
    this.temperaturasFiltradas = _.filter(this.temperaturas, _.conforms(this.filtros))
    this.contacto = null;
    this.filtro = false;
  }

  //se aplica el filtro para el select de años
  filtroExactoAno(property: string, regla: any) {
    let query = null;
    this.filtros[property] = val => val == regla
    this.aplicarFiltros()
  }
  //se aplica el filtro para el select de mes
  filtroExactoMes(property: string, regla: any) {
    this.filtros[property] = val => val == regla
    this.aplicarFiltros()
  }
  //se aplica el filtro para el select de dias
  filtroExactoDia(property: string, regla: any) {
    this.filtros[property] = val => val == regla
    this.aplicarFiltros()
    this.temperaturasFiltradasGrafico = this.temperaturasFiltradas;
    this.banderita = true;
  }
  //funcion que ejecuta el boton para eliminar los filtros de cada select
  eliminarFiltro(property: string) {
    delete this.filtros[property]
    this[property] = null
    this.aplicarFiltros();
    this.filtro = true;
  }

  //terminan las funciones para Historial-page

  registerUser(email, pass) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(email, pass)
        .then(userData => resolve(userData),
          err => reject(err));
    });
  }

  loginEmail(email, pass) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, pass)
        .then(userData => resolve(userData),
          err => reject(err));
    });
  }

  getAuth() {
    return this.afAuth.authState.map(user => user);
  }

  logout() {
    this.router.navigate(['/']);
    return this.afAuth.auth.signOut().then(function () {
      console.log("Se ha cerrado sesion");
      location.reload();
    }).catch(function (error) {
      console.log(error);
    });
  }

  verificaUsuario() {
    var user = this.afAuth.auth.currentUser;

    user.sendEmailVerification().then(function () {
      //email sent
      console.log('Mensaje de Confirmacion Enviado');
    }).catch(function (error) {
      console.log(error);
    })
  }
  emailVerified() {

  }
}