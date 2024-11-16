import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, BigInt, Address } from "@graphprotocol/graph-ts"
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
} from "../generated/CropCashConsumer/CropCashConsumer"

export function createChainlinkCancelledEvent(id: Bytes): ChainlinkCancelled {
  let chainlinkCancelledEvent = changetype<ChainlinkCancelled>(newMockEvent())

  chainlinkCancelledEvent.parameters = new Array()

  chainlinkCancelledEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )

  return chainlinkCancelledEvent
}

export function createChainlinkFulfilledEvent(id: Bytes): ChainlinkFulfilled {
  let chainlinkFulfilledEvent = changetype<ChainlinkFulfilled>(newMockEvent())

  chainlinkFulfilledEvent.parameters = new Array()

  chainlinkFulfilledEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )

  return chainlinkFulfilledEvent
}

export function createChainlinkRequestedEvent(id: Bytes): ChainlinkRequested {
  let chainlinkRequestedEvent = changetype<ChainlinkRequested>(newMockEvent())

  chainlinkRequestedEvent.parameters = new Array()

  chainlinkRequestedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )

  return chainlinkRequestedEvent
}

export function createLandObjectUpdatedEvent(
  tokenId: BigInt,
  coordinate1: string,
  coordinate2: string,
  coordinate3: string,
  coordinate4: string,
  sizeInHectare: BigInt
): LandObjectUpdated {
  let landObjectUpdatedEvent = changetype<LandObjectUpdated>(newMockEvent())

  landObjectUpdatedEvent.parameters = new Array()

  landObjectUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  landObjectUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "coordinate1",
      ethereum.Value.fromString(coordinate1)
    )
  )
  landObjectUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "coordinate2",
      ethereum.Value.fromString(coordinate2)
    )
  )
  landObjectUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "coordinate3",
      ethereum.Value.fromString(coordinate3)
    )
  )
  landObjectUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "coordinate4",
      ethereum.Value.fromString(coordinate4)
    )
  )
  landObjectUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "sizeInHectare",
      ethereum.Value.fromUnsignedBigInt(sizeInHectare)
    )
  )

  return landObjectUpdatedEvent
}

export function createLoanInitiliazedEvent(
  landOwner: Address,
  tokenId: BigInt,
  amount: BigInt
): LoanInitiliazed {
  let loanInitiliazedEvent = changetype<LoanInitiliazed>(newMockEvent())

  loanInitiliazedEvent.parameters = new Array()

  loanInitiliazedEvent.parameters.push(
    new ethereum.EventParam("landOwner", ethereum.Value.fromAddress(landOwner))
  )
  loanInitiliazedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  loanInitiliazedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return loanInitiliazedEvent
}

export function createOneTonPriceRequestedEvent(
  requested: boolean
): OneTonPriceRequested {
  let oneTonPriceRequestedEvent = changetype<OneTonPriceRequested>(
    newMockEvent()
  )

  oneTonPriceRequestedEvent.parameters = new Array()

  oneTonPriceRequestedEvent.parameters.push(
    new ethereum.EventParam("requested", ethereum.Value.fromBoolean(requested))
  )

  return oneTonPriceRequestedEvent
}

export function createOwnershipTransferRequestedEvent(
  from: Address,
  to: Address
): OwnershipTransferRequested {
  let ownershipTransferRequestedEvent = changetype<OwnershipTransferRequested>(
    newMockEvent()
  )

  ownershipTransferRequestedEvent.parameters = new Array()

  ownershipTransferRequestedEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  ownershipTransferRequestedEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )

  return ownershipTransferRequestedEvent
}

export function createOwnershipTransferredEvent(
  from: Address,
  to: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )

  return ownershipTransferredEvent
}

export function createRequestOneTonPriceFulfilledEvent(
  requestId: Bytes,
  price: BigInt
): RequestOneTonPriceFulfilled {
  let requestOneTonPriceFulfilledEvent =
    changetype<RequestOneTonPriceFulfilled>(newMockEvent())

  requestOneTonPriceFulfilledEvent.parameters = new Array()

  requestOneTonPriceFulfilledEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromFixedBytes(requestId)
    )
  )
  requestOneTonPriceFulfilledEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return requestOneTonPriceFulfilledEvent
}

export function createRequestTonPerHectareFulfilledEvent(
  requestId: Bytes,
  ton: BigInt
): RequestTonPerHectareFulfilled {
  let requestTonPerHectareFulfilledEvent =
    changetype<RequestTonPerHectareFulfilled>(newMockEvent())

  requestTonPerHectareFulfilledEvent.parameters = new Array()

  requestTonPerHectareFulfilledEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromFixedBytes(requestId)
    )
  )
  requestTonPerHectareFulfilledEvent.parameters.push(
    new ethereum.EventParam("ton", ethereum.Value.fromUnsignedBigInt(ton))
  )

  return requestTonPerHectareFulfilledEvent
}

export function createTonPerHectareRequestedEvent(
  requested: boolean
): TonPerHectareRequested {
  let tonPerHectareRequestedEvent = changetype<TonPerHectareRequested>(
    newMockEvent()
  )

  tonPerHectareRequestedEvent.parameters = new Array()

  tonPerHectareRequestedEvent.parameters.push(
    new ethereum.EventParam("requested", ethereum.Value.fromBoolean(requested))
  )

  return tonPerHectareRequestedEvent
}
