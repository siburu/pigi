import '../../../setup'

import {
  CannotDecideError,
  NotDecider,
  NotDeciderInput,
} from '../../../../src/app/ovm/deciders'
import { CannotDecideDecider, FalseDecider, TrueDecider } from './utils'
import { Decision } from '../../../../src/types/ovm'
import * as assert from 'assert'

describe('NotDecider', () => {
  let decider: NotDecider
  const input: string = 'test'
  const witness: string = 'witness'

  const trueDecider: TrueDecider = new TrueDecider()
  const falseDecider: FalseDecider = new FalseDecider()
  const cannotDecideDecider: CannotDecideDecider = new CannotDecideDecider()
  beforeEach(() => {
    decider = new NotDecider()
  })

  describe('decide', () => {
    it('should return true with false decision', async () => {
      const notInput: NotDeciderInput = {
        property: {
          decider: falseDecider,
          input,
        },
        witness,
      }

      const decision: Decision = await decider.decide(notInput, undefined)

      decision.outcome.should.eq(true)
      decision.justification.length.should.eq(2)
      decision.justification[0].implication.decider.should.eq(decider)
      decision.justification[1].implication.decider.should.eq(falseDecider)

      decision.justification[1].implication.input.should.eq(input)
      decision.justification[1].implicationWitness.should.eq(witness)
    })

    it('should return false with true decision', async () => {
      const notInput: NotDeciderInput = {
        property: {
          decider: trueDecider,
          input,
        },
        witness,
      }

      const decision: Decision = await decider.decide(notInput, undefined)

      decision.outcome.should.eq(false)
      decision.justification.length.should.eq(2)
      decision.justification[0].implication.decider.should.eq(decider)
      decision.justification[1].implication.decider.should.eq(trueDecider)

      decision.justification[1].implication.input.should.eq(input)
      decision.justification[1].implicationWitness.should.eq(witness)
    })

    it('should throw when cannot decide', async () => {
      const notInput: NotDeciderInput = {
        property: {
          decider: cannotDecideDecider,
          input,
        },
        witness,
      }

      try {
        await decider.decide(notInput, undefined)
        assert(false, 'This should throw a CannotDecideError')
      } catch (e) {
        if (!(e instanceof CannotDecideError)) {
          assert(false, 'Error thrown should be CannotDecideError')
        }
      }
    })
  })
})
