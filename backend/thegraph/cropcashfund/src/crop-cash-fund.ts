import {
  Funded as FundedEvent,
  ProjectCreated as ProjectCreatedEvent,
  Withdrawn as WithdrawnEvent
} from "../generated/CropCashFund/CropCashFund"
import { Funded, ProjectCreated, Withdrawn } from "../generated/schema"

export function handleFunded(event: FundedEvent): void {
  let entity = new Funded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenId = event.params.tokenId
  entity.investor = event.params.investor
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProjectCreated(event: ProjectCreatedEvent): void {
  let entity = new ProjectCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.projectId = event.params.projectId
  entity.title = event.params.title
  entity.landSize = event.params.landSize
  entity.farmer = event.params.farmer
  entity.fundingGoal = event.params.fundingGoal

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdrawn(event: WithdrawnEvent): void {
  let entity = new Withdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.projectId = event.params.projectId
  entity.farmer = event.params.farmer
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
