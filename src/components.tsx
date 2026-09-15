import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Minus,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Users,
  Wifi,
  X
} from "lucide-react";
import {
  AnimatePresence,
  motion
} from "framer-motion";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate
} from "react-router-dom";
import {
  useState,
  type ReactNode
} from "react";
import {
  facilities,
  hotelInfo,
  reviews,
  rooms
} from "./data";
import type {
  BedType,
  BookingSearch,
  Room,
  RoomAvailability
} from "./types";
/* ============================================================
   HELPERS
   ============================================================ */
export function formatCurrency(
  amount: number
): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}
export function formatDate(
  date: string
): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(`${date}T00:00:00`));
}
/* ============================================================
   PAGE TRANSITION
   ============================================================ */
export function PageTransition({
  children
}: {
  children: ReactNode;
}) {
  return (
    <motion.main
      initial={{
        opacity: 0,
        y: 12
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.45,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.main>
  );
}
/* ============================================================
   HEADER
   ============================================================ */
export function Header() {
  const [mobileOpen, setMobileOpen] =
    useState(false);
  const location = useLocation();
  const navigation = [
    {
      label: "Home",
      path: "/"
    },
    {
      label: "Rooms",
      path: "/rooms"
    },
    {
      label: "Facilities",
      path: "/facilities"
    },
    {
      label: "Experience",
      path: "/experience"
    },
    {
      label: "About",
      path: "/about"
    },
    {
      label: "Contact",
      path: "/contact"
    }
  ];
  const isAdminRoute =
    location.pathname.startsWith("/admin");
  if (isAdminRoute) {
    return null;
  }
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link
            to="/"
            className="brand"
            onClick={() =>
              setMobileOpen(false)
            }
          >
            <span className="brand-mark">
              AR
            </span>
            <span className="brand-copy">
              <strong>
                Al Rahamat
              </strong>
              <small>
                HOTEL
              </small>
            </span>
          </Link>
          <nav className="desktop-nav">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  isActive
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <Link
              to="/my-booking"
              className="header-booking-link"
            >
              My Booking
            </Link>
            <Link
              to="/booking"
              className="btn btn-primary header-cta"
            >
              Book a Stay
            </Link>
            <button
              type="button"
              className="icon-button mobile-menu-button"
              aria-label="Open menu"
              onClick={() =>
                setMobileOpen(
                  !mobileOpen
                )
              }
            >
              {mobileOpen ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{
              opacity: 0,
              height: 0
            }}
            animate={{
              opacity: 1,
              height: "auto"
            }}
            exit={{
              opacity: 0,
              height: 0
            }}
          >
            <div className="container mobile-menu-inner">
              {navigation.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className="mobile-nav-link"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                >
                  {item.label}
                  <ArrowRight size={17} />
                </NavLink>
              ))}
              <Link
                to="/my-booking"
                className="mobile-nav-link"
                onClick={() =>
                  setMobileOpen(false)
                }
              >
                My Booking
                <ArrowRight size={17} />
              </Link>
              <Link
                to="/booking"
                className="btn btn-primary mobile-book-button"
                onClick={() =>
                  setMobileOpen(false)
                }
              >
                Book a Stay
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
/* ============================================================
   FOOTER
   ============================================================ */
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <Link
              to="/"
              className="brand footer-brand-link"
            >
              <span className="brand-mark">
                AR
              </span>
              <span className="brand-copy">
                <strong>
                  Al Rahamat
                </strong>
                <small>
                  HOTEL
                </small>
              </span>
            </Link>
            <p>
              A refined stay, designed
              around you. Experience
              thoughtful hospitality,
              comfortable rooms and
              memorable moments.
            </p>
            <div className="social-links">
              <a
                href="#"
                aria-label="Instagram"
              >
                <Instagram size={17} />
              </a>
              <a
                href="#"
                aria-label="Facebook"
              >
                <Facebook size={17} />
              </a>
            </div>
          </div>
          <div className="footer-column">
            <h4>Explore</h4>
            <Link to="/rooms">
              Rooms
            </Link>
            <Link to="/facilities">
              Facilities
            </Link>
            <Link to="/experience">
              Experience
            </Link>
            <Link to="/about">
              About Us
            </Link>
          </div>
          <div className="footer-column">
            <h4>Guest Services</h4>
            <Link to="/booking">
              Book a Stay
            </Link>
            <Link to="/my-booking">
              My Booking
            </Link>
            <Link to="/contact">
              Contact
            </Link>
          </div>
          <div className="footer-column footer-contact">
            <h4>Contact</h4>
            <a href={`tel:${hotelInfo.phone}`}>
              <Phone size={15} />
              {hotelInfo.phone}
            </a>
            <a
              href={`mailto:${hotelInfo.email}`}
            >
              <Mail size={15} />
              {hotelInfo.email}
            </a>
            <span>
              <MapPin size={15} />
              {hotelInfo.address}
            </span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()}{" "}
            Al Rahamat Hotel. All rights
            reserved.
          </span>
          <span>
            Designed for refined stays.
          </span>
        </div>
      </div>
    </footer>
  );
}
/* ============================================================
   SECTION HEADING
   ============================================================ */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left"
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={`section-heading ${
        align === "center"
          ? "section-heading-center"
          : ""
      }`}
    >
      {eyebrow && (
        <span className="eyebrow">
          {eyebrow}
        </span>
      )}
      <h2>{title}</h2>
      {description && (
        <p>{description}</p>
      )}
    </div>
  );
}
/* ============================================================
   BUTTON
   ============================================================ */
