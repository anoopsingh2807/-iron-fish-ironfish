/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  CurrencyUtils,
  DEFAULT_CONFIG_NAME,
  DEFAULT_DATA_DIR,
  DEFAULT_USE_RPC_HTTP,
  DEFAULT_USE_RPC_IPC,
  DEFAULT_USE_RPC_TCP,
  DEFAULT_USE_RPC_TLS,
  MAXIMUM_ORE_AMOUNT,
  MINIMUM_ORE_AMOUNT,
} from '@ironfish/sdk'
import { Flags, Interfaces } from '@oclif/core'

type CompletableOptionFlag = Interfaces.CompletableOptionFlag<unknown>

export const VerboseFlagKey = 'verbose'
export const ConfigFlagKey = 'config'
export const ColorFlagKey = 'color'
export const DataDirFlagKey = 'datadir'
export const RpcUseIpcFlagKey = 'rpc.ipc'
export const RpcUseTcpFlagKey = 'rpc.tcp'
export const RpcTcpHostFlagKey = 'rpc.tcp.host'
export const RpcTcpPortFlagKey = 'rpc.tcp.port'
export const RpcUseHttpFlagKey = 'rpc.http'
export const RpcHttpHostFlagKey = 'rpc.http.host'
export const RpcHttpPortFlagKey = 'rpc.http.port'
export const RpcTcpTlsFlagKey = 'rpc.tcp.tls'
export const RpcAuthFlagKey = 'rpc.auth'

export const VerboseFlag = Flags.boolean({
  char: 'v',
  default: false,
  description: 'Set logging level to verbose',
})

export const ColorFlag = Flags.boolean({
  default: true,
  allowNo: true,
  description: 'Should colorize the output',
})

export const ConfigFlag = Flags.string({
  default: DEFAULT_CONFIG_NAME,
  description: 'The name of the config file to use',
})

export const DataDirFlag = Flags.string({
  char: 'd',
  default: DEFAULT_DATA_DIR,
  description: 'The path to the data dir',
  env: 'IRONFISH_DATA_DIR',
})

export const RpcUseIpcFlag = Flags.boolean({
  default: DEFAULT_USE_RPC_IPC,
  description: 'Connect to the RPC over IPC (default)',
})

export const RpcUseTcpFlag = Flags.boolean({
  default: DEFAULT_USE_RPC_TCP,
  description: 'Connect to the RPC over TCP',
})

export const RpcTcpHostFlag = Flags.string({
  description: 'The TCP host to listen for connections on',
})

export const RpcTcpPortFlag = Flags.integer({
  description: 'The TCP port to listen for connections on',
})

export const RpcTcpTlsFlag = Flags.boolean({
  default: DEFAULT_USE_RPC_TLS,
  description: 'Encrypt TCP connection to the RPC over TLS',
  allowNo: true,
})

export const RpcAuthFlag = Flags.string({
  description: 'The RPC auth token',
})

export const RpcHttpHostFlag = Flags.string({
  description: 'The HTTP host to listen for connections on',
})

export const RpcHttpPortFlag = Flags.integer({
  description: 'The HTTP port to listen for connections on',
})

export const RpcUseHttpFlag = Flags.boolean({
  default: DEFAULT_USE_RPC_HTTP,
  description: 'Connect to the RPC over HTTP',
  allowNo: true,
})

const localFlags: Record<string, CompletableOptionFlag> = {}
localFlags[VerboseFlagKey] = VerboseFlag as unknown as CompletableOptionFlag
localFlags[ConfigFlagKey] = ConfigFlag as unknown as CompletableOptionFlag
localFlags[DataDirFlagKey] = DataDirFlag as unknown as CompletableOptionFlag

/**
 * These flags should usually be used on any command that starts a node,
 * or uses a database to execute the command
 */
export const LocalFlags = localFlags

