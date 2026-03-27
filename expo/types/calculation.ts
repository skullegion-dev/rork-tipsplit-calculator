export interface Calculation {
  id: string;
  billAmount: number;
  tipPercent: number;
  taxPercent: number;
  numberOfPeople: number;
  subtotal: number;
  tipAmount: number;
  taxAmount: number;
  total: number;
  perPerson: number;
  createdAt: string;
}
