import { useMemo, useState } from "react";
import { DexContractConfig, SwalConfig } from "../config";
import { useContract } from 'wagmi';
import { ethers } from "ethers";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { awaitTransaction } from "../utils";
import useNotify from "./useNotify";
import { useWallet } from "./useWallet";

const ORDER_TYPES = ["Offer", "Trade"];
const TRANSACTION_TYPES = ["BUY", "SELL"];

export const useExchange = (selectedToken) => {
    const [loading, setLoading] = useState(false);
    const {
        signer,
        amountController,
        getDexBalance,
        getWalletBalance,
        refetch,
        isConnected,
        isLoading
    } = useWallet();

    const [price, setPrice] = useState("");
    const priceController = useMemo(() => ({
        value: price,
        setValue: setPrice
    }), [price])

    const [orderType, setOrderType] = useState(ORDER_TYPES[0]);
    const orderTypeController = useMemo(() => ({
        value: orderType,
        setValue: setOrderType
    }), [orderType])

    const { notifyLoading, dismissNotify, notifySuccess, notifyError } = useNotify();

    const dexContract = useContract({
        ...DexContractConfig,
        signerOrProvider: signer,
    });

    const createMarketOrder = async (buyOrSell) => {
        if (!dexContract) return;
        setLoading(true);
        const notifyId = notifyLoading("Transaction in progress...");
        try {
            if (!amountController.value || parseFloat(amountController.value) <= 0) {
                Swal.fire({
                    ...SwalConfig,
                    confirmButtonText: "GO BACK TO EXCHANGE",
                    confirmButtonText: "GO BACK TO EXCHANGE",
                    title: "Warning!",
                    text: `Enter a valid amount.`,
                    icon: "warning",
                    iconColor: "#FF9700",
                });
                notifyError(`Error: Zero or NULL value`)
                setLoading(false);
                return;
            }

            const response = await awaitTransaction(
                dexContract.createMarketOrder(
                    selectedToken.ticker,
                    ethers.utils.parseEther(amountController.value),
                    buyOrSell === TRANSACTION_TYPES[0] ? 0 : 1
                )
            );
            if (response.status) {
                Swal.fire({
                    ...SwalConfig,
                    confirmButtonText: "GO BACK TO EXCHANGE",
                    title: "Successful",
                    text: "Transaction Completed Successfully",
                    icon: "success",
                    iconColor: "#00ff22",
                    confirmButtonColor: "#00ff22"
                });
                refetch();
                amountController.setValue("");
                notifySuccess("Transaction Completed.")
            } else {
                Swal.fire({
                    ...SwalConfig,
                    confirmButtonText: "GO BACK TO EXCHANGE",
                    title: "Error",
                    text: response.error,
                    icon: "error",
                    iconColor: "#E56672",
                });
                notifyError(`Error: ${response.error}`)
            }

            setLoading(false);
            return response.status;
        } catch (error) {
            Swal.fire({
                ...SwalConfig,
                confirmButtonText: "GO BACK TO EXCHANGE",
                title: "Error",
                text: error,
                icon: "error",
                iconColor: "#E56672",
            });
            notifyError(`Error: ${error.message}`)
            setLoading(false);
            return false;
        } finally {
            dismissNotify(notifyId);
        }
    }

    const createLimitOrder = async (buyOrSell) => {
        if (!dexContract) return;
        setLoading(true);
        const notifyId = notifyLoading("Transaction in progress...");
        try {
            if (!amountController.value || parseFloat(amountController.value) <= 0) {
                Swal.fire({
                    ...SwalConfig,
                    confirmButtonText: "GO BACK TO EXCHANGE",
                    title: "Warning!",
                    text: `Enter a valid amount.`,
                    icon: "warning",
                    iconColor: "#FF9700",
                });
                notifyError(`Error: Zero or NULL value`)
                setLoading(false);
                return;
            }
            else if (!priceController.value || parseFloat(priceController.value) <= 0) {
                Swal.fire({
                    ...SwalConfig,
                    confirmButtonText: "GO BACK TO EXCHANGE",
                    title: "Warning!",
                    text: `Enter a valid price.`,
                    icon: "warning",
                    iconColor: "#FF9700",
                });
                notifyError(`Error: Zero or NULL value`)
                setLoading(false);
                return;
            }

            const response = await awaitTransaction(
                dexContract.createLimitOrder(
                    selectedToken.ticker,
                    ethers.utils.parseEther(amountController.value),
                    ethers.utils.parseEther(priceController.value),
                    buyOrSell === "BUY" ? 0 : 1
                )
            );
            if (response.status) {
                Swal.fire({
                    ...SwalConfig,
                    confirmButtonText: "GO BACK TO EXCHANGE",
                    title: "Successful",
                    text: "Transaction Completed Successfully",
                    icon: "success",
                    iconColor: "#00ff22",
                    confirmButtonColor: "#00ff22"
                });
                refetch();
                amountController.setValue("");
                priceController.setValue("");
                notifySuccess("Transaction Completed.")
            } else {
                Swal.fire({
                    ...SwalConfig,
                    confirmButtonText: "GO BACK TO EXCHANGE",
                    title: "Error",
                    text: response.error,
                    icon: "error",
                    iconColor: "#E56672",
                });
                notifyError(`Error: ${response.error}`)
            }

            setLoading(false);
            return response.status;
        } catch (error) {
            Swal.fire({
                ...SwalConfig,
                confirmButtonText: "GO BACK TO EXCHANGE",
                title: "Error",
                text: error,
                icon: "error",
                iconColor: "#E56672",
            });
            notifyError(`Error: ${error.message}`)
            setLoading(false);
            return false;
        } finally {
            dismissNotify(notifyId);
        }
    }

    return {
        ORDER_TYPES,
        TRANSACTION_TYPES,
        amountController,
        priceController,
        orderTypeController,
        getWalletBalance,
        getDexBalance,
        createMarketOrder,
        createLimitOrder,
        isConnected,
        isLoading: loading || isLoading
    }

};