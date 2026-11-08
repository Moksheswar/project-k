import { Suspense } from "react";
import BuyerRegistrationForm from "./BuyerRegistrationForm";

export default function BuyerRegistrationPage() {
  return (
    <Suspense fallback={<div>Loading registration form...</div>}>
      <BuyerRegistrationForm />
    </Suspense>
  );
}