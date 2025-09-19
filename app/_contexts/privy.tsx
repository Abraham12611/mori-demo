"use client";

import React from 'react';

import {PrivyProvider as PrivyProviderBase} from '@privy-io/react-auth';
import {toSolanaWalletConnectors} from '@privy-io/react-auth/solana';
import { bsc } from 'viem/chains';

import '@/components/utils/suppress-console'

interface Props {
    children: React.ReactNode;
}

const solanaConnectors = toSolanaWalletConnectors({
    shouldAutoConnect: false,
});

export const PrivyProvider: React.FC<Props> = ({ children }) => {
    return (
        <PrivyProviderBase
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
            config={{
                appearance: {
                    theme: 'dark',
                    accentColor: '#d19900',
                    logo: '/logo.png',
                    walletChainType: 'ethereum-and-solana',
                    showWalletLoginFirst: true,
                    walletList: ['phantom', 'metamask', 'coinbase_wallet', 'wallet_connect'],
                },
                loginMethods: ['email', 'wallet', 'google', 'twitter', 'discord', 'github'],
                externalWallets: {
                    solana: {
                        connectors: solanaConnectors
                    }
                },

                solanaClusters: [
                    {
                        name: 'mainnet-beta',
                        rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL!,
                    }
                ],
                supportedChains: [bsc],
                // Remove defaultChain to let Privy use the chain context
            }}
        >
            {children}
        </PrivyProviderBase>
    )
}