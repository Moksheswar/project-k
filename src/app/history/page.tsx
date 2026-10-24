"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import Header from "../components/Header";

type RegistrationType = "Import" | "Export";

interface Registration {
  id: string;
  type: RegistrationType;

  requestId?: string;

  userId?: string;

  // Common
  name?: string;
  email?: string;
  phone?: string;
  companyName?: string;

  createdDate?: any;
  lastModifiedDate?: any;
  status?: string;

  // Product
  productCategory?: string;
  productCategoryOther?: string;
  productName?: string;
  productDescription?: string;

  // Buyer product details
  qualitySpecifications?: string;
  quantity?: string | number;
  quantityUnit?: string;
  quantityUnitOther?: string;

  priceMin?: string | number;
  priceMax?: string | number;
  currency?: string;
  currencyOther?: string;
  priceUnit?: string;
  priceUnitOther?: string;

  // Buyer location / other
  preferredSourceLocation?: string;
  deliveryState?: string;
  deliveryCity?: string;
  pinCode?: string;
  port?: string;
  additionalRequirements?: string;
  sampleRequirement?: string;
  supplyFrequency?: string;

  // Seller product details
  regularSupplyAvailable?: string;
  regularSupplyCapacity?: string | number;
  regularSupplyCapacityUnit?: string;

  availableFromDate?: string;
  availableUntilDate?: string;

  rateNegotiable?: string;

  originProductionLocation?: string;
  otherInformation?: string;

  [key: string]: any;
}

