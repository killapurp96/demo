import { useCallback } from "react";
import { axiosClient } from "../lib/axiosClient";
import type { PaymentDTO } from "../types/pi";

type PaymentMetadata = {
  productId: string;
};

type UsePaymentsArgs = {
  isAuthenticated: boolean;
  onRequireAuth: () => void;
};

export const usePayments = ({ isAuthenticated, onRequireAuth }: UsePaymentsArgs) => {
  const onReadyForServerApproval = useCallback((paymentId: string) => {
    setTimeout(() => {
      axiosClient.post(`/v2/payments/${paymentId}/approve`, {}, { headers: { Authorization: "Key asd" } });
    }, 5_000);
  }, []);

  const onReadyForServerCompletion = useCallback((paymentId: string, txid: string) => {
    setTimeout(() => {
      axiosClient.post(`/v2/payments/${paymentId}/complete`, { txid }, { headers: { Authorization: "Key asd" } });
    }, 10_000);
  }, []);

  const onCancel = useCallback(async (paymentId: string) => {
    await axiosClient.post("/payments/cancelled_payment", { paymentId });
  }, []);

  const onError = useCallback((error: Error, payment?: PaymentDTO) => {
    console.error("Payment error", error, payment);
  }, []);

  const orderProduct = useCallback(
    async (memo: string, amount: number, metadata: PaymentMetadata) => {
      if (!isAuthenticated) {
        onRequireAuth();
        return;
      }

      await window.Pi.createPayment(
        { amount, memo, metadata },
        {
          onReadyForServerApproval,
          onReadyForServerCompletion,
          onCancel,
          onError,
        }
      );
    },
    [isAuthenticated, onRequireAuth, onReadyForServerApproval, onReadyForServerCompletion, onCancel, onError]
  );

  return {
    orderProduct,
  };
};