export function Button({
  children,
  to,
  type = "button",
  variant = "primary",
  onClick,
  disabled = false,
  fullWidth = false
}: {
  children: ReactNode;
  to?: string;
  type?: "button" | "submit" | "reset";
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost";
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
}) {
  const className = [
    "btn",
    `btn-${variant}`,
    fullWidth ? "btn-full" : ""
  ]
    .filter(Boolean)
    .join(" ");
  if (to) {
    return (
      <Link
        to={to}
        className={className}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
/* ============================================================
   HERO IMAGE
   ============================================================ */
export function HeroImage({
  image,
  alt,
  position = "center"
}: {
  image: string;
  alt: string;
  position?: string;
}) {
  return (
    <div className="hero-image-wrap">
      <img
        src={image}
        alt={alt}
        className="hero-image"
        style={{
          objectPosition: position
        }}
      />
      <div className="hero-image-overlay" />
    </div>
  );
}
/* ============================================================
   ROOM CARD
   ============================================================ */
export function RoomCard({
  room,
  availability,
  showAvailability = false
}: {
  room: Room;
  availability?: RoomAvailability;
  showAvailability?: boolean;
}) {
  const available =
    availability?.available_units ??
    room.total_units;
  return (
    <motion.article
      className="room-card"
      whileHover={{
        y: -5
      }}
      transition={{
        duration: 0.25
      }}
    >
      <Link
        to={`/rooms/${room.slug}`}
        className="room-card-image-link"
      >
        <div className="room-card-image">
          <img
            src={room.image_url}
            alt={room.name}
          />
          <span className="room-card-price">
            {formatCurrency(
              room.price_per_night
            )}
            <small>
              / night
            </small>
          </span>
        </div>
      </Link>
      <div className="room-card-body">
        <div className="room-card-top">
          <div>
            <span className="card-eyebrow">
              {room.room_size} sq ft
            </span>
            <h3>{room.name}</h3>
          </div>
          <span className="room-bed">
            <BedDouble size={16} />
            {room.bed_type}
          </span>
        </div>
        <p>
          {room.description}
        </p>
        <div className="room-meta">
          <span>
            <Users size={15} />
            Up to {room.max_guests}
          </span>
          <span>
            <Wifi size={15} />
            Wi-Fi
          </span>
        </div>
        {showAvailability && (
          <div
            className={
              available > 0
                ? "availability-good"
                : "availability-none"
            }
          >
            {available > 0
              ? `${available} room${
                  available === 1
                    ? ""
                    : "s"
                } available`
              : "Sold out"}
          </div>
        )}
        <Link
          to={`/rooms/${room.slug}`}
          className="text-link"
        >
          View room
          <ArrowRight size={16} />
        </Link>
      </div>
    </motion.article>
  );
}
/* ============================================================
   ROOM GRID
   ============================================================ */
export function RoomGrid({
  limit
}: {
  limit?: number;
}) {
  const displayedRooms = limit
    ? rooms.slice(0, limit)
    : rooms;
  return (
    <div className="room-grid">
      {displayedRooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
        />
      ))}
    </div>
  );
}
/* ============================================================
   BOOKING SEARCH
   ============================================================ */
export function BookingSearchBar({
  initialValues,
  compact = false
}: {
  initialValues?: Partial<BookingSearch>;
  compact?: boolean;
}) {
  const navigate = useNavigate();
  const today =
    new Date().toISOString().split("T")[0];
  const tomorrow = new Date(
    Date.now() + 86400000
  )
    .toISOString()
    .split("T")[0];
  const [checkIn, setCheckIn] =
    useState(
      initialValues?.checkIn || today
    );
  const [checkOut, setCheckOut] =
    useState(
      initialValues?.checkOut || tomorrow
    );
  const [adults, setAdults] =
    useState(
      initialValues?.adults || 1
    );
  const [children, setChildren] =
    useState(
      initialValues?.children || 0
    );
  const [roomsCount, setRoomsCount] =
    useState(
      initialValues?.rooms || 1
    );
  const [bedType, setBedType] =
    useState<BedType>(
      initialValues?.bedType ||
        "King Bed"
    );
  const [error, setError] =
    useState("");
  function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();
    setError("");
    if (!checkIn || !checkOut) {
      setError(
        "Please select both dates."
      );
      return;
    }
    if (checkOut <= checkIn) {
      setError(
        "Check-out must be after check-in."
      );
      return;
    }
    const params =
      new URLSearchParams({
        checkIn,
        checkOut,
        adults: String(adults),
        children: String(children),
        rooms: String(roomsCount),
        bedType
      });
    navigate(
      `/booking/rooms?${params.toString()}`
    );
  }
  return (
    <form
      className={`booking-search ${
        compact
          ? "booking-search-compact"
          : ""
      }`}
      onSubmit={handleSubmit}
    >
      <div className="booking-field">
        <label>
          <CalendarDays size={16} />
          Check in
        </label>
        <input
          type="date"
          min={today}
          value={checkIn}
          onChange={(event) =>
            setCheckIn(
              event.target.value
            )
          }
        />
      </div>
      <div className="booking-field">
        <label>
          <CalendarDays size={16} />
          Check out
        </label>
        <input
          type="date"
          min={checkIn || today}
          value={checkOut}
          onChange={(event) =>
            setCheckOut(
              event.target.value
            )
          }
        />
      </div>
      <NumberField
        label="Adults"
        value={adults}
        min={1}
        onChange={setAdults}
      />
      <NumberField
        label="Children"
        value={children}
        min={0}
        onChange={setChildren}
      />
      <NumberField
        label="Rooms"
        value={roomsCount}
        min={1}
        onChange={setRoomsCount}
      />
      <div className="booking-field">
        <label>
          <BedDouble size={16} />
          Bed
        </label>
        <div className="select-wrap">
          <select
            value={bedType}
            onChange={(event) =>
              setBedType(
                event.target
                  .value as BedType
              )
            }
          >
            <option>
              King Bed
            </option>
            <option>
              Queen Bed
            </option>
            <option>
              Twin Beds
            </option>
            <option>
              Single Bed
            </option>
          </select>
          <ChevronDown size={16} />
        </div>
      </div>
      <button
        type="submit"
        className="btn btn-primary booking-search-button"
      >
        <Search size={17} />
        Search rooms
      </button>
      {error && (
        <div className="booking-search-error">
          {error}
        </div>
      )}
    </form>
  );
}
/* ============================================================
   NUMBER FIELD
   ============================================================ */
