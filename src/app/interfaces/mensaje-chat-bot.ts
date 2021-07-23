import { BotonEnlace } from './boton-enlace';

export interface MensajeChatBot {
    Id?: number;
    Mensaje?: string;
    MensajeAnterior?: number;
    MensajeSiguiente?: number[];
    RespuestaMensaje?: string;
    SubMensajes?: MensajeChatBot[];
    Request?: any;
    Usuario?: Boolean;
    TextoUsuario?: string;
    Resultados?: any[];
    BotonEnlace?: BotonEnlace;
}
