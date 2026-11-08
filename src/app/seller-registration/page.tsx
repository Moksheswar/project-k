import { Suspense } from "react";
import SellerRegistrationForm from "./SellerRegistrationForm";

export default function SellerRegistrationPage() {
  return (
    <Suspense fallback={<div>Loading registration form...</div>}>
      <SellerRegistrationForm />
    </Suspense>
  );
}