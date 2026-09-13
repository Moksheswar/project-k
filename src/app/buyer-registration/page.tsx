"use client";

import {
  FormEvent,
  useEffect,
  useState,
  useRef,
} from "react";

import {
  onAuthStateChanged,
  User,
} from "firebase/auth";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { useRouter, useSearchParams } from "next/navigation";

import { auth, db } from "../../lib/firebase";
import Header from "../components/Header";

/* =========================================================
   TYPES
========================================================= */

type ProductDetails = {
  productCategory: string;
  productCategoryOther: string;

  productName: string;
  productDescription: string;

  qualitySpecifications: string;

  quantity: string;
  quantityUnit: string;
  quantityUnitOther: string;

  priceMin: string;
  priceMax: string;

  currency: string;
  currencyOther: string;

  priceUnit: string;
  priceUnitOther: string;
};

type LocationDetails = {
  preferredSourceLocation: string;
  preferredSourceCountry: string;
  preferredSupplierLocation: string;

  deliveryState: string;
  deliveryCity: string;
  deliveryPin: string;
  deliveryPort: string;

  additionalRequirements: string;

  sampleRequirement: string;

  supplyFrequency: string;
};

type ContactDetails = {
  fullName: string;

  role: string;
  roleOther: string;

  email: string;

  mobileCountryCode: string;
  mobileNumber: string;

  preferredContactMethod: string;

  alternateContactName: string;
  alternateContactNumber: string;

  contactAddress: string;
};

/* =========================================================
   INITIAL VALUES
========================================================= */

const initialProductDetails: ProductDetails = {
  productCategory: "",
  productCategoryOther: "",

  productName: "",
  productDescription: "",

  qualitySpecifications: "",

  quantity: "",
  quantityUnit: "",
  quantityUnitOther: "",

  priceMin: "",
  priceMax: "",

  currency: "",
  currencyOther: "",

  priceUnit: "",
  priceUnitOther: "",
};

const initialLocationDetails: LocationDetails = {
  preferredSourceLocation: "",
  preferredSourceCountry: "",
  preferredSupplierLocation: "",

  deliveryState: "",
  deliveryCity: "",
  deliveryPin: "",
  deliveryPort: "",

  additionalRequirements: "",

  sampleRequirement: "",

  supplyFrequency: "",
};

const initialContactDetails: ContactDetails = {
  fullName: "",

  role: "",
  roleOther: "",

  email: "",

  mobileCountryCode: "+91",
  mobileNumber: "",

  preferredContactMethod: "",

  alternateContactName: "",
  alternateContactNumber: "",

  contactAddress: "",
};

/* =========================================================
   OPTIONS - PRODUCT CATEGORY
========================================================= */

const productCategoryOptions = [
  "Agriculture Products",
  "Fruits & Vegetables",
  "Food & Grocery Products",
  "Spices & Dry Fruits",
  "Grains & Cereals",
  "Pulses & Legumes",
  "Edible Oils",
  "Other Food Products",
  "Furniture",
  "Home & Kitchen Products",
  "Electronics & Electrical Products",
  "Industrial Products",
  "Machinery & Equipment",
  "Construction Materials",
  "Chemicals & Raw Materials",
  "Textiles & Fabrics",
  "Garments & Apparel",
  "Leather Products",
  "Handicrafts & Decorative Products",
  "Packaging Materials",
  "Automobile / Auto Components",
  "Medical / Healthcare Products",
  "Beauty & Personal Care Products",
  "Other",
];

/* =========================================================
   OPTIONS - QUANTITY
========================================================= */

const quantityUnitOptions = [
  "Kilograms (KG)",
  "Grams (G)",
  "Metric Tons (MT)",
  "Tons",
  "Liters (L)",
  "Milliliters (ML)",
  "Pieces",
  "Units",
  "Boxes",
  "Cartons",
  "Containers",
  "Sets",
  "Pairs",
  "Other",
];

/* =========================================================
   OPTIONS - CURRENCY
========================================================= */

const currencyOptions = [
  "INR",
  "USD",
  "EUR",
  "GBP",
  "AED",
  "Other",
];

/* =========================================================
   OPTIONS - PRICE UNIT
========================================================= */

const priceUnitOptions = [
  "Per KG",
  "Per Gram",
  "Per Liter",
  "Per Piece",
  "Per Unit",
  "Per Box",
  "Per Carton",
  "Per Ton",
  "Per Metric Ton",
  "Per Container",
  "Other",
];

/* =========================================================
   OPTIONS - CONTACT
========================================================= */

const roleOptions = [
  "Owner",
  "Farmer",
  "Director",
  "Partner",
  "Export Manager",
  "Sales Manager",
  "Authorized Representative",
  "Other",
];

const contactMethodOptions = [
  "Phone Call",
  "Email",
];

/* =========================================================
   OPTIONS - FREQUENCY
========================================================= */

const supplyFrequencyOptions = [
  "One-time purchase",
  "Monthly",
  "Every 2–3 months",
  "Quarterly",
  "Every 6 months",
  "Yearly",
  "Regular / Ongoing supply",
  "Not sure",
];

/* =========================================================
   COUNTRY CODES
========================================================= */

