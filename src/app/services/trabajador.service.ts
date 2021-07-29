import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class TrabajadorService {

  constructor(private apollo: Apollo) { }

  allDirectorio(): any {
    return this.apollo.watchQuery<any>({
      query: gql`
        {
          allDirectorio {
            Area
            Cargo
            Extencion
            Titulo
            NombreCompleto
            Nombre
            APaterno
            Amaterno
            Correo
            Edificio
            Piso
          }
        }`,
    });
  }
}
