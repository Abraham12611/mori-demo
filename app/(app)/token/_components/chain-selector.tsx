'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useChain } from '@/app/_contexts/chain-context'
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui'
import ChainIcon from '@/app/(app)/_components/chain-icon'

const ChainSelector: React.FC = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { currentChain } = useChain()

    // Get current chain from URL or context
    const chainParam = searchParams.get('chain')
    const currentChainFromUrl = chainParam && (chainParam === 'solana' || chainParam === 'bsc' || chainParam === 'base') 
        ? chainParam 
        : currentChain

    const handleChainChange = (value: string) => {
        const newChain = value as 'solana' | 'bsc' | 'base'
        
        // Update URL only, not global context
        const params = new URLSearchParams(searchParams.toString())
        params.set('chain', newChain)
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Chain:</span>
            <Select
                value={currentChainFromUrl}
                onValueChange={handleChainChange}
            >
                <SelectTrigger className="w-[120px] h-8">
                    <SelectValue placeholder="Select chain" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="solana">
                        <div className="flex items-center gap-2">
                            <ChainIcon chain="solana" className="size-4" />
                            <span>Solana</span>
                        </div>
                    </SelectItem>
                    <SelectItem value="bsc">
                        <div className="flex items-center gap-2">
                            <ChainIcon chain="bsc" className="size-4" />
                            <span>BSC</span>
                        </div>
                    </SelectItem>
                    <SelectItem value="base">
                        <div className="flex items-center gap-2">
                            <ChainIcon chain="base" className="size-4" />
                            <span>Base</span>
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}

export default ChainSelector 