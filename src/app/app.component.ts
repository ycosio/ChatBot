import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChatBotComponent } from './components/chat-bot/chat-bot.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(public modalController: ModalController) {

  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ChatBotComponent,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }
}
