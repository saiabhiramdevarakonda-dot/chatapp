export interface Message {
  id: number;
  message: string;
  role: 'user' | 'bot';
  modelname?: string;
}
