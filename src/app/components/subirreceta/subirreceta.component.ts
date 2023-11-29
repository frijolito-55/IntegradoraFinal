import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { getDatabase, ref, onValue, set } from 'firebase/database';

@Component({
  selector: 'app-subirreceta',
  templateUrl: './subirreceta.component.html',
  styleUrls: ['./subirreceta.component.css']
})
export class SubirrecetaComponent implements OnInit {
  dataCitas: {
    [key: string]: {
      id: string;
      nombre: string;
      titulo: string;
      fecha: string;
      hora: string;
      descripcion: string;
      uid: string;
      estado: string;
      uidUsuario: string;
    };
  } = {};
  dataUser: any;
  archivoSeleccionado: File | null = null;
  app = initializeApp(environment.firebase);
  db = getDatabase(this.app);
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  key: any;
  nombreBusqueda: string = ''; // Nueva propiedad para almacenar el nombre de búsqueda
  archivoSubido: boolean = false;

  constructor(private afAuth: AngularFireAuth, private router: Router, private storage: AngularFireStorage) {}

  ngOnInit(): void {
    this.afAuth.currentUser.then((user) => {
      if (user && user.emailVerified) {
        const databaseRef = ref(this.db, '/citas_usuario/');
        onValue(databaseRef, (snapshot) => {
          const dataCitas = snapshot.val();
  
          // Filtrar citas por nombre de búsqueda
          if (dataCitas) {
            const filteredCitas: { [key: string]: { id: string; nombre: string; titulo: string; fecha: string; hora: string; descripcion: string; uid: string; estado: string; uidUsuario: string } } = {};
            Object.keys(dataCitas).forEach((key) => {
              const cita = dataCitas[key];
              if (cita.nombre.toLowerCase().includes(this.nombreBusqueda.toLowerCase())) {
                filteredCitas[key] = cita;
              }
            });
            this.dataCitas = filteredCitas;
          }
        });
      }
      if (user && user.emailVerified) {
        this.dataUser = user;
      }
    });
  }
  
  selectImage() {
    // Hacer clic en el campo de entrada de archivo oculto
    this.fileInput?.nativeElement.click();
  }

  async onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
      console.log('Se ha seleccionado un archivo:', this.archivoSeleccionado);
    }
  }

  copiarUID(uid: string) {
    // Lógica para copiar el UID al portapapeles
    // Puedes usar el API de Document.execCommand o el API de Clipboard API para copiar el texto al portapapeles
    const textField = document.createElement('textarea');
    textField.innerText = uid;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();

    // Puedes mostrar una notificación o realizar cualquier otra acción después de copiar el UID
    console.log('UID copiado al portapapeles:', uid);
  }

  async subirArchivos() {
    if (this.archivoSubido) {
      // Si la receta ya se ha subido, no hagas nada
      return;
    }
  
    if (this.archivoSeleccionado) {
      for (const key in this.dataCitas) {
        if (this.dataCitas.hasOwnProperty(key)) {
          const value = this.dataCitas[key];
          if (value && value.uidUsuario) {
            console.log('uidUsuario:', value.uidUsuario);
  
            const nodoUsuarioRef = ref(this.db, `/receta_medica/${value.uidUsuario}`);
            const path = `receta_medica/${this.archivoSeleccionado.name}`;
  
            try {
              const uploadTask = await this.storage.upload(path, this.archivoSeleccionado);
              const url = await uploadTask.ref.getDownloadURL();
  
              const nuevoDato = {
                url: url,
              };
  
              await set(nodoUsuarioRef, nuevoDato);
  
              console.log('Receta subida exitosamente');
  
              
              // Deshabilitar el botón después de la primera ejecución
              this.archivoSubido = true;
            } 
            
            catch (error) {
              console.error('Error al subir la receta:', error);
            }
          }
        }
      }
      alert('Archivo cargado con éxito');
  
    } else {
      console.log('No se ha seleccionado ningún archivo.');
    }
  }

  buscarPorNombre() {
    this.ngOnInit(); // Volver a cargar los datos de citas aplicando el filtro de búsqueda
  }
}
