import { ethers } from "ethers"

declare global {
  interface Window {
    ethereum?: any
  }
}

export interface Web3Config {
  supportedChains: Record<number, ChainConfig>
  tokens: Record<string, TokenConfig>
}

export interface ChainConfig {
  chainId: number
  name: string
  symbol: string
  rpcUrl: string
  blockExplorer: string
  icon: string
}

export interface TokenConfig {
  address: string
  symbol: string
  decimals: number
  name: string
  icon: string
  chainId: number
}

export const web3Config: Web3Config = {
  supportedChains: {
    1: {
      chainId: 1,
      name: "Ethereum Mainnet",
      symbol: "ETH",
      rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
      blockExplorer: "https://etherscan.io",
      icon: "⟠",
    },
    56: {
      chainId: 56,
      name: "BNB Smart Chain",
      symbol: "BNB",
      rpcUrl: "https://bsc-dataseed.binance.org/",
      blockExplorer: "https://bscscan.com",
      icon: "🟡",
    },
    137: {
      chainId: 137,
      name: "Polygon",
      symbol: "MATIC",
      rpcUrl: "https://polygon-rpc.com/",
      blockExplorer: "https://polygonscan.com",
      icon: "🟣",
    },
    43114: {
      chainId: 43114,
      name: "Avalanche",
      symbol: "AVAX",
      rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
      blockExplorer: "https://snowtrace.io",
      icon: "🔺",
    },
  },
  tokens: {
    USDC_ETH: {
      address: "0xA0b86a33E6441b4C8528d3d66c8e6dF86E3c5f7e",
      symbol: "USDC",
      decimals: 6,
      name: "USD Coin",
      icon: "💰",
      chainId: 1,
    },
    USDT_ETH: {
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      symbol: "USDT",
      decimals: 6,
      name: "Tether",
      icon: "💰",
      chainId: 1,
    },
    GBT_BSC: {
      address: "0xBf632C62b6b842015B5912a2B2cE942bd13A30Ad",
      symbol: "GBT",
      decimals: 18,
      name: "GatorBite Token",
      icon: "🐊",
      chainId: 56,
    },
    USDC_BSC: {
      address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      symbol: "USDC",
      decimals: 18,
      name: "USD Coin",
      icon: "💰",
      chainId: 56,
    },
  },
}

export class Web3Service {
  private static provider: ethers.BrowserProvider | null = null
  private static signer: ethers.JsonRpcSigner | null = null

  static async isMetaMaskInstalled(): Promise<boolean> {
    return typeof window !== "undefined" && typeof window.ethereum !== "undefined"
  }

  static async connectWallet(): Promise<{
    success: boolean
    address?: string
    chainId?: number
    error?: string
  }> {
    try {
      if (!(await this.isMetaMaskInstalled())) {
        return {
          success: false,
          error: "MetaMask is not installed. Please install MetaMask to continue.",
        }
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length === 0) {
        return {
          success: false,
          error: "No accounts found. Please connect your MetaMask wallet.",
        }
      }

      // Get current chain ID
      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      })

      this.provider = new ethers.BrowserProvider(window.ethereum)
      this.signer = await this.provider.getSigner()

      return {
        success: true,
        address: accounts[0],
        chainId: Number.parseInt(chainId, 16),
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to connect wallet",
      }
    }
  }

  static async switchChain(chainId: number): Promise<boolean> {
    try {
      const chain = web3Config.supportedChains[chainId]
      if (!chain) {
        throw new Error(`Unsupported chain ID: ${chainId}`)
      }

      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      })

      return true
    } catch (error: any) {
      // Chain not added to MetaMask
      if (error.code === 4902) {
        return await this.addChain(chainId)
      }
      throw error
    }
  }

  static async addChain(chainId: number): Promise<boolean> {
    try {
      const chain = web3Config.supportedChains[chainId]
      if (!chain) {
        throw new Error(`Unsupported chain ID: ${chainId}`)
      }

      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: chain.name,
            nativeCurrency: {
              name: chain.name,
              symbol: chain.symbol,
              decimals: 18,
            },
            rpcUrls: [chain.rpcUrl],
            blockExplorerUrls: [chain.blockExplorer],
          },
        ],
      })

      return true
    } catch (error) {
      console.error("Failed to add chain:", error)
      return false
    }
  }

  static async addToken(tokenConfig: TokenConfig): Promise<boolean> {
    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenConfig.address,
            symbol: tokenConfig.symbol,
            decimals: tokenConfig.decimals,
            image: `https://repairhq.co/tokens/${tokenConfig.symbol.toLowerCase()}.png`,
          },
        },
      })

      return true
    } catch (error) {
      console.error("Failed to add token:", error)
      return false
    }
  }

  static async getBalance(tokenAddress?: string): Promise<string> {
    try {
      if (!this.signer) {
        throw new Error("Wallet not connected")
      }

      const address = await this.signer.getAddress()

      if (!tokenAddress) {
        // Get native token balance (ETH, BNB, etc.)
        const balance = await this.provider!.getBalance(address)
        return ethers.formatEther(balance)
      } else {
        // Get ERC20 token balance
        const tokenContract = new ethers.Contract(
          tokenAddress,
          ["function balanceOf(address) view returns (uint256)"],
          this.provider,
        )
        const balance = await tokenContract.balanceOf(address)
        return balance.toString()
      }
    } catch (error) {
      console.error("Failed to get balance:", error)
      return "0"
    }
  }

  static async sendPayment(
    amount: string,
    tokenAddress?: string,
    recipientAddress?: string,
  ): Promise<{
    success: boolean
    txHash?: string
    error?: string
  }> {
    try {
      if (!this.signer) {
        throw new Error("Wallet not connected")
      }

      const recipient = recipientAddress || "0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4" // RepairHQ treasury

      let tx: any

      if (!tokenAddress) {
        // Send native token (ETH, BNB, etc.)
        tx = await this.signer.sendTransaction({
          to: recipient,
          value: ethers.parseEther(amount),
        })
      } else {
        // Send ERC20 token
        const tokenContract = new ethers.Contract(
          tokenAddress,
          ["function transfer(address to, uint256 amount) returns (bool)", "function decimals() view returns (uint8)"],
          this.signer,
        )

        const decimals = await tokenContract.decimals()
        const tokenAmount = ethers.parseUnits(amount, decimals)

        tx = await tokenContract.transfer(recipient, tokenAmount)
      }

      await tx.wait()

      return {
        success: true,
        txHash: tx.hash,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Transaction failed",
      }
    }
  }

  static async estimateGas(amount: string, tokenAddress?: string, recipientAddress?: string): Promise<string> {
    try {
      if (!this.signer) {
        throw new Error("Wallet not connected")
      }

      const recipient = recipientAddress || "0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4"

      let gasEstimate: bigint

      if (!tokenAddress) {
        gasEstimate = await this.provider!.estimateGas({
          to: recipient,
          value: ethers.parseEther(amount),
        })
      } else {
        const tokenContract = new ethers.Contract(
          tokenAddress,
          ["function transfer(address to, uint256 amount) returns (bool)"],
          this.signer,
        )

        gasEstimate = await tokenContract.transfer.estimateGas(recipient, ethers.parseUnits(amount, 18))
      }

      return gasEstimate.toString()
    } catch (error) {
      console.error("Failed to estimate gas:", error)
      return "21000" // Default gas limit
    }
  }
}
