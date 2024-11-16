import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { Funded } from "../generated/schema"
import { Funded as FundedEvent } from "../generated/CropCashFund/CropCashFund"
import { handleFunded } from "../src/crop-cash-fund"
import { createFundedEvent } from "./crop-cash-fund-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let tokenId = BigInt.fromI32(234)
    let investor = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let amount = BigInt.fromI32(234)
    let newFundedEvent = createFundedEvent(tokenId, investor, amount)
    handleFunded(newFundedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("Funded created and stored", () => {
    assert.entityCount("Funded", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "Funded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenId",
      "234"
    )
    assert.fieldEquals(
      "Funded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "investor",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "Funded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
