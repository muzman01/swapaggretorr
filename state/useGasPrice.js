// Files and modules

import { BN } from "./EthereumContext.js"
import axios from "axios"
import { useState, useEffect, useRef } from "react"

// Chain gas price hook

function useGasPrice(chainId, chain) {
    // Gas state data

    const [ slow, setSlow ] = useState(0)
    const [ normal, setNormal ] = useState(0)
    const [ fast, setFast ] = useState(0)
    const [ priorityFee, setPriorityFee ] = useState({
        slow: 0,
        default: 0,
        fast: 0
    })
    const initialized = useRef(false)

    const gasPrice = {
        slow,
        default: normal,
        fast,
        priorityFee,
        getPriorityFee,
        getGasParameters
    }

    // Update gas prices

    async function updateGas() {
        try {
            const key = chain.api.keys[Math.floor(Math.random() * chain.api.keys.length)]
            const data = (await axios(`${chain.api.endpoint}/api?module=gastracker&action=gasoracle&apikey=${key}`)).data.result
            const slow = Math.floor(+data.SafeGasPrice * 100) / 100
            const normal = Math.round(+data.ProposeGasPrice * 100) / 100
            const fast = Math.ceil(+data.FastGasPrice * 100) / 100
            if (isNaN(slow) || isNaN(normal) || isNaN(fast)) return

            setSlow(slow)
            setNormal(normal)
            setFast(fast)

            if (chainId === "0x1") {
                setPriorityFee({
                    slow: 1,
                    default: 2,
                    fast: fast > 200 ? 6 : 4
                })
            } else if (chainId === "0x89") {
                setPriorityFee({
                    slow: Math.min(slow > 30 ? 10 : 2, slow),
                    default: Math.min(normal > 35 ? 20 : 4, normal),
                    fast: fast
                })
            } else if (chainId === "0xfa") {
                setPriorityFee({
                    slow: Math.min(slow > 1000 ? 100 : 20, slow),
                    default: Math.min(normal > 1000 ? 200 : 50, normal),
                    fast: fast
                })
            } else if (chainId === "0xa86a") {
                setPriorityFee({
                    slow: 10 ** -6,
                    default: 10 ** -6,
                    fast: Math.min(fast > 100 ? 15 : 5, fast)
                })
            }
        } catch(error) {
            console.error(error)
        }
    }

    // Calculate priority fee

    function getPriorityFee(gas) {
        if (typeof gas !== "number") {
            return priorityFee[gas]
        }
        if (gas <= slow) {
            return priorityFee.slow
        } else if (gas <= normal) {
            return priorityFee.default
        } else {
            return priorityFee.fast
        }
    }

    // Calculate gas parameters

    function getGasParameters(gas) {
        if (gas === "default") return {}
        if (["0x1", "0xfa", "0x89", "0xa86a"].includes(chainId)) {
            return {
                type: "2",
                maxFeePerGas: BN((gasPrice[gas] || gas) * 10 ** 6).mul(BN(10).pow(BN(3))).toString(16),
                maxPriorityFeePerGas: BN(getPriorityFee(gas) * 10 ** 6).mul(BN(10).pow(BN(3))).toString(16)
            }
        } else {
            return {
                type: "1",
                gasPrice: BN((gasPrice[gas] || gas) * 10 ** 6).mul(BN(10).pow(BN(3))).toString(16)
            }
        }
    }

    // Update gas price fetch loop on chain changes

    useEffect(() => {
        if (chain.id === chainId) {
            updateGas()
        } else if (!initialized.current) {
            initialized.current = true
            updateGas()
        }
        const interval = setInterval(updateGas, chain.id === chainId ? 5000 : 20000)
        return () => clearInterval(interval)
    }, [chain])

    // Gas data

    return gasPrice
}

// Exports

export default useGasPrice