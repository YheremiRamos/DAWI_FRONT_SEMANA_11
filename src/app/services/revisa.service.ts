import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';
import { Revista } from '../models/revista.model';
import { map } from "rxjs/operators";

const baseUrlRevista = AppSettings.API_ENDPOINT+ '/revista';
const baseUrlCrudRevista = AppSettings.API_ENDPOINT+ '/crudRevista';
const baseUrlConsultaRevista = AppSettings.API_ENDPOINT+ '/consultaRevista';

@Injectable({
  providedIn: 'root'
})
export class RevistaService {

  constructor(private http:HttpClient) { }

  //PC1 - Registrar
  registrar(data:Revista):Observable<any>{
    return this.http.post(baseUrlRevista, data);
  }

  //PC2 - CRUD
  registrarCrud(data:Revista):Observable<any>{
    return this.http.post(baseUrlCrudRevista+"/registraRevista", data);
  }
  actualizarCrud(data:Revista):Observable<any>{
    return this.http.put(baseUrlCrudRevista+"/actualizaRevista", data);
  }
  eliminarCrud(id:number):Observable<any>{
    return this.http.delete(baseUrlCrudRevista+"/eliminaRevista/"+id);
  }
  consultarCrud(filtro:string):Observable<any>{
    return this.http.get(baseUrlCrudRevista+"/listaRevistaPorNombreLike/"+ filtro);
  }

  //PC3 - Consultar
  consultarRevistaComplejo(nom:string, fre:string, desde:string, hasta:string, est:number, p:number, t:number):Observable<any>{
        const params = new HttpParams()
        .set("nombre", nom)
        .set("frecuencia", fre)
        .set("fecDesde", desde)
        .set("fecHasta", hasta)
        .set("estado", est)
        .set("idPais", p)
        .set("idTipo", t);

    return this.http.get(baseUrlConsultaRevista+"/consultaRevistaPorParametros", {params});
  }
  generateDocumentReport(nom:string, fre:string, desde:string, hasta:string, est:number, p:number, t:number): Observable<any> {
      const params = new HttpParams()
      .set("nombre", nom)
      .set("frecuencia", fre)
      .set("fecDesde", desde)
      .set("fecHasta", hasta)
      .set("estado", est)
      .set("idPais", p)
      .set("idTipo", t);

    let headers = new HttpHeaders();
    headers.append('Accept', 'application/pdf');
    let requestOptions: any = { headers: headers, responseType: 'blob' };

    return this.http.post(baseUrlConsultaRevista +"/reporteRevistaPDF?nombre="+nom+"&frecuencia="
      +fre+"&fecDesde="+desde+"&fecHasta="+hasta+"&estado="+
      est+"&idPais="+p+"&idTipo="+t,'', requestOptions).pipe(map((response)=>{
      return {
          filename: 'reporteDocente20232.pdf',
          data: new Blob([response], {type: 'application/pdf'})
      };
  }));
}

  generateDocumentExcel(nom:string, fre:string, desde:string, hasta:string, est:number, p:number, t:number): Observable<any> {
    const params = new HttpParams()
    .set("nombre", nom)
    .set("frecuencia", fre)
    .set("fecDesde", desde)
    .set("fecHasta", hasta)
    .set("estado", est)
    .set("idPais", p)
    .set("idTipo", t);

    let headers = new HttpHeaders();
    headers.append('Accept', 'application/vnd.ms-excel');
    let requestOptions: any = { headers: headers, responseType: 'blob' };

    return this.http.post(baseUrlConsultaRevista +"/reporteRevistaExcel?nombre="+nom+"&frecuencia="+
      fre+"&fecDesde="+desde+"&fecHasta="+hasta+"&estado="+est+"&idPais="+p+"&idTipo="+t,'', 
      requestOptions).pipe(map((response)=>{
      return {
          filename: 'reporteExcel20232.xlsx',
          data: new Blob([response], {type: 'application/vnd.ms-excel'})
      };
  }));
}


}
