import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonContent } from '@ionic/angular';
import { MensajeChatBot } from 'src/app/interfaces/mensaje-chat-bot';
import { TrabajadorService } from 'src/app/services/trabajador.service';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss'],
})
export class ChatBotComponent implements OnInit {

  @ViewChild('chat', { static: false }) chat: IonContent;

  private _mensajes: MensajeChatBot[] = [{
    Id: 0,
    Mensaje: '¡Hola! Soy ChatBot ¿En qué puedo ayudarte?',
    MensajeSiguiente: [1, 2],
    SubMensajes: [{
      Mensaje: 'a) Buscar información en el Directorio',
      RespuestaMensaje: 'a'
    }, {
      Mensaje: 'b) Buscar sitios de interés',
      RespuestaMensaje: 'b'
    }]
  }, {
    Id: 1,
    Mensaje: 'Ingresa el nombre de la persona, puesto o área que estás buscando',
    MensajeAnterior: 0,
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
    const mensajesGuardados = localStorage.getItem('stackMensajes');
    if (mensajesGuardados) {
      const mensajeActivoGuardadoId = localStorage.getItem('mensajeActivoId');
      this.stackMensajes = JSON.parse(mensajesGuardados);
      this._mensajeActivo = this._mensajes.find(mensaje => mensaje.Id == parseInt(mensajeActivoGuardadoId));
      this.updateScroll();
    } else {
      this.addMensaje(this._mensajeActivo);
    }
  }

  closeModal() {
    localStorage.removeItem('stackMensajes');
    this.modalController.dismiss();
  }

  minimizeModal() {
    localStorage.setItem('stackMensajes', JSON.stringify(this.stackMensajes));
    localStorage.setItem('mensajeActivoId', JSON.stringify(this._mensajeActivo.Id));
    this.modalController.dismiss();
  }

  resetChat() {
    this.stackMensajes = [];
    this._mensajeActivo = this._mensajes[0];
    this.addMensaje(this._mensajeActivo);
  }

  seleccionarRespuesta(respuesta: string, mensaje: MensajeChatBot) {
    if (mensaje === this._mensajeActivo) {
      this.chatInput = respuesta;
      this.enviarInpunt();
    }
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
    this.chatInput = null;
  }

  validarRespuestaUsuario() {
    if (!this._mensajeActivo.Request) {
      let respuestaEncontrada: Boolean;

      for (let index = 0; index < this._mensajeActivo.MensajeSiguiente.length; index++) {
        const pregunta = this._mensajes.find(item => item.Id === this._mensajeActivo.MensajeSiguiente[index]);

        if (pregunta.RespuestaMensaje.toLocaleLowerCase() == this.chatInput.toLocaleLowerCase()) {
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

  addMensaje(pregunta: MensajeChatBot) {
    this.stackMensajes.push(pregunta);
    this.updateScroll();
  }

  updateScroll() {
    setTimeout(() => {
      this.chat?.scrollToBottom(300);
    }, 100);
  }

  filtrarDirectorio(palabra: string) {
    this.trabajadorService.allDirectorio().refetch().then(result => {
      const directorio = result.data?.allDirectorio?.map(item => {
        let itemDirectorio = { ...item };
        itemDirectorio.NombreCompleo = `${itemDirectorio.Nombre} ${itemDirectorio.APaterno} ${itemDirectorio.Amaterno}`;
        return itemDirectorio;
      });
      const resultadoBusqueda = this.filtrarItems(directorio, palabra, ['NombreCompleo', 'Titulo', 'Area']);
      const resultadosFormateados = resultadoBusqueda.map((resultado: any) => {
        return [{
          Campo: 'Nombre',
          Valor: resultado.NombreCompleo,
          Tipo: 'Normal'
        }, {
          Campo: 'Area',
          Valor: resultado.Area,
          Tipo: 'Normal'
        }, {
          Campo: 'Cargo',
          Valor: resultado.Cargo,
          Tipo: 'Normal'
        }, {
          Campo: 'Correo',
          Valor: resultado.Correo,
          Tipo: 'Normal'
        }, {
          Campo: 'Edificio',
          Valor: resultado.Edificio,
          Tipo: 'Normal'
        }, {
          Campo: 'Extension',
          Valor: resultado.Extension,
          Tipo: 'Normal'
        }, {
          Campo: 'Piso',
          Valor: resultado.Piso,
          Tipo: 'Normal'
        }]
      });

      this.addMensaje({
        Mensaje: resultadosFormateados.length > 0 ? 'Su búsqueda arrojó los siguientes resultados:' : 'Su búsqueda no arrojó resultados:',
        Resultados: resultadosFormateados.slice(0, 5),
        BotonEnlace: {
          Texto: resultadosFormateados.length > 0 ? 'Clic para ver mas resultados' : 'Clic para revisar mi busqueda',
          Url: 'https://web.diputados.gob.mx/inicio/directorio'
        }
      });
    });
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
