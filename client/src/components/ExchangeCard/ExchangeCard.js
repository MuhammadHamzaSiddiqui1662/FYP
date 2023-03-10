import { InputWithLabel } from "../InputWithLabel/InputWithLabel"
import { SelectToken } from "../SelectToken/SelectToken";
import { Tabs } from "../Tabs/Tabs";
import { useExchange } from "../../hooks/useExchange";
import { CircularLoader } from "../CircularLoader/CircularLoader";
import "./ExchangeCard.css";
import { ethers } from "ethers";

export const ExchangeCard = ({ tokens, selectedToken, handleTokenChange }) => {
    const {
        createMarketOrder,
        createLimitOrder,
        TRANSACTION_TYPES,
        ORDER_TYPES,
        orderTypeController,
        amountController,
        priceController,
        getDexBalance,
        isLoading
    } = useExchange(selectedToken);
    return (
        <div className="exchangeCard">
            <h2 className="exchangeHeading">Exchange</h2>
            <div></div>
            <Tabs tabs={ORDER_TYPES} selectedTab={orderTypeController.value} setSelectedTab={orderTypeController.setValue} />
            <div></div>
            {
                orderTypeController.value === ORDER_TYPES[0] &&
                <InputWithLabel
                    label={"Price"}
                    type={"number"}
                    fullwidth={true}
                    value={priceController.value}
                    setValue={priceController.setValue}
                    placeholder={"Enter Desired Price..."}
                />
            }
            <InputWithLabel
                label={"Amount"}
                type={"number"}
                fullwidth={true}
                value={amountController.value}
                setValue={amountController.setValue}
                placeholder={"Enter Amount..."}
            >
                <p className="tokenBalance">{`${selectedToken.symbol} Balance: ${ethers.utils.formatEther(getDexBalance(selectedToken.symbol))}`}</p>
                <SelectToken tokens={tokens} selectedToken={selectedToken} handleTokenChange={handleTokenChange} position="absolute" />
            </InputWithLabel>
            <div className="buttonSection" >
                <button
                    className="outlinedButton fullwidth"
                    type="button"
                    onClick={
                        () => orderTypeController.value === ORDER_TYPES[0] ?
                            createLimitOrder(TRANSACTION_TYPES[1]) :
                            createMarketOrder(TRANSACTION_TYPES[1])
                    } >
                    {
                        isLoading ?
                            <CircularLoader size={24} /> :
                            TRANSACTION_TYPES[1]
                    }
                </button>
                <button
                    className="filledButton fullwidth"
                    type="button"
                    onClick={
                        () => orderTypeController.value === ORDER_TYPES[0] ?
                            createLimitOrder(TRANSACTION_TYPES[0]) :
                            createMarketOrder(TRANSACTION_TYPES[0])
                    } >
                    {
                        isLoading ?
                            <CircularLoader size={24} /> :
                            TRANSACTION_TYPES[0]
                    }
                </button>
            </div>
        </div>
    )
}