function formatDate(value: any) {
  if (!value) {
    return "Not provided";
  }

  try {
    if (value?.toDate) {
      return value.toDate().toLocaleString("en-IN");
    }

    if (value instanceof Date) {
      return value.toLocaleString("en-IN");
    }

    return new Date(value).toLocaleString("en-IN");
  } catch {
    return String(value);
  }
}

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

      <div className="min-h-[44px] break-words whitespace-pre-wrap rounded-xl border border-white/80 bg-white/45 px-4 py-3 text-sm text-gray-800 shadow-sm backdrop-blur-xl">
        {displayValue}
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [registrations, setRegistrations] = useState<Registration[]>([]);

  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState<
    "All" | "Import" | "Export"
  >("All");

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedRegistration, setSelectedRegistration] =
    useState<Registration | null>(null);

  const ITEMS_PER_PAGE = 10;

  /*
   * AUTH LISTENER
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  /*
   * FETCH USER REGISTRATIONS
   */
  useEffect(() => {
    if (!user) {
      setRegistrations([]);
      setLoading(false);
      return;
    }

    const fetchRegistrations = async () => {
      try {
        setLoading(true);

        /*
         * SELLER REGISTRATIONS
         */
        const sellerQuery = query(
          collection(db, "sellerRegistrations"),
          where("userId", "==", user.uid)
        );

        /*
         * BUYER REGISTRATIONS
         */
        const buyerQuery = query(
          collection(db, "buyerRegistrations"),
          where("userId", "==", user.uid)
        );

        const [sellerSnapshot, buyerSnapshot] =
          await Promise.all([
            getDocs(sellerQuery),
            getDocs(buyerQuery),
          ]);

        const sellerRecords: Registration[] =
          sellerSnapshot.docs.map((doc) => ({
            id: doc.id,
            type: "Export",
            ...doc.data(),
          }));

        const buyerRecords: Registration[] =
          buyerSnapshot.docs.map((doc) => ({
            id: doc.id,
            type: "Import",
            ...doc.data(),
          }));

        /*
         * COMBINE BOTH COLLECTIONS
         */
        const allRecords = [
          ...sellerRecords,
          ...buyerRecords,
        ];

        /*
         * SORT BY LAST MODIFIED DATE
         */
        allRecords.sort((a, b) => {
          const dateA = getDateValue(a.lastModifiedDate);
          const dateB = getDateValue(b.lastModifiedDate);

          return dateB - dateA;
        });

        setRegistrations(allRecords);
      } catch (error) {
        console.error(
          "Error fetching registration history:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [user]);

  /*
   * DATE HELPER FOR SORTING
   */
  function getDateValue(value: any): number {
    if (!value) {
      return 0;
    }

    try {
      if (value?.toDate) {
        return value.toDate().getTime();
      }

      return new Date(value).getTime();
    } catch {
      return 0;
    }
  }

  /*
   * FILTER + SEARCH
   */
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((registration) => {
      /*
       * TYPE FILTER
       */
      if (
        filter !== "All" &&
        registration.type !== filter
      ) {
        return false;
      }

      /*
       * REQUEST ID SEARCH
       */
      if (search.trim() !== "") {
        const requestId =
          registration.requestId?.toLowerCase() || "";

        if (
          !requestId.includes(
            search.trim().toLowerCase()
          )
        ) {
          return false;
        }
      }

      return true;
    });
  }, [registrations, filter, search]);

  /*
   * PAGINATION
   */
  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredRegistrations.length /
        ITEMS_PER_PAGE
    )
  );

  const paginatedRegistrations =
    filteredRegistrations.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );

  /*
   * RESET PAGE WHEN FILTER / SEARCH CHANGES
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);

  /*
   * OPEN POPUP
   */
  const openDetails = (
    registration: Registration
  ) => {
    setSelectedRegistration(registration);
  };

  /*
   * CLOSE POPUP
   */
  const closeDetails = () => {
    setSelectedRegistration(null);
  };

    if (checkingAuth) {
        return null;
    }

    if (!user) {
        return null;
    }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat pt-[72px]"
      style={{
        backgroundImage: "url('images/skyma-dbg.jpg')",
      }}
    >
        <Header user={user} />

      {/* MAIN HISTORY AREA */}

      <main className="px-6 py-8">

        <div className="mx-auto max-w-7xl">

          {/* PAGE TITLE */}
          <div className="mb-6">

            <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-[#023b18] drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
              History
            </h1>

            <p className="mt-1 text-sm font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              View your buyer and seller registration history.
            </p>
          </div>

          </div>

          {/* FILTER + SEARCH */}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            {/* FILTER */}

            <div>

              <select
                value={filter}
                onChange={(e) =>
                  setFilter(
                    e.target.value as
                      | "All"
                      | "Import"
                      | "Export"
                  )
                }
                className="rounded-xl border border-white/80 bg-white/45 px-4 py-2.5 text-sm text-[#03471c] shadow-sm backdrop-blur-xl outline-none transition-all duration-200 hover:border-emerald-300 focus:border-emerald-600/60 focus:bg-white/70 focus:ring-4 focus:ring-emerald-500/10"
              >

                <option value="All">
                  All
                </option>

                <option value="Import">
                  Import
                </option>

                <option value="Export">
                  Export
                </option>

              </select>

            </div>

            {/* SEARCH */}

            <div className="relative w-full sm:w-80">

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search Request ID"
                className="w-full rounded-xl border border-white/80 bg-white/45 px-4 py-2.5 text-sm text-gray-900 shadow-sm backdrop-blur-xl outline-none transition-all duration-200 placeholder:text-gray-500 hover:border-emerald-300 focus:border-emerald-600/60 focus:bg-white/70 focus:ring-4 focus:ring-emerald-500/10"
              />

            </div>

          </div>

          {/* LOADING */}

          {loading && (
            <div className="flex min-h-[300px] items-center justify-center">

              <p className="text-sm text-gray-400">
                Loading history...
              </p>

            </div>
          )}

          {/* NOT LOGGED IN */}

          {!loading && !user && (
            <div className="rounded-2xl border border-white/80 bg-white/50 p-8 text-center shadow-[0_8px_25px_rgba(3,71,28,0.07)] backdrop-blur-xl">

              <p className="text-gray-600">
                Please log in to view your history.
              </p>

            </div>
          )}

          {/* NO RECORDS */}

          {!loading &&
            user &&
            paginatedRegistrations.length === 0 && (

              <div className="rounded-2xl border border-white/80 bg-white/50 p-10 text-center shadow-[0_8px_25px_rgba(3,71,28,0.07)] backdrop-blur-xl">

                <p className="text-lg font-medium text-gray-700">
                  No registrations found
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Your buyer and seller registrations
                  will appear here.
                </p>

              </div>
            )}

          {/* REGISTRATION CARDS */}
          {!loading &&
            user &&
            paginatedRegistrations.length > 0 && (

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {paginatedRegistrations.map(
                  (registration) => (

                    <div
                      key={`${registration.type}-${registration.id}`}
                       className={`rounded-2xl border border-white/80 bg-white/45 p-5 shadow-[0_8px_25px_rgba(3,71,28,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/60 hover:shadow-[0_12px_30px_rgba(3,71,28,0.12)] ${
                              registration.type === "Import"
                                ? "border-l-[8px] border-l-blue-600"
                                : "border-l-[8px] border-l-[#03471c]"
                            }`}
                    >

                      {/* CARD HEADER */}

                      <div className="mb-4 flex items-start justify-between">

                        <div>

                          <span
                            className={`
                              inline-flex
                              rounded-full
                              px-3
                              py-1
                              text-xs
                              font-medium
                              ${
                                registration.type === "Import"
                                  ? "border border-blue-200/70 bg-blue-100/65 text-blue-800"
                                  : "border border-emerald-200/70 bg-emerald-100/65 text-emerald-900"
                              }
                            `}
                          >
                            {registration.type}
                          </span>

                          <h2 className="mt-3 text-lg font-semibold text-[#03471c]">
                            {registration.productDetails?.productName ||
                              "Product not provided"}
                          </h2>

                        </div>

                        {/* DETAILS ICON */}

                        <button
                          type="button"
                          onClick={() =>
                            openDetails(
                              registration
                            )
                          }
                          title="View Details"
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-white/40 text-[#03471c] shadow-sm backdrop-blur-xl transition-all duration-200 hover:border-emerald-400/60 hover:bg-emerald-50/80 hover:shadow-md"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                            />
                            <line
                              x1="12"
                              y1="16"
                              x2="12"
                              y2="12"
                            />
                            <line
                              x1="12"
                              y1="8"
                              x2="12.01"
                              y2="8"
                            />
                          </svg>
                        </button>

                      </div>

                      {/* REQUEST ID */}

                      <div className="mb-4">

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          Request ID
                        </p>

                        <p className="mt-1 break-words font-semibold text-[#03471c]">
                          {registration.requestId ||
                            "Not provided"}
                        </p>

                      </div>

                      {/* CARD DETAILS */}

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        <div>

                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Last Modified
                          </p>

                          <p className="mt-1 text-sm text-gray-800">
                            {formatDate(
                              registration.updatedAt
                            )}
                          </p>

                        </div>

                        <div>

                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Status
                          </p>

                          <span
                             className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                  registration.status === "Completed"
                                    ? "border border-emerald-200/70 bg-emerald-100/70 text-emerald-900"
                                    : registration.status === "In-progress"
                                    ? "border border-amber-200/70 bg-amber-100/75 text-amber-900"
                                    : "border border-rose-200/70 bg-rose-100/70 text-rose-900"
                                }`}
                          >
                            {registration.status ||
                              "NA"}
                          </span>

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          {/* PAGINATION */}

          {!loading &&
            filteredRegistrations.length > 0 && (

              <div className="mt-8 flex items-center justify-center gap-6">

                {/* PREVIOUS */}

                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage(
                      (page) => page - 1
                    )
                  }
                  className="rounded-xl border border-white/80 bg-white/40 px-5 py-2.5 text-sm font-semibold text-[#03471c] shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/70 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                {/* PAGE NUMBER */}

                <span className="text-sm font-semibold text-[#03471c]">
                  Page {currentPage} of{" "}
                  {totalPages}
                </span>

                {/* NEXT */}

                <button
                  type="button"
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) => page + 1
                    )
                  }
                  className="rounded-xl border border-white/80 bg-white/40 px-5 py-2.5 text-sm font-semibold text-[#03471c] shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/70 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>

              </div>
            )}

        </div>

      </main>

      {/* =====================================================
          DETAILS POPUP
          ===================================================== */}

      {selectedRegistration && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/45 p-4 backdrop-blur-md"
          onClick={closeDetails}
        >

          {/* POPUP */}

          <div
            className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/80 bg-white/80 shadow-[0_20px_60px_rgba(3,71,28,0.20)] backdrop-blur-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* =================================================
                POPUP HEADER
                ================================================= */}

            <div
              className="flex shrink-0 items-center justify-between border-b border-emerald-900/10 bg-white/45 px-6 py-5 backdrop-blur-xl"
            >

              <div>

                <div className="flex items-center gap-3">

                  <h2 className="text-xl font-semibold text-[#03471c]">
                    Registration Details
                  </h2>

                  <span
                    className={`
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-medium
                      ${
                        selectedRegistration.type ===
                        "Import"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-green-50 text-green-700"
                      }
                    `}
                  >
                    {selectedRegistration.type}
                  </span>

                </div>

                <p className="mt-1 text-sm text-gray-500">
                  Request ID:{" "}
                  <span className="font-medium text-gray-700">
                    {selectedRegistration.requestId ||
                      "Not provided"}
                  </span>
                </p>

              </div>

              {/* CLOSE BUTTON */}

              <button
                type="button"
                onClick={closeDetails}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  text-2xl
                  text-gray-500
                  transition
                  hover:bg-gray-100
                  hover:text-gray-800
                "
                aria-label="Close"
              >
                ×
              </button>

            </div>

            {/* =================================================
                POPUP SCROLLABLE BODY
                ================================================= */}

            <div
              className="min-h-0 flex-1 overflow-y-auto bg-white/20 px-6 py-6"
            >

              {/* =================================================
                  IMPORT / BUYER
                  ================================================= */}

              {selectedRegistration.type ===
                "Import" && (
                <>

                  {/* PRODUCT DETAILS */}

                  <section className="mb-8">

                    <div className="mb-5 flex items-center gap-3">

                      <div className="h-8 w-1 rounded-full bg-[#03471c]" />

                      <h3 className="text-lg font-semibold text-[#03471c]">
                        Product Details
                      </h3>

                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                      <ReviewField
                        label="Product Category"
                        value={
                          selectedRegistration.productDetails.productCategory ===
                          "Other"
                            ? selectedRegistration.productDetails.productCategoryOther
                            : selectedRegistration.productDetails.productCategory
                        }
                      />

                      <ReviewField
                        label="Product Name"
                        value={
                          selectedRegistration.productDetails.productName
                        }
                      />

                      <ReviewField
                        label="Product Details"
                        value={
                          selectedRegistration.productDetails.productDescription
                        }
                      />

                      <ReviewField
                        label="Quality / Specifications"
                        value={
                          selectedRegistration.productDetails.qualitySpecifications
                        }
                      />

                      <ReviewField
                        label="Quantity Requirement"
                        value={`${selectedRegistration.productDetails.quantity || ""} ${
                          selectedRegistration.productDetails.quantityUnit ===
                          "Other"
                            ? selectedRegistration.productDetails.quantityUnitOther ||
                              ""
                            : selectedRegistration.productDetails.quantityUnit ||
                              ""
                        }`}
                      />

                      <ReviewField
                        label="Expected Price"
                        value={`${selectedRegistration.productDetails.priceMin || ""} - ${
                          selectedRegistration.productDetails.priceMax || ""
                        } ${
                          selectedRegistration.productDetails.currency ===
                          "Other"
                            ? selectedRegistration.productDetails.currencyOther ||
                              ""
                            : selectedRegistration.productDetails.currency ||
                              ""
                        } ${
                          selectedRegistration.productDetails.priceUnit ===
                          "Other"
                            ? selectedRegistration.productDetails.priceUnitOther ||
                              ""
                            : selectedRegistration.productDetails.priceUnit ||
                              ""
                        }`}
                      />

                    </div>

                  </section>

                  {/* LOCATION & OTHER */}

                  <section className="mb-8">

                    <div className="mb-5 flex items-center gap-3">

                      <div className="h-8 w-1 rounded-full bg-[#03471c]" />

                      <h3 className="text-lg font-semibold text-[#03471c]">
                        Location & Other Information
                      </h3>

                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                      <ReviewField
                        label="Preferred Source Country"
                        value={
                          selectedRegistration.locationDetails.preferredSourceCountry
                        }
                      />

                      <ReviewField
                        label="Preferred Source Location"
                        value={
                          selectedRegistration.locationDetails.preferredSourceLocation
                        }
                      />

                      <ReviewField
                        label="Preferred Supplier Location"
                        value={
                          selectedRegistration.locationDetails.preferredSupplierLocation
                        }
                      />

                      <ReviewField
                        label="Delivery State"
                        value={
                          selectedRegistration.locationDetails.deliveryState
                        }
                      />

                      <ReviewField
                        label="Delivery City"
                        value={
                          selectedRegistration.locationDetails.deliveryCity
                        }
                      />

                      <ReviewField
                        label="PIN Code"
                        value={
                          selectedRegistration.locationDetails.deliveryPin
                        }
                      />

                      <ReviewField
                        label="Port"
                        value={
                          selectedRegistration.locationDetails.deliveryPort
                        }
                      />

                      <ReviewField
                        label="Sample Requirement"
                        value={
                          selectedRegistration.locationDetails.sampleRequirement
                        }
                      />

                      <ReviewField
                        label="Supply Frequency"
                        value={
                          selectedRegistration.locationDetails.supplyFrequency
                        }
                      />

                      <ReviewField
                        label="Additional Requirements"
                        value={
                          selectedRegistration.locationDetails.additionalRequirements
                        }
                      />

                    </div>

                  </section>

                </>
              )}

              {/* =================================================
                  EXPORT / SELLER
                  ================================================= */}

              {selectedRegistration.type ===
                "Export" && (

                <section className="mb-8">

                  <div className="mb-5 flex items-center gap-3">

                    <div className="h-8 w-1 rounded-full bg-[#03471c]" />

                    <h3 className="text-lg font-semibold text-[#03471c]">
                      Product Details
                    </h3>

                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    <ReviewField
                      label="Product Category"
                      value={
                        selectedRegistration.productDetails.productCategory ===
                        "Other"
                          ? selectedRegistration.productDetails.productCategoryOther
                          : selectedRegistration.productDetails.productCategory
                      }
                    />

                    <ReviewField
                      label="Product Name"
                      value={
                        selectedRegistration.productDetails.productName
                      }
                    />

                    <ReviewField
                      label="Product Description"
                      value={
                        selectedRegistration.productDetails.productDescription
                      }
                    />

                    <ReviewField
                      label="Available Quantity"
                      value={`${selectedRegistration.productDetails.availableQuantity || ""} ${
                        selectedRegistration.productDetails.availableQuantityUnit ===
                        "Other"
                          ? selectedRegistration.productDetails.availableQuantityUnitOther ||
                            ""
                          : selectedRegistration.productDetails.availableQuantityUnit ||
                            ""
                      }`}
                    />

                    <ReviewField
                      label="Regular Supply Available"
                      value={
                        selectedRegistration.productDetails.regularSupplyAvailable
                      }
                    />

                    <ReviewField
                      label="Regular Supply Capacity"
                      value={`${selectedRegistration.productDetails.regularSupplyCapacity || ""} ${
                        selectedRegistration.productDetails.regularSupplyCapacityUnit ===
                        "Other"
                          ? selectedRegistration.productDetails.regularSupplyCapacityUnitOther ||
                            ""
                          : selectedRegistration.productDetails.regularSupplyCapacityUnit ||
                            ""
                      }`}
                    />

                    <ReviewField
                      label="Available From"
                      value={
                        selectedRegistration.productDetails.availableFromDate
                      }
                    />

                    <ReviewField
                      label="Available Until"
                      value={
                        selectedRegistration.productDetails.availableUntilDate
                      }
                    />

                    <ReviewField
                      label="Expected Export Rate - Minimum"
                      value={
                        selectedRegistration.productDetails.expectedExportRateMin
                      }
                    />

                    <ReviewField
                      label="Expected Export Rate - Maximum"
                      value={
                        selectedRegistration.productDetails.expectedExportRateMax
                      }
                    />

                    <ReviewField
                      label="Currency"
                      value={
                        selectedRegistration.productDetails.currency ===
                        "Other"
                          ? selectedRegistration.productDetails.currencyOther
                          : selectedRegistration.productDetails.currency
                      }
                    />

                    <ReviewField
                      label="Price Unit"
                      value={
                        selectedRegistration.productDetails.priceUnit ===
                        "Other"
                          ? selectedRegistration.productDetails.priceUnitOther
                          : selectedRegistration.productDetails.priceUnit
                      }
                    />

                    <ReviewField
                      label="Rate Negotiable"
                      value={
                        selectedRegistration.productDetails.rateNegotiable
                      }
                    />

                    <ReviewField
                      label="Origin / Production Location"
                      value={
                        selectedRegistration.productDetails.originProductionLocation
                      }
                    />

                    <ReviewField
                      label="Other Information"
                      value={
                        selectedRegistration.productDetails.additionalInformation
                      }
                    />

                  </div>

                </section>
              )}

              {/* =================================================
                  COMMON DETAILS
                  ================================================= */}

              <section className="border-t border-emerald-900/10 pt-6">

                <div className="mb-5 flex items-center gap-3">

                  <div className="h-8 w-1 rounded-full bg-[#03471c]" />

                  <h3 className="text-lg font-semibold text-[#03471c]">
                    Registration Information
                  </h3>

                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  <ReviewField
                    label="Last Modified Date"
                    value={formatDate(
                      selectedRegistration.updatedAt
                    )}
                  />

                  <ReviewField
                    label="Status"
                    value={
                      selectedRegistration.status ||
                      "NA"
                    }
                  />

                </div>

              </section>

            </div>

            {/* =================================================
                POPUP FOOTER
                ================================================= */}

            <div
              className="flex shrink-0 items-center justify-end border-t border-emerald-900/10 bg-white/45 px-6 py-4 backdrop-blur-xl"
            >

              <button
                type="button"
                onClick={closeDetails}
                className="rounded-xl border border-emerald-800/25 bg-white/40 px-6 py-2.5 text-sm font-semibold text-[#03471c] shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/75 hover:shadow-md"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}