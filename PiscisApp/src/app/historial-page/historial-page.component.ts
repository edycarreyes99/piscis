import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service'
import {MatDialog} from '@angular/material';
@Component({
  selector: 'app-historial-page',
  templateUrl: './historial-page.component.html',
  styleUrls: ['./historial-page.component.scss']
})
export class HistorialPageComponent implements OnInit{
  title = 'Temperaturas';
  contactos: any[];
  ciudades = ['Todos','2018','11','10'];
  contacto = null;
  contactoEditar = null;
  contactoAgregar=false;

  constructor(
    private servicio: AuthService,
    private dialog: MatDialog){}
  ngOnInit(){
    this.servicio.getContactos().snapshotChanges()
    .map(changes =>{
      return changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
    })
    .subscribe(contactos => {
      this.contactos = contactos
    });
  }
  onSelect(event){
    let query = null;
    if(event.value == "Todos")
      query= this.servicio.getContactos();
    else
      query = this.servicio.getContactosFiltro(event.value);
    query.snapshotChanges()
    .map(changes =>{
      return changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
    }).subscribe(contactos =>{
      this.contactos = contactos;
    })
    this.contacto = null;
  }
  
  onClick(contacto){
    this.contacto = contacto;
  }
  cerrarDetalles(){
    this.contacto = null;
  }
}