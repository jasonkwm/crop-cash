import {
  ChainlinkCancelled as ChainlinkCancelledEvent,
  ChainlinkFulfilled as ChainlinkFulfilledEvent,
  ChainlinkRequested as ChainlinkRequestedEvent,
  LandObjectUpdated as LandObjectUpdatedEvent,
  LoanInitiliazed as LoanInitiliazedEvent,
  OneTonPriceRequested as OneTonPriceRequestedEvent,
  OwnershipTransferRequested as OwnershipTransferRequestedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  RequestOneTonPriceFulfilled as RequestOneTonPriceFulfilledEvent,
  RequestTonPerHectareFulfilled as RequestTonPerHectareFulfilledEvent,
  TonPerHectareRequested as TonPerHectareRequestedEvent
} from "../generated/CropCashConsumer/CropCashConsumer"
import {
  ChainlinkCancelled,
  ChainlinkFulfilled,
  ChainlinkRequested,
  LandObjectUpdated,
  LoanInitiliazed,
  OneTonPriceRequested,
  OwnershipTransferRequested,
  OwnershipTransferred,
  RequestOneTonPriceFulfilled,
  RequestTonPerHectareFulfilled,
  TonPerHectareRequested
} from "../generated/schema"

export function handleChainlinkCancelled(event: ChainlinkCancelledEvent): void {
  let entity = new ChainlinkCancelled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.CropCashConsumer_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleChainlinkFulfilled(event: ChainlinkFulfilledEvent): void {
  let entity = new ChainlinkFulfilled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.CropCashConsumer_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleChainlinkRequested(event: ChainlinkRequestedEvent): void {
  let entity = new ChainlinkRequested(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.CropCashConsumer_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLandObjectUpdated(event: LandObjectUpdatedEvent): void {
  let entity = new LandObjectUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenId = event.params.tokenId
  entity.coordinate1 = event.params.coordinate1
  entity.coordinate2 = event.params.coordinate2
  entity.coordinate3 = event.params.coordinate3
  entity.coordinate4 = event.params.coordinate4
  entity.sizeInHectare = event.params.sizeInHectare

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLoanInitiliazed(event: LoanInitiliazedEvent): void {
  let entity = new LoanInitiliazed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.landOwner = event.params.landOwner
  entity.tokenId = event.params.tokenId
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOneTonPriceRequested(
  event: OneTonPriceRequestedEvent
): void {
  let entity = new OneTonPriceRequested(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.requested = event.params.requested

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferRequested(
  event: OwnershipTransferRequestedEvent
): void {
  let entity = new OwnershipTransferRequested(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRequestOneTonPriceFulfilled(
  event: RequestOneTonPriceFulfilledEvent
): void {
  let entity = new RequestOneTonPriceFulfilled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.requestId = event.params.requestId
  entity.price = event.params.price

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRequestTonPerHectareFulfilled(
  event: RequestTonPerHectareFulfilledEvent
): void {
  let entity = new RequestTonPerHectareFulfilled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.requestId = event.params.requestId
  entity.ton = event.params.ton

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTonPerHectareRequested(
  event: TonPerHectareRequestedEvent
): void {
  let entity = new TonPerHectareRequested(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.requested = event.params.requested

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