const remoteFlags: Record<string, CompletableOptionFlag> = {}
remoteFlags[VerboseFlagKey] = VerboseFlag as unknown as CompletableOptionFlag
remoteFlags[ConfigFlagKey] = ConfigFlag as unknown as CompletableOptionFlag
remoteFlags[DataDirFlagKey] = DataDirFlag as unknown as CompletableOptionFlag
remoteFlags[RpcUseTcpFlagKey] = RpcUseTcpFlag as unknown as CompletableOptionFlag
remoteFlags[RpcUseIpcFlagKey] = RpcUseIpcFlag as unknown as CompletableOptionFlag
remoteFlags[RpcTcpHostFlagKey] = RpcTcpHostFlag as unknown as CompletableOptionFlag
remoteFlags[RpcTcpPortFlagKey] = RpcTcpPortFlag as unknown as CompletableOptionFlag
remoteFlags[RpcHttpHostFlagKey] = RpcHttpHostFlag as unknown as CompletableOptionFlag
remoteFlags[RpcHttpPortFlagKey] = RpcHttpPortFlag as unknown as CompletableOptionFlag
remoteFlags[RpcUseHttpFlagKey] = RpcUseHttpFlag as unknown as CompletableOptionFlag
remoteFlags[RpcTcpTlsFlagKey] = RpcTcpTlsFlag as unknown as CompletableOptionFlag
remoteFlags[RpcAuthFlagKey] = RpcAuthFlag as unknown as CompletableOptionFlag

export const RemoteFlags = remoteFlags

/**
 * These flags should be usually used for a standalone wallet that connects to a
 * remote node.
 */
export const WalletNodeUseIpcFlagKey = 'node.rpc.ipc'
export const WalletNodeIpcPathFlagKey = 'node.rpc.ipc.path'
export const WalletNodeUseTcpFlagKey = 'node.rpc.tcp'
export const WalletNodeTcpHostFlagKey = 'node.rpc.tcp.host'
export const WalletNodeTcpPortFlagKey = 'node.rpc.tcp.port'
export const WalletNodeTcpTlsFlagKey = 'node.rpc.tcp.tls'
export const WalletNodeAuthFlagKey = 'node.rpc.auth'

export const WalletNodeUseIpcFlag = Flags.boolean({
  allowNo: true,
  description: 'Connect to the node client using IPC',
})

export const WalletNodeIpcPathFlag = Flags.string({
  description: 'The IPC path of the node client',
})

export const WalletNodeUseTcpFlag = Flags.boolean({
  allowNo: true,
  description: 'Connect to the node client using TCP',
})

export const WalletNodeTcpHostFlag = Flags.string({
  description: 'The TCP host of the node client',
})

export const WalletNodeTcpPortFlag = Flags.integer({
  description: 'The TCP port of the node client',
})

export const WalletNodeTcpTlsFlag = Flags.boolean({
  allowNo: true,
  description: 'Connect to the node client using TLS',
})

export const WalletNodeAuthFlag = Flags.string({
  description: 'The RPC authorization token for the node client',
})

export const WalletRemoteFlags: Record<string, CompletableOptionFlag> = {
  [WalletNodeUseIpcFlagKey]: WalletNodeUseIpcFlag as unknown as CompletableOptionFlag,
  [WalletNodeIpcPathFlagKey]: WalletNodeIpcPathFlag as unknown as CompletableOptionFlag,
  [WalletNodeUseTcpFlagKey]: WalletNodeUseTcpFlag as unknown as CompletableOptionFlag,
  [WalletNodeTcpHostFlagKey]: WalletNodeTcpHostFlag as unknown as CompletableOptionFlag,
  [WalletNodeTcpPortFlagKey]: WalletNodeTcpPortFlag as unknown as CompletableOptionFlag,
  [WalletNodeTcpTlsFlagKey]: WalletNodeTcpTlsFlag as unknown as CompletableOptionFlag,
  [WalletNodeAuthFlagKey]: WalletNodeAuthFlag as unknown as CompletableOptionFlag,
}

export type IronOpts = { minimum?: bigint; flagName: string }

export const IronFlag = Flags.custom<bigint, IronOpts>({
  parse: async (input, _ctx, opts) => parseIron(input, opts),
  char: 'i',
})

export const parseIron = (input: string, opts: IronOpts): Promise<bigint> => {
  return new Promise((resolve, reject) => {
    const { minimum, flagName } = opts ?? {}
    try {
      const value = CurrencyUtils.decodeIron(input)

      if (minimum !== undefined && value < minimum) {
        reject(
          new Error(`The minimum ${flagName} is ${CurrencyUtils.renderOre(minimum, true)}`),
        )
      }

      if (value < MINIMUM_ORE_AMOUNT || value > MAXIMUM_ORE_AMOUNT) {
        reject(new Error(`The number inputted for ${flagName} is invalid.`))
      }

      resolve(value)
    } catch {
      reject(new Error(`The number inputted for ${flagName} is invalid.`))
    }
  })
}
