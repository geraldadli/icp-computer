// src/dfinity/agent.js
import { HttpAgent, Actor } from '@dfinity/agent';

const idlFactory = ({ IDL }) =>
  IDL.Service({
    addProduct: IDL.Func(
      [IDL.Text, IDL.Text, IDL.Text, IDL.Nat,  IDL.Vec(IDL.Nat8), IDL.Nat, IDL.Text],
      [IDL.Nat],
      []
    ),
    viewProducts: IDL.Func([], [IDL.Vec(
      IDL.Record({
        id: IDL.Nat,
        name: IDL.Text,
        description: IDL.Text,
        category: IDL.Text,
        price: IDL.Nat,
        owner: IDL.Principal,
        image:  IDL.Vec(IDL.Nat8),
        stock: IDL.Nat,
        seller: IDL.Text,
      })
    )], ['query']),
    buyProduct: IDL.Func([IDL.Nat], [IDL.Text], []),
    findProductIndex: IDL.Func([IDL.Nat], [IDL.Opt(IDL.Nat)], ['query']),
  });

const canisterId = 'uxrrr-q7777-77774-qaaaq-cai';

async function getActor() {
  const agent = new HttpAgent({ host: 'http://127.0.0.1:4943' });

  // Important for local development only
  await agent.fetchRootKey();

  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });

  return actor;
}
const actor = getActor();
export default actor;