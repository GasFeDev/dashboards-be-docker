export enum PaymentCoins {
  ETH = 'ETH',
  MATIC = 'MATIC',
  ARB = 'ARB'
}

export interface ActivePayment {
  paymentId: number;
  amount: number;
  itemLevel: string;
  userId: number;
  createdAt: Date;
};

export interface AddressList {
  address: string;
  activePayment: ActivePayment;
  previousTxs: string[];
};

export interface AddressGroup {
  ETH: AddressList[],
  MATIC: AddressList[],
  ARB: AddressList[],
}