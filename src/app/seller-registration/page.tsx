"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

import { auth, db } from "../../lib/firebase";
import Header from "../components/Header";

/* =========================================================
   TYPES
========================================================= */

type BusinessInformation = {
  businessType: string;
  businessTypeOther: string;

  businessName: string;

  natureOfBusiness: string;
  natureOfBusinessOther: string;

  hasRegistrationCertificate: string;
  registrationNumber: string;

  gstTaxId: string;

  hasExportLicense: string;
  exportLicenseNumber: string;

  country: string;
  state: string;
  city: string;

  businessAddress: string;

  website: string;

  yearsInBusiness: string;
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

type ProductDetails = {
  productCategory: string;
  productCategoryOther: string;

  productName: string;

  productDescription: string;

  availableQuantity: string;
  availableQuantityUnit: string;
  availableQuantityUnitOther: string;

  regularSupplyAvailable: string;

  regularSupplyCapacity: string;
  regularSupplyCapacityUnit: string;
  regularSupplyCapacityUnitOther: string;

  availableFromDate: string;
  availableUntilDate: string;

  expectedExportRateMin: string;
  expectedExportRateMax: string;

  currency: string;
  currencyOther: string;

  priceUnit: string;
  priceUnitOther: string;

  rateNegotiable: string;

  originProductionLocation: string;

  additionalInformation: string;
};

/* =========================================================
   STEP 1 INITIAL VALUES
========================================================= */

const initialBusinessInformation: BusinessInformation = {
  businessType: "",
  businessTypeOther: "",

  businessName: "",

  natureOfBusiness: "",
  natureOfBusinessOther: "",

  hasRegistrationCertificate: "",
  registrationNumber: "",

  gstTaxId: "",

  hasExportLicense: "",
  exportLicenseNumber: "",

  country: "",
  state: "",
  city: "",

  businessAddress: "",

  website: "",

  yearsInBusiness: "",
};

/* =========================================================
   STEP 2 INITIAL VALUES
========================================================= */

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
   STEP 3 INITIAL VALUES
========================================================= */

const initialProductDetails: ProductDetails = {
  productCategory: "",
  productCategoryOther: "",

  productName: "",

  productDescription: "",

  availableQuantity: "",
  availableQuantityUnit: "",
  availableQuantityUnitOther: "",

  regularSupplyAvailable: "",

  regularSupplyCapacity: "",
  regularSupplyCapacityUnit: "",
  regularSupplyCapacityUnitOther: "",

  availableFromDate: "",
  availableUntilDate: "",

  expectedExportRateMin: "",
  expectedExportRateMax: "",

  currency: "",
  currencyOther: "",

  priceUnit: "",
  priceUnitOther: "",

  rateNegotiable: "",

  originProductionLocation: "",

  additionalInformation: "",
};

/* =========================================================
   STEP 1 OPTIONS
========================================================= */

const businessTypeOptions = [
  "Individual / Farmer",
  "Registered Business",
  "Manufacturer",
  "Trader",
  "Wholesaler / Distributor",
  "Producer",
  "Cooperative / Producer Organization",
  "Other",
];

const natureOfBusinessOptions = [
  "Agriculture / Farming",
  "Manufacturing",
  "Trading",
  "Wholesale",
  "Distribution",
  "Food Processing",
  "Chemical / Industrial",
  "Handicrafts",
  "Textile / Apparel",
  "Other",
];

const yearsInBusinessOptions = [
  "Less than 1 year",
  "1–2 years",
  "3–5 years",
  "5–10 years",
  "10+ years",
];

/* =========================================================
   STEP 2 OPTIONS
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
   STEP 3 OPTIONS
========================================================= */

const productCategoryOptions = [
  "Agriculture",
  "Fruits & Vegetables",
  "Food & Grocery",
  "Spices",
  "Grains & Cereals",
  "Pulses",
  "Edible Oils",
  "Furniture",
  "Textiles",
  "Garments",
  "Handicrafts",
  "Industrial Products",
  "Machinery",
  "Chemicals / Raw Materials",
  "Other",
];

const quantityUnitOptions = [
  "KG",
  "Metric Tons",
  "Tons",
  "Liters",
  "Pieces",
  "Boxes",
  "Cartons",
  "Containers",
  "Units",
  "Other",
];

const currencyOptions = [
  "INR",
  "USD",
  "EUR",
  "GBP",
  "AED",
  "Other",
];

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

const rateNegotiableOptions = [
  "Yes",
  "No",
  "Discuss",
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
   INDIAN STATES
========================================================= */

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

/* =========================================================
   COMPONENT
========================================================= */

export default function SellerRegistrationPage() {
  const router = useRouter();

  /* =======================================================
     AUTH
  ======================================================= */

  const [user, setUser] = useState<User | null>(null);

  const [checkingAuth, setCheckingAuth] = useState(true);

  /* =======================================================
     CURRENT STEP
  ======================================================= */

  const [currentStep, setCurrentStep] = useState(1);

  /* =======================================================
     BUSINESS INFORMATION
     
     IMPORTANT:
     This data exists only in React state for now.
     Nothing is written to Firebase.
  ======================================================= */

  const [businessInformation, setBusinessInformation] =
    useState<BusinessInformation>(
      initialBusinessInformation
    );

  /* =======================================================
     CONTACT DETAILS
     
     IMPORTANT:
     This data also exists only in React state.
  ======================================================= */

  const [contactDetails, setContactDetails] =
    useState<ContactDetails>(
      initialContactDetails
    );

  /* =======================================================
     PRODUCT DETAILS
     
     IMPORTANT:
     This data also exists only in React state.
  ======================================================= */

  const [productDetails, setProductDetails] =
    useState<ProductDetails>(
      initialProductDetails
    );

  /* =======================================================
     UI
  ======================================================= */

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

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

  /* =======================================================
     COUNTRY LIST
  ======================================================= */

  const countries = useMemo(() => {
    try {
      const regionCodes = ["IN","US","CA","GB","AE","SG","AU","DE","FR","JP","CN","ZA","BR"];

      const displayNames = new Intl.DisplayNames(
        ["en"],
        {
          type: "region",
        }
      );

      return regionCodes
        .map((code) => ({
          code,
          name: displayNames.of(code) ?? code,
        }))
        .filter((country) => country.name)
        .sort((a, b) =>
          a.name.localeCompare(b.name)
        );
    } catch {
      return [
        { code: "IN", name: "India" },
        {
          code: "US",
          name: "United States",
        },
        {
          code: "GB",
          name: "United Kingdom",
        },
        {
          code: "AE",
          name: "United Arab Emirates",
        },
        {
          code: "SG",
          name: "Singapore",
        },
        {
          code: "AU",
          name: "Australia",
        },
        {
          code: "CA",
          name: "Canada",
        },
      ];
    }
  }, []);

  /* =======================================================
     STEP 1 CONDITIONAL LOGIC
  ======================================================= */

  const showBusinessTypeOther =
    businessInformation.businessType === "Other";

  /*
   * Individual / Farmer does NOT require Business Name.
   *
   * Every other selected business type requires it.
   */
  const requiresBusinessName =
    businessInformation.businessType !== "" &&
    businessInformation.businessType !==
      "Individual / Farmer";

  const showNatureOther =
    businessInformation.natureOfBusiness === "Other";

  const showRegistrationNumber =
    businessInformation.hasRegistrationCertificate ===
    "Yes";

  const showExportLicenseDetails =
    businessInformation.hasExportLicense === "Yes";

  /* =======================================================
     STEP 2 CONDITIONAL LOGIC
  ======================================================= */

  const showRoleOther =
    contactDetails.role === "Other";

  /* =======================================================
      STEP 3 CONDITIONAL LOGIC
  ======================================================= */

  const showProductCategoryOther =
    productDetails.productCategory === "Other";

  const showAvailableQuantityUnitOther =
    productDetails.availableQuantityUnit === "Other";

  const showRegularSupplyCapacity =
    productDetails.regularSupplyAvailable === "Yes";

  const showRegularSupplyCapacityUnitOther =
    productDetails.regularSupplyCapacityUnit === "Other";

  const showCurrencyOther =
    productDetails.currency === "Other";

  const showPriceUnitOther =
    productDetails.priceUnit === "Other";

  /* =======================================================
     BUSINESS FIELD CHANGE
  ======================================================= */

  const handleBusinessChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setBusinessInformation((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =======================================================
     CONTACT FIELD CHANGE
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
      PRODUCT FIELD CHANGE
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
     VALIDATE STEP 1
  ======================================================= */

  const validateBusinessInformation = () => {
    if (!businessInformation.businessType) {
      setMessage(
        "Please select Business Type."
      );

      return false;
    }

    if (
      showBusinessTypeOther &&
      !businessInformation.businessTypeOther.trim()
    ) {
      setMessage(
        "Please specify the Business Type."
      );

      return false;
    }

    if (
      requiresBusinessName &&
      !businessInformation.businessName.trim()
    ) {
      setMessage(
        "Business / Company Name is required."
      );

      return false;
    }

    if (!businessInformation.natureOfBusiness) {
      setMessage(
        "Please select Nature of Business."
      );

      return false;
    }

    if (
      showNatureOther &&
      !businessInformation.natureOfBusinessOther.trim()
    ) {
      setMessage(
        "Please specify the Nature of Business."
      );

      return false;
    }

    if (
      !businessInformation.hasRegistrationCertificate
    ) {
      setMessage(
        "Please select Business Registration Certificate."
      );

      return false;
    }

    /*
     * Registration Number is shown when certificate = Yes.
     *
     * Requirement says OPTIONAL / CONDITIONAL,
     * so we don't make it mandatory here.
     */

    if (!businessInformation.hasExportLicense) {
      setMessage(
        "Please select Export License / IEC."
      );

      return false;
    }

    if (!businessInformation.country) {
      setMessage("Please select Country.");

      return false;
    }

    if (!businessInformation.state.trim()) {
      setMessage(
        "Please enter State / Province."
      );

      return false;
    }

    if (!businessInformation.city.trim()) {
      setMessage(
        "Please enter Business City."
      );

      return false;
    }

    if (
      !businessInformation.businessAddress.trim()
    ) {
      setMessage(
        "Please enter Business Address."
      );

      return false;
    }

    /*
     * Website is optional.
     *
     * If entered, make sure it looks like a URL.
     */

    if (businessInformation.website.trim()) {
      const website =
        businessInformation.website.trim();

      if (
        !website.startsWith("http://") &&
        !website.startsWith("https://")
      ) {
        setMessage(
          "Business Website must start with http:// or https://."
        );

        return false;
      }
    }

    return true;
  };

  /* =======================================================
     VALIDATE STEP 2
  ======================================================= */

  const validateContactDetails = () => {
    /* Full Name */

    if (!contactDetails.fullName.trim()) {
      setMessage(
        "Please enter Full Name."
      );

      return false;
    }

    /* Role */

    if (!contactDetails.role) {
      setMessage(
        "Please select Role / Designation."
      );

      return false;
    }

    /* Role Other */

    if (
      showRoleOther &&
      !contactDetails.roleOther.trim()
    ) {
      setMessage(
        "Please specify the Role / Designation."
      );

      return false;
    }

    /* Email */

    if (!contactDetails.email.trim()) {
      setMessage(
        "Please enter Email Address."
      );

      return false;
    }

    /*
     * Email format validation.
     */

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

    /* Mobile Number */

    if (!contactDetails.mobileNumber.trim()) {
      setMessage(
        "Please enter Mobile Number."
      );

      return false;
    }

    /*
     * Basic international phone validation.
     *
     * We allow spaces, hyphens and brackets.
     */
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

    /* Preferred Contact Method */

    if (
      !contactDetails.preferredContactMethod
    ) {
      setMessage(
        "Please select Preferred Contact Method."
      );

      return false;
    }

    /*
     * Alternate Contact is optional.
     *
     * If name is entered, require a number.
     * If number is entered, require a name.
     */

    const alternateName =
      contactDetails.alternateContactName.trim();

    const alternateNumber =
      contactDetails.alternateContactNumber.trim();

    if (alternateName && !alternateNumber) {
      setMessage(
        "Please enter the Alternate Contact number."
      );

      return false;
    }

    if (!alternateName && alternateNumber) {
      setMessage(
        "Please enter the Alternate Contact name."
      );

      return false;
    }

    return true;
  };

  /* =======================================================
      VALIDATE STEP 3
  ======================================================= */

  const validateProductDetails = () => {
    /* Product Category */

    if (!productDetails.productCategory) {
      setMessage(
        "Please select Product Category / Section."
      );

      return false;
    }

    /* Product Category - Other */

    if (
      showProductCategoryOther &&
      !productDetails.productCategoryOther.trim()
    ) {
      setMessage(
        "Please specify the Product Category."
      );

      return false;
    }

    /* Particular Product Name */

    if (!productDetails.productName.trim()) {
      setMessage(
        "Please enter the Particular Product Name."
      );

      return false;
    }

    /* Product Description */

    if (
      !productDetails.productDescription.trim()
    ) {
      setMessage(
        "Please enter the Product Description."
      );

      return false;
    }

    /* Available Quantity */

    if (!productDetails.availableQuantity) {
      setMessage(
        "Please enter Available Quantity."
      );

      return false;
    }

    if (
      Number(productDetails.availableQuantity) <= 0
    ) {
      setMessage(
        "Available Quantity must be greater than zero."
      );

      return false;
    }

    /* Available Quantity Unit */

    if (!productDetails.availableQuantityUnit) {
      setMessage(
        "Please select the Available Quantity Unit."
      );

      return false;
    }

    /* Available Quantity Unit - Other */

    if (
      showAvailableQuantityUnitOther &&
      !productDetails.availableQuantityUnitOther.trim()
    ) {
      setMessage(
        "Please specify the Available Quantity Unit."
      );

      return false;
    }

    /* Regular Supply */

    /*
    * Optional.
    *
    * If Yes, capacity becomes available.
    */

    if (showRegularSupplyCapacity) {
      if (
        !productDetails.regularSupplyCapacity
      ) {
        setMessage(
          "Please enter Regular Supply Capacity."
        );

        return false;
      }

      if (
        Number(
          productDetails.regularSupplyCapacity
        ) <= 0
      ) {
        setMessage(
          "Regular Supply Capacity must be greater than zero."
        );

        return false;
      }

      if (
        !productDetails.regularSupplyCapacityUnit
      ) {
        setMessage(
          "Please select the Regular Supply Capacity Unit."
        );

        return false;
      }

      if (
        showRegularSupplyCapacityUnitOther &&
        !productDetails.regularSupplyCapacityUnitOther.trim()
      ) {
        setMessage(
          "Please specify the Regular Supply Capacity Unit."
        );

        return false;
      }
    }

    /* Available From */

    if (!productDetails.availableFromDate) {
      setMessage(
        "Please select Available From Date."
      );

      return false;
    }

    /* Available Until */

    if (!productDetails.availableUntilDate) {
      setMessage(
        "Please select Available Until Date."
      );

      return false;
    }

    /* Date validation */

    if (
      productDetails.availableUntilDate <
      productDetails.availableFromDate
    ) {
      setMessage(
        "Available Until Date cannot be earlier than Available From Date."
      );

      return false;
    }

    /* Minimum Export Rate */

    if (
      !productDetails.expectedExportRateMin
    ) {
      setMessage(
        "Please enter Expected Export Rate - Minimum."
      );

      return false;
    }

    if (
      Number(
        productDetails.expectedExportRateMin
      ) < 0
    ) {
      setMessage(
        "Minimum Export Rate cannot be negative."
      );

      return false;
    }

    /* Maximum Export Rate */

    if (
      !productDetails.expectedExportRateMax
    ) {
      setMessage(
        "Please enter Expected Export Rate - Maximum."
      );

      return false;
    }

    if (
      Number(
        productDetails.expectedExportRateMax
      ) < 0
    ) {
      setMessage(
        "Maximum Export Rate cannot be negative."
      );

      return false;
    }

    /* Minimum <= Maximum */

    if (
      Number(
        productDetails.expectedExportRateMin
      ) >
      Number(
        productDetails.expectedExportRateMax
      )
    ) {
      setMessage(
        "Minimum Export Rate cannot be greater than Maximum Export Rate."
      );

      return false;
    }

    /* Currency */

    if (!productDetails.currency) {
      setMessage(
        "Please select Currency."
      );

      return false;
    }

    /* Currency Other */

    if (
      showCurrencyOther &&
      !productDetails.currencyOther.trim()
    ) {
      setMessage(
        "Please specify the Currency."
      );

      return false;
    }

    /* Price Unit */

    if (!productDetails.priceUnit) {
      setMessage(
        "Please select Price Unit."
      );

      return false;
    }

    /* Price Unit Other */

    if (
      showPriceUnitOther &&
      !productDetails.priceUnitOther.trim()
    ) {
      setMessage(
        "Please specify the Price Unit."
      );

      return false;
    }

    /*
    * Rate Negotiable is optional.
    *
    * No validation required.
    */

    /*
    * Origin / Production Location is optional.
    */

    /*
    * Additional Information is optional.
    */

    return true;
  };

  /* =======================================================
     NEXT STEP
     
     IMPORTANT:
     NO FIRESTORE WRITE HERE.
  ======================================================= */

  const handleNext = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    setMessage("");

    /* STEP 1 */

    if (currentStep === 1) {
      const valid =
        validateBusinessInformation();

      if (!valid) {
        return;
      }

      /*
       * ONLY move to Step 2.
       *
       * Nothing is saved to Firebase.
       */
      setCurrentStep(2);

      return;
    }

    /* STEP 2 */

    if (currentStep === 2) {
      const valid =
        validateContactDetails();

      if (!valid) {
        return;
      }

      /*
       * ONLY move to Step 3.
       *
       * Nothing is saved to Firebase.
       */
      setCurrentStep(3);

      return;
    }

    /* STEP 3 */

    if (currentStep === 3) {
      const valid =
        validateProductDetails();

      if (!valid) {
        return;
      }

      setCurrentStep(4);

      return;
    }

    /* STEP 4 */

    if (currentStep === 4) {
      /*
       * Document upload validation will be added later.
       */

      setCurrentStep(5);

      return;
    }
  };

  /* =======================================================
     PREVIOUS
  ======================================================= */

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(
        (previous) => previous - 1
      );

      setMessage("");
    }
  };

  /* =======================================================
     FINAL SUBMIT
     
     THIS is where Firestore INSERT happens.
     
     For now Steps 3 and 4 are placeholders.
     We will add their data to this object later.
  ======================================================= */

  const handleFinalSubmit = async () => {
    if (!user) {
      setMessage(
        "You must be logged in to submit the registration."
      );

      return;
    }

    try {
      setSaving(true);
      setMessage("");

      /*
       * ONE Firestore document is created.
       *
       * All five-step information will eventually
       * be stored here.
       */

      await addDoc(
        collection(
          db,
          "sellerRegistrations"
        ),
        {
          /* =====================================
             BUSINESS INFORMATION
          ===================================== */

          businessInformation: {
            businessType:
              businessInformation.businessType,

            businessTypeOther:
              businessInformation.businessTypeOther.trim(),

            businessName:
              businessInformation.businessName.trim(),

            natureOfBusiness:
              businessInformation.natureOfBusiness,

            natureOfBusinessOther:
              businessInformation.natureOfBusinessOther.trim(),

            hasRegistrationCertificate:
              businessInformation.hasRegistrationCertificate,

            registrationNumber:
              businessInformation.registrationNumber.trim(),

            gstTaxId:
              businessInformation.gstTaxId.trim(),

            hasExportLicense:
              businessInformation.hasExportLicense,

            exportLicenseNumber:
              businessInformation.exportLicenseNumber.trim(),

            country:
              businessInformation.country,

            state:
              businessInformation.state.trim(),

            city:
              businessInformation.city.trim(),

            businessAddress:
              businessInformation.businessAddress.trim(),

            website:
              businessInformation.website.trim(),

            yearsInBusiness:
              businessInformation.yearsInBusiness,
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

            availableQuantity:
              Number(
                productDetails.availableQuantity
              ),

            availableQuantityUnit:
              productDetails.availableQuantityUnit,

            availableQuantityUnitOther:
              productDetails.availableQuantityUnitOther.trim(),

            regularSupplyAvailable:
              productDetails.regularSupplyAvailable,

            regularSupplyCapacity:
              productDetails.regularSupplyCapacity
                ? Number(
                    productDetails.regularSupplyCapacity
                  )
                : null,

            regularSupplyCapacityUnit:
              productDetails.regularSupplyCapacityUnit,

            regularSupplyCapacityUnitOther:
              productDetails.regularSupplyCapacityUnitOther.trim(),

            availableFromDate:
              productDetails.availableFromDate,

            availableUntilDate:
              productDetails.availableUntilDate,

            expectedExportRateMin:
              Number(
                productDetails.expectedExportRateMin
              ),

            expectedExportRateMax:
              Number(
                productDetails.expectedExportRateMax
              ),

            currency:
              productDetails.currency,

            currencyOther:
              productDetails.currencyOther.trim(),

            priceUnit:
              productDetails.priceUnit,

            priceUnitOther:
              productDetails.priceUnitOther.trim(),

            rateNegotiable:
              productDetails.rateNegotiable,

            originProductionLocation:
              productDetails.originProductionLocation.trim(),

            additionalInformation:
              productDetails.additionalInformation.trim(),
          },

          /* =====================================
             USER INFORMATION
          ===================================== */

          userId: user.uid,

          userEmail: user.email ?? "",

          /* =====================================
             REGISTRATION STATUS
          ===================================== */

          registrationStatus: "submitted",

          currentStep: 5,

          /* =====================================
             TIMESTAMPS
          ===================================== */

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),
        }
      );

      /*
       * Successfully submitted.
       */

      setMessage(
        "Seller registration submitted successfully."
      );

    } catch (error) {
      console.error(
        "Error submitting seller registration:",
        error
      );

      setMessage(
        "Unable to submit registration. Please try again."
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
     STEPS
  ======================================================= */

  const steps = [
    "Business Information",
    "Contact Details",
    "Product Details",
    "Documents Upload",
    "Review & Submit",
  ];

  /* =======================================================
     RETURN UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#1f1f1f]">

      {/* =================================================
          HEADER
      ================================================= */}

      <Header user={user} />

      <main className="p-4 md:p-8">

        <div className="mx-auto flex max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl">

          {/* =================================================
              LEFT SIDEBAR
          ================================================= */}

          <aside className="hidden w-[280px] shrink-0 bg-[#03471c] p-8 text-white md:block">

            <h2 className="mb-10 text-xl font-semibold">
              Seller Registration
            </h2>

            <div className="relative">

              {steps.map((step, index) => {

                const stepNumber =
                  index + 1;

                const active =
                  stepNumber === currentStep;

                const completed =
                  stepNumber < currentStep;

                return (
                  <div
                    key={step}
                    className="relative flex min-h-[75px] items-start"
                  >

                    {/* Connecting Line */}

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

                    {/* Circle */}

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
                      ).padStart(2, "0")}
                    </div>

                    {/* Step Name */}

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
              })}

            </div>

          </aside>

          {/* =================================================
              RIGHT CONTENT
          ================================================= */}

          <section className="min-w-0 flex-1 p-6 md:p-12">

            {/* PAGE TITLE */}

            <div className="mb-9">

              <h1 className="text-3xl font-bold text-gray-900">
                Register as a Seller
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Join our global network of trusted sellers.
              </p>

            </div>

            {/* =================================================
                STEP 1
            ================================================= */}

            {currentStep === 1 && (

              <form onSubmit={handleNext}>

                <h2 className="mb-6 text-xl font-semibold text-[#03471c]">
                  Business Information
                </h2>

                <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">

                  {/* =========================================
                      BUSINESS TYPE
                  ========================================= */}

                  <div>
                    <label
                      htmlFor="businessType"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Business Type
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <select
                      id="businessType"
                      name="businessType"
                      required
                      value={
                        businessInformation.businessType
                      }
                      onChange={
                        handleBusinessChange
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    >

                      <option value="">
                        Select business type
                      </option>

                      {businessTypeOptions.map(
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

                  {/* =========================================
                      BUSINESS TYPE OTHER
                  ========================================= */}

                  {showBusinessTypeOther && (
                    <div>
                      <label
                        htmlFor="businessTypeOther"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Specify Business Type
                        <span className="text-red-500">
                          {" "}*
                        </span>
                      </label>

                      <input
                        id="businessTypeOther"
                        name="businessTypeOther"
                        type="text"
                        required
                        value={
                          businessInformation.businessTypeOther
                        }
                        onChange={
                          handleBusinessChange
                        }
                        placeholder="Specify business type"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                      />
                    </div>
                  )}

                  {/* =========================================
                      BUSINESS / COMPANY NAME
                  ========================================= */}

                  <div>
                    <label
                      htmlFor="businessName"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Business / Company Name

                      {requiresBusinessName && (
                        <span className="text-red-500">
                          {" "}*
                        </span>
                      )}
                    </label>

                    <input
                      id="businessName"
                      name="businessName"
                      type="text"
                      required={
                        requiresBusinessName
                      }
                      value={
                        businessInformation.businessName
                      }
                      onChange={
                        handleBusinessChange
                      }
                      placeholder="Enter legal or trading name"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                    {!requiresBusinessName && (
                      <p className="mt-1 text-xs text-gray-500">
                        Optional for Individual / Farmer.
                      </p>
                    )}
                  </div>

                  {/* =========================================
                      NATURE OF BUSINESS
                  ========================================= */}

                  <div>
                    <label
                      htmlFor="natureOfBusiness"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Nature of Business
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <select
                      id="natureOfBusiness"
                      name="natureOfBusiness"
                      required
                      value={
                        businessInformation.natureOfBusiness
                      }
                      onChange={
                        handleBusinessChange
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    >

                      <option value="">
                        Select nature of business
                      </option>

                      {natureOfBusinessOptions.map(
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

                  {/* =========================================
                      NATURE OTHER
                  ========================================= */}

                  {showNatureOther && (
                    <div>
                      <label
                        htmlFor="natureOfBusinessOther"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Specify Nature of Business
                        <span className="text-red-500">
                          {" "}*
                        </span>
                      </label>

                      <input
                        id="natureOfBusinessOther"
                        name="natureOfBusinessOther"
                        type="text"
                        required
                        value={
                          businessInformation.natureOfBusinessOther
                        }
                        onChange={
                          handleBusinessChange
                        }
                        placeholder="Specify nature of business"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                      />
                    </div>
                  )}

                  {/* =========================================
                      REGISTRATION CERTIFICATE
                  ========================================= */}

                  <div>
                    <label
                      htmlFor="hasRegistrationCertificate"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Business Registration Certificate
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <select
                      id="hasRegistrationCertificate"
                      name="hasRegistrationCertificate"
                      required
                      value={
                        businessInformation.hasRegistrationCertificate
                      }
                      onChange={
                        handleBusinessChange
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

                  {/* =========================================
                      REGISTRATION NUMBER
                  ========================================= */}

                  {showRegistrationNumber && (
                    <div>
                      <label
                        htmlFor="registrationNumber"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Registration Number
                      </label>

                      <input
                        id="registrationNumber"
                        name="registrationNumber"
                        type="text"
                        value={
                          businessInformation.registrationNumber
                        }
                        onChange={
                          handleBusinessChange
                        }
                        placeholder="Enter registration number"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                      />
                    </div>
                  )}

                  {/* =========================================
                      GST / TAX ID
                  ========================================= */}

                  <div>
                    <label
                      htmlFor="gstTaxId"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      GST / Tax Identification Number
                    </label>

                    <input
                      id="gstTaxId"
                      name="gstTaxId"
                      type="text"
                      value={
                        businessInformation.gstTaxId
                      }
                      onChange={
                        handleBusinessChange
                      }
                      placeholder="Enter GST / Tax ID"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  {/* =========================================
                      EXPORT LICENSE
                  ========================================= */}

                  <div>
                    <label
                      htmlFor="hasExportLicense"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Export License / IEC
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <select
                      id="hasExportLicense"
                      name="hasExportLicense"
                      required
                      value={
                        businessInformation.hasExportLicense
                      }
                      onChange={
                        handleBusinessChange
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

                    <p className="mt-1 text-xs text-gray-500">
                      No export license will not block registration.
                    </p>
                  </div>

                  {/* =========================================
                      EXPORT LICENSE NUMBER
                  ========================================= */}

                  {showExportLicenseDetails && (
                    <div>
                      <label
                        htmlFor="exportLicenseNumber"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Export License / IEC Number
                      </label>

                      <input
                        id="exportLicenseNumber"
                        name="exportLicenseNumber"
                        type="text"
                        value={
                          businessInformation.exportLicenseNumber
                        }
                        onChange={
                          handleBusinessChange
                        }
                        placeholder="Enter IEC / license number"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                      />
                    </div>
                  )}

                  {/* =========================================
                      COUNTRY
                  ========================================= */}

                  <div>
                    <label
                      htmlFor="country"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Country
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <input
                      id="country"
                      name="country"
                      list="country-options"
                      required
                      value={
                        businessInformation.country
                      }
                      onChange={
                        handleBusinessChange
                      }
                      placeholder="Search country"
                      autoComplete="country-name"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                    <datalist id="country-options">
                      {countries.map(
                        (country) => (
                          <option
                            key={country.code}
                            value={country.name}
                          />
                        )
                      )}
                    </datalist>
                  </div>

                  {/* =========================================
                      STATE
                  ========================================= */}

                  <div>
                    <label
                      htmlFor="state"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      State / Province
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <input
                      id="state"
                      name="state"
                      list="state-options"
                      required
                      value={
                        businessInformation.state
                      }
                      onChange={
                        handleBusinessChange
                      }
                      placeholder="Search state / province"
                      autoComplete="address-level1"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                    <datalist id="state-options">
                      {indianStates.map(
                        (state) => (
                          <option
                            key={state}
                            value={state}
                          />
                        )
                      )}
                    </datalist>
                  </div>

                  {/* =========================================
                      CITY
                  ========================================= */}

                  <div>
                    <label
                      htmlFor="city"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Business City
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      value={
                        businessInformation.city
                      }
                      onChange={
                        handleBusinessChange
                      }
                      placeholder="Enter city / town"
                      autoComplete="address-level2"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  {/* =========================================
                      BUSINESS ADDRESS
                  ========================================= */}

                  <div className="md:col-span-2">

                    <label
                      htmlFor="businessAddress"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Business Address
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <textarea
                      id="businessAddress"
                      name="businessAddress"
                      required
                      rows={4}
                      value={
                        businessInformation.businessAddress
                      }
                      onChange={
                        handleBusinessChange
                      }
                      placeholder="Enter full farm, office, factory, warehouse, or operating address"
                      autoComplete="street-address"
                      className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                  </div>

                  {/* =========================================
                      WEBSITE
                  ========================================= */}

                  <div>
                    <label
                      htmlFor="website"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Business Website
                    </label>

                    <input
                      id="website"
                      name="website"
                      type="url"
                      value={
                        businessInformation.website
                      }
                      onChange={
                        handleBusinessChange
                      }
                      placeholder="https://example.com"
                      autoComplete="url"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  {/* =========================================
                      YEARS
                  ========================================= */}

                  <div>
                    <label
                      htmlFor="yearsInBusiness"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Years in Business / Farming
                    </label>

                    <select
                      id="yearsInBusiness"
                      name="yearsInBusiness"
                      value={
                        businessInformation.yearsInBusiness
                      }
                      onChange={
                        handleBusinessChange
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    >

                      <option value="">
                        Select years
                      </option>

                      {yearsInBusinessOptions.map(
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

                {/* MESSAGE */}

                {message && (
                  <div className="mt-6 rounded-lg bg-gray-100 p-3 text-sm text-gray-700">
                    {message}
                  </div>
                )}

                {/* BUTTON */}

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
                STEP 2 - CONTACT DETAILS
            ================================================= */}

            {currentStep === 2 && (

              <form onSubmit={handleNext}>

                <h2 className="mb-6 text-xl font-semibold text-[#03471c]">
                  Contact Details
                </h2>

                <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">

                  {/* =========================================
                      1. FULL NAME
                  ========================================= */}

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
                      autoComplete="name"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                    <p className="mt-1 text-xs text-gray-500">
                      Person completing the registration.
                    </p>
                  </div>

                  {/* =========================================
                      2. ROLE / DESIGNATION
                  ========================================= */}

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

                  {/* =========================================
                      ROLE OTHER
                  ========================================= */}

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
                        placeholder="Enter role / designation"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                      />
                    </div>
                  )}

                  {/* =========================================
                      3. EMAIL
                  ========================================= */}

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
                      autoComplete="email"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                    <p className="mt-1 text-xs text-gray-500">
                      Enter a valid email address.
                    </p>
                  </div>

                  {/* =========================================
                      4. MOBILE NUMBER
                  ========================================= */}

                  <div>

                    <label
                      htmlFor="mobileNumber"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Mobile Number
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <div className="flex gap-2">

                      {/* COUNTRY CODE */}

                      <select
                        name="mobileCountryCode"
                        value={
                          contactDetails.mobileCountryCode
                        }
                        onChange={
                          handleContactChange
                        }
                        className="w-[125px] rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                      >

                        {countryCodeOptions.map(
                          (item) => (
                            <option
                              key={`${item.country}-${item.code}`}
                              value={item.code}
                            >
                              {item.code}{" "}
                              {item.country}
                            </option>
                          )
                        )}

                      </select>

                      {/* PHONE NUMBER */}

                      <input
                        id="mobileNumber"
                        name="mobileNumber"
                        type="tel"
                        required
                        value={
                          contactDetails.mobileNumber
                        }
                        onChange={
                          handleContactChange
                        }
                        placeholder="Enter phone number"
                        autoComplete="tel"
                        className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                      />

                    </div>

                    <p className="mt-1 text-xs text-gray-500">
                      Select country code and enter the number.
                    </p>

                  </div>

                  {/* =========================================
                      5. PREFERRED CONTACT METHOD
                  ========================================= */}

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
                        Select preferred method
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

                    <p className="mt-1 text-xs text-gray-500">
                      Skyma will use this preference for follow-up.
                    </p>
                  </div>

                  {/* =========================================
                      6. ALTERNATE CONTACT NAME
                  ========================================= */}

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
                      placeholder="Enter alternate contact name"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                    <p className="mt-1 text-xs text-gray-500">
                      Optional secondary contact.
                    </p>
                  </div>

                  {/* =========================================
                      6. ALTERNATE CONTACT NUMBER
                  ========================================= */}

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
                      placeholder="Enter alternate phone number"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  {/* =========================================
                      7. CONTACT ADDRESS
                  ========================================= */}

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
                      placeholder="Enter contact address if different from business address"
                      className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                    <p className="mt-1 text-xs text-gray-500">
                      Optional. Use only if different from business address.
                    </p>

                  </div>

                </div>

                {/* MESSAGE */}

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
                    className="rounded-lg border border-gray-300 px-7 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    ← Previous
                  </button>

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
                STEP 3 - PRODUCT DETAILS
            ================================================= */}

            {currentStep === 3 && (

              <form onSubmit={handleNext}>

                <h2 className="mb-6 text-xl font-semibold text-[#03471c]">
                  Product Details
                </h2>

                <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">

                  <div>

                    <label
                      htmlFor="productCategory"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Product Category / Section
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
                      onChange={handleProductChange}
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
                        onChange={handleProductChange}
                        placeholder="Enter product category"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                      />

                    </div>

                  )}

                  <div>

                    <label
                      htmlFor="productName"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Particular Product Name
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
                      onChange={handleProductChange}
                      placeholder="Example: Fresh Red Chillies"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                    <p className="mt-1 text-xs text-gray-500">
                      Enter the exact product name, not just the category.
                    </p>

                  </div>

                  <div className="md:col-span-2">

                    <label
                      htmlFor="productDescription"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Product Description
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <textarea
                      id="productDescription"
                      name="productDescription"
                      required
                      rows={5}
                      value={
                        productDetails.productDescription
                      }
                      onChange={handleProductChange}
                      placeholder="Describe the actual product, variety, grade/type, origin, and important characteristics."
                      className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                  </div>

                  <div>

                    <label
                      htmlFor="availableQuantity"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Available Quantity
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <input
                      id="availableQuantity"
                      name="availableQuantity"
                      type="number"
                      min="0"
                      step="any"
                      required
                      value={
                        productDetails.availableQuantity
                      }
                      onChange={handleProductChange}
                      placeholder="Enter quantity"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                  </div>

                  <div>

                    <label
                      htmlFor="availableQuantityUnit"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Quantity Unit
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <select
                      id="availableQuantityUnit"
                      name="availableQuantityUnit"
                      required
                      value={
                        productDetails.availableQuantityUnit
                      }
                      onChange={handleProductChange}
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

                  {showAvailableQuantityUnitOther && (

                    <div>

                      <label
                        htmlFor="availableQuantityUnitOther"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Specify Unit
                        <span className="text-red-500">
                          {" "}*
                        </span>
                      </label>

                      <input
                        id="availableQuantityUnitOther"
                        name="availableQuantityUnitOther"
                        type="text"
                        required
                        value={
                          productDetails.availableQuantityUnitOther
                        }
                        onChange={handleProductChange}
                        placeholder="Specify quantity unit"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                      />

                    </div>

                  )}

                  <div>

                    <label
                      htmlFor="regularSupplyAvailable"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Regular Supply Available?
                    </label>

                    <select
                      id="regularSupplyAvailable"
                      name="regularSupplyAvailable"
                      value={
                        productDetails.regularSupplyAvailable
                      }
                      onChange={handleProductChange}
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

                  {showRegularSupplyCapacity && (

                    <div>

                      <label
                        htmlFor="regularSupplyCapacity"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Regular Supply Capacity
                        <span className="text-red-500">
                          {" "}*
                        </span>
                      </label>

                      <input
                        id="regularSupplyCapacity"
                        name="regularSupplyCapacity"
                        type="number"
                        min="0"
                        step="any"
                        required
                        value={
                          productDetails.regularSupplyCapacity
                        }
                        onChange={handleProductChange}
                        placeholder="Quantity per month / shipment"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                      />

                    </div>

                  )}

                  {showRegularSupplyCapacity && (

                    <div>

                      <label
                        htmlFor="regularSupplyCapacityUnit"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Regular Supply Capacity Unit
                        <span className="text-red-500">
                          {" "}*
                        </span>
                      </label>

                      <select
                        id="regularSupplyCapacityUnit"
                        name="regularSupplyCapacityUnit"
                        required
                        value={
                          productDetails.regularSupplyCapacityUnit
                        }
                        onChange={handleProductChange}
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

                  )}

                  {showRegularSupplyCapacity &&
                    showRegularSupplyCapacityUnitOther && (

                    <div>

                      <label
                        htmlFor="regularSupplyCapacityUnitOther"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Specify Supply Capacity Unit
                        <span className="text-red-500">
                          {" "}*
                        </span>
                      </label>

                      <input
                        id="regularSupplyCapacityUnitOther"
                        name="regularSupplyCapacityUnitOther"
                        type="text"
                        required
                        value={
                          productDetails.regularSupplyCapacityUnitOther
                        }
                        onChange={handleProductChange}
                        placeholder="Specify unit"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                      />

                    </div>

                  )}

                  <div>

                    <label
                      htmlFor="availableFromDate"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Available From Date
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <input
                      id="availableFromDate"
                      name="availableFromDate"
                      type="date"
                      required
                      value={
                        productDetails.availableFromDate
                      }
                      onChange={handleProductChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                  </div>

                  <div>

                    <label
                      htmlFor="availableUntilDate"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Available Until Date
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <input
                      id="availableUntilDate"
                      name="availableUntilDate"
                      type="date"
                      required
                      min={
                        productDetails.availableFromDate ||
                        undefined
                      }
                      value={
                        productDetails.availableUntilDate
                      }
                      onChange={handleProductChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                  </div>

                  <div>

                    <label
                      htmlFor="expectedExportRateMin"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Expected Export Rate — Minimum
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <input
                      id="expectedExportRateMin"
                      name="expectedExportRateMin"
                      type="number"
                      min="0"
                      step="any"
                      required
                      value={
                        productDetails.expectedExportRateMin
                      }
                      onChange={handleProductChange}
                      placeholder="Enter minimum rate"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                  </div>

                  <div>

                    <label
                      htmlFor="expectedExportRateMax"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Expected Export Rate — Maximum
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <input
                      id="expectedExportRateMax"
                      name="expectedExportRateMax"
                      type="number"
                      min="0"
                      step="any"
                      required
                      value={
                        productDetails.expectedExportRateMax
                      }
                      onChange={handleProductChange}
                      placeholder="Enter maximum rate"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                  </div>

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
                      onChange={handleProductChange}
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
                        onChange={handleProductChange}
                        placeholder="Enter currency"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                      />

                    </div>

                  )}

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
                      onChange={handleProductChange}
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
                        onChange={handleProductChange}
                        placeholder="Specify price unit"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                      />

                    </div>

                  )}

                  <div>

                    <label
                      htmlFor="rateNegotiable"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Rate Negotiable?
                    </label>

                    <select
                      id="rateNegotiable"
                      name="rateNegotiable"
                      value={
                        productDetails.rateNegotiable
                      }
                      onChange={handleProductChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    >

                      <option value="">
                        Select an option
                      </option>

                      {rateNegotiableOptions.map(
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

                  <div>

                    <label
                      htmlFor="originProductionLocation"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Origin / Production Location
                    </label>

                    <input
                      id="originProductionLocation"
                      name="originProductionLocation"
                      type="text"
                      value={
                        productDetails.originProductionLocation
                      }
                      onChange={handleProductChange}
                      placeholder="Farm, city, region, state, etc."
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#06752e] focus:ring-2 focus:ring-green-100"
                    />

                  </div>

                  <div className="md:col-span-2">

                    <label
                      htmlFor="additionalInformation"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Additional Information
                    </label>

                    <textarea
                      id="additionalInformation"
                      name="additionalInformation"
                      rows={4}
                      value={
                        productDetails.additionalInformation
                      }
                      onChange={handleProductChange}
                      placeholder="Enter any other information relevant to the export product."
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
                    className="rounded-lg border border-gray-300 px-7 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    ← Previous
                  </button>

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
                STEP 4
            ================================================= */}

            {currentStep === 4 && (

              <div>

                <h2 className="mb-6 text-xl font-semibold text-[#03471c]">
                  Documents Upload
                </h2>

                <p className="text-gray-600">
                  Documents Upload will be added here.
                </p>

                {message && (
                  <div className="mt-6 rounded-lg bg-gray-100 p-3 text-sm text-gray-700">
                    {message}
                  </div>
                )}

                <div className="mt-10 flex justify-between">

                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="rounded-lg border border-gray-300 px-7 py-3 font-medium text-gray-700 hover:bg-gray-50"
                  >
                    ← Previous
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentStep(5)
                    }
                    className="rounded-lg bg-[#06752e] px-7 py-3 font-medium text-white hover:bg-[#045d24]"
                  >
                    Save & Continue →
                  </button>

                </div>

              </div>
            )}

            {/* =================================================
                STEP 5
            ================================================= */}

            {currentStep === 5 && (

              <div>

                <h2 className="mb-6 text-xl font-semibold text-[#03471c]">
                  Review & Submit
                </h2>

                <div className="rounded-lg bg-gray-50 p-6">

                  <h3 className="mb-4 font-semibold text-[#03471c]">
                    Registration Ready
                  </h3>

                  <p className="text-sm text-gray-600">
                    Review your information before submitting
                    the seller registration.
                  </p>

                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">

                    <div>
                      <p className="text-xs text-gray-500">
                        Business Type
                      </p>

                      <p className="font-medium text-gray-800">
                        {
                          businessInformation.businessType
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Business Name
                      </p>

                      <p className="font-medium text-gray-800">
                        {
                          businessInformation.businessName ||
                          "Not provided"
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Nature of Business
                      </p>

                      <p className="font-medium text-gray-800">
                        {
                          businessInformation.natureOfBusiness
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Country
                      </p>

                      <p className="font-medium text-gray-800">
                        {
                          businessInformation.country
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Contact Name
                      </p>

                      <p className="font-medium text-gray-800">
                        {
                          contactDetails.fullName
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Email
                      </p>

                      <p className="font-medium text-gray-800">
                        {
                          contactDetails.email
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Mobile
                      </p>

                      <p className="font-medium text-gray-800">
                        {
                          contactDetails.mobileCountryCode
                        }{" "}
                        {
                          contactDetails.mobileNumber
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Preferred Contact Method
                      </p>

                      <p className="font-medium text-gray-800">
                        {
                          contactDetails.preferredContactMethod
                        }
                      </p>
                    </div>

                  </div>

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
                    className="rounded-lg border border-gray-300 px-7 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    ← Previous
                  </button>

                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={saving}
                    className="rounded-lg bg-[#06752e] px-7 py-3 font-medium text-white transition hover:bg-[#045d24] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving
                      ? "Submitting..."
                      : "Submit Registration →"}
                  </button>

                </div>

              </div>
            )}

          </section>

        </div>

      </main>

    </div>
  );
}