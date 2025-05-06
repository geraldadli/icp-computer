import { HttpAgent, Actor } from '@dfinity/agent';

const walletIdlFactory = ({ IDL }) =>
  IDL.Service({
    addWallet: IDL.Func(
      [IDL.Nat, IDL.Text],
      [IDL.Nat],
      []
    ),
    viewWallets: IDL.Func(
      [],
      [IDL.Vec(
        IDL.Record({
          id: IDL.Nat,
          amount: IDL.Nat,
          owner: IDL.Principal,
          user: IDL.Text
        })
      )],
      ['query']
    ),
    deposit: IDL.Func(
      [IDL.Nat, IDL.Nat],
      [IDL.Text],
      []
    ),
    findWalletIndex: IDL.Func(
      [IDL.Nat],
      [IDL.Opt(IDL.Nat)],
      ['query']
    )
  });

const walletCanisterId = 'vizcg-th777-77774-qaaea-cai' // <-- Change this!

async function getWalletActor() {
  const agent = new HttpAgent({ host: 'http://127.0.0.1:4943' });
  await agent.fetchRootKey(); // For local dev

  return Actor.createActor(walletIdlFactory, {
    agent,
    canisterId: walletCanisterId,
  });
}

const actor = await getWalletActor();
export default actor;