function NumberField({
  label,
  value,
  min,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="booking-field">
      <label>{label}</label>
      <div className="number-control">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          disabled={value <= min}
          onClick={() =>
            onChange(
              Math.max(
                min,
                value - 1
              )
            )
          }
        >
          <Minus size={14} />
        </button>
        <span>{value}</span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() =>
            onChange(value + 1)
          }
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
/* ============================================================
   BOOKING SUMMARY
   ============================================================ */
export function BookingSummary({
  room,
  checkIn,
  checkOut,
  adults,
  children,
  roomsCount
}: {
  room: Room;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomsCount: number;
}) {
  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.round(
            (new Date(
              `${checkOut}T00:00:00`
            ).getTime() -
              new Date(
                `${checkIn}T00:00:00`
              ).getTime()) /
              86400000
          )
        )
      : 0;
  const roomTotal =
    nights *
    room.price_per_night *
    roomsCount;
  return (
    <aside className="booking-summary">
      <div className="summary-room">
        <img
          src={room.image_url}
          alt={room.name}
        />
        <div>
          <span className="card-eyebrow">
            Your room
          </span>
          <h3>{room.name}</h3>
          <span>
            {room.bed_type}
          </span>
        </div>
      </div>
      <div className="summary-divider" />
      <div className="summary-row">
        <span>Check in</span>
        <strong>
          {formatDate(checkIn)}
        </strong>
      </div>
      <div className="summary-row">
        <span>Check out</span>
        <strong>
          {formatDate(checkOut)}
        </strong>
      </div>
      <div className="summary-row">
        <span>Guests</span>
        <strong>
          {adults} adult
          {adults !== 1 ? "s" : ""}
          {children > 0
            ? `, ${children} child${
                children !== 1
                  ? "ren"
                  : ""
              }`
            : ""}
        </strong>
      </div>
      <div className="summary-row">
        <span>Rooms</span>
        <strong>
          {roomsCount}
        </strong>
      </div>
      <div className="summary-row">
        <span>Stay</span>
        <strong>
          {nights} night
          {nights !== 1 ? "s" : ""}
        </strong>
      </div>
      <div className="summary-divider" />
      <div className="summary-price">
        <span>Total</span>
        <strong>
          {formatCurrency(
            roomTotal
          )}
        </strong>
      </div>
      <small className="summary-note">
        Final booking amount is
        calculated from live room
        availability and the hotel's
        current room rate.
      </small>
    </aside>
  );
}
/* ============================================================
   FEATURE / FACILITY CARD
   ============================================================ */
