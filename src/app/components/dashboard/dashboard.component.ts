import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router, } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, update, remove } from 'firebase/database';
import { environment } from 'src/environments/environment';





@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dataCitas: { [key: string]: { id: string, nombre: string, titulo: string, fecha: string, hora: string, descripcion: string, uid: string, estado: string } } = {};
  showAlert: boolean = false;

  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  ngOnInit(): void {
    this.afAuth.currentUser.then(user => {
      if (user && user.emailVerified) {
        const app = initializeApp(environment.firebase);
        const db = getDatabase(app);
        const databaseRef = ref(db, '/citas_usuario/');
        onValue(databaseRef, (snapshot) => {
          this.dataCitas = snapshot.val();
        });
      } else {
        this.router.navigate(['/login']);
      }
    })
  }

  logOut() {
    this.afAuth.signOut().then(() => this.router.navigate(['/login']));
    
  }
  confirmLogout() {
    //  alerta de confirmación
    this.showAlert = true;
  }
  cancelLogout() {
    // Ocultar la alerta de confirmación
    this.showAlert = false;
  }

  aceptarCita(citaKey: string) {
    const app = initializeApp(environment.firebase);
    const db = getDatabase(app);
    const citaRef = ref(db, '/citas_usuario/' + citaKey);

    // Actualiza el estado de la cita a "Aceptado"
    update(citaRef, {
      estado: "Aceptado"
    });

    // Muestra una alerta
    window.alert('Cita aceptada con éxito');
  }

  //eliminar
  eliminarCita(citaKey: string) {
    const app = initializeApp(environment.firebase);
    const db = getDatabase(app);
    const citaRef = ref(db, '/citas_usuario/' + citaKey);

    // Elimina la cita de la base de datos
    remove(citaRef);

    // Muestra una alerta
    window.alert('Cita eliminada con éxito');
  }
  
  // Función para mostar el color de la fila según el estado de la cita
  getColorPorEstado(estado: string): string {
    return estado === 'Aceptado' ? 'table-success' : 'table-danger';
  }
}

