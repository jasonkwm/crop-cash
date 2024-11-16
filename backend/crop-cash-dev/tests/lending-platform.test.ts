import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { FundsDeposited } from "../generated/schema"
import { FundsDeposited as FundsDepositedEvent } from "../generated/LendingPlatform/LendingPlatform"
import { handleFundsDeposited } from "../src/lending-platform"
import { createFundsDepositedEvent } from "./lending-platform-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let requestId = BigInt.fromI32(234)
    let lender = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let amount = BigInt.fromI32(234)
    let newFundsDepositedEvent = createFundsDepositedEvent(
      requestId,
      lender,
      amount
    )
    handleFundsDeposited(newFundsDepositedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("FundsDeposited created and stored", () => {
    assert.entityCount("FundsDeposited", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "FundsDeposited",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "requestId",
      "234"
    )
    assert.fieldEquals(
      "FundsDeposited",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "lender",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "FundsDeposited",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
