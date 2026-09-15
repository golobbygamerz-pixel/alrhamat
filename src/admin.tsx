import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  DoorOpen,
  LogIn,
  LogOut,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

import {
  Button,
  EmptyState,
  ErrorState,
  FormField,
  LoadingState,
  PageTransition,
} from "./components";

import {
  adminLogin,
  adminLogout,
  assignRoom,
  getAdminBookings,
  getAdminStats,
  getCurrentAdmin,
  getRoomAssignments,
  getRoomUnits,
  removeRoomAssignment,
  updateBookingStatus,
  updatePaymentStatus,
  updateRoomStatus,
} from "./lib/booking";

import type {
  BookingStatus,
  PaymentStatus,
  RoomStatus,
} from "./types";

import type {
  AdminStats,
  BookingWithRoom,
  RoomAssignment,
  RoomUnit,
} from "./lib/booking";

/* =====================================
   HELPERS
===================================== */

function formatCurrency(amount: number) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

function formatDate(date: string) {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function formatStatus(status: string) {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) =>
      letter.toUpperCase()
    );
}

function statusClass(status: string) {
  return `admin-status ${status.replace(/_/g, "-")}`;
}

/* =====================================
   ADMIN AUTH GUARD
===================================== */

function AdminGuard({
  children,
}: {
  children: ReactNode;
}) {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;

    getCurrentAdmin()
      .then((admin) => {
        if (active) {
          setAuthenticated(Boolean(admin));
        }
      })
      .catch(() => {
        if (active) {
          setAuthenticated(false);
        }
      })
      .finally(() => {
        if (active) {
          setChecking(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (checking) {
    return (
      <LoadingState text="Checking admin session..." />
    );
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

/* =====================================
   ADMIN LOGIN
===================================== */

export function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      await adminLogin(email.trim(), password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <main className="admin-login-page">
        <div className="admin-login-card">
          <div className="admin-brand-mark">
            <ShieldCheck size={28} />
          </div>

          <span className="eyebrow">
            AL RAHAMAT HOTEL
          </span>

          <h1>Admin portal</h1>

          <p>
            Sign in to manage reservations, rooms and hotel
            operations.
          </p>

          <form
            className="admin-login-form"
            onSubmit={handleSubmit}
          >
            <FormField
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="admin@example.com"
              required
              autoComplete="email"
            />

            <FormField
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <LogIn size={17} />}
            </Button>
          </form>

          <Link
            className="admin-back-link"
            to="/"
          >
            Back to hotel website
          </Link>
        </div>
      </main>
    </PageTransition>
  );
}

/* =====================================
   ADMIN NAVIGATION
===================================== */

function AdminNavigation() {
  const location = useLocation();

  const links = [
    {
      to: "/admin",
      label: "Dashboard",
      icon: <ClipboardList size={18} />,
    },
    {
      to: "/admin/bookings",
      label: "Bookings",
      icon: <CalendarDays size={18} />,
    },
    {
      to: "/admin/rooms",
      label: "Rooms",
      icon: <DoorOpen size={18} />,
    },
    {
      to: "/admin/calendar",
      label: "Calendar",
      icon: <CalendarDays size={18} />,
    },
  ];

  return (
    <nav className="admin-navigation">
      {links.map((link) => {
        const active =
          location.pathname === link.to ||
          (link.to !== "/admin" &&
            location.pathname.startsWith(link.to));

        return (
          <Link
            key={link.to}
            to={link.to}
            className={active ? "active" : ""}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/* =====================================
   ADMIN LAYOUT
===================================== */

function AdminLayout({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
}) {
  const navigate = useNavigate();

  const [loggingOut, setLoggingOut] = useState(false);

  const logout = async () => {
    setLoggingOut(true);

    try {
      await adminLogout();
    } finally {
      navigate("/admin/login", {
        replace: true,
      });
    }
  };

  return (
    <AdminGuard>
      <PageTransition>
        <div className="admin-app">
          <aside className="admin-sidebar">
            <div className="admin-sidebar-brand">
              <div className="admin-logo">
                AR
              </div>

              <div>
                <strong>Al Rahamat</strong>
                <span>Hotel Admin</span>
              </div>
            </div>

            <AdminNavigation />

            <div className="admin-sidebar-bottom">
              <Link to="/">
                <ChevronLeft size={16} />
                Hotel website
              </Link>

              <button
                type="button"
                onClick={logout}
                disabled={loggingOut}
              >
                <LogOut size={16} />
                {loggingOut
                  ? "Signing out..."
                  : "Sign out"}
              </button>
            </div>
          </aside>

          <div className="admin-main">
            <header className="admin-topbar">
              <div>
                <span className="eyebrow">
                  AL RAHAMAT HOTEL
                </span>

                <h1>{title}</h1>

                {subtitle && <p>{subtitle}</p>}
              </div>

              <div className="admin-topbar-actions">
                <Link
                  to="/"
                  className="admin-site-link"
                >
                  View website
                </Link>
              </div>
            </header>

            <main className="admin-content">
              {children}
            </main>
          </div>
        </div>
      </PageTransition>
    </AdminGuard>
  );
}

/* =====================================
   STAT CARD
===================================== */

function StatCard({
  label,
  value,
  icon,
  detail,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  detail?: string;
}) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-top">
        <span>{label}</span>

        <div className="admin-stat-icon">
          {icon}
        </div>
      </div>

      <strong>{value}</strong>

      {detail && <small>{detail}</small>}
    </div>
  );
}

/* =====================================
   DASHBOARD
===================================== */

export function AdminDashboard() {
  const [stats, setStats] =
    useState<AdminStats | null>(null);

  const [bookings, setBookings] =
    useState<BookingWithRoom[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [statsData, bookingData] =
        await Promise.all([
          getAdminStats(),
          getAdminBookings(),
        ]);

      setStats(statsData);
      setBookings(bookingData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <AdminLayout
        title="Dashboard"
        subtitle="Today's hotel overview"
      >
        <LoadingState text="Loading dashboard..." />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Dashboard">
        <ErrorState
          title="Dashboard unavailable"
          message={error}
          onRetry={loadDashboard}
        />
      </AdminLayout>
    );
  }

  const recentBookings = bookings.slice(0, 6);

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Today's hotel overview"
    >
      <div className="admin-page-actions">
        <button
          type="button"
          className="admin-refresh"
          onClick={loadDashboard}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <section className="admin-stat-grid">
        <StatCard
          label="Total rooms"
          value={stats?.total_rooms ?? 0}
          icon={<DoorOpen size={20} />}
        />

        <StatCard
          label="Available rooms"
          value={stats?.available_rooms ?? 0}
          icon={<CheckCircle2 size={20} />}
        />

        <StatCard
          label="Occupied rooms"
          value={stats?.occupied_rooms ?? 0}
          icon={<Users size={20} />}
        />

        <StatCard
          label="Pending bookings"
          value={stats?.pending_bookings ?? 0}
          icon={<ClipboardList size={20} />}
        />

        <StatCard
          label="Today's check-ins"
          value={stats?.today_check_ins ?? 0}
          icon={<LogIn size={20} />}
        />

        <StatCard
          label="Today's check-outs"
          value={stats?.today_check_outs ?? 0}
          icon={<LogOut size={20} />}
        />

        <StatCard
          label="Today's revenue"
          value={formatCurrency(
            stats?.today_revenue ?? 0
          )}
          icon={
            <span className="rupee-symbol">
              ₹
            </span>
          }
        />
      </section>

      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <span className="eyebrow">
              RECENT RESERVATIONS
            </span>

            <h2>Latest bookings</h2>
          </div>

          <Link
            className="admin-panel-link"
            to="/admin/bookings"
          >
            View all
            <ChevronRight size={16} />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <EmptyState
            title="No bookings yet"
            message="New reservations will appear here."
          />
        ) : (
          <BookingTable
            bookings={recentBookings}
            compact
          />
        )}
      </section>
    </AdminLayout>
  );
}

/* =====================================
   BOOKING TABLE
===================================== */

function BookingTable({
  bookings,
  compact = false,
  onChanged,
}: {
  bookings: BookingWithRoom[];
  compact?: boolean;
  onChanged?: () => void;
}) {
  const [updating, setUpdating] =
    useState<string | null>(null);

  const changeStatus = async (
    booking: BookingWithRoom,
    status: BookingStatus
  ) => {
    setUpdating(booking.id);

    try {
      await updateBookingStatus(
        booking.id,
        status
      );

      onChanged?.();
    } catch (err) {
      window.alert(
        err instanceof Error
          ? err.message
          : "Unable to update booking."
      );
    } finally {
      setUpdating(null);
    }
  };

  const changePayment = async (
    booking: BookingWithRoom,
    status: PaymentStatus
  ) => {
    setUpdating(booking.id);

    try {
      await updatePaymentStatus(
        booking.id,
        status
      );

      onChanged?.();
    } catch (err) {
      window.alert(
        err instanceof Error
          ? err.message
          : "Unable to update payment."
      );
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Booking</th>
            <th>Guest</th>
            <th>Stay</th>
            <th>Room</th>

            {!compact && <th>Guests</th>}
            {!compact && <th>Amount</th>}

            <th>Status</th>

            {!compact && <th>Payment</th>}
            {!compact && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>
                <strong>
                  {booking.booking_code}
                </strong>

                <small>
                  {formatDate(
                    booking.created_at?.split(
                      "T"
                    )[0] || ""
                  )}
                </small>
              </td>

              <td>
                <strong>
                  {booking.guest_first_name}{" "}
                  {booking.guest_last_name}
                </strong>

                <small>{booking.phone}</small>
                <small>{booking.email}</small>
              </td>

              <td>
                <strong>
                  {formatDate(
                    booking.check_in
                  )}
                </strong>

                <small>
                  →{" "}
                  {formatDate(
                    booking.check_out
                  )}
                </small>
              </td>

              <td>
                <strong>
                  {booking.room?.name ||
                    "Room"}
                </strong>

                <small>
                  {booking.rooms_count} room
                  {booking.rooms_count > 1
                    ? "s"
                    : ""}
                </small>

                <small>
                  {booking.bed_type}
                </small>
              </td>

              {!compact && (
                <td>
                  <strong>
                    {booking.adults} adults
                  </strong>

                  <small>
                    {booking.children} children
                  </small>
                </td>
              )}

              {!compact && (
                <td>
                  <strong>
                    {formatCurrency(
                      booking.total_amount
                    )}
                  </strong>
                </td>
              )}

              <td>
                <span
                  className={statusClass(
                    booking.status
                  )}
                >
                  {formatStatus(
                    booking.status
                  )}
                </span>
              </td>

              {!compact && (
                <td>
                  <select
                    className="admin-select small"
                    value={
                      booking.payment_status
                    }
                    disabled={
                      updating === booking.id
                    }
                    onChange={(event) =>
                      changePayment(
                        booking,
                        event.target
                          .value as PaymentStatus
                      )
                    }
                  >
                    <option value="pending">
                      Pending
                    </option>

                    <option value="paid">
                      Paid
                    </option>

                    <option value="failed">
                      Failed
                    </option>

                    <option value="refunded">
                      Refunded
                    </option>
                  </select>
                </td>
              )}

              {!compact && (
                <td>
                  <BookingActions
                    booking={booking}
                    updating={
                      updating === booking.id
                    }
                    onStatusChange={
                      changeStatus
                    }
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* =====================================
   BOOKING ACTIONS
===================================== */

function BookingActions({
  booking,
  updating,
  onStatusChange,
}: {
  booking: BookingWithRoom;
  updating: boolean;
  onStatusChange: (
    booking: BookingWithRoom,
    status: BookingStatus
  ) => void;
}) {
  if (booking.status === "cancelled") {
    return (
      <span className="muted-text">
        Cancelled
      </span>
    );
  }

  if (booking.status === "checked_out") {
    return (
      <span className="muted-text">
        Completed
      </span>
    );
  }

  return (
    <div className="admin-action-buttons">
      {booking.status === "pending" && (
        <>
          <button
            type="button"
            className="action-confirm"
            disabled={updating}
            onClick={() =>
              onStatusChange(
                booking,
                "confirmed"
              )
            }
            title="Confirm booking"
          >
            <Check size={15} />
          </button>

          <button
            type="button"
            className="action-cancel"
            disabled={updating}
            onClick={() =>
              onStatusChange(
                booking,
                "cancelled"
              )
            }
            title="Cancel booking"
          >
            <X size={15} />
          </button>
        </>
      )}

      {booking.status === "confirmed" && (
        <>
          <button
            type="button"
            className="action-primary"
            disabled={updating}
            onClick={() =>
              onStatusChange(
                booking,
                "checked_in"
              )
            }
            title="Check in"
          >
            <LogIn size={15} />
            Check-in
          </button>

          <button
            type="button"
            className="action-cancel"
            disabled={updating}
            onClick={() =>
              onStatusChange(
                booking,
                "cancelled"
              )
            }
            title="Cancel booking"
          >
            <X size={15} />
          </button>
        </>
      )}

      {booking.status === "checked_in" && (
        <button
          type="button"
          className="action-primary"
          disabled={updating}
          onClick={() =>
            onStatusChange(
              booking,
              "checked_out"
            )
          }
          title="Check out"
        >
          <LogOut size={15} />
          Check-out
        </button>
      )}
    </div>
  );
}

/* =====================================
   ADMIN BOOKINGS
===================================== */

export function AdminBookings() {
  const [bookings, setBookings] =
    useState<BookingWithRoom[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<"all" | BookingStatus>("all");

  const loadBookings = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAdminBookings();
      setBookings(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return bookings.filter((booking) => {
      const matchesStatus =
        statusFilter === "all" ||
        booking.status === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchable = [
        booking.booking_code,
        booking.guest_first_name,
        booking.guest_last_name,
        booking.phone,
        booking.email,
        booking.room?.name || "",
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [
    bookings,
    search,
    statusFilter,
  ]);

  return (
    <AdminLayout
      title="Bookings"
      subtitle="Manage guest reservations"
    >
      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={17} />

          <input
            type="search"
            placeholder="Search booking, guest, phone..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <select
          className="admin-select"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as
                | "all"
                | BookingStatus
            )
          }
        >
          <option value="all">
            All statuses
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="confirmed">
            Confirmed
          </option>

          <option value="checked_in">
            Checked-in
          </option>

          <option value="checked_out">
            Checked-out
          </option>

          <option value="cancelled">
            Cancelled
          </option>
        </select>

        <button
          type="button"
          className="admin-refresh"
          onClick={loadBookings}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <span className="eyebrow">
              RESERVATION MANAGEMENT
            </span>

            <h2>
              {filteredBookings.length} booking
              {filteredBookings.length !== 1
                ? "s"
                : ""}
            </h2>
          </div>
        </div>

        {loading ? (
          <LoadingState text="Loading bookings..." />
        ) : error ? (
          <ErrorState
            title="Bookings unavailable"
            message={error}
            onRetry={loadBookings}
          />
        ) : filteredBookings.length === 0 ? (
          <EmptyState
            title="No bookings found"
            message="Try changing your search or status filter."
          />
        ) : (
          <BookingTable
            bookings={filteredBookings}
            onChanged={loadBookings}
          />
        )}
      </section>
    </AdminLayout>
  );
}

/* =====================================
   ROOM STATUS
===================================== */

function RoomStatusSelect({
  room,
  onChanged,
}: {
  room: RoomUnit;
  onChanged: () => void;
}) {
  const [updating, setUpdating] =
    useState(false);

  const handleChange = async (
    status: RoomStatus
  ) => {
    setUpdating(true);

    try {
      await updateRoomStatus(
        room.id,
        status
      );

      onChanged();
    } catch (err) {
      window.alert(
        err instanceof Error
          ? err.message
          : "Unable to update room status."
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <select
      className="admin-select small"
      value={room.status}
      disabled={updating}
      onChange={(event) =>
        handleChange(
          event.target.value as RoomStatus
        )
      }
    >
      <option value="available">
        Available
      </option>

      <option value="occupied">
        Occupied
      </option>

      <option value="cleaning">
        Cleaning
      </option>

      <option value="maintenance">
        Maintenance
      </option>
    </select>
  );
}

/* =====================================
   ROOM ASSIGNMENT
===================================== */

function RoomAssignmentControl({
  booking,
  rooms,
  assignments,
  onChanged,
}: {
  booking: BookingWithRoom;
  rooms: RoomUnit[];
  assignments: RoomAssignment[];
  onChanged: () => void;
}) {
  const [updating, setUpdating] =
    useState(false);

  const assigned = assignments.filter(
    (assignment) =>
      assignment.booking_id === booking.id
  );

  const availableRooms = rooms.filter(
    (room) =>
      room.status === "available" ||
      assigned.some(
        (assignment) =>
          assignment.room_unit_id ===
          room.id
      )
  );

  const handleAssign = async (
    roomId: string
  ) => {
    if (!roomId) return;

    setUpdating(true);

    try {
      await assignRoom(
        booking.id,
        roomId
      );

      onChanged();
    } catch (err) {
      window.alert(
        err instanceof Error
          ? err.message
          : "Unable to assign room."
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async (
    roomId: string
  ) => {
    setUpdating(true);

    try {
      await removeRoomAssignment(
        booking.id,
        roomId
      );

      onChanged();
    } catch (err) {
      window.alert(
        err instanceof Error
          ? err.message
          : "Unable to remove room assignment."
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="room-assignment">
      <div className="assigned-room-list">
        {assigned.map((assignment) => {
          const assignedRoom =
            rooms.find(
              (room) =>
                room.id ===
                assignment.room_unit_id
            );

          return (
            <span
              className="assigned-room"
              key={
                assignment.room_unit_id
              }
            >
              Room{" "}
              {assignedRoom?.room_number ||
                assignment.room_unit_id}

              <button
                type="button"
                disabled={updating}
                onClick={() =>
                  handleRemove(
                    assignment.room_unit_id
                  )
                }
                title="Remove room"
              >
                <X size={13} />
              </button>
            </span>
          );
        })}
      </div>

      {assigned.length <
        booking.rooms_count && (
        <select
          className="admin-select small"
          disabled={updating}
          value=""
          onChange={(event) =>
            handleAssign(
              event.target.value
            )
          }
        >
          <option value="">
            Assign room...
          </option>

          {availableRooms
            .filter(
              (room) =>
                !assigned.some(
                  (assignment) =>
                    assignment.room_unit_id ===
                    room.id
                )
            )
            .map((room) => (
              <option
                key={room.id}
                value={room.id}
              >
                Room {room.room_number}
              </option>
            ))}
        </select>
      )}
    </div>
  );
}

/* =====================================
   ADMIN ROOMS
===================================== */

export function AdminRooms() {
  const [rooms, setRooms] =
    useState<RoomUnit[]>([]);

  const [bookings, setBookings] =
    useState<BookingWithRoom[]>([]);

  const [assignments, setAssignments] =
    useState<RoomAssignment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  const loadRooms = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        roomData,
        bookingData,
        assignmentData,
      ] = await Promise.all([
        getRoomUnits(),
        getAdminBookings(),
        getRoomAssignments(),
      ]);

      setRooms(roomData);
      setBookings(bookingData);
      setAssignments(assignmentData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load rooms."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const activeBookings = bookings.filter(
    (booking) =>
      booking.status === "confirmed" ||
      booking.status === "checked_in"
  );

  const availableCount = rooms.filter(
    (room) =>
      room.status === "available"
  ).length;

  const occupiedCount = rooms.filter(
    (room) =>
      room.status === "occupied"
  ).length;

  const cleaningCount = rooms.filter(
    (room) =>
      room.status === "cleaning"
  ).length;

  const maintenanceCount = rooms.filter(
    (room) =>
      room.status === "maintenance"
  ).length;

  return (
    <AdminLayout
      title="Rooms"
      subtitle="Manage room inventory and assignments"
    >
      <div className="room-summary-grid">
        <StatCard
          label="Available"
          value={availableCount}
          icon={
            <CheckCircle2 size={20} />
          }
        />

        <StatCard
          label="Occupied"
          value={occupiedCount}
          icon={<Users size={20} />}
        />

        <StatCard
          label="Cleaning"
          value={cleaningCount}
          icon={<RefreshCw size={20} />}
        />

        <StatCard
          label="Maintenance"
          value={maintenanceCount}
          icon={<Settings size={20} />}
        />
      </div>

      {loading ? (
        <LoadingState text="Loading rooms..." />
      ) : error ? (
        <ErrorState
          title="Rooms unavailable"
          message={error}
          onRetry={loadRooms}
        />
      ) : (
        <>
          <section className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <span className="eyebrow">
                  ROOM INVENTORY
                </span>

                <h2>All rooms</h2>
              </div>

              <button
                type="button"
                className="admin-refresh"
                onClick={loadRooms}
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>

            {rooms.length === 0 ? (
              <EmptyState
                title="No rooms found"
                message="Add room units in Supabase to manage them here."
              />
            ) : (
              <div className="room-grid-admin">
                {rooms.map((room) => {
                  /* FIX:
                     RoomAssignment only contains booking_id.
                     Find the assignment first, then find the
                     real BookingWithRoom using booking_id.
                  */
                  const assignedAssignment =
                    assignments.find(
                      (assignment) =>
                        assignment.room_unit_id ===
                        room.id
                    );

                  const assignedBooking =
                    assignedAssignment
                      ? bookings.find(
                          (booking) =>
                            booking.id ===
                            assignedAssignment.booking_id
                        )
                      : undefined;

                  return (
                    <article
                      className="admin-room-card"
                      key={room.id}
                    >
                      <div className="admin-room-top">
                        <div>
                          <span className="eyebrow">
                            {room.room?.name ||
                              "ROOM"}
                          </span>

                          <h3>
                            Room{" "}
                            {room.room_number}
                          </h3>
                        </div>

                        <span
                          className={statusClass(
                            room.status
                          )}
                        >
                          {formatStatus(
                            room.status
                          )}
                        </span>
                      </div>

                      <div className="admin-room-meta">
                        {room.room?.slug && (
                          <span>
                            {room.room.slug}
                          </span>
                        )}

                        {assignedBooking && (
                          <span>
                            Booking{" "}
                            {assignedBooking.booking_code}
                          </span>
                        )}
                      </div>

                      <RoomStatusSelect
                        room={room}
                        onChanged={loadRooms}
                      />
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <span className="eyebrow">
                  ROOM ASSIGNMENTS
                </span>

                <h2>
                  Active reservations
                </h2>
              </div>
            </div>

            {activeBookings.length === 0 ? (
              <EmptyState
                title="No active reservations"
                message="Confirmed and checked-in bookings will appear here."
              />
            ) : (
              <div className="assignment-table">
                {activeBookings.map(
                  (booking) => (
                    <div
                      className="assignment-row"
                      key={booking.id}
                    >
                      <div>
                        <strong>
                          {
                            booking.booking_code
                          }
                        </strong>

                        <span>
                          {
                            booking.guest_first_name
                          }{" "}
                          {
                            booking.guest_last_name
                          }
                        </span>

                        <small>
                          {formatDate(
                            booking.check_in
                          )}{" "}
                          →{" "}
                          {formatDate(
                            booking.check_out
                          )}
                        </small>
                      </div>

                      <RoomAssignmentControl
                        booking={booking}
                        rooms={rooms}
                        assignments={
                          assignments
                        }
                        onChanged={
                          loadRooms
                        }
                      />
                    </div>
                  )
                )}
              </div>
            )}
          </section>
        </>
      )}
    </AdminLayout>
  );
}

/* =====================================
   CALENDAR HELPERS
===================================== */

function getMonthStart(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  );
}

function getMonthEnd(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  );
}

function dateKey(date: Date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function monthLabel(date: Date) {
  return date.toLocaleDateString(
    "en-IN",
    {
      month: "long",
      year: "numeric",
    }
  );
}

/* =====================================
   ADMIN CALENDAR
===================================== */

export function AdminCalendar() {
  const [currentMonth, setCurrentMonth] =
    useState(() => new Date());

  const [bookings, setBookings] =
    useState<BookingWithRoom[]>([]);

  const [rooms, setRooms] =
    useState<RoomUnit[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  const loadCalendar = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        bookingData,
        roomData,
      ] = await Promise.all([
        getAdminBookings(),
        getRoomUnits(),
      ]);

      setBookings(bookingData);
      setRooms(roomData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load calendar."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalendar();
  }, []);

  const days = useMemo(() => {
    const start =
      getMonthStart(currentMonth);

    const end =
      getMonthEnd(currentMonth);

    const firstDay = start.getDay();

    const result: Array<
      Date | null
    > = [];

    for (
      let i = 0;
      i < firstDay;
      i++
    ) {
      result.push(null);
    }

    for (
      let day = 1;
      day <= end.getDate();
      day++
    ) {
      result.push(
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          day
        )
      );
    }

    return result;
  }, [currentMonth]);

  const activeBookings =
    bookings.filter(
      (booking) =>
        booking.status !==
          "cancelled" &&
        booking.status !==
          "checked_out"
    );

  const getDayBookings = (
    date: Date
  ) => {
    const key = dateKey(date);

    return activeBookings.filter(
      (booking) =>
        key >= booking.check_in &&
        key < booking.check_out
    );
  };

  const totalRoomCount = rooms.length;

  return (
    <AdminLayout
      title="Calendar"
      subtitle="Room occupancy and reservation calendar"
    >
      <div className="calendar-toolbar">
        <button
          type="button"
          className="calendar-nav"
          onClick={() =>
            setCurrentMonth(
              new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() -
                  1,
                1
              )
            )
          }
        >
          <ChevronLeft size={18} />
        </button>

        <h2>
          {monthLabel(currentMonth)}
        </h2>

        <button
          type="button"
          className="calendar-nav"
          onClick={() =>
            setCurrentMonth(
              new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() +
                  1,
                1
              )
            )
          }
        >
          <ChevronRight size={18} />
        </button>

        <button
          type="button"
          className="admin-refresh"
          onClick={loadCalendar}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {loading ? (
        <LoadingState text="Loading calendar..." />
      ) : error ? (
        <ErrorState
          title="Calendar unavailable"
          message={error}
          onRetry={loadCalendar}
        />
      ) : (
        <section className="admin-panel calendar-panel">
          <div className="calendar-weekdays">
            {[
              "Sun",
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
            ].map((day) => (
              <span key={day}>
                {day}
              </span>
            ))}
          </div>

          <div className="calendar-grid">
            {days.map(
              (date, index) => {
                if (!date) {
                  return (
                    <div
                      className="calendar-day empty"
                      key={`empty-${index}`}
                    />
                  );
                }

                const bookingsForDay =
                  getDayBookings(date);

                const occupancy =
                  totalRoomCount > 0
                    ? Math.min(
                        100,
                        Math.round(
                          (bookingsForDay.reduce(
                            (
                              sum,
                              booking
                            ) =>
                              sum +
                              booking.rooms_count,
                            0
                          ) /
                            totalRoomCount) *
                            100
                        )
                      )
                    : 0;

                const isToday =
                  dateKey(date) ===
                  dateKey(new Date());

                return (
                  <div
                    className={`calendar-day ${
                      isToday
                        ? "today"
                        : ""
                    }`}
                    key={dateKey(date)}
                  >
                    <div className="calendar-day-header">
                      <strong>
                        {date.getDate()}
                      </strong>

                      <small>
                        {occupancy}%
                      </small>
                    </div>

                    <div className="calendar-occupancy">
                      <span
                        style={{
                          width: `${occupancy}%`,
                        }}
                      />
                    </div>

                    <div className="calendar-bookings">
                      {bookingsForDay
                        .slice(0, 3)
                        .map(
                          (
                            booking
                          ) => (
                            <Link
                              key={
                                booking.id
                              }
                              to="/admin/bookings"
                              className={`calendar-booking ${booking.status}`}
                            >
                              <strong>
                                {
                                  booking.booking_code
                                }
                              </strong>

                              <span>
                                {
                                  booking.guest_first_name
                                }
                              </span>
                            </Link>
                          )
                        )}

                      {bookingsForDay.length >
                        3 && (
                        <small className="calendar-more">
                          +
                          {bookingsForDay.length -
                            3}{" "}
                          more
                        </small>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </section>
      )}

      <section className="admin-panel calendar-legend">
        <div>
          <span className="legend-dot pending" />
          Pending
        </div>

        <div>
          <span className="legend-dot confirmed" />
          Confirmed
        </div>

        <div>
          <span className="legend-dot checked-in" />
          Checked-in
        </div>

        <div>
          <span className="legend-dot checked-out" />
          Checked-out
        </div>
      </section>
    </AdminLayout>
  );
}