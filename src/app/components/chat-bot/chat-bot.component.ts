import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MensajeChatBot } from 'src/app/interfaces/mensaje-chat-bot';
import { TrabajadorService } from 'src/app/services/trabajador.service';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss'],
})
export class ChatBotComponent implements OnInit {

  private _mensajes: MensajeChatBot[] = [{
    Id: 0,
    Mensaje: '¡Hola! Soy ChatBot ¿En qué puedo ayudarte?',
    MensajeSiguiente: [1, 2],
    SubMensajes: [{
      Mensaje: 'a) Buscar información en el Directorio',
    }, {
      Mensaje: 'b) Buscar sitios de interés',
    }]
  }, {
    Id: 1,
    Mensaje: 'Ingresa el nombre de la persona, puesto o área que estás buscando',
    MensajeAnterior: 0,
    MensajeSiguiente: [3, 4],
    RespuestaMensaje: 'a',
    Request: (palabra) => this.filtrarDirectorio(palabra)
  }, {
    Id: 2,
    Mensaje: 'Test B',
    MensajeAnterior: 0,
    RespuestaMensaje: 'b',
    Request: (palabra) => console.log(`Buscando ${palabra}`)
  }];
  private _mensajeActivo: MensajeChatBot = this._mensajes[0];
  public stackMensajes: MensajeChatBot[] = [];
  public chatInput: string;

  constructor(public modalController: ModalController, private trabajadorService: TrabajadorService) { }

  ngOnInit() {
    this.addMensaje(this._mensajeActivo);
  }

  closeModal() {
    this.modalController.dismiss();
  }

  resetChat() {
    this.stackMensajes = [];
    this._mensajeActivo = this._mensajes[0];
    this.addMensaje(this._mensajeActivo);
  }

  enviarInpunt() {
    if (this.chatInput) {
      const respuestaUsuario: MensajeChatBot = {
        Usuario: true,
        TextoUsuario: this.chatInput
      };
      this.addMensaje(respuestaUsuario);
      this.validarRespuestaUsuario();
    }
    this.resetChatIput();
  }

  validarRespuestaUsuario() {
    if (!this._mensajeActivo.Request) {
      let respuestaEncontrada: Boolean;

      for (let index = 0; index < this._mensajeActivo.MensajeSiguiente.length; index++) {
        const pregunta = this._mensajes.find(item => item.Id === this._mensajeActivo.MensajeSiguiente[index]);

        if (pregunta.RespuestaMensaje == this.chatInput) {
          this._mensajeActivo = pregunta;
          this.addMensaje(this._mensajeActivo);
          respuestaEncontrada = true;
          break;
        }
      }

      if (!respuestaEncontrada) {
        this.addMensaje(this._mensajeActivo);
      }
    } else {
      this._mensajeActivo.Request(this.chatInput);
    }
  }

  resetChatIput() {
    this.chatInput = ' ';
    setTimeout(() => {
      this.chatInput = null;
    }, 100);
  }

  updateScroll() {
    // setTimeout(() => {
    //   var element = document.getElementById("chatContent");
    //   element.scrollTop = element.scrollHeight;
    // }, 100);
  }

  addMensaje(pregunta: MensajeChatBot) {
    this.stackMensajes.push(pregunta);
    this.updateScroll();
  }

  filtrarDirectorio(palabra: string) {
    console.log("----------------", palabra);
    
    // this.trabajadorService.allDirectorio().refetch().then(result => {
    //   const directorio = result.data?.allDirectorio?.map(directorio => {
    //     directorio.NombreCompleo = `${directorio.Nombre} ${directorio.APaterno} ${directorio.Amaterno}`;
    //     return directorio;
    //   });
    //   const resultadoBusqueda = this.filtrarItems(directorio, palabra, ['NombreCompleo', 'Titulo', 'Area']);
    //   const resultadosFormateados = resultadoBusqueda.map((resultado: Contacto) => {
    //     return [{
    //       Campo: 'Nombre',
    //       Valor: resultado.NombreCompleo,
    //       Tipo: 'Normal'
    //     }, {
    //       Campo: 'Area',
    //       Valor: resultado.Area,
    //       Tipo: 'Normal'
    //     }, {
    //       Campo: 'Cargo',
    //       Valor: resultado.Cargo,
    //       Tipo: 'Normal'
    //     }, {
    //       Campo: 'Correo',
    //       Valor: resultado.Correo,
    //       Tipo: 'Normal'
    //     }, {
    //       Campo: 'Edificio',
    //       Valor: resultado.Edificio,
    //       Tipo: 'Normal'
    //     }, {
    //       Campo: 'Extension',
    //       Valor: resultado.Extension,
    //       Tipo: 'Normal'
    //     }, {
    //       Campo: 'Piso',
    //       Valor: resultado.Piso,
    //       Tipo: 'Normal'
    //     }]
    //   });

    //   this.addMensaje({
    //     Pregunta: resultadosFormateados.length > 0 ? 'Su búsqueda arrojó los siguientes resultados:' :'Su búsqueda no arrojó resultados:',
    //     Resultados: resultadosFormateados.slice(0, 5),
    //     BotonEnlace: {
    //       Texto: resultadosFormateados.length > 0 ? 'Clic para ver mas resultados' : 'Clic para revisar mi busqueda',
    //       Url: 'https://web.diputados.gob.mx/inicio/directorio'
    //     }
    //   });
    // });
  }

  filtrarItems(items: any[], palabra: string, llaves: any[]) {
    return items.filter(item => {
      return llaves.some((key) => {
        return item[key]
          ?.toString()
          ?.toLowerCase()
          .includes(palabra.toLowerCase());
      })
    });
  }

}
