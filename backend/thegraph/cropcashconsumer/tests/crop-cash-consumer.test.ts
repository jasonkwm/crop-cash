import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Bytes, BigInt, Address } from "@graphprotocol/graph-ts"
import { ChainlinkCancelled } from "../generated/schema"
import { ChainlinkCancelled as ChainlinkCancelledEvent } from "../generated/CropCashConsumer/CropCashConsumer"
import { handleChainlinkCancelled } from "../src/crop-cash-consumer"
import { createChainlinkCancelledEvent } from "./crop-cash-consumer-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let id = Bytes.fromI32(1234567890)
    let newChainlinkCancelledEvent = createChainlinkCancelledEvent(id)
    handleChainlinkCancelled(newChainlinkCancelledEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ChainlinkCancelled created and stored", () => {
    assert.entityCount("ChainlinkCancelled", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
