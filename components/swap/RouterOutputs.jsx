// Files and modules

import ThemeContext from "../../state/ThemeContext.js"
import WindowSizeContext from "../../state/WindowSizeContext.js"
import EthereumContext from "../../state/EthereumContext.js"
import PriceContext from "../../state/PriceContext.js"
import { parse, format, formatNumber } from "../../helpers/number.js"
import { useContext } from "react"

// Router outputs component

const RouterOutputs = () => {
    // Swap data

    const { theme } = useContext(ThemeContext)
    const { chain } = useContext(EthereumContext)
    const prices = useContext(PriceContext)
    const { width } = useContext(WindowSizeContext)
    const swap = chain.swap

    // Get token value

    function getTokenValue(token, amount) {
        if (!prices[token.symbol]) return 0
        return +parse(amount, token.decimals) * prices[token.symbol]
    }

    // Replace token image with default unknown

    function defaultImage(event) {
        if (event.currentTarget.src.endsWith("unknown.svg") || event.currentTarget.src.endsWith("unknown-white.svg")) return
        event.currentTarget.src = theme === "dark" ? "/tokens/unknown-white.svg" : "/tokens/unknown.svg"
    }

    // Component

    return (
        <>
    
        </>
    )
}

// Exports

export default RouterOutputs