export function FacilityCard({
  title,
  description,
  index
}: {
  title: string;
  description: string;
  index?: number;
}) {
  return (
    <motion.div
      className="facility-card"
      initial={{
        opacity: 0,
        y: 20
      }}
      whileInView={{
        opacity: 1,
        y: 0
      }}
      viewport={{
        once: true,
        amount: 0.2
      }}
      transition={{
        duration: 0.45,
        delay: (index ?? 0) * 0.04
      }}
    >
      <span className="facility-number">
        {String(
          (index ?? 0) + 1
        ).padStart(2, "0")}
      </span>
      <div className="facility-icon">
        <Check size={17} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
}
/* ============================================================
   FACILITY GRID
   ============================================================ */
export function FacilityGrid() {
  return (
    <div className="facility-grid">
      {facilities.map(
        (facility, index) => (
          <FacilityCard
            key={facility.title}
            title={facility.title}
            description={
              facility.description
            }
            index={index}
          />
        )
      )}
    </div>
  );
}
/* ============================================================
   REVIEW CARD
   ============================================================ */
export function ReviewCard({
  name,
  rating,
  text,
  index = 0
}: {
  name: string;
  rating: number;
  text: string;
  index?: number;
}) {
  return (
    <motion.article
      className="review-card"
      initial={{
        opacity: 0,
        y: 20
      }}
      whileInView={{
        opacity: 1,
        y: 0
      }}
      viewport={{
        once: true
      }}
      transition={{
        duration: 0.45,
        delay: index * 0.08
      }}
    >
      <div className="review-stars">
        {Array.from({
          length: rating
        }).map((_, starIndex) => (
          <Star
            key={starIndex}
            size={15}
            fill="currentColor"
          />
        ))}
      </div>
      <p>
        “{text}”
      </p>
      <strong>{name}</strong>
      <span>Verified guest</span>
    </motion.article>
  );
}
/* ============================================================
   REVIEWS
   ============================================================ */
export function Reviews() {
  return (
    <div className="review-grid">
      {reviews.map(
        (review, index) => (
          <ReviewCard
            key={review.name}
            name={review.name}
            rating={review.rating}
            text={review.text}
            index={index}
          />
        )
      )}
    </div>
  );
}
/* ============================================================
   TRUST STRIP
   ============================================================ */
export function TrustStrip() {
  const items = [
    {
      icon: ShieldCheck,
      title: "Secure booking",
      text: "Your reservation is safely stored."
    },
    {
      icon: CalendarDays,
      title: "Real availability",
      text: "Dates are checked before booking."
    },
    {
      icon: Clock3,
      title: "24/7 assistance",
      text: "Our team is available when you need us."
    },
    {
      icon: Wifi,
      title: "Guest comfort",
      text: "Thoughtful essentials included."
    }
  ];
  return (
    <div className="trust-strip">
      <div className="container trust-grid">
        {items.map(
          ({
            icon: Icon,
            title,
            text
          }) => (
            <div
              className="trust-item"
              key={title}
            >
              <div className="trust-icon">
                <Icon size={19} />
              </div>
              <div>
                <strong>
                  {title}
                </strong>
                <span>{text}</span>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
/* ============================================================
   CTA SECTION
   ============================================================ */
export function BookingCTA({
  title = "Your stay starts here.",
  description = "Choose your dates, find your room and let us take care of the rest."
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="booking-cta">
      <div className="container">
        <div className="booking-cta-inner">
          <div>
            <span className="eyebrow">
              Reserve your stay
            </span>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          <Link
            to="/booking"
            className="btn btn-light"
          >
            Book a Stay
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
/* ============================================================
   BREADCRUMB
   ============================================================ */
export function Breadcrumb({
  items
}: {
  items: {
    label: string;
    to?: string;
  }[];
}) {
  return (
    <div className="breadcrumb">
      <Link to="/">
        Home
      </Link>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`}>
          <span className="breadcrumb-separator">
            /
          </span>
          {item.to ? (
            <Link to={item.to}>
              {item.label}
            </Link>
          ) : (
            <span className="breadcrumb-current">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
/* ============================================================
   LOADING STATE
   ============================================================ */
export function LoadingState({
  text = "Loading..."
}: {
  text?: string;
}) {
  return (
    <div className="loading-state">
      <div className="loading-spinner" />
      <span>{text}</span>
    </div>
  );
}
/* ============================================================
   ERROR STATE
   ============================================================ */
export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="error-state">
      <div className="error-state-icon">
        !
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
      {onRetry && (
        <button
          type="button"
          className="btn btn-outline"
          onClick={onRetry}
        >
          Try again
        </button>
      )}
    </div>
  );
}
/* ============================================================
   EMPTY STATE
   ============================================================ */
export function EmptyState({
  title,
  message,
  action
}: {
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Search size={22} />
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  );
}
/* ============================================================
   FORM FIELD
   ============================================================ */
export function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  autoComplete
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <div className="form-field">
      <label htmlFor={name}>
        {label}
        {required && (
          <span className="required-mark">
            *
          </span>
        )}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
      />
      {error && (
        <span className="field-error">
          {error}
        </span>
      )}
    </div>
  );
}
/* ============================================================
   TEXTAREA FIELD
   ============================================================ */
export function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
}) {
  return (
    <div className="form-field">
      <label htmlFor={name}>
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={5}
      />
    </div>
  );
}
/* ============================================================
   CONTACT INFO
   ============================================================ */
export function ContactInfo() {
  return (
    <div className="contact-info-list">
      <a
        href={`tel:${hotelInfo.phone}`}
        className="contact-info-item"
      >
        <span className="contact-info-icon">
          <Phone size={18} />
        </span>
        <span>
          <small>Call us</small>
          <strong>
            {hotelInfo.phone}
          </strong>
        </span>
      </a>
      <a
        href={`mailto:${hotelInfo.email}`}
        className="contact-info-item"
      >
        <span className="contact-info-icon">
          <Mail size={18} />
        </span>
        <span>
          <small>Email us</small>
          <strong>
            {hotelInfo.email}
          </strong>
        </span>
      </a>
      <div className="contact-info-item">
        <span className="contact-info-icon">
          <MapPin size={18} />
        </span>
        <span>
          <small>Visit us</small>
          <strong>
            {hotelInfo.address}
          </strong>
        </span>
      </div>
    </div>
  );
}
/* ============================================================
   HOTEL TIMINGS
   ============================================================ */
export function HotelTimings() {
  return (
    <div className="hotel-timings">
      <div>
        <span>
          Check-in
        </span>
        <strong>
          {hotelInfo.checkInTime}
        </strong>
      </div>
      <div>
        <span>
          Check-out
        </span>
        <strong>
          {hotelInfo.checkOutTime}
        </strong>
      </div>
    </div>
  );
}
/* ============================================================
   PAGE SHELL
   ============================================================ */
export function SiteShell({
  children
}: {
  children: ReactNode;
}) {
  return (
    <div className="site">
      <Header />
      <PageTransition>
        {children}
      </PageTransition>
      <Footer />
    </div>
  );
}
/* ============================================================
   ADMIN SHELL
   ============================================================ */
export function AdminShell({
  children
}: {
  children: ReactNode;
}) {
  return (
    <div className="admin-site">
      {children}
    </div>
  );
}
