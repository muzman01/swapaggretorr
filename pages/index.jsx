// Files and modules

import WindowSizeContext from "../state/WindowSizeContext.js"
import SwapInterface from "../components/swap/SwapInterface.jsx"
import SwapSettings from "../components/swap/SwapSettings.jsx"
import RouterOutputs from "../components/swap/RouterOutputs.jsx"
import { useContext } from "react"
import EthereumContext from "../state/EthereumContext.js"

// Swap page

const Swap = () => {
    // Responsive window size

    const { width } = useContext(WindowSizeContext)
    const { chain, account } = useContext(EthereumContext)


    // Component

    return (
        <>
            <div className="content">
                {width > 700 ? (
                    <>
                        <div className="top">
                            <SwapInterface></SwapInterface>
                            <SwapSettings></SwapSettings>
                        </div>
                        <RouterOutputs></RouterOutputs>
                    </>
                ) : (
                    <>
                        <SwapInterface></SwapInterface>
                        <div className="divider"></div>
                        <RouterOutputs></RouterOutputs>
                        <div className="divider"></div>
                        <SwapSettings></SwapSettings>
                        <div className="divider"></div>
                    </>
                )}
               <div className="leftbody"><iframe width="800" height="600" allowFullScreen frameBorder="0" scrolling="no" src={`https://coinbrain.com/embed/${chain?.swap.tokenIn?.address}?theme=light&chart=1&trades=1`}></iframe></div>
            </div>
            <style jsx>{`
            .leftbody{
                margin-left:330px;
                padding-top:10px;
                border-radius:30px !important;
               position:absolute !important;
            }
                .content {
                    width: 100%;
                    height: calc(100vh - 140px);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: flex-start;
                    padding-bottom: 20px;
                }

                .top {
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: flex-start;
                }

                .disclaimer {
                    width: 100%;
                    font-size: 0.9rem;
                    color: var(--gray);
                    margin-top: 24px;
                }

                @media only screen and (max-width: 1000px), (max-height: 900px) {
                    .content {
                        height: calc(100vh - 100px);
                    }

                    .disclaimer {
                        margin-top: 18px;
                    }
                }

                @media only screen and (max-width: 800px), (max-height: 800px) {
                    .disclaimer {
                        margin-top: 12px;
                    }
                }

                @media only screen and (max-width: 700px) {
                    .content {
                        height: auto;
                        align-items: center;
                        padding: 32px 0;
                    }

                    .divider {
                        width: 100%;
                        height: 0.5px;
                        background-color: var(--gray);
                        margin: 32px 0;
                    }

                    .disclaimer {
                        margin-top: 0;
                    }
                }
            `}</style>
        </>
    )
}

// Exports

export default Swap