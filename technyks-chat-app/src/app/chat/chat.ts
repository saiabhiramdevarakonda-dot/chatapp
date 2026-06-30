import { Component, effect, ElementRef, inject, signal, viewChild, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message } from '../interfaces/message';
import { ChatService } from '../services/chat/chat.service';


@Component({
  selector: 'app-chat',
  imports: [FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class ChatComponent {

  // Signals for managing chat state
  history: WritableSignal<Message[]> = signal([]);
  loading: WritableSignal<boolean> = signal(false);
  error: WritableSignal<any> = signal(null);
  message: WritableSignal<string> = signal('');
   
 private  chatContainer = viewChild<ElementRef<HTMLDivElement>>('chatContainer');

  private chatService = inject(ChatService);
  constructor() {
    effect(() => {
      if(this.history().length>0)
        this.scrollToBottom();
    });
  }
 
  private scrollToBottom(): void {
    const container = this.chatContainer();
    if (container) {
      setTimeout(() => { container.nativeElement.scrollTop = container.nativeElement.scrollHeight; }, 0);
    }
  }

  // Sends a message from the user and simulates a bot response
  sendMessage(): void {
    const userMessage = this.message().trim();
    if (!userMessage || this.loading()) {
      return;
    }

    const newMessage: Message = { id: Date.now(), role: 'user', message: userMessage };
    // Add user message to history and clear input
    this.history.update(currentHistory => [
      ...currentHistory, newMessage]);
      this.message.set('');
    this.scrollToBottom();
    this.askLLM(newMessage);
  }
 
  async askLLM(message: Message): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);
     const botMessage = await this.chatService.sendMessage(message?.message);
     
     const newBotMessage: Message = { id: Date.now(), role: 'bot', message: botMessage };
     
     this.history.update(currentHistory => [
       ...currentHistory, newBotMessage
     ]);
     this.scrollToBottom();
    } catch(error: any) {
      console.error('Error sending message:', error);
      this.error.set(error?.message);
    } finally { 
      this.loading.set(false);
    }
  }
}