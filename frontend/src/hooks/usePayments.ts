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
  const onReadyForServerApproval = useCallback(async (paymentId: string) => {
    await axiosClient.post("/payments/approve", { paymentId });
  }, []);

  const onReadyForServerCompletion = useCallback(async (paymentId: string, txid: string) => {
    await axiosClient.post("/payments/complete", { paymentId, txid });
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
