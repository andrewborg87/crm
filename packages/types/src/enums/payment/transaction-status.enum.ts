export enum TransactionStatus {
  OPEN = 'open', // New transaction created
  PENDING = 'pending', // Transaction passed any pre-checks and is being processed
  COMPLETED = 'completed', // Transaction successfully completed
  FAILED = 'failed', // Transaction failed during processing
  CANCELED = 'canceled', // Transaction was canceled before completion
}
