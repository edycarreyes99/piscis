import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { auth } from 'firebase/app';
import { Router, NavigationEnd  } from '@angular/router';
import { Observable } from "rxjs/Observable";
import * as M from 'materialize-css';
import { AngularFirestoreDocument, AngularFirestore } from '../../../node_modules/angularfire2/firestore';
declare var $:any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public isLogin: boolean;
  public isVerified: boolean;
  public nombreUsuario: string;
  public emailUsuario: string;
  public userDoc: AngularFirestoreDocument<any>;
  public user: Observable<any>;

  constructor(
    public authService: AuthService,
    public router: Router,
    public afs: AngularFirestore
  ) { }

  ngOnInit() {
    M.AutoInit();
    $(window).on('load',function(){
      $('.tap-target').tapTarget('open');
    });
  
    this.authService.getAuth().subscribe(user => {
      if (user) {
        if (user.emailVerified) {
          this.isVerified = true;
        } else {
          this.isVerified = false;
        }
        this.userDoc = this.afs.doc(`Piscis/Users/Administradores/${user.email}`);
        this.user = this.userDoc.valueChanges();
        this.isLogin = true;
        console.log("Hay Usuarios Activos");
        console.log(user.emailVerified);
        this.contenido(user)
      } else {
        this.isLogin = false;
        console.log("No hay Usuarios Activos");
      }
    })
  }
  contenido(user) {
    var user = user;
    if (user.emailVerified) {
      this.isVerified = true;
    } else {
      this.isVerified = false;
    }
  }
  cerrar() {
    this.authService.logout();
    this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
      // Reload WoW animations when done navigating to page,
      // but you are free to call it whenever/wherever you like
    });
  }
}