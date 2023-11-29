import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-mispacientes',
  templateUrl: './mispacientes.component.html',
  styleUrls: ['./mispacientes.component.css']
})
export class MispacientesComponent  implements OnInit{
  dataUser: { [key: string]: { correo: string, nombre: string, uid: string } } = {};

  constructor(private afAuth: AngularFireAuth,
    private router: Router) { }

ngOnInit(): void {
  this.afAuth.currentUser.then(user => {
    if(user && user.emailVerified) {
      const app = initializeApp(environment.firebase);
      const db = getDatabase(app);
      const databaseRef = ref(db, '/Usuarios/');
      onValue(databaseRef, (snapshot) => {
        this.dataUser = snapshot.val();
        console.log(this.dataUser); // Maneja los datos como desees
      });
    } else {
      this.router.navigate(['/login']);
    }
  })
}


}
