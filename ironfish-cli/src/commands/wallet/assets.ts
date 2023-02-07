/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  ASSET_ID_LENGTH,
  ASSET_METADATA_LENGTH,
  ASSET_NAME_LENGTH,
  PUBLIC_ADDRESS_LENGTH,
} from '@ironfish/rust-nodejs'
import { BufferUtils } from '@ironfish/sdk'
import { CliUx } from '@oclif/core'
import { IronfishCommand } from '../../command'
import { RemoteFlags } from '../../flags'
import { truncateCol } from '../../utils/table'

const MAX_ASSET_METADATA_COLUMN_WIDTH = ASSET_METADATA_LENGTH + 1
const MIN_ASSET_METADATA_COLUMN_WIDTH = ASSET_METADATA_LENGTH / 2 + 1

const MAX_ASSET_NAME_COLUMN_WIDTH = ASSET_NAME_LENGTH + 1
const MIN_ASSET_NAME_COLUMN_WIDTH = ASSET_NAME_LENGTH / 2 + 1

export class AssetsCommand extends IronfishCommand {
  static description = `Display the wallet's assets`

  static flags = {
    ...RemoteFlags,
    ...CliUx.ux.table.flags(),
  }

  static args = [
    {
      name: 'account',
      parse: (input: string): Promise<string> => Promise.resolve(input.trim()),
      required: false,
      description: 'Name of the account',
    },
  ]

  async start(): Promise<void> {
    const { flags, args } = await this.parse(AssetsCommand)
    const account = args.account as string | undefined

    const client = await this.sdk.connectRpc()
    const response = client.getAssets({
      account,
    })

    const assetMetadataWidth = flags.extended
      ? MAX_ASSET_METADATA_COLUMN_WIDTH
      : MIN_ASSET_METADATA_COLUMN_WIDTH
    const assetNameWidth = flags.extended
      ? MAX_ASSET_NAME_COLUMN_WIDTH
      : MIN_ASSET_NAME_COLUMN_WIDTH
    let showHeader = true

    for await (const asset of response.contentStream()) {
      CliUx.ux.table(
        [asset],
        {
          name: {
            header: 'Name',
            minWidth: assetNameWidth,
            get: (row) =>
              truncateCol(BufferUtils.toHuman(Buffer.from(row.name, 'hex')), assetNameWidth),
          },
          id: {
            header: 'ID',
            minWidth: ASSET_ID_LENGTH + 1,
          },
          metadata: {
            header: 'Metadata',
            minWidth: assetMetadataWidth,
            get: (row) =>
              truncateCol(
                BufferUtils.toHuman(Buffer.from(row.metadata, 'hex')),
                assetMetadataWidth,
              ),
          },
          status: {
            header: 'Status',
            minWidth: 12,
          },
          supply: {
            header: 'Supply',
            minWidth: 16,
            get: (row) => row.supply ?? 'NULL',
          },
          owner: {
            header: 'Owner',
            minWidth: PUBLIC_ADDRESS_LENGTH + 1,
          },
        },
        {
          printLine: this.log.bind(this),
          ...flags,
          'no-header': !showHeader,
        },
      )

      showHeader = false
    }
  }
}