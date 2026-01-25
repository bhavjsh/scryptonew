# Scrypto - Web3-Style Skill Exchange Platform

A peer-to-peer skill exchange platform where users trade skills instead of money, using crypto-inspired staking incentives to ensure quality learning experiences.

![Scrypto Demo](https://img.shields.io/badge/Demo-Hackathon%20Ready-brightgreen)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%2B%20Supabase%20%2B%20ethers.js-blue)

##  Project Overview

Scrypto enables users to exchange skills in a trustless manner. Instead of paying for courses or tutoring, users teach what they know in exchange for learning what they want. Quality is enforced through a simulated crypto-staking system.

**Key Innovation**: Web3-style accountability without requiring actual blockchain transactions - perfect for hackathon demos!

##  User Flow

1. **Connect Wallet** - User connects MetaMask/WalletConnect (used for identity only)
2. **Select Skills** - Choose skills you can teach and skills you want to learn
3. **Find Matches** - Platform automatically finds users with complementary skills
4. **Accept Match** - Both parties agree to the skill exchange
5. **Stake ETH** - Both users stake simulated ETH into off-chain escrow
6. **Conduct Session** - Learning session takes place (frontend simulation)
7. **Vote Satisfaction** - Both users mark whether they were satisfied
8. **Escrow Resolution** - Stakes are either refunded or sent to treasury

##  Off-Chain Escrow Logic

All escrow functionality is implemented **off-chain** using database state:

### How It Works

```
User A Balance: 1.0 ETH (starting balance)
User B Balance: 1.0 ETH (starting balance)
Platform Treasury: 0 ETH

[After both stake 0.01 ETH]
User A Balance: 0.99 ETH
User B Balance: 0.99 ETH
Escrow Locked: 0.02 ETH

[Resolution - Both Satisfied]
User A Balance: 1.0 ETH (refunded)
User B Balance: 1.0 ETH (refunded)
Both gain reputation points!

[Resolution - Any Unsatisfied]
User A Balance: 0.99 ETH (stake lost)
User B Balance: 0.99 ETH (stake lost)
Platform Treasury: 0.02 ETH
No reputation earned.
```

### Database Tables

- `user_balances` - Tracks simulated ETH balance per wallet
- `escrow_deposits` - Tracks individual stakes (locked/refunded/treasury)
- `platform_treasury` - Tracks total treasury balance
- `learning_sessions` - Tracks session state and satisfaction votes

### Why Off-Chain?

1. **No Gas Fees** - Perfect for demos and hackathons
2. **Instant Transactions** - No blockchain confirmation delays
3. **Easy Testing** - Reset balances anytime
4. **Same UX** - Users still get the Web3 experience

##  Leaderboard & Reputation

The reputation system tracks:

- **Total Sessions** - How many exchanges completed
- **Successful Sessions** - Sessions where both were satisfied
- **Reputation Score** - Percentage of successful sessions

Users can:
- View the leaderboard of top teachers
- Share their rank on Twitter/X
- Build reputation through quality teaching

##  Wallet-Based Identity

- Wallet address = User identity (no email/password needed)
- MetaMask and WalletConnect supported
- Uses ethers.js for wallet connection
- No actual blockchain transactions required

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Animation | Framer Motion |
| Routing | React Router v6 |
| State | React Query + Context |
| Backend | Supabase (PostgreSQL) |
| Auth | Wallet-based (ethers.js) |
| Build | Vite |

##  Project Structure

```
src/
├── components/
│   ├── layout/          # Navbar, Footer
│   ├── skills/          # SkillSelector, MatchCard, SessionCard
│   ├── ui/              # shadcn components
│   └── wallet/          # WalletButton
├── contexts/
│   └── Web3Context.tsx  # Wallet connection state
├── hooks/
│   ├── useEscrow.ts     # Off-chain escrow logic
│   ├── useMatching.ts   # Skill matching
│   ├── useSessions.ts   # Session management
│   └── useSkills.ts     # User skills CRUD
├── lib/
│   └── scrypto-contract.ts  # Simulated contract helpers
├── pages/
│   ├── ScryptoLanding.tsx   # Landing page
│   ├── MySkillsPage.tsx     # Skill selection
│   ├── FindMatchesPage.tsx  # Match discovery
│   ├── SessionsPage.tsx     # Session management
│   └── LeaderboardPage.tsx  # Reputation rankings
└── types/
    └── scrypto.ts       # TypeScript interfaces
```

##  Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask browser extension

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/scrypto.git
cd scrypto

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

The app uses Supabase for the backend. Required environment variables are automatically configured.

##  Demo Flow

1. **Open the app** and click "Connect Wallet"
2. **Set up skills** at `/skills` - select what you know and want to learn
3. **Find matches** at `/matches` - discover complementary users
4. **Request a match** - click "Request Match" on a potential partner
5. **Manage sessions** at `/sessions`:
   - Accept incoming match requests
   - Stake simulated ETH
   - Start the learning session
   - Vote on satisfaction
6. **Check leaderboard** at `/leaderboard` - see top teachers

## 🤖 AI-Assisted Development

This project was built using AI-assisted development with Lovable. Key areas where AI helped:

- Database schema design with proper RLS policies
- Component architecture and state management
- Off-chain escrow logic implementation
- TypeScript type definitions
- Responsive UI with accessibility considerations

##  Features

- ✅ Wallet connection (MetaMask/WalletConnect)
- ✅ Skill selection and management
- ✅ Complementary skill matching
- ✅ Off-chain escrow staking
- ✅ Satisfaction voting system
- ✅ Automatic escrow resolution
- ✅ Reputation tracking
- ✅ Leaderboard with Twitter sharing
- ✅ Responsive design
- ✅ Dark mode support

## 🔮 Future Enhancements

- [ ] Real smart contract deployment
- [ ] Video session integration
- [ ] Skill verification system
- [ ] Multi-chain support
- [ ] NFT badges for achievements
- [ ] Discord integration

##  License

MIT License - feel free to use for your own hackathon projects!

##  Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [ethers.js](https://ethers.org/) for Web3 integration
- [Supabase](https://supabase.com/) for backend infrastructure
- [Lovable](https://lovable.dev/) for AI-assisted development
