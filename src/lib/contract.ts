import { ethers } from "ethers";

// ============================================
// SMART CONTRACT CONFIGURATION
// ============================================

export const CONTRACT_ADDRESS: string = "0x640bFDC0cc928016a140D506806513FE51151aE8"; // TODO: replace with deployed contract address

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// ✅ Updated ABI (from your JSON)
export const CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "skillId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "provider",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "PaymentReleased",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "skillId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "seeker",
        type: "address",
      },
    ],
    name: "SkillAccepted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "skillId",
        type: "uint256",
      },
    ],
    name: "SkillCompleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "skillId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "provider",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "SkillCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_skillId",
        type: "uint256",
      },
    ],
    name: "acceptSkill",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_skillId",
        type: "uint256",
      },
    ],
    name: "confirmAndRelease",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
    ],
    name: "createSkill",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_skillId",
        type: "uint256",
      },
    ],
    name: "markCompleted",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "skillCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "skills",
    outputs: [
      {
        internalType: "address",
        name: "provider",
        type: "address",
      },
      {
        internalType: "address",
        name: "seeker",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "completed",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "paid",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

// ============================================
// TYPES
// ============================================

export interface Skill {
  id: number;
  provider: string;
  seeker: string;
  price: string; // ETH string
  completed: boolean;
  paid: boolean;
}

export enum OfferStatus {
  Open = 0,
  InProgress = 1,
  Completed = 2,
  Paid = 3,
}

export interface SkillOffer {
  id: number;
  provider: string;
  buyer: string;
  title: string;
  description: string;
  price: string;
  status: OfferStatus;
}

// ============================================
// OFFER FUNCTIONS (for Marketplace)
// ============================================

/**
 * Get all skill offers from contract
 */
export async function getAllOffers(provider: ethers.Provider): Promise<SkillOffer[]> {
  // Return empty array if contract not connected
  if (CONTRACT_ADDRESS === ZERO_ADDRESS) {
    return [];
  }

  const skills = await getAllSkills(provider);
  return skills.map((skill) => ({
    id: skill.id,
    provider: skill.provider,
    buyer: skill.seeker,
    title: `Skill #${skill.id}`,
    description: "On-chain skill offer",
    price: skill.price,
    status: skill.paid
      ? OfferStatus.Paid
      : skill.completed
        ? OfferStatus.Completed
        : skill.seeker !== "0x0000000000000000000000000000000000000000"
          ? OfferStatus.InProgress
          : OfferStatus.Open,
  }));
}

/**
 * Create a skill offer with title/description
 */
export async function createSkillOffer(
  signer: ethers.Signer,
  title: string,
  description: string,
  priceInEth: string,
): Promise<ethers.TransactionResponse> {
  // Title/description stored off-chain, only price on-chain
  return createSkill(signer, priceInEth);
}

/**
 * Accept a skill offer
 */
export async function acceptSkillOffer(
  signer: ethers.Signer,
  skillId: number,
  priceInEth: string,
): Promise<ethers.TransactionResponse> {
  return acceptSkill(signer, skillId, priceInEth);
}

/**
 * Mark work as completed
 */
export async function markWorkCompleted(signer: ethers.Signer, skillId: number): Promise<ethers.TransactionResponse> {
  return markCompleted(signer, skillId);
}

/**
 * Confirm completion and release payment
 */
export async function confirmCompletion(signer: ethers.Signer, skillId: number): Promise<ethers.TransactionResponse> {
  return confirmAndRelease(signer, skillId);
}

// ============================================
// CONTRACT INSTANCE
// ============================================

export function getContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
}

// ============================================
// WRITE FUNCTIONS
// ============================================

export interface TransactionResult {
  success: boolean;
  txHash: string;
  error?: string;
}

/**
 * Wait for transaction confirmation and return result
 */
async function waitForTransaction(tx: ethers.TransactionResponse): Promise<TransactionResult> {
  try {
    const receipt = await tx.wait();
    return {
      success: receipt?.status === 1,
      txHash: tx.hash,
    };
  } catch (error: any) {
    return {
      success: false,
      txHash: tx.hash,
      error: error.message || 'Transaction failed',
    };
  }
}

/**
 * Create a skill offer
 * Contract: createSkill(uint256 _price)
 * Converts price from MON to wei before sending
 * Shows MetaMask confirmation popup
 */
export async function createSkill(signer: ethers.Signer, priceInEth: string): Promise<ethers.TransactionResponse> {
  const contract = getContract(signer);
  const priceInWei = ethers.parseEther(priceInEth);

  if (CONTRACT_ADDRESS === ZERO_ADDRESS) {
    console.log("Contract not connected yet.");
    throw new Error("Please set CONTRACT_ADDRESS to your deployed contract.");
  }

  // This triggers MetaMask confirmation popup
  return await contract.createSkill(priceInWei);
}

/**
 * Accept a skill offer (payable)
 * Contract: acceptSkill(uint256 _skillId) payable
 * Sends value equal to the skill price
 * Shows MetaMask confirmation popup
 */
export async function acceptSkill(
  signer: ethers.Signer,
  skillId: number,
  priceInEth: string,
): Promise<ethers.TransactionResponse> {
  const contract = getContract(signer);
  const value = ethers.parseEther(priceInEth);

  if (CONTRACT_ADDRESS === ZERO_ADDRESS) {
    console.log("Contract not connected yet.");
    throw new Error("Please set CONTRACT_ADDRESS to your deployed contract.");
  }

  // This triggers MetaMask confirmation popup with value
  return await contract.acceptSkill(skillId, { value });
}

/**
 * Mark skill as completed (provider)
 * Contract: markCompleted(uint256 _skillId)
 * Shows MetaMask confirmation popup
 */
export async function markCompleted(signer: ethers.Signer, skillId: number): Promise<ethers.TransactionResponse> {
  const contract = getContract(signer);

  if (CONTRACT_ADDRESS === ZERO_ADDRESS) {
    console.log("Contract not connected yet.");
    throw new Error("Please set CONTRACT_ADDRESS to your deployed contract.");
  }

  // This triggers MetaMask confirmation popup
  return await contract.markCompleted(skillId);
}

/**
 * Confirm and release payment (seeker)
 * Contract: confirmAndRelease(uint256 _skillId)
 * Shows MetaMask confirmation popup
 */
export async function confirmAndRelease(signer: ethers.Signer, skillId: number): Promise<ethers.TransactionResponse> {
  const contract = getContract(signer);

  if (CONTRACT_ADDRESS === ZERO_ADDRESS) {
    console.log("Contract not connected yet.");
    throw new Error("Please set CONTRACT_ADDRESS to your deployed contract.");
  }

  // This triggers MetaMask confirmation popup
  return await contract.confirmAndRelease(skillId);
}

// ============================================
// READ FUNCTIONS
// ============================================

/**
 * Get total number of skills created
 */
export async function getSkillCount(provider: ethers.Provider): Promise<number> {
  const contract = getContract(provider);
  const count = await contract.skillCount();
  return Number(count);
}

/**
 * Get a skill by id
 */
export async function getSkillById(provider: ethers.Provider, skillId: number): Promise<Skill> {
  const contract = getContract(provider);
  const raw = await contract.skills(skillId);

  return {
    id: skillId,
    provider: raw.provider,
    seeker: raw.seeker,
    price: ethers.formatEther(raw.price),
    completed: Boolean(raw.completed),
    paid: Boolean(raw.paid),
  };
}

/**
 * Get all skills (loops 1..skillCount)
 * NOTE: If your contract uses 0-based ids, change loop start accordingly.
 */
export async function getAllSkills(provider: ethers.Provider): Promise<Skill[]> {
  const count = await getSkillCount(provider);
  const skills: Skill[] = [];

  for (let i = 1; i <= count; i++) {
    try {
      const s = await getSkillById(provider, i);
      skills.push(s);
    } catch (err) {
      // If some ids are missing, skip
      console.warn("Skipping skill id", i, err);
    }
  }

  return skills;
}
