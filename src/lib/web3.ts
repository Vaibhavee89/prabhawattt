import contractABI from "@/data/contract-abi.json";
import Web3 from "web3";
import { fromWei } from "web3-utils";

const contractAddresses = {
  ethereum: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_ETHEREUM,
  polygon: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_POLYGON,
};

const networkChainIds = {
  ethereum: "0x14a34", // Ethereum testnet (Sepolia)
  polygon: "0x13882", // Polygon testnet (Amoy)
};

// Types matching the smart contract structures
export interface UserDetails {
  isRegistered: boolean;
  userId: string;
  name: string;
  email: string;
  registeredAt: number;
}

export interface EnergyOffer {
  id: number;
  seller: string;
  energyAmount: string;
  tokenPrice: string;
  isActive: boolean;
}

export interface RegisterUserData {
  userId: string;
  name: string;
  email: string;
}

declare global {
  interface Window {
    ethereum: any;
  }
}

export class EnergyTradingService {
  private web3: Web3 | null;
  private contract: any;
  private currentAccount: string | null = null;
  private currentNetwork: string = "unknown";

  constructor() {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      this.web3 = new Web3(window.ethereum);

      // Listen for account and chain changes
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        this.currentAccount = accounts.length > 0 ? accounts[0] : null;
      });

      window.ethereum.on("chainChanged", async (chainId: string) => {
        await this.setContractByNetwork(chainId);
      });
    } else {
      console.error("Web3 provider not found");
      this.web3 = null;
      this.contract = null;
      this.currentNetwork = "unknown";
    }
  }

  async initialize() {
    if (this.web3 && typeof window.ethereum !== "undefined") {
      try {
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        await this.setContractByNetwork(chainId);
      } catch (error) {
        console.error("Error getting initial chain ID:", error);
      }
    }
  }

  private async setContractByNetwork(chainId: string) {
    if (this.web3 && chainId === networkChainIds.ethereum) {
      this.contract = new this.web3.eth.Contract(
        contractABI,
        contractAddresses.ethereum,
      );
      this.currentNetwork = "ethereum";
    } else if (this.web3 && chainId === networkChainIds.polygon) {
      this.contract = new this.web3.eth.Contract(
        contractABI,
        contractAddresses.polygon,
      );
      this.currentNetwork = "polygon";
    } else {
      console.error("Unsupported network:", chainId);
      this.contract = null;
      this.currentNetwork = "unknown";
    }
  }

  async connectWallet(): Promise<string[]> {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      this.currentAccount = accounts[0];
      return accounts;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw error;
    }
  }

  async changeWallet(): Promise<string | null> {
    try {
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      this.currentAccount = accounts[0];
      return this.currentAccount;
    } catch (error) {
      console.error("Error changing wallet:", error);
      throw error;
    }
  }

  async registerUser(userData: RegisterUserData): Promise<void> {
    try {
      const accounts = await this.connectWallet();
      await this.contract.methods
        .registerUser(userData.userId, userData.name, userData.email)
        .send({ from: accounts[0] });
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }

  async getUserDetails(address: string): Promise<UserDetails> {
    try {
      const result = await this.contract.methods.getUserDetails(address).call();
      return {
        isRegistered: result[0],
        userId: result[1],
        name: result[2],
        email: result[3],
        registeredAt: Number(result[4]),
      };
    } catch (error) {
      console.error("Error getting user details:", error);
      throw error;
    }
  }

  async createEnergyOffer(
    energyAmount: number,
    tokenPrice: number,
  ): Promise<void> {
    try {
      const accounts = await this.connectWallet();
      await this.contract.methods
        .createEnergyOffer(energyAmount, tokenPrice)
        .send({ from: accounts[0] });
    } catch (error) {
      console.error("Error creating energy offer:", error);
      throw error;
    }
  }

  async purchaseEnergy(_offerId: number, amount: number): Promise<void> {
    try {
      const accounts = await this.connectWallet();
      const weiValue = this.web3!.utils.toWei(amount.toString(), "ether");

      await this.contract.methods
        .purchaseEnergy(_offerId)
        .send({ from: accounts[0], value: weiValue });

      console.log("Energy purchased successfully");
    } catch (error) {
      console.error("Error purchasing energy:", error);
      throw error;
    }
  }

  async getUserBalance(address: string): Promise<string> {
    try {
      const balance = await this.contract.methods
        .getUserTokenBalance(address)
        .call();
      return fromWei(balance, "ether");
    } catch (error) {
      console.error("Error getting user balance:", error);
      throw error;
    }
  }

  async mintEnergyTokens(amount: number): Promise<void> {
    try {
      const accounts = await this.connectWallet();
      const exchangeRate = 10000; // 1 ETH = 10000 Energy Tokens
      const ethRequired = amount / exchangeRate; // This gives you the ETH required for the amount of tokens

      // Convert ETH to wei for the transaction
      const weiValue = this.web3!.utils.toWei(ethRequired.toString(), "ether");

      // Calculate the actual amount of tokens being minted
      const tokensToMint = amount; // This is the amount of tokens you're looking to mint

      await this.contract.methods.purchaseTokens(tokensToMint).send({
        from: accounts[0],
        value: weiValue,
      });
    } catch (error) {
      console.error("Error minting energy tokens:", error);
      throw error;
    }
  }

  async getActiveOffers(): Promise<any[]> {
    try {
      const totalOffers = await this.contract.methods
        .getActiveOffersCount()
        .call();
      const offers = [];

      for (let i = 0; i < totalOffers; i++) {
        const offer = await this.contract.methods.energyOffers(i).call();
        if (offer.isActive) {
          offers.push({
            id: i,
            seller: offer.seller,
            amount: Number(offer.energyAmount),
            pricePerUnit: Number(offer.tokenPrice),
            isActive: offer.isActive,
            timestamp: new Date(), // Since your contract doesn't store timestamp
          });
        }
      }

      return offers;
    } catch (error) {
      console.error("Error getting active offers:", error);
      throw error;
    }
  }
}

export const energyTradingService = new EnergyTradingService();
energyTradingService.initialize();