const countryCodeOptions = [
  { country: "India", code: "+91" },
  { country: "United States", code: "+1" },
  { country: "Canada", code: "+1" },
  { country: "United Kingdom", code: "+44" },
  { country: "United Arab Emirates", code: "+971" },
  { country: "Singapore", code: "+65" },
  { country: "Australia", code: "+61" },
  { country: "Germany", code: "+49" },
  { country: "France", code: "+33" },
  { country: "Japan", code: "+81" },
  { country: "China", code: "+86" },
  { country: "South Africa", code: "+27" },
  { country: "Brazil", code: "+55" },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function BuyerRegistrationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* =======================================================
     AUTH
  ======================================================= */

  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  /* =======================================================
     CURRENT STEP
  ======================================================= */

  const [currentStep, setCurrentStep] = useState(1);

  const contentRef = useRef<HTMLDivElement>(null);

  /* =======================================================
     FORM DATA
  ======================================================= */

  const [productDetails, setProductDetails] =
    useState<ProductDetails>(
      initialProductDetails
    );

  const [locationDetails, setLocationDetails] =
    useState<LocationDetails>(
      initialLocationDetails
    );

  const [contactDetails, setContactDetails] =
    useState<ContactDetails>(
      initialContactDetails
    );

  const resetRegistration = () => {
    setCurrentStep(1);

    setProductDetails({
      ...initialProductDetails,
    });

    setLocationDetails({
      ...initialLocationDetails,
    });

    setContactDetails({
      ...initialContactDetails,
    });

    setDeclarationAccepted(false);

    setMessage("");

    setSaving(false);

    setSubmitted(false);

    setRequestId("");
  };

  /* =======================================================
     UI
  ======================================================= */

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("");

  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  /* =======================================================
     AUTH CHECK
  ======================================================= */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        if (!currentUser) {
          router.push("/login");
          return;
        }

        setUser(currentUser);
        setCheckingAuth(false);
      }
    );

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    contentRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentStep]);

  useEffect(() => {
    if (searchParams.get("new") === "true") {
      resetRegistration();

      router.replace("/buyer-registration");
    }
  }, [searchParams, router]);

  /* =======================================================
     CONDITIONAL LOGIC
  ======================================================= */

  const showProductCategoryOther =
    productDetails.productCategory === "Other";

  const showQuantityUnitOther =
    productDetails.quantityUnit === "Other";

  const showCurrencyOther =
    productDetails.currency === "Other";

  const showPriceUnitOther =
    productDetails.priceUnit === "Other";

  const showRoleOther =
    contactDetails.role === "Other";

  const showSourceLocation =
    locationDetails.preferredSourceLocation === "Yes";

  /* =======================================================
     PRODUCT CHANGE
  ======================================================= */

  const handleProductChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setProductDetails((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =======================================================
     LOCATION CHANGE
  ======================================================= */

  const handleLocationChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setLocationDetails((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =======================================================
     CONTACT CHANGE
  ======================================================= */

  const handleContactChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setContactDetails((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =======================================================
     VALIDATE STEP 1
  ======================================================= */

  const validateProductDetails = () => {
    if (!productDetails.productCategory) {
      setMessage(
        "Please select Product Category."
      );
      return false;
    }

    if (
      showProductCategoryOther &&
      !productDetails.productCategoryOther.trim()
    ) {
      setMessage(
        "Please specify the Product Category."
      );
      return false;
    }

    if (!productDetails.productName.trim()) {
      setMessage(
        "Please enter the product you are looking for."
      );
      return false;
    }

    // if (
    //   !productDetails.productDescription.trim()
    // ) {
    //   setMessage(
    //     "Please enter Product Details."
    //   );
    //   return false;
    // }

    // if (
    //   !productDetails.qualitySpecifications.trim()
    // ) {
    //   setMessage(
    //     "Please enter the required Quality / Specifications."
    //   );
    //   return false;
    // }

    if (!productDetails.quantity) {
      setMessage(
        "Please enter the Quantity Requirement."
      );
      return false;
    }

    if (Number(productDetails.quantity) <= 0) {
      setMessage(
        "Quantity must be greater than zero."
      );
      return false;
    }

    if (!productDetails.quantityUnit) {
      setMessage(
        "Please select Quantity Unit."
      );
      return false;
    }

    if (
      showQuantityUnitOther &&
      !productDetails.quantityUnitOther.trim()
    ) {
      setMessage(
        "Please specify the Quantity Unit."
      );
      return false;
    }

    if (!productDetails.priceMin) {
      setMessage(
        "Please enter Minimum Expected Price."
      );
      return false;
    }

    if (!productDetails.priceMax) {
      setMessage(
        "Please enter Maximum Expected Price."
      );
      return false;
    }

    if (
      Number(productDetails.priceMin) >
      Number(productDetails.priceMax)
    ) {
      setMessage(
        "Minimum price cannot be greater than maximum price."
      );
      return false;
    }

    if (!productDetails.currency) {
      setMessage(
        "Please select Currency."
      );
      return false;
    }

    if (
      showCurrencyOther &&
      !productDetails.currencyOther.trim()
    ) {
      setMessage(
        "Please specify Currency."
      );
      return false;
    }

    if (!productDetails.priceUnit) {
      setMessage(
        "Please select Price Unit."
      );
      return false;
    }

    if (
      showPriceUnitOther &&
      !productDetails.priceUnitOther.trim()
    ) {
      setMessage(
        "Please specify Price Unit."
      );
      return false;
    }

    return true;
  };

  /* =======================================================
     VALIDATE STEP 2
  ======================================================= */

  const validateLocationDetails = () => {
    if (
      !locationDetails.preferredSourceLocation
    ) {
      setMessage(
        "Please select whether you have a preferred source location."
      );
      return false;
    }

    // if (
    //   showSourceLocation &&
    //   !locationDetails.preferredSourceCountry.trim() &&
    //   !locationDetails.preferredSupplierLocation.trim()
    // ) {
    //   setMessage(
    //     "Please enter the preferred country or supplier location."
    //   );
    //   return false;
    // }

    // if (!locationDetails.deliveryState.trim()) {
    //   setMessage(
    //     "Please enter Delivery State."
    //   );
    //   return false;
    // }

    // if (!locationDetails.deliveryCity.trim()) {
    //   setMessage(
    //     "Please enter Delivery City."
    //   );
    //   return false;
    // }

    if (!locationDetails.deliveryPin.trim()) {
      setMessage(
        "Please enter Delivery PIN."
      );
      return false;
    }

    // if (!locationDetails.deliveryPort.trim()) {
    //   setMessage(
    //     "Please enter Delivery Port."
    //   );
    //   return false;
    // }

    if (!locationDetails.sampleRequirement) {
      setMessage(
        "Please select Sample Requirement."
      );
      return false;
    }

    if (!locationDetails.supplyFrequency) {
      setMessage(
        "Please select Supply Frequency."
      );
      return false;
    }

    return true;
  };

  /* =======================================================
     VALIDATE STEP 3
  ======================================================= */

  const validateContactDetails = () => {
    if (!contactDetails.fullName.trim()) {
      setMessage(
        "Please enter Full Name."
      );
      return false;
    }

    if (!contactDetails.role) {
      setMessage(
        "Please select Role / Designation."
      );
      return false;
    }

    if (
      showRoleOther &&
      !contactDetails.roleOther.trim()
    ) {
      setMessage(
        "Please specify the Role / Designation."
      );
      return false;
    }

    if (!contactDetails.email.trim()) {
      setMessage(
        "Please enter Email Address."
      );
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        contactDetails.email.trim()
      )
    ) {
      setMessage(
        "Please enter a valid Email Address."
      );
      return false;
    }

    if (!contactDetails.mobileNumber.trim()) {
      setMessage(
        "Please enter Mobile Number."
      );
      return false;
    }

    const phoneRegex =
      /^[0-9\s\-()]{7,20}$/;

    if (
      !phoneRegex.test(
        contactDetails.mobileNumber.trim()
      )
    ) {
      setMessage(
        "Please enter a valid Mobile Number."
      );
      return false;
    }

    if (
      !contactDetails.preferredContactMethod
    ) {
      setMessage(
        "Please select Preferred Contact Method."
      );
      return false;
    }

    const alternateName =
      contactDetails.alternateContactName.trim();

    const alternateNumber =
      contactDetails.alternateContactNumber.trim();

    if (
      alternateName &&
      !alternateNumber
    ) {
      setMessage(
        "Please enter Alternate Contact Number."
      );
      return false;
    }

    if (
      !alternateName &&
      alternateNumber
    ) {
      setMessage(
        "Please enter Alternate Contact Name."
      );
      return false;
    }

    return true;
  };

  /* =======================================================
     SCROLL TO TOP
  ======================================================= */

  const scrollToTop = () => {
    const contentArea =
      document.getElementById(
        "buyer-registration-content"
      );

    if (contentArea) {
      contentArea.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  /* =======================================================
     GO TO STEP
  ======================================================= */

  const goToStep = (step: number) => {
    setCurrentStep(step);
    setMessage("");

    setTimeout(() => {
      scrollToTop();
    }, 50);
  };

  /* =======================================================
     NEXT
  ======================================================= */

  const handleNext = (
    event: FormEvent
  ) => {
    event.preventDefault();

    setMessage("");

    if (currentStep === 1) {
      if (!validateProductDetails()) {
        return;
      }

      goToStep(2);
      return;
    }

    if (currentStep === 2) {
      if (!validateLocationDetails()) {
        return;
      }

      goToStep(3);
      return;
    }

    if (currentStep === 3) {
      if (!validateContactDetails()) {
        return;
      }

      goToStep(4);
      return;
    }
  };

  /* =======================================================
     PREVIOUS
  ======================================================= */

  const handlePrevious = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  /* =======================================================
     REQUEST ID
  ======================================================= */

  const generateRequestId = () => {
    const number =
      Math.floor(
        100000 +
          Math.random() * 900000
      );

    return `SKY-IMP-${number}`;
  };

  /* =======================================================
     FINAL SUBMIT
  ======================================================= */

  const handleFinalSubmit = async () => {

    if (!user) {
      setMessage(
        "You must be logged in to submit the request."
      );
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const generatedRequestId =
        generateRequestId();

      /* ==========================================
         FIREBASE INSERT
      ========================================== */

      await addDoc(
        collection(
          db,
          "buyerRegistrations"
        ),
        {
          status: "In-progress",
          requestId:
            generatedRequestId,

          /* =====================================
             PRODUCT DETAILS
          ===================================== */

          productDetails: {
            productCategory:
              productDetails.productCategory,

            productCategoryOther:
              productDetails.productCategoryOther.trim(),

            productName:
              productDetails.productName.trim(),

            productDescription:
              productDetails.productDescription.trim(),

            qualitySpecifications:
              productDetails.qualitySpecifications.trim(),

            quantity:
              Number(productDetails.quantity),

            quantityUnit:
              productDetails.quantityUnit,

            quantityUnitOther:
              productDetails.quantityUnitOther.trim(),

            priceMin:
              Number(productDetails.priceMin),

            priceMax:
              Number(productDetails.priceMax),

            currency:
              productDetails.currency,

            currencyOther:
              productDetails.currencyOther.trim(),

            priceUnit:
              productDetails.priceUnit,

            priceUnitOther:
              productDetails.priceUnitOther.trim(),
          },

          /* =====================================
             LOCATION DETAILS
          ===================================== */

          locationDetails: {
            preferredSourceLocation:
              locationDetails.preferredSourceLocation,

            preferredSourceCountry:
              locationDetails.preferredSourceCountry.trim(),

            preferredSupplierLocation:
              locationDetails.preferredSupplierLocation.trim(),

            deliveryState:
              locationDetails.deliveryState.trim(),

            deliveryCity:
              locationDetails.deliveryCity.trim(),

            deliveryPin:
              locationDetails.deliveryPin.trim(),

            deliveryPort:
              locationDetails.deliveryPort.trim(),

            additionalRequirements:
              locationDetails.additionalRequirements.trim(),

            sampleRequirement:
              locationDetails.sampleRequirement,

            supplyFrequency:
              locationDetails.supplyFrequency,
          },

          /* =====================================
             CONTACT DETAILS
          ===================================== */

          contactDetails: {
            fullName:
              contactDetails.fullName.trim(),

            role:
              contactDetails.role,

            roleOther:
              contactDetails.roleOther.trim(),

            email:
              contactDetails.email.trim(),

            mobileCountryCode:
              contactDetails.mobileCountryCode,

            mobileNumber:
              contactDetails.mobileNumber.trim(),

            preferredContactMethod:
              contactDetails.preferredContactMethod,

            alternateContactName:
              contactDetails.alternateContactName.trim(),

            alternateContactNumber:
              contactDetails.alternateContactNumber.trim(),

            contactAddress:
              contactDetails.contactAddress.trim(),
          },

          /* =====================================
             USER INFORMATION
          ===================================== */

          userId: user.uid,

          userEmail:
            user.email ?? "",

          /* =====================================
             STATUS
          ===================================== */

          registrationStatus:
            "submitted",

          currentStep: 4,

          /* =====================================
             TIMESTAMPS
          ===================================== */

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),
        }
      );

      /* ==========================================
         SEND EMAILS
      ========================================== */

      try {
        const emailResponse = await fetch(
          "/api/send-buyer-registration",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              requestId: generatedRequestId,

              name: contactDetails.fullName,

              email: contactDetails.email,

              phone: `${contactDetails.mobileCountryCode} ${contactDetails.mobileNumber}`,

              productName: productDetails.productName,

              productCategory: productDetails.productCategory,

              quantity: `${productDetails.quantity} ${productDetails.quantityUnit}`,

              currency: productDetails.currency,

              priceRange: `${productDetails.priceMin} - ${productDetails.priceMax}`,

              priceUnit: productDetails.priceUnit,

              deliveryState: locationDetails.deliveryState,

              deliveryCity: locationDetails.deliveryCity,

              deliveryPin: locationDetails.deliveryPin,

              deliveryPort: locationDetails.deliveryPort,

              sampleRequirement: locationDetails.sampleRequirement,

              supplyFrequency: locationDetails.supplyFrequency,
            }),
          }
        );

        const emailResult = await emailResponse.json();

        if (!emailResponse.ok || !emailResult.success) {
          console.error(
            "Buyer registration email failed:",
            emailResult
          );
        }
      } catch (emailError) {
        console.error(
          "Buyer email request failed:",
          emailError
        );
      }

      /* ==========================================
         SUCCESS
      ========================================== */

      setRequestId(
        generatedRequestId
      );

      setSubmitted(true);

    } catch (error) {
      console.error(
        "Error submitting buyer registration:",
        error
      );

      setMessage(
        "Unable to submit the import request. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     AUTH LOADING
  ======================================================= */

  if (checkingAuth || !user) {
    return null;
  }

  /* =======================================================
     SUCCESS SCREEN
  ======================================================= */

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#1f1f1f]">

        <Header user={user} />

        <main className="flex min-h-[calc(100vh-72px)] items-center justify-center p-6">

          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-10 text-center shadow-xl">

            {/* CLOSE BUTTON */}

            <button
              type="button"
              onClick={() =>
                router.push("/home")
              }
              className="
                absolute
                right-5
                top-5
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                text-xl
                text-gray-500
                transition
                hover:bg-gray-100
                hover:text-gray-800
              "
              aria-label="Close"
            >
              ×
            </button>

            {/* SUCCESS ICON */}

            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">

              <span className="text-3xl text-[#06752e]">
                ✓
              </span>

            </div>

            <h1 className="text-2xl font-bold text-[#03471c] md:text-3xl">
              IMPORT REQUEST SUBMITTED SUCCESSFULLY
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-600">
              Thank you for registering with
              Skyma as a buyer. Our team will
              review your product requirements,
              quantity, pricing, destination,
              and other information and contact
              you using the details provided.
            </p>

            {/* REQUEST ID */}

            <div className="mx-auto mt-8 max-w-md rounded-xl border border-green-200 bg-green-50 p-6">

              <p className="text-sm text-gray-600">
                Request ID
              </p>

              <p className="mt-2 text-2xl font-bold tracking-wide text-[#03471c]">
                {requestId}
              </p>

              <p className="mt-3 text-xs text-gray-500">
                Please keep this Request ID
                for future communication.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                router.push("/home")
              }
              className="
                mt-8
                rounded-lg
                bg-[#06752e]
                px-8
                py-3
                font-medium
                text-white
                transition
                hover:bg-[#045d24]
              "
            >
              Go to Home
            </button>

          </div>

        </main>

      </div>
    );
  }

  /* =======================================================
     STEPS
  ======================================================= */

  const steps = [
    "Product Details",
    "Location & Other Information",
    "Contact Details",
    "Review & Submit",
  ];

  /* =======================================================
     RETURN UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#1f1f1f] pt-[72px]">

      <Header user={user} />

      {/* <main className="p-4 md:p-8">

        <div
            className="
            mx-auto
            flex
            h-[767px]
            max-h-[calc(100vh-120px)]
            max-w-6xl
            overflow-hidden
            rounded-3xl
            bg-white
            shadow-xl
            "
        > */}

        <main className="h-[calc(100vh-80px)] p-4 md:p-8">

        <div className="mx-auto flex h-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl">

          {/* =================================================
              LEFT SIDEBAR
          ================================================= */}

          <aside className="hidden w-[280px] shrink-0 bg-[#03471c] p-8 text-white md:block">

            <h2 className="mb-10 text-xl font-semibold">
              Buyer Registration
            </h2>

            <div className="relative">

              {steps.map(
                (step, index) => {

                  const stepNumber =
                    index + 1;

                  const active =
                    stepNumber ===
                    currentStep;

                  const completed =
                    stepNumber <
                    currentStep;

                  return (
                    <div
                      key={step}
                      className="relative flex min-h-[85px] items-start"
                    >

                      {index !==
                        steps.length - 1 && (
                        <div
                          className={`absolute left-[17px] top-9 h-full w-[2px] ${
                            completed
                              ? "bg-white"
                              : "bg-white/25"
                          }`}
                        />
                      )}

                      <div
                        className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${
                          active ||
                          completed
                            ? "border-white bg-white text-[#03471c]"
                            : "border-white/40 bg-[#03471c] text-white"
                        }`}
                      >
                        {String(
                          stepNumber
                        ).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <div className="ml-4 pt-2">

                        <p
                          className={`text-sm ${
                            active
                              ? "font-semibold text-white"
                              : completed
                              ? "text-white"
                              : "text-white/65"
                          }`}
                        >
                          {step}
                        </p>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </aside>

          {/* =================================================
              RIGHT CONTENT
          ================================================= */}

          {/* <section id="buyer-registration-content" className="min-w-0 flex-1 min-h-0 p-6 md:p-12"> */}
          <section className="flex min-h-0 min-w-0 flex-1 flex-col p-6 md:p-12">
            
            {/* PAGE TITLE */}

            <div className="mb-9">

              <h1 className="text-3xl font-bold text-gray-900">
                Register as a Buyer
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Submit your import requirements
                and connect with trusted suppliers.
              </p>

            </div>

            <div ref={contentRef} className="h-full overflow-y-auto pr-2">

            {/* =================================================
                STEP 1
            ================================================= */}

            {currentStep === 1 && (

              <form onSubmit={handleNext}>

                <h2 className="mb-7 text-xl font-semibold text-[#03471c]">
                  Product Details
                </h2>

                <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">

                  {/* PRODUCT CATEGORY */}

                  <div>

                    <label
                      htmlFor="productCategory"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Product Category
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <select
                      id="productCategory"
                      name="productCategory"
                      required
                      value={
                        productDetails.productCategory
                      }
                      onChange={
                        handleProductChange
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    >

                      <option value="">
                        Select product category
                      </option>

                      {productCategoryOptions.map(
                        (option) => (
                          <option
                            key={option}
                            value={option}
                          >
                            {option}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  {/* CATEGORY OTHER */}

                  {showProductCategoryOther && (

                    <div>

                      <label
                        htmlFor="productCategoryOther"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Specify Product Category
                        <span className="text-red-500">
                          {" "}*
                        </span>
                      </label>

                      <input
                        id="productCategoryOther"
                        name="productCategoryOther"
                        type="text"
                        required
                        value={
                          productDetails.productCategoryOther
                        }
                        onChange={
                          handleProductChange
                        }
                        placeholder="Specify product category"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                      />

                    </div>

                  )}

                  {/* PRODUCT NAME */}

                  <div className="md:col-span-2">

                    <label
                      htmlFor="productName"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      What product are you looking for?
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <input
                      id="productName"
                      name="productName"
                      type="text"
                      required
                      value={
                        productDetails.productName
                      }
                      onChange={
                        handleProductChange
                      }
                      placeholder="Enter exact product name"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                  </div>

                  {/* PRODUCT DETAILS */}

                  <div className="md:col-span-2">

                    <label
                      htmlFor="productDescription"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Product Details
                    </label>

                    <textarea
                      id="productDescription"
                      name="productDescription"
                      rows={4}
                      value={
                        productDetails.productDescription
                      }
                      onChange={
                        handleProductChange
                      }
                      placeholder="Describe the product you are looking for"
                      className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                  </div>

                  {/* QUALITY */}

                  <div className="md:col-span-2">

                    <label
                      htmlFor="qualitySpecifications"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Quality / Specifications
                    </label>

                    <textarea
                      id="qualitySpecifications"
                      name="qualitySpecifications"
                      rows={4}
                      value={
                        productDetails.qualitySpecifications
                      }
                      onChange={
                        handleProductChange
                      }
                      placeholder="Enter required quality, grade, specifications, standards, etc."
                      className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                  </div>

                  {/* QUANTITY */}

                  <div>

                    <label
                      htmlFor="quantity"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Quantity Requirement
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="0"
                      step="any"
                      required
                      value={
                        productDetails.quantity
                      }
                      onChange={
                        handleProductChange
                      }
                      placeholder="Enter quantity"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                  </div>

                  <div>

                    <label
                      htmlFor="quantityUnit"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Quantity Unit
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <select
                      id="quantityUnit"
                      name="quantityUnit"
                      required
                      value={
                        productDetails.quantityUnit
                      }
                      onChange={
                        handleProductChange
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    >

                      <option value="">
                        Select unit
                      </option>

                      {quantityUnitOptions.map(
                        (option) => (
                          <option
                            key={option}
                            value={option}
                          >
                            {option}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  {/* QUANTITY OTHER */}

                  {showQuantityUnitOther && (

                    <div>

                      <label
                        htmlFor="quantityUnitOther"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Specify Quantity Unit
                        <span className="text-red-500">
                          {" "}*
                        </span>
                      </label>

                      <input
                        id="quantityUnitOther"
                        name="quantityUnitOther"
                        type="text"
                        required
                        value={
                          productDetails.quantityUnitOther
                        }
                        onChange={
                          handleProductChange
                        }
                        placeholder="Specify unit"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                      />

                    </div>

                  )}

                  {/* PRICE MIN */}

                  <div>

                    <label
                      htmlFor="priceMin"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Expected Price — Minimum
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <input
                      id="priceMin"
                      name="priceMin"
                      type="number"
                      min="0"
                      step="any"
                      required
                      value={
                        productDetails.priceMin
                      }
                      onChange={
                        handleProductChange
                      }
                      placeholder="Minimum price"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                  </div>

                  {/* PRICE MAX */}

                  <div>

                    <label
                      htmlFor="priceMax"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Expected Price — Maximum
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <input
                      id="priceMax"
                      name="priceMax"
                      type="number"
                      min="0"
                      step="any"
                      required
                      value={
                        productDetails.priceMax
                      }
                      onChange={
                        handleProductChange
                      }
                      placeholder="Maximum price"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                  </div>

                  {/* CURRENCY */}

                  <div>

                    <label
                      htmlFor="currency"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Currency
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <select
                      id="currency"
                      name="currency"
                      required
                      value={
                        productDetails.currency
                      }
                      onChange={
                        handleProductChange
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    >

                      <option value="">
                        Select currency
                      </option>

                      {currencyOptions.map(
                        (option) => (
                          <option
                            key={option}
                            value={option}
                          >
                            {option}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  {/* CURRENCY OTHER */}

                  {showCurrencyOther && (

                    <div>

                      <label
                        htmlFor="currencyOther"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Specify Currency
                        <span className="text-red-500">
                          {" "}*
                        </span>
                      </label>

                      <input
                        id="currencyOther"
                        name="currencyOther"
                        type="text"
                        required
                        value={
                          productDetails.currencyOther
                        }
                        onChange={
                          handleProductChange
                        }
                        placeholder="Enter currency"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                      />

                    </div>

                  )}

                  {/* PRICE UNIT */}

                  <div>

                    <label
                      htmlFor="priceUnit"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Price Unit
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <select
                      id="priceUnit"
                      name="priceUnit"
                      required
                      value={
                        productDetails.priceUnit
                      }
                      onChange={
                        handleProductChange
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    >

                      <option value="">
                        Select price unit
                      </option>

                      {priceUnitOptions.map(
                        (option) => (
                          <option
                            key={option}
                            value={option}
                          >
                            {option}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  {/* PRICE UNIT OTHER */}

                  {showPriceUnitOther && (

                    <div>

                      <label
                        htmlFor="priceUnitOther"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Specify Price Unit
                        <span className="text-red-500">
                          {" "}*
                        </span>
                      </label>

                      <input
                        id="priceUnitOther"
                        name="priceUnitOther"
                        type="text"
                        required
                        value={
                          productDetails.priceUnitOther
                        }
                        onChange={
                          handleProductChange
                        }
                        placeholder="Specify price unit"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                      />

                    </div>

                  )}

                </div>

                {message && (
                  <div className="mt-6 rounded-lg bg-gray-100 p-3 text-sm text-gray-700">
                    {message}
                  </div>
                )}

                <div className="mt-10 flex justify-end">

                  <button
                    type="submit"
                    className="rounded-lg bg-[#06752e] px-7 py-3 font-medium text-white transition hover:bg-[#045d24]"
                  >
                    Save & Continue →
                  </button>

                </div>

              </form>
            )}

            {/* =================================================
                STEP 2
            ================================================= */}

            {currentStep === 2 && (

              <form onSubmit={handleNext}>

                <h2 className="mb-7 text-xl font-semibold text-[#03471c]">
                  Location & Other Information
                </h2>

                <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">

                  {/* SOURCE LOCATION */}

                  <div>

                    <label
                      htmlFor="preferredSourceLocation"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Do you have a preferred country or supplier location?
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <select
                      id="preferredSourceLocation"
                      name="preferredSourceLocation"
                      required
                      value={
                        locationDetails.preferredSourceLocation
                      }
                      onChange={
                        handleLocationChange
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    >

                      <option value="">
                        Select an option
                      </option>

                      <option value="Yes">
                        Yes
                      </option>

                      <option value="No">
                        No
                      </option>

                    </select>

                  </div>

                  {/* PREFERRED COUNTRY */}

                  {showSourceLocation && (

                    <div>

                      <label
                        htmlFor="preferredSourceCountry"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Preferred Source Country
                      </label>

                      <input
                        id="preferredSourceCountry"
                        name="preferredSourceCountry"
                        type="text"
                        value={
                          locationDetails.preferredSourceCountry
                        }
                        onChange={
                          handleLocationChange
                        }
                        placeholder="Enter country"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                      />

                    </div>

                  )}

                  {/* SUPPLIER LOCATION */}

                  {showSourceLocation && (

                    <div>

                      <label
                        htmlFor="preferredSupplierLocation"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Preferred Supplier Location
                      </label>

                      <input
                        id="preferredSupplierLocation"
                        name="preferredSupplierLocation"
                        type="text"
                        value={
                          locationDetails.preferredSupplierLocation
                        }
                        onChange={
                          handleLocationChange
                        }
                        placeholder="Country / city / region"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                      />

                    </div>

                  )}

                  {/* DELIVERY STATE */}

                  <div>

                    <label
                      htmlFor="deliveryState"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Delivery State
                    </label>

                    <input
                      id="deliveryState"
                      name="deliveryState"
                      type="text"
                      value={
                        locationDetails.deliveryState
                      }
                      onChange={
                        handleLocationChange
                      }
                      placeholder="Enter state"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                  </div>

                  {/* DELIVERY CITY */}

                  <div>

                    <label
                      htmlFor="deliveryCity"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Delivery City
                    </label>

                    <input
                      id="deliveryCity"
                      name="deliveryCity"
                      type="text"
                      value={
                        locationDetails.deliveryCity
                      }
                      onChange={
                        handleLocationChange
                      }
                      placeholder="Enter city"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                  </div>

                  {/* PIN */}

                  <div>

                    <label
                      htmlFor="deliveryPin"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      PIN
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <input
                      id="deliveryPin"
                      name="deliveryPin"
                      type="text"
                      required
                      value={
                        locationDetails.deliveryPin
                      }
                      onChange={
                        handleLocationChange
                      }
                      placeholder="Enter PIN code"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                  </div>

                  {/* PORT */}

                  <div>

                    <label
                      htmlFor="deliveryPort"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Port
                    </label>

                    <input
                      id="deliveryPort"
                      name="deliveryPort"
                      type="text"
                      value={
                        locationDetails.deliveryPort
                      }
                      onChange={
                        handleLocationChange
                      }
                      placeholder="Enter preferred port"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                  </div>

                  {/* ADDITIONAL REQUIREMENTS */}

                  <div className="md:col-span-2">

                    <label
                      htmlFor="additionalRequirements"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Additional Requirements
                    </label>

                    <textarea
                      id="additionalRequirements"
                      name="additionalRequirements"
                      rows={4}
                      value={
                        locationDetails.additionalRequirements
                      }
                      onChange={
                        handleLocationChange
                      }
                      placeholder="Enter any other requirements or instructions"
                      className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                  </div>

                  {/* SAMPLE */}

                  <div>

                    <label
                      htmlFor="sampleRequirement"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Do you require a product sample?
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <select
                      id="sampleRequirement"
                      name="sampleRequirement"
                      required
                      value={
                        locationDetails.sampleRequirement
                      }
                      onChange={
                        handleLocationChange
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    >

                      <option value="">
                        Select an option
                      </option>

                      <option value="Yes">
                        Yes
                      </option>

                      <option value="No">
                        No
                      </option>

                      <option value="Not Sure">
                        Not Sure
                      </option>

                    </select>

                  </div>

                  {/* FREQUENCY */}

                  <div>

                    <label
                      htmlFor="supplyFrequency"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Supply Frequency
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <select
                      id="supplyFrequency"
                      name="supplyFrequency"
                      required
                      value={
                        locationDetails.supplyFrequency
                      }
                      onChange={
                        handleLocationChange
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    >

                      <option value="">
                        Select frequency
                      </option>

                      {supplyFrequencyOptions.map(
                        (option) => (
                          <option
                            key={option}
                            value={option}
                          >
                            {option}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                </div>

                {message && (
                  <div className="mt-6 rounded-lg bg-gray-100 p-3 text-sm text-gray-700">
                    {message}
                  </div>
                )}

                <div className="mt-10 flex justify-between">

                  <button
                    type="button"
                    onClick={handlePrevious}
                    //className="rounded-lg border border-gray-300 px-7 py-3 font-medium text-gray-700 hover:bg-gray-50"
                    className="rounded-lg border border-[#06752e] px-7 py-3 font-medium text-[#06752e] transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ← Previous
                  </button>

                  <button
                    type="submit"
                    className="rounded-lg bg-[#06752e] px-7 py-3 font-medium text-white hover:bg-[#045d24]"
                  >
                    Save & Continue →
                  </button>

                </div>

              </form>
            )}

            {/* =================================================
                STEP 3
            ================================================= */}

            {currentStep === 3 && (

              <form onSubmit={handleNext}>

                <h2 className="mb-7 text-xl font-semibold text-[#03471c]">
                  Contact Details
                </h2>

                <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">

                  {/* FULL NAME */}

                  <div>

                    <label
                      htmlFor="fullName"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Full Name
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={
                        contactDetails.fullName
                      }
                      onChange={
                        handleContactChange
                      }
                      placeholder="Enter first and last name"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                  </div>

                  {/* ROLE */}

                  <div>

                    <label
                      htmlFor="role"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Role / Designation
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <select
                      id="role"
                      name="role"
                      required
                      value={
                        contactDetails.role
                      }
                      onChange={
                        handleContactChange
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    >

                      <option value="">
                        Select role / designation
                      </option>

                      {roleOptions.map(
                        (option) => (
                          <option
                            key={option}
                            value={option}
                          >
                            {option}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  {/* ROLE OTHER */}

                  {showRoleOther && (

                    <div>

                      <label
                        htmlFor="roleOther"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Specify Role / Designation
                        <span className="text-red-500">
                          {" "}*
                        </span>
                      </label>

                      <input
                        id="roleOther"
                        name="roleOther"
                        type="text"
                        required
                        value={
                          contactDetails.roleOther
                        }
                        onChange={
                          handleContactChange
                        }
                        placeholder="Specify role"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                      />

                    </div>

                  )}

                  {/* EMAIL */}

                  <div>

                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Email Address
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={
                        contactDetails.email
                      }
                      onChange={
                        handleContactChange
                      }
                      placeholder="Enter email address"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                  </div>

                  {/* PHONE */}

                  <div>

                    <label className="mb-2 block text-sm font-medium text-gray-700">

                      Mobile Number

                      <span className="text-red-500">
                        {" "}*
                      </span>

                    </label>

                    <div className="flex gap-2">

                      <select
                        name="mobileCountryCode"
                        value={
                          contactDetails.mobileCountryCode
                        }
                        onChange={
                          handleContactChange
                        }
                        className="w-[120px] rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900 outline-none focus:border-[#06752e]"
                      >

                        {countryCodeOptions.map(
                          (item) => (
                            <option
                              key={`${item.country}-${item.code}`}
                              value={item.code}
                            >
                              {item.code}
                            </option>
                          )
                        )}

                      </select>

                      <input
                        name="mobileNumber"
                        type="tel"
                        required
                        value={
                          contactDetails.mobileNumber
                        }
                        onChange={
                          handleContactChange
                        }
                        placeholder="Mobile number"
                        className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                      />

                    </div>

                  </div>

                  {/* CONTACT METHOD */}

                  <div>

                    <label
                      htmlFor="preferredContactMethod"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Preferred Contact Method
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <select
                      id="preferredContactMethod"
                      name="preferredContactMethod"
                      required
                      value={
                        contactDetails.preferredContactMethod
                      }
                      onChange={
                        handleContactChange
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    >

                      <option value="">
                        Select contact method
                      </option>

                      {contactMethodOptions.map(
                        (option) => (
                          <option
                            key={option}
                            value={option}
                          >
                            {option}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  {/* ALTERNATE NAME */}

                  <div>

                    <label
                      htmlFor="alternateContactName"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Alternate Contact Name
                    </label>

                    <input
                      id="alternateContactName"
                      name="alternateContactName"
                      type="text"
                      value={
                        contactDetails.alternateContactName
                      }
                      onChange={
                        handleContactChange
                      }
                      placeholder="Optional"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                  </div>

                  {/* ALTERNATE NUMBER */}

                  <div>

                    <label
                      htmlFor="alternateContactNumber"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Alternate Contact Number
                    </label>

                    <input
                      id="alternateContactNumber"
                      name="alternateContactNumber"
                      type="tel"
                      value={
                        contactDetails.alternateContactNumber
                      }
                      onChange={
                        handleContactChange
                      }
                      placeholder="Optional"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                  </div>

                  {/* CONTACT ADDRESS */}

                  <div className="md:col-span-2">

                    <label
                      htmlFor="contactAddress"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Contact Address
                    </label>

                    <textarea
                      id="contactAddress"
                      name="contactAddress"
                      rows={4}
                      value={
                        contactDetails.contactAddress
                      }
                      onChange={
                        handleContactChange
                      }
                      placeholder="Optional address if different from delivery address"
                      className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                  </div>

                </div>

                {message && (
                  <div className="mt-6 rounded-lg bg-gray-100 p-3 text-sm text-gray-700">
                    {message}
                  </div>
                )}

                <div className="mt-10 flex justify-between">

                  <button
                    type="button"
                    onClick={handlePrevious}
                    //className="rounded-lg border border-gray-300 px-7 py-3 font-medium text-gray-700 hover:bg-gray-50"
                    className="rounded-lg border border-[#06752e] px-7 py-3 font-medium text-[#06752e] transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ← Previous
                  </button>

                  <button
                    type="submit"
                    className="rounded-lg bg-[#06752e] px-7 py-3 font-medium text-white hover:bg-[#045d24]"
                  >
                    Save & Continue →
                  </button>

                </div>

              </form>
            )}

            {/* =================================================
                STEP 4 - REVIEW
            ================================================= */}

            {currentStep === 4 && (

              <div>

                <div className="mb-7 flex items-center justify-between">

                  <div>

                    <h2 className="text-xl font-semibold text-[#03471c]">
                      Review & Submit
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Please verify all information
                      before submitting.
                    </p>

                  </div>

                </div>

                {/* =================================================
                    SECTION 1 - PRODUCT
                ================================================= */}

                <div className="mb-8 rounded-2xl border border-gray-200 bg-white shadow-sm p-6">

                  {/* <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

                    <h3 className="font-semibold text-[#03471c]">
                      1. Product Details
                    </h3>

                    <button
                      type="button"
                      onClick={() =>
                        goToStep(1)
                      }
                      className="flex items-center gap-2 text-sm font-medium text-[#06752e] hover:text-[#045d24]"
                    >
                      <span>✎</span>
                      Edit
                    </button>

                  </div> */}
                  <ReviewSectionHeader
                    number="01"
                    title="Product Details"
                    onEdit={() => goToStep(1)}
                    />

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    <ReviewField
                      label="Product Category"
                      value={
                        productDetails.productCategory ===
                        "Other"
                          ? productDetails.productCategoryOther
                          : productDetails.productCategory
                      }
                    />

                    <ReviewField
                      label="Product Name"
                      value={
                        productDetails.productName
                      }
                    />

                    <ReviewField
                      label="Product Details"
                      value={
                        productDetails.productDescription
                      }
                    />

                    <ReviewField
                      label="Quality / Specifications"
                      value={
                        productDetails.qualitySpecifications
                      }
                    />

                    <ReviewField
                      label="Quantity"
                      value={`${productDetails.quantity} ${
                        productDetails.quantityUnit ===
                        "Other"
                          ? productDetails.quantityUnitOther
                          : productDetails.quantityUnit
                      }`}
                    />

                    <ReviewField
                      label="Expected Price"
                      value={`${productDetails.priceMin} - ${productDetails.priceMax} ${
                        productDetails.currency ===
                        "Other"
                          ? productDetails.currencyOther
                          : productDetails.currency
                      } ${
                        productDetails.priceUnit ===
                        "Other"
                          ? productDetails.priceUnitOther
                          : productDetails.priceUnit
                      }`}
                    />

                  </div>

                </div>

                {/* =================================================
                    SECTION 2 - LOCATION
                ================================================= */}

                <div className="mb-8 rounded-2xl border border-gray-200 bg-white shadow-sm p-6">

                  {/* <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

                    <h3 className="font-semibold text-[#03471c]">
                      2. Location & Other Information
                    </h3>

                    <button
                      type="button"
                      onClick={() =>
                        goToStep(2)
                      }
                      className="flex items-center gap-2 text-sm font-medium text-[#06752e] hover:text-[#045d24]"
                    >
                      <span>✎</span>
                      Edit
                    </button>

                  </div> */}

                  <ReviewSectionHeader
                    number="02"
                    title="Location & Other Information"
                    onEdit={() => goToStep(2)}
                    />

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    <ReviewField
                      label="Preferred Source Location"
                      value={
                        locationDetails.preferredSourceLocation
                      }
                    />

                    {showSourceLocation && (
                      <>
                        <ReviewField
                          label="Preferred Source Country"
                          value={
                            locationDetails.preferredSourceCountry ||
                            "Not provided"
                          }
                        />

                        <ReviewField
                          label="Preferred Supplier Location"
                          value={
                            locationDetails.preferredSupplierLocation ||
                            "Not provided"
                          }
                        />
                      </>
                    )}

                    <ReviewField
                      label="Delivery State"
                      value={
                        locationDetails.deliveryState
                      }
                    />

                    <ReviewField
                      label="Delivery City"
                      value={
                        locationDetails.deliveryCity
                      }
                    />

                    <ReviewField
                      label="PIN"
                      value={
                        locationDetails.deliveryPin
                      }
                    />

                    <ReviewField
                      label="Port"
                      value={
                        locationDetails.deliveryPort
                      }
                    />

                    <ReviewField
                      label="Additional Requirements"
                      value={
                        locationDetails.additionalRequirements ||
                        "Not provided"
                      }
                    />

                    <ReviewField
                      label="Sample Requirement"
                      value={
                        locationDetails.sampleRequirement
                      }
                    />

                    <ReviewField
                      label="Supply Frequency"
                      value={
                        locationDetails.supplyFrequency
                      }
                    />

                  </div>

                </div>

                {/* =================================================
                    SECTION 3 - CONTACT
                ================================================= */}

                <div className="mb-8 rounded-2xl border border-gray-200 bg-white shadow-sm p-6">

                  {/* <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

                    <h3 className="font-semibold text-[#03471c]">
                      3. Contact Details
                    </h3>

                    <button
                      type="button"
                      onClick={() =>
                        goToStep(3)
                      }
                      className="flex items-center gap-2 text-sm font-medium text-[#06752e] hover:text-[#045d24]"
                    >
                      <span>✎</span>
                      Edit
                    </button>

                  </div> */}

                  <ReviewSectionHeader
                    number="03"
                    title="Contact Details"
                    onEdit={() => goToStep(3)}
                    />

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    <ReviewField
                      label="Full Name"
                      value={
                        contactDetails.fullName
                      }
                    />

                    <ReviewField
                      label="Role / Designation"
                      value={
                        contactDetails.role ===
                        "Other"
                          ? contactDetails.roleOther
                          : contactDetails.role
                      }
                    />

                    <ReviewField
                      label="Email Address"
                      value={
                        contactDetails.email
                      }
                    />

                    <ReviewField
                      label="Mobile Number"
                      value={`${contactDetails.mobileCountryCode} ${contactDetails.mobileNumber}`}
                    />

                    <ReviewField
                      label="Preferred Contact Method"
                      value={
                        contactDetails.preferredContactMethod
                      }
                    />

                    <ReviewField
                      label="Alternate Contact"
                      value={
                        contactDetails.alternateContactName &&
                        contactDetails.alternateContactNumber
                          ? `${contactDetails.alternateContactName} - ${contactDetails.alternateContactNumber}`
                          : "Not provided"
                      }
                    />

                    <ReviewField
                      label="Contact Address"
                      value={
                        contactDetails.contactAddress ||
                        "Not provided"
                      }
                    />

                  </div>

                </div>

                {/* =================================================
                    DECLARATION
                ================================================= */}

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">

                <label className="flex cursor-pointer items-start gap-3">

                    <input
                    type="checkbox"
                    checked={declarationAccepted}
                    onChange={(event) =>
                        setDeclarationAccepted(
                        event.target.checked
                        )
                    }
                    className="
                        mt-1
                        h-4
                        w-4
                        shrink-0
                        cursor-pointer
                        rounded
                        border-gray-300
                        text-[#06752e]
                        focus:ring-[#06752e]
                    "
                    />

                    <span className="text-sm leading-6 text-gray-700">

                    I confirm that the information provided is
                    accurate and that I am authorized to submit
                    this import request. I agree to be contacted
                    by Skyma regarding this import request.

                    </span>

                </label>

                </div>

                {message && (

                  <div className="mt-6 rounded-lg bg-gray-100 p-3 text-sm text-gray-700">
                    {message}
                  </div>

                )}

                {/* BUTTONS */}

                <div className="mt-10 flex justify-between">

                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={saving}
                    //className="rounded-lg border border-gray-300 px-7 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    className="rounded-lg border border-[#06752e] px-7 py-3 font-medium text-[#06752e] transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ← Previous
                  </button>

                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={
                        saving ||
                        !declarationAccepted
                    }
                    className="
                        rounded-lg
                        bg-[#06752e]
                        px-7
                        py-3
                        font-medium
                        text-white
                        transition
                        hover:bg-[#045d24]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                    >
                    {saving
                        ? "Submitting..."
                        : "SUBMIT IMPORT REQUEST"}
                    </button>

                </div>

              </div>
            )}

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

// /* =========================================================
//    REVIEW FIELD COMPONENT
// ========================================================= */

// function ReviewField({
//   label,
//   value,
//   fullWidth = false,
// }: {
//   label: string;
//   value: string;
//   fullWidth?: boolean;
// }) {
//   return (
//     <div
//       className={
//         fullWidth
//           ? "md:col-span-2"
//           : ""
//       }
//     >

//       <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
//         {label}
//       </p>

//       <p className="mt-1 whitespace-pre-wrap break-words text-sm font-medium text-gray-800">
//         {value || "Not provided"}
//       </p>

//     </div>
//   );
// }


/* =========================================================
   REVIEW HELPERS
========================================================= */

function ReviewField({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  const displayValue =
    value !== null &&
    value !== undefined &&
    String(value).trim() !== ""
      ? String(value)
      : "Not provided";

  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <div className="min-h-[44px] rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-900 whitespace-pre-wrap break-words">
        {displayValue}
      </div>
    </div>
  );
}


function ReviewSectionHeader({
  number,
  title,
  onEdit,
}: {
  number: string;
  title: string;
  onEdit: () => void;
}) {
  return (
    <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">

      <div className="flex items-center gap-3">

        {/* CIRCLE NUMBER */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#03471c] text-sm font-semibold text-white">
          {number}
        </div>

        {/* TITLE */}
        <h2 className="text-xl font-semibold text-[#03471c]">
          {title}
        </h2>

      </div>

      {/* EDIT */}
      <button
        type="button"
        onClick={onEdit}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#03471c] transition hover:bg-green-50"
      >
        <span className="text-base">✎</span>
        <span>Edit</span>
      </button>

    </div>
  );
}