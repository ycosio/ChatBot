import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  pubs: any[];
  loading: true;
  error: any;

  constructor(private apollo: Apollo) {}
  ngOnInit() {
    this.apollo
      .watchQuery({
        query: gql`
          {
            allPublicacionCefp {
              Resumen
              Url
              Titulo
              Activo
              PalabrasClave
              Subcategoria
            }
          }
        `,
      })
      .valueChanges.subscribe((result: any) => {
        console.log({ result });
        this.pubs = result?.data?.allPublicacionCefp;
        this.loading = result.loading;
        this.error = result.error;
      });
  }
}
