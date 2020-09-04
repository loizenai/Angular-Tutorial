import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html'
})
export class MessageComponent {
  constructor(public messageService: MessageService) {}
}