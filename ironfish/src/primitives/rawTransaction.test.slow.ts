/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Asset, generateKey, Note as NativeNote } from '@ironfish/rust-nodejs'
import { Witness } from '../merkletree'
import { NoteHasher } from '../merkletree/hasher'
import { Side } from '../merkletree/merkletree'
import { useAccountFixture, useTxFixture } from '../testUtilities'
import { createNodeTest } from '../testUtilities/nodeTest'
import { SpendingAccount } from '../wallet'
import { Note } from './note'
import { RawTransaction } from './rawTransaction'

const TEST_ASSET_ID_1: Buffer = Buffer.from(
  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaac',
  'hex',
)
const TEST_ASSET_ID_2: Buffer = Buffer.from(
  'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbba',
  'hex',
)

type TestRawTransactionOptions = {
  withExpiration: boolean
  withFee: boolean
  withMints: boolean
  withBurns: boolean
  withOutputs: boolean
}

function createTestRawTransaction(
  account: SpendingAccount,
  options: Partial<TestRawTransactionOptions>,
): RawTransaction {
  const raw = new RawTransaction()

  if (options.withExpiration) {
    raw.expiration = 123
  }

  if (options.withFee) {
    raw.fee = 1337n
  }

  const witness = new Witness(
    0,
    Buffer.alloc(32, 1),
    [
      { side: Side.Left, hashOfSibling: Buffer.alloc(32, 2) },
      { side: Side.Right, hashOfSibling: Buffer.alloc(32, 3) },
      { side: Side.Left, hashOfSibling: Buffer.alloc(32, 4) },
      { side: Side.Right, hashOfSibling: Buffer.alloc(32, 5) },
    ],
    new NoteHasher(),
  )

  const note = new Note(
    new NativeNote(
      generateKey().publicAddress,
      123456789n,
      'some memo',
      Asset.nativeId(),
      account.publicAddress,
    ).serialize(),
  )

  raw.spends.push({ note, witness })

  if (options.withMints) {
    raw.mints.push({
      name: 'an asset',
      metadata: 'some metadata',
      value: 123n,
    })
    raw.mints.push({
      name: 'another asset',
      metadata: 'some other metadata',
      value: 456n,
    })
  }

  if (options.withBurns) {
    raw.burns.push({
      assetId: TEST_ASSET_ID_1,
      value: 789n,
    })
    raw.burns.push({
      assetId: TEST_ASSET_ID_2,
      value: 5n,
    })

    const burnNoteA = new Note(
      new NativeNote(
        generateKey().publicAddress,
        123456789n,
        'some memo',
        TEST_ASSET_ID_1,
        account.publicAddress,
      ).serialize(),
    )

    const burnNoteB = new Note(
      new NativeNote(
        generateKey().publicAddress,
        123456789n,
        'some memo',
        TEST_ASSET_ID_2,
        account.publicAddress,
      ).serialize(),
    )

    raw.spends.push({ note: burnNoteA, witness })
    raw.spends.push({ note: burnNoteB, witness })
  }

  if (options.withOutputs) {
    const outputNote = new Note(
      new NativeNote(
        generateKey().publicAddress,
        123456789n - raw.fee,
        'some memo',
        Asset.nativeId(),
        account.publicAddress,
      ).serialize(),
    )

    raw.outputs.push({ note: outputNote })
  }

  return raw
}

/**
 * Given an array of possible flags from `TestRawTransactionOptions`, produces
 * a sequence of all possible combinations of such flags.
 *
 * Example:
 *
 * ```
 * > testOptionCombinations(['withExpiration', 'withFee'])
 * [
 *   { withExpiration: false, withFee: false },
 *   { withExpiration: false, withFee: true  },
 *   { withExpiration: true,  withFee: false },
 *   { withExpiration: true,  withFee: true  },
 * ]
 * ```
 */
function testOptionCombinations(
  flags: Readonly<Array<keyof TestRawTransactionOptions>>,
): Array<Partial<TestRawTransactionOptions>> {
  const combinations = []
  for (let mask = 0; mask < 2 ** flags.length; mask++) {
    const options: Partial<TestRawTransactionOptions> = {}
    for (let index = 0; index < flags.length; index++) {
      const flagName = flags[index]
      const enabled = !!(mask & (1 << index))
      options[flagName] = enabled
    }
    combinations.push(options)
  }
  return combinations
}

function describeTestOptions(options: Partial<TestRawTransactionOptions>): string {
  const description = Object.entries(options)
    .filter(([_flag, enabled]) => enabled)
    .map(([flag, _enabled]) => flag)
  if (description.length) {
    return description.join(', ')
  } else {
    return 'empty'
  }
}

describe('RawTransaction', () => {
  const nodeTest = createNodeTest()

  describe('postedSize', () => {
    describe('v1', () => {
      const flags = [
        'withExpiration',
        'withFee',
        'withMints',
        'withBurns',
        'withOutputs',
      ] as const

      testOptionCombinations(flags).forEach((options) => {
        // eslint-disable-next-line jest/valid-title
        it(describeTestOptions(options), async () => {
          const account = await useAccountFixture(nodeTest.wallet)

          const raw = createTestRawTransaction(account, options)
          const serialized = (
            await useTxFixture(
              nodeTest.wallet,
              account,
              account,
              () => {
                return raw.post(account.spendingKey)
              },
              undefined,
              undefined,
              false,
            )
          ).serialize()

          expect(raw.postedSize(account.publicAddress)).toEqual(serialized.byteLength)
        })
      })
    })
  })
})
