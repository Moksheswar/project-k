"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

import { auth, db } from "../../lib/firebase";
import Header from "../components/Header";

type RegistrationType = "Import" | "Export";
type FilterType = "All" | "Import" | "Export";

interface Registration {
  id: string;
  type: RegistrationType;
  requestId?: string;
  userId?: string;
  status?: string;
  createdDate?: Timestamp | string | null;
  lastModifiedDate?: Timestamp | string | null;
  updatedAt?: Timestamp | string | null;

  productDetails?: Record<string, any>;
  locationDetails?: Record<string, any>;

  [key: string]: any;
}

/*
 * IMPORTANT:
 * Replace this with the email address of your admin account.
 */
const ADMIN_EMAILS = [
  "plesam692@gmail.com",
  "admin2@gmail.com",
  "admin3@gmail.com",
].map((email) => email.toLowerCase().trim());

const ITEMS_PER_PAGE = 10;

/*
 * Safely convert a value to displayable text.
 */
function displayValue(value: any): string {
  if (value === null || value === undefined || value === "") {
    return "Not provided";
  }

  if (typeof value === "object" && typeof value.toDate === "function") {
    return value.toDate().toLocaleString("en-IN");
  }

  if (value instanceof Date) {
    return value.toLocaleString("en-IN");
  }

  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

/*
 * Safely format dates.
 */
function formatDate(value: any): string {
  if (!value) {
    return "Not provided";
  }

  try {
    let date: Date;

    if (value instanceof Timestamp) {
      date = value.toDate();
    } else if (typeof value?.toDate === "function") {
      date = value.toDate();
    } else {
      date = new Date(value);
    }

    if (Number.isNaN(date.getTime())) {
      return "Not provided";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return "Not provided";
  }
}

/*
 * Convert a date into a number for sorting.
 */
function getDateValue(value: any): number {
  if (!value) {
    return 0;
  }

  try {
    if (typeof value?.toMillis === "function") {
      return value.toMillis();
    }

    if (typeof value?.toDate === "function") {
      return value.toDate().getTime();
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
  } catch {
    return 0;
  }
}

/*
 * Reusable field for the details popup.
 */
function ReviewField({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <div className="min-h-[44px] break-words whitespace-pre-wrap rounded-xl border border-white/80 bg-white/45 px-4 py-3 text-sm text-gray-800 shadow-sm backdrop-blur-xl">
        {displayValue(value)}
      </div>
    </div>
  );
}

/*
 * Reusable section heading in the popup.
 */
function DetailSectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="h-8 w-1 rounded-full bg-[#03471c]" />

      <h3 className="text-lg font-semibold text-[#03471c]">
        {title}
      </h3>
    </div>
  );
}

/*
 * Render the fields in a nested object.
 * This avoids errors when optional fields are missing.
 */
function DetailsGrid({
  data,
  excludeKeys = [],
}: {
  data: Record<string, any>;
  excludeKeys?: string[];
}) {
  const entries = Object.entries(data || {}).filter(
    ([key, value]) =>
      !excludeKeys.includes(key) &&
      value !== undefined &&
      value !== null &&
      typeof value !== "object"
  );

  if (entries.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No additional details provided.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {entries.map(([key, value]) => (
        <ReviewField
          key={key}
          label={key
            .replace(/([A-Z])/g, " $1")
            .replace(/_/g, " ")
            .replace(/^./, (letter) => letter.toUpperCase())}
          value={value}
        />
      ))}
    </div>
  );
}

/*
 * Resolve product details.
 *
 * Supports both:
 * productDetails.productName
 *
 * and older records where product fields were saved at the root.
 */
function getProductDetails(
  registration: Registration
): Record<string, any> {
  if (
    registration.productDetails &&
    typeof registration.productDetails === "object"
  ) {
    return registration.productDetails;
  }

  const excludedKeys = [
    "id",
    "requestId",
    "userId",
    "status",
    "createdDate",
    "lastModifiedDate",
    "createdAt",
    "updatedAt",
    "locationDetails",
    "registrationType",
    "type",
  ];

  return Object.fromEntries(
    Object.entries(registration).filter(
      ([key]) => !excludedKeys.includes(key)
    )
  );
}

/*
 * Resolve location details.
 */
function getLocationDetails(
  registration: Registration
): Record<string, any> {
  if (
    registration.locationDetails &&
    typeof registration.locationDetails === "object"
  ) {
    return registration.locationDetails;
  }

  return {};
}

/*
 * Resolve the product name displayed on each card.
 */
function getProductName(registration: Registration): string {
  const productDetails = getProductDetails(registration);

  return (
    productDetails.productName ||
    registration.productName ||
    "Product not provided"
  );
}

export default function AdminHistoryPage() {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [authChecked, setAuthChecked] = useState(false);

    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [filter, setFilter] = useState<FilterType>("All");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [selectedRegistration, setSelectedRegistration] =
        useState<Registration | null>(null);

    const [editingStatusId, setEditingStatusId] = useState<string | null>(null);

    const [pendingStatus, setPendingStatus] = useState<
    "In-progress" | "Completed"
    >("In-progress");

    const [savingStatusId, setSavingStatusId] = useState<string | null>(null);

    const [statusError, setStatusError] = useState("");

  /*
   * AUTHENTICATION AND ADMIN CHECK
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setAuthChecked(true);
        router.replace("/login");
        return;
      }

      if (
        !currentUser.email ||
        !ADMIN_EMAILS.includes(currentUser.email.toLowerCase().trim())
        ){
            setUser(null);
            setAuthChecked(true);
            router.replace("/home");
            return;
        }

      setUser(currentUser);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, [router]);

  /*
   * FETCH ALL SELLER AND BUYER REGISTRATIONS.
   *
   * Unlike the normal History page, this does not filter by userId.
   * The Firestore security rules must explicitly permit authorized
   * admins to read all registration records.
   */
  useEffect(() => {
    if (!authChecked || !user) {
      return;
    }

    let cancelled = false;

    async function fetchRegistrations() {
      try {
        setLoading(true);
        setError("");

        const [sellerSnapshot, buyerSnapshot] = await Promise.all([
          getDocs(collection(db, "sellerRegistrations")),
          getDocs(collection(db, "buyerRegistrations")),
        ]);

        if (cancelled) {
          return;
        }

        const sellerRecords: Registration[] =
          sellerSnapshot.docs.map((document) => {
            const data = document.data();

            return {
              ...data,
              id: document.id,
              requestId: String(data.requestId ?? document.id),
              type: "Export",
              status: String(data.status ?? "In-progress"),
            } as Registration;
          });

        const buyerRecords: Registration[] =
          buyerSnapshot.docs.map((document) => {
            const data = document.data();

            return {
              ...data,
              id: document.id,
              requestId: String(data.requestId ?? document.id),
              type: "Import",
              status: String(data.status ?? "In-progress"),
            } as Registration;
          });

        const allRecords = [...sellerRecords, ...buyerRecords];

        /*
         * Newest/most recently modified registrations first.
         */
        allRecords.sort((a, b) => {
          const dateA = getDateValue(
            a.lastModifiedDate ?? a.updatedAt ?? a.createdDate
          );

          const dateB = getDateValue(
            b.lastModifiedDate ?? b.updatedAt ?? b.createdDate
          );

          return dateB - dateA;
        });

        setRegistrations(allRecords);
      } catch (fetchError) {
        console.error("Failed to fetch admin history:", fetchError);

        if (!cancelled) {
          setError(
            "Unable to load registration records. Check your Firestore security rules and collection names."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchRegistrations();

    return () => {
      cancelled = true;
    };
  }, [authChecked, user]);

  /*
   * FILTER AND REQUEST ID SEARCH
   */
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((registration) => {
      const matchesType =
        filter === "All" || registration.type === filter;

      const requestId = String(
        registration.requestId ?? ""
      ).toLowerCase();

      const matchesSearch = requestId.includes(
        search.trim().toLowerCase()
      );

      return matchesType && matchesSearch;
    });
  }, [registrations, filter, search]);

  /*
   * PAGINATION
   */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredRegistrations.length / ITEMS_PER_PAGE)
  );

  const paginatedRegistrations = filteredRegistrations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /*
   * Reset pagination when the filter or search changes.
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);

  /*
   * Prevent the page behind the popup from scrolling.
   */
  useEffect(() => {
    if (!selectedRegistration) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedRegistration(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedRegistration]);

  const handleStatusSave = async (registration: Registration) => {
        if (
            !user ||
            !ADMIN_EMAILS.includes(user.email?.toLowerCase().trim() ?? "")
        ) {
            setStatusError("You are not authorized to update registration status.");
            return;
        }

        const collectionName =
            registration.type === "Import"
            ? "buyerRegistrations"
            : "sellerRegistrations";

        setSavingStatusId(registration.id);
        setStatusError("");

        try {
            const registrationRef = doc(
            db,
            collectionName,
            registration.id
            );

            await updateDoc(registrationRef, {
            status: pendingStatus,
            lastModifiedDate: serverTimestamp(),
            updatedAt: serverTimestamp(),
            });

            // Update the card immediately without reloading the page.
            setRegistrations((previous) =>
            previous.map((item) =>
                item.id === registration.id &&
                item.type === registration.type
                ? {
                    ...item,
                    status: pendingStatus,
                    }
                : item
            )
            );

            // Keep the details popup synchronized.
            setSelectedRegistration((previous) =>
            previous &&
            previous.id === registration.id &&
            previous.type === registration.type
                ? {
                    ...previous,
                    status: pendingStatus,
                }
                : previous
            );

            setEditingStatusId(null);
        } catch (error) {
            console.error("Failed to update registration status:", error);

            setStatusError(
            "Unable to update status. Check your Firestore security rules."
            );
        } finally {
            setSavingStatusId(null);
        }
    };

  /*
   * Wait until Firebase has checked the signed-in user.
   */
  if (!authChecked) {
    return <div className="min-h-screen bg-[#eaf5e5]" />;
  }

  if (!user) {
    return <div className="min-h-screen bg-[#eaf5e5]" />;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat pt-[72px]"
      style={{
        backgroundImage: "url('images/skyma-dbg.jpg')",
      }}
    >
      {/* FIXED HEADER */}
      <Header user={user} />

      <main className="px-6 py-8">
        <div className="mx-auto max-w-7xl">
          {/* PAGE TITLE */}
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-[#023b18] drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
              Admin History
            </h1>

            <p className="mt-1 text-sm font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              View all buyer and seller registration requests.
            </p>
          </div>

          {/* FILTER AND SEARCH */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* FILTER */}
            <div>
              <select
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value as FilterType)
                }
                className="rounded-xl border border-white/80 bg-white/45 px-4 py-2.5 text-sm text-[#03471c] shadow-sm backdrop-blur-xl outline-none transition-all duration-200 hover:border-emerald-300 focus:border-emerald-600/60 focus:bg-white/70 focus:ring-4 focus:ring-emerald-500/10"
              >
                <option value="All">All</option>
                <option value="Import">Import</option>
                <option value="Export">Export</option>
              </select>
            </div>

            {/* SEARCH */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search Request ID"
                className="w-full rounded-xl border border-white/80 bg-white/45 px-4 py-2.5 text-sm text-gray-900 shadow-sm backdrop-blur-xl outline-none transition-all duration-200 placeholder:text-gray-500 hover:border-emerald-300 focus:border-emerald-600/60 focus:bg-white/70 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="flex min-h-[300px] items-center justify-center">
              <p className="text-sm text-gray-400">
                Loading registration history...
              </p>
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="rounded-2xl border border-white/80 bg-white/60 p-8 text-center shadow-[0_8px_25px_rgba(3,71,28,0.08)] backdrop-blur-xl">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* NO RECORDS */}
          {!loading &&
            !error &&
            paginatedRegistrations.length === 0 && (
              <div className="rounded-2xl border border-white/80 bg-white/60 p-10 text-center shadow-[0_8px_25px_rgba(3,71,28,0.08)] backdrop-blur-xl">
                <p className="text-lg font-medium text-gray-700">
                  No registrations found
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  No buyer or seller registrations match your search.
                </p>
              </div>
            )}

          {/* REGISTRATION CARDS */}
          {!loading &&
            !error &&
            paginatedRegistrations.length > 0 && (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {paginatedRegistrations.map((registration) => {
                  const status = registration.status || "NA";

                  const statusClass =
                    status.toLowerCase() === "na"
                      ? "bg-red-100 text-red-700"
                      : status.toLowerCase() === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700";

                  const lastModified =
                    registration.lastModifiedDate ??
                    registration.updatedAt;

                  return (
                    <div
                      key={`${registration.type}-${registration.id}`}
                      className={`rounded-2xl border border-white/80 bg-white/45 p-5 shadow-[0_8px_25px_rgba(3,71,28,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/60 hover:shadow-[0_12px_30px_rgba(3,71,28,0.12)] border-l-[8px] ${
                        registration.type === "Import"
                          ? "border-l-blue-600"
                          : "border-l-[#03471c]"
                      }`}
                    >
                      {/* CARD HEADER */}
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <span
                            className={`
                              inline-flex
                              rounded-full
                              px-3 py-1
                              text-xs font-medium
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
                            {getProductName(registration)}
                          </h2>
                        </div>

                        {/* DETAILS ICON */}
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedRegistration(registration)
                          }
                          title="View Details"
                          aria-label={`View details for ${registration.requestId}`}
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
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                          </svg>
                        </button>
                      </div>

                      {/* REQUEST ID */}
                      <div className="mb-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          Request ID
                        </p>

                        <p className="mt-1 break-all font-semibold text-[#03471c]">
                          {registration.requestId || "Not provided"}
                        </p>
                      </div>

                      {/* LAST MODIFIED AND STATUS */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Last Modified
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-800">
                            {formatDate(lastModified)}
                          </p>
                        </div>

                        <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Status
                        </p>

                        {editingStatusId === `${registration.type}-${registration.id}` ? (
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                            <select
                                value={pendingStatus}
                                onChange={(event) =>
                                setPendingStatus(
                                    event.target.value as "In-progress" | "Completed"
                                )
                                }
                                disabled={savingStatusId === registration.id}
                                className="rounded-xl border border-white/80 bg-white/65 px-3 py-2 text-xs text-[#03471c] shadow-sm backdrop-blur-xl outline-none focus:border-emerald-600/60 focus:ring-2 focus:ring-emerald-500/10"
                            >
                                <option value="In-progress">In-progress</option>
                                <option value="Completed">Completed</option>
                            </select>

                            {/* SAVE */}
                            <button
                                type="button"
                                onClick={() => handleStatusSave(registration)}
                                disabled={savingStatusId === registration.id}
                                title="Save status"
                                aria-label="Save status"
                                className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-200/70 bg-white/45 text-emerald-800 shadow-sm backdrop-blur-xl transition hover:bg-emerald-100/80 disabled:opacity-50"
                            >
                                {savingStatusId === registration.id ? (
                                <span className="text-xs">...</span>
                                ) : (
                                <span className="text-lg font-bold">✓</span>
                                )}
                            </button>

                            {/* CANCEL */}
                            <button
                                type="button"
                                onClick={() => {
                                setEditingStatusId(null);
                                setStatusError("");
                                }}
                                disabled={savingStatusId === registration.id}
                                title="Cancel editing"
                                aria-label="Cancel editing"
                                className="flex h-7 w-7 items-center justify-center rounded-full border border-rose-200/70 bg-white/45 text-rose-800 shadow-sm backdrop-blur-xl transition hover:bg-rose-100/80 disabled:opacity-50"
                            >
                                <span className="text-lg font-bold">×</span>
                            </button>
                            </div>
                        ) : (
                            <div className="mt-1 flex items-center gap-2">
                            <span
                                className={`
                                inline-flex rounded-full px-3 py-1
                                text-xs font-medium
                                ${
                                    status.toLowerCase() === "na"
                                      ? "border border-rose-200/70 bg-rose-100/75 text-rose-900"
                                      : status.toLowerCase() === "completed"
                                      ? "border border-emerald-200/70 bg-emerald-100/75 text-emerald-900"
                                      : "border border-amber-200/70 bg-amber-100/75 text-amber-900"
                                }
                                `}
                            >
                                {status}
                            </span>

                            {/* EDIT STATUS */}
                            <button
                                type="button"
                                onClick={() => {
                                setPendingStatus(
                                    status.toLowerCase() === "completed"
                                    ? "Completed"
                                    : "In-progress"
                                );
                                setEditingStatusId(`${registration.type}-${registration.id}`);
                                setStatusError("");
                                }}
                                title="Edit status"
                                aria-label="Edit status"
                                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/70 bg-white/35 text-[#03471c] shadow-sm backdrop-blur-xl transition hover:border-emerald-300 hover:bg-emerald-50/80 hover:text-[#03471c]"
                            >
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                >
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
                                </svg>
                            </button>
                            </div>
                        )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          {/* PAGINATION */}
          {!loading &&
            !error &&
            filteredRegistrations.length > 0 && (
              <div className="mt-8 flex items-center justify-center gap-6">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  className="rounded-xl border border-white/80 bg-white/40 px-5 py-2.5 text-sm font-semibold text-[#03471c] shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/70 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="text-sm font-semibold text-[#03471c] drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(totalPages, page + 1)
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
          REGISTRATION DETAILS POPUP
          ===================================================== */}
      {selectedRegistration && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-emerald-950/45 p-4 backdrop-blur-md"
          onClick={() => setSelectedRegistration(null)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/80 bg-white/80 shadow-[0_20px_60px_rgba(3,71,28,0.20)] backdrop-blur-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* POPUP HEADER */}
            <div
              className="flex shrink-0 items-center justify-between border-b border-emerald-900/10 bg-white/45 px-6 py-5 backdrop-blur-xl"
            >
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-semibold text-[#03471c]">
                    Registration Details
                  </h2>

                  <span
                    className={`
                      rounded-full
                      px-3 py-1
                      text-xs font-medium
                      ${
                        selectedRegistration.type === "Import"
                        ? "border border-blue-200/70 bg-blue-100/65 text-blue-800"
                        : "border border-emerald-200/70 bg-emerald-100/65 text-emerald-900"
                      }
                    `}
                  >
                    {selectedRegistration.type}
                  </span>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  Request ID:{" "}
                  <span className="font-medium text-gray-700">
                    {selectedRegistration.requestId || "Not provided"}
                  </span>
                </p>
              </div>

              {/* CLOSE BUTTON */}
              <button
                type="button"
                onClick={() => setSelectedRegistration(null)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/80 bg-white/40 text-2xl text-gray-600 shadow-sm backdrop-blur-xl transition hover:border-emerald-300 hover:bg-emerald-50/80 hover:text-[#03471c]"
                aria-label="Close registration details"
              >
                ×
              </button>
            </div>

            {/* SCROLLABLE POPUP BODY */}
            <div className="min-h-0 flex-1 overflow-y-auto bg-white/20 px-6 py-6">
              {/* COMMON DETAILS FOR IMPORT AND EXPORT */}
              <section className="mb-8">
                <DetailSectionHeading title="Registration Information" />

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <ReviewField
                    label="Request ID"
                    value={selectedRegistration.requestId}
                  />

                  <ReviewField
                    label="Last Modified Date"
                    value={formatDate(
                      selectedRegistration.lastModifiedDate ??
                        selectedRegistration.updatedAt
                    )}
                  />

                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                        Status
                    </p>

                    {editingStatusId ===
                    `${selectedRegistration.type}-${selectedRegistration.id}` ? (
                        <div className="flex flex-wrap items-center gap-2">
                        <select
                            value={pendingStatus}
                            onChange={(event) =>
                            setPendingStatus(
                                event.target.value as "In-progress" | "Completed"
                            )
                            }
                            disabled={savingStatusId === selectedRegistration.id}
                            className="min-h-[44px] rounded-xl border border-white/80 bg-white/65 px-4 py-3 text-sm text-[#03471c] shadow-sm backdrop-blur-xl outline-none focus:border-emerald-600/60 focus:ring-2 focus:ring-emerald-500/10"
                        >
                            <option value="In-progress">In-progress</option>
                            <option value="Completed">Completed</option>
                        </select>

                        <button
                            type="button"
                            onClick={() => handleStatusSave(selectedRegistration)}
                            disabled={savingStatusId === selectedRegistration.id}
                            title="Save status"
                            aria-label="Save status"
                            className="flex h-9 w-9 items-center justify-center rounded-full text-green-700 transition hover:bg-green-100 disabled:opacity-50"
                        >
                            {savingStatusId === selectedRegistration.id ? "..." : "✓"}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                            setEditingStatusId(null);
                            setStatusError("");
                            }}
                            disabled={savingStatusId === selectedRegistration.id}
                            title="Cancel editing"
                            aria-label="Cancel editing"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200/70 bg-white/45 text-emerald-800 shadow-sm backdrop-blur-xl transition hover:bg-emerald-100/80 disabled:opacity-50"
                        >
                            ×
                        </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                        <div className="min-h-[44px] flex-1 rounded-xl border border-white/80 bg-white/45 px-4 py-3 text-sm text-gray-800 shadow-sm backdrop-blur-xl">
                            {selectedRegistration.status || "NA"}
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                            setPendingStatus(
                                selectedRegistration.status?.toLowerCase() === "completed"
                                ? "Completed"
                                : "In-progress"
                            );
                            setEditingStatusId(
                                `${selectedRegistration.type}-${selectedRegistration.id}`
                            );
                            setStatusError("");
                            }}
                            title="Edit status"
                            aria-label="Edit status"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/35 text-[#03471c] shadow-sm backdrop-blur-xl transition hover:bg-emerald-50/80"
                        >
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
                            </svg>
                        </button>
                        </div>
                    )}
                    </div>
                </div>
              </section>

              {/* PRODUCT DETAILS FOR BOTH TYPES */}
              <section className="mb-8">
                <DetailSectionHeading title="Product Details" />

                <DetailsGrid
                  data={getProductDetails(selectedRegistration)}
                  excludeKeys={[
                    "productDetails",
                    "locationDetails",
                    "userId",
                    "status",
                    "requestId",
                    "createdDate",
                    "lastModifiedDate",
                    "createdAt",
                    "updatedAt",
                    "registrationType",
                    "type",
                  ]}
                />
              </section>

              {/* LOCATION DETAILS ONLY FOR IMPORT */}
              {selectedRegistration.type === "Import" && (
                <section className="mb-8">
                  <DetailSectionHeading title="Location & Other Information" />

                  <DetailsGrid
                    data={getLocationDetails(selectedRegistration)}
                  />
                </section>
              )}
            </div>

            {/* POPUP FOOTER */}
            <div className="flex shrink-0 justify-end border-t border-emerald-900/10 bg-white/45 px-6 py-4 backdrop-blur-xl">
              <button
                type="button"
                onClick={() => setSelectedRegistration(null)}
                className="rounded-xl border border-white/30 bg-emerald-800/85 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(3,71,28,0.16)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-900 hover:shadow-[0_6px_18px_rgba(3,71,28,0.22)] active:translate-y-0"
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