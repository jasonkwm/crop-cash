import {
  FundsDeposited as FundsDepositedEvent,
  FundsWithdrawn as FundsWithdrawnEvent,
  LendingRequestCreated as LendingRequestCreatedEvent
} from "../generated/Lend/Lend"
import {
  FundsDeposited,
  FundsWithdrawn,
  LendingRequestCreated
} from "../generated/schema"

export function handleFundsDeposited(event: FundsDepositedEvent): void {
  let entity = new FundsDeposited(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.requestId = event.params.requestId
  entity.lender = event.params.lender
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFundsWithdrawn(event: FundsWithdrawnEvent): void {
  let entity = new FundsWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.requestId = event.params.requestId
  entity.borrower = event.params.borrower
  entity.totalAmount = event.params.totalAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLendingRequestCreated(
  event: LendingRequestCreatedEvent
): void {
  let entity = new LendingRequestCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.requestId = event.params.requestId
  entity.borrower = event.params.borrower
  entity.amount = event.params.amount
  entity.interestRate = event.params.interestRate
  entity.duration = event.params.duration

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
