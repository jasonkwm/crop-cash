import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  Funded,
  ProjectCreated,
  Withdrawn
} from "../generated/CropCashFund/CropCashFund"

export function createFundedEvent(
  tokenId: BigInt,
  investor: Address,
  amount: BigInt
): Funded {
  let fundedEvent = changetype<Funded>(newMockEvent())

  fundedEvent.parameters = new Array()

  fundedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  fundedEvent.parameters.push(
    new ethereum.EventParam("investor", ethereum.Value.fromAddress(investor))
  )
  fundedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return fundedEvent
}

export function createProjectCreatedEvent(
  projectId: BigInt,
  title: string,
  landSize: string,
  farmer: Address,
  fundingGoal: BigInt
): ProjectCreated {
  let projectCreatedEvent = changetype<ProjectCreated>(newMockEvent())

  projectCreatedEvent.parameters = new Array()

  projectCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "projectId",
      ethereum.Value.fromUnsignedBigInt(projectId)
    )
  )
  projectCreatedEvent.parameters.push(
    new ethereum.EventParam("title", ethereum.Value.fromString(title))
  )
  projectCreatedEvent.parameters.push(
    new ethereum.EventParam("landSize", ethereum.Value.fromString(landSize))
  )
  projectCreatedEvent.parameters.push(
    new ethereum.EventParam("farmer", ethereum.Value.fromAddress(farmer))
  )
  projectCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "fundingGoal",
      ethereum.Value.fromUnsignedBigInt(fundingGoal)
    )
  )

  return projectCreatedEvent
}

export function createWithdrawnEvent(
  projectId: BigInt,
  farmer: Address,
  amount: BigInt
): Withdrawn {
  let withdrawnEvent = changetype<Withdrawn>(newMockEvent())

  withdrawnEvent.parameters = new Array()

  withdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "projectId",
      ethereum.Value.fromUnsignedBigInt(projectId)
    )
  )
  withdrawnEvent.parameters.push(
    new ethereum.EventParam("farmer", ethereum.Value.fromAddress(farmer))
  )
  withdrawnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return withdrawnEvent
}
