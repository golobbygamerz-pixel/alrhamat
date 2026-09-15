import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import {
  BookingCTA,
  BookingSearchBar,
  BookingSummary,
  Breadcrumb,
  Button,
  ContactInfo,
  EmptyState,
  ErrorState,
  FacilityGrid,
  Footer,
  FormField,
  HeroImage,
  HotelTimings,
  LoadingState,
  PageTransition,
  Reviews,
  SectionHeading,
  SiteShell,
  TextAreaField,
  TrustStrip,
} from "./components";
import {
  createBooking,
  findBooking,
  getRoomAvailability,
  getRooms,
} from "./lib/booking";
import {
  facilities,
  hotelInfo,
  reviews,
  rooms,
} from "./data";
import type {
  BedType,
  Booking,
  BookingSearch,
  Guest,
  Room,
  RoomAvailability,
} from "./types";

const SEARCH_KEY = "alrahamat_booking_search";
const ROOM_KEY = "alrahamat_selected_room";
const BOOKING_KEY = "alrahamat_created_booking";

function saveBookingSearch(search: BookingSearch) {
  sessionStorage.setItem(SEARCH_KEY, JSON.stringify(search));
}

function getBookingSearch(): BookingSearch | null {
  try {
    const value = sessionStorage.getItem(SEARCH_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function saveSelectedRoom(room: RoomAvailability) {
  sessionStorage.setItem(ROOM_KEY, JSON.stringify(room));
}

function getSelectedRoom(): RoomAvailability | null {
  try {
    const value = sessionStorage.getItem(ROOM_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function saveCreatedBooking(booking: unknown) {
  sessionStorage.setItem(BOOKING_KEY, JSON.stringify(booking));
}

function getCreatedBooking(): Booking | null {
  try {
    const value = sessionStorage.getItem(BOOKING_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function todayString() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().split("T")[0];
}

function addDays(dateString: string, days: number) {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function nightsBetween(checkIn: string, checkOut: string) {
  const start = new Date(`${checkIn}T00:00:00`).getTime();
  const end = new Date(`${checkOut}T00:00:00`).getTime();

  return Math.max(
    1,
    Math.ceil((end - start) / 86400000)
  );
}

function defaultSearch(): BookingSearch {
  const checkIn = todayString();

  return {
    checkIn,
    checkOut: addDays(checkIn, 1),
    adults: 2,
    children: 0,
    rooms: 1,
    bedType: "King Bed",
  };
}

function PageTitle({
  eyebrow,
  title,
  text,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="page-title">
      {eyebrow && (
        <span className="eyebrow">{eyebrow}</span>
      )}

      <h1>{title}</h1>

      {text && <p>{text}</p>}
    </div>
  );
}

/* =========================
   HOME
========================= */

export function Home() {
  const navigate = useNavigate();

  const handleSearch = (search: BookingSearch) => {
    saveBookingSearch(search);
    navigate("/booking/rooms");
  };

  return (
    <SiteShell>
      <PageTransition>
        <main>
          <section className="hero">
            <HeroImage
              src={rooms[0].image_url}
              alt="Al Rahamat Hotel"
            />

            <div className="hero-overlay" />

            <div className="container hero-content">
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="hero-copy"
              >
                <span className="eyebrow hero-eyebrow">
                  AL RAHAMAT HOTEL
                </span>

                <h1>
                  A refined stay, designed around you.
                </h1>

                <p>
                  Thoughtful rooms, warm Indian hospitality
                  and a peaceful place to pause.
                </p>

                <div className="hero-actions">
                  <Button
                    onClick={() =>
                      document
                        .getElementById("availability")
                        ?.scrollIntoView({
                          behavior: "smooth",
                        })
                    }
                  >
                    Check availability
                    <ArrowRight size={17} />
                  </Button>

                  <Link
                    className="button button-light-outline"
                    to="/rooms"
                  >
                    Explore rooms
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>

          <section
            id="availability"
            className="availability-section"
          >
            <div className="container">
              <BookingSearchBar
                onSearch={handleSearch}
              />
            </div>
          </section>

          <section className="section">
            <div className="container">
              <SectionHeading
                eyebrow="STAY WITH US"
                title="Rooms made for slower mornings."
                text="Choose a room that fits the way you travel."
              />

              <RoomGrid rooms={rooms.slice(0, 4)} />

              <div className="section-center">
                <Link
                  className="text-link"
                  to="/rooms"
                >
                  View all rooms
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </section>

          <TrustStrip />

          <section className="section section-ivory">
            <div className="container split-section">
              <div>
                <span className="eyebrow">
                  THE AL RAHAMAT EXPERIENCE
                </span>

                <h2>
                  Hospitality with a quieter point of view.
                </h2>

                <p className="lead">
                  Every detail is designed to make your stay
                  feel comfortable, considered and effortless.
                </p>

                <Link
                  className="text-link"
                  to="/experience"
                >
                  Discover the experience
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="experience-image">
                <img
                  src={rooms[1].image_url}
                  alt="Hotel interior"
                />
              </div>
            </div>
          </section>

          <section className="section">
            <div className="container">
              <SectionHeading
                eyebrow="FACILITIES"
                title="Everything you need, thoughtfully placed."
              />

              <FacilityGrid
                facilities={facilities.slice(0, 6)}
              />
            </div>
          </section>

          <Reviews reviews={reviews} />

          <BookingCTA />
        </main>

        <Footer />
      </PageTransition>
    </SiteShell>
  );
}

/* =========================
   ROOMS
========================= */

export function Rooms() {
  const [roomList, setRoomList] =
    useState<Room[]>(rooms);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let active = true;

    getRooms()
      .then((data) => {
        if (active && data.length > 0) {
          setRoomList(data);
        }
      })
      .catch(() => {
        // Local fallback data keeps the room catalogue visible
        // before Supabase room records are seeded.
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <SiteShell>
      <PageTransition>
        <main>
          <section className="page-hero">
            <div className="container">
              <Breadcrumb
                items={[{ label: "Rooms" }]}
              />

              <PageTitle
                eyebrow="OUR ROOMS"
                title="A room for every kind of stay."
                text="Comfortable spaces designed with simplicity, warmth and detail."
              />
            </div>
          </section>

          <section className="section">
            <div className="container">
              {loading ? (
                <LoadingState text="Loading rooms..." />
              ) : (
                <RoomGrid rooms={roomList} />
              )}
            </div>
          </section>

          <BookingCTA />
        </main>

        <Footer />
      </PageTransition>
    </SiteShell>
  );
}

/* =========================
   ROOM DETAILS
========================= */

export function RoomDetails() {
  const { roomId } = useParams();

  const room = rooms.find(
    (item) =>
      item.id === roomId ||
      item.slug === roomId
  );

  const navigate = useNavigate();

  if (!room) {
    return (
      <SiteShell>
        <PageTransition>
          <main className="section">
            <div className="container">
              <EmptyState
                title="Room not found"
                text="The room you're looking for is unavailable."
                action={
                  <Button
                    onClick={() =>
                      navigate("/rooms")
                    }
                  >
                    Back to rooms
                  </Button>
                }
              />
            </div>
          </main>

          <Footer />
        </PageTransition>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <PageTransition>
        <main>
          <section className="page-hero">
            <div className="container">
              <Breadcrumb
                items={[
                  {
                    label: "Rooms",
                    to: "/rooms",
                  },
                  {
                    label: room.name,
                  },
                ]}
              />
            </div>
          </section>

          <section className="room-detail">
            <div className="container">
              <div className="room-gallery">
                <img
                  className="room-gallery-main"
                  src={room.image_url}
                  alt={room.name}
                />

                {room.gallery
                  .slice(0, 3)
                  .map((image) => (
                    <img
                      key={image}
                      src={image}
                      alt={`${room.name} interior`}
                    />
                  ))}
              </div>

              <div className="room-detail-grid">
                <div>
                  <span className="eyebrow">
                    AL RAHAMAT HOTEL
                  </span>

                  <h1>{room.name}</h1>

                  <p className="lead">
                    {room.description}
                  </p>

                  <div className="room-specs">
                    <div>
                      <BedDouble size={19} />
                      <span>{room.bed_type}</span>
                    </div>

                    <div>
                      <Users size={19} />
                      <span>
                        Up to {room.max_guests} guests
                      </span>
                    </div>

                    <div>
                      <Sparkles size={19} />
                      <span>
                        {room.room_size} sq ft
                      </span>
                    </div>
                  </div>

                  <div className="detail-block">
                    <h3>Amenities</h3>

                    <div className="amenity-list">
                      {room.amenities.map(
                        (amenity) => (
                          <span key={amenity}>
                            {amenity}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <aside className="booking-card">
                  <span className="eyebrow">
                    FROM
                  </span>

                  <div className="booking-price">
                    ₹
                    {room.price_per_night.toLocaleString(
                      "en-IN"
                    )}

                    <small>/ night</small>
                  </div>

                  <p>
                    Taxes and payment options are shown
                    during booking.
                  </p>

                  <Button
                    full
                    onClick={() => {
                      const search =
                        defaultSearch();

                      saveBookingSearch(search);

                      saveSelectedRoom({
                        room_id: room.id,
                        room_name: room.name,
                        price_per_night:
                          room.price_per_night,
                        max_guests:
                          room.max_guests,
                        bed_type:
                          room.bed_type,
                        total_units:
                          room.total_units,
                        booked_units: 0,
                        available_units:
                          room.total_units,
                      });

                      navigate(
                        "/booking/details"
                      );
                    }}
                  >
                    Book this room
                    <ArrowRight size={17} />
                  </Button>
                </aside>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </PageTransition>
    </SiteShell>
  );
}

/* =========================
   BOOKING SEARCH
========================= */

export function Booking() {
  const navigate = useNavigate();

  const handleSearch = (
    search: BookingSearch
  ) => {
    saveBookingSearch(search);
    navigate("/booking/rooms");
  };

  return (
    <SiteShell>
      <PageTransition>
        <main>
          <section className="page-hero">
            <div className="container">
              <Breadcrumb
                items={[
                  { label: "Booking" },
                ]}
              />

              <PageTitle
                eyebrow="BOOK YOUR STAY"
                title="Find your room."
                text="Choose your dates, guests and room requirements."
              />
            </div>
          </section>

          <section className="section">
            <div className="container narrow-container">
              <BookingSearchBar
                initialValue={
                  getBookingSearch() ??
                  undefined
                }
                onSearch={handleSearch}
              />
            </div>
          </section>
        </main>

        <Footer />
      </PageTransition>
    </SiteShell>
  );
}

/* =========================
   AVAILABLE ROOMS
========================= */

export function AvailableRooms() {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const [search, setSearch] =
    useState<BookingSearch | null>(
      getBookingSearch()
    );

  const [results, setResults] =
    useState<RoomAvailability[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const stored =
      getBookingSearch();

    if (stored) {
      setSearch(stored);
      return;
    }

    const checkIn =
      searchParams.get("checkIn");

    const checkOut =
      searchParams.get("checkOut");

    if (checkIn && checkOut) {
      const fallback: BookingSearch = {
        checkIn,
        checkOut,
        adults: Number(
          searchParams.get("adults") || 2
        ),
        children: Number(
          searchParams.get("children") || 0
        ),
        rooms: Number(
          searchParams.get("rooms") || 1
        ),
        bedType:
          (searchParams.get(
            "bedType"
          ) as BedType) ||
          "King Bed",
      };

      saveBookingSearch(fallback);
      setSearch(fallback);
      return;
    }

    setLoading(false);
  }, [searchParams]);

  useEffect(() => {
    if (!search) return;

    let active = true;

    setLoading(true);
    setError("");

    getRoomAvailability(search)
      .then((data) => {
        if (active) {
          setResults(data);
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to check availability."
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [search]);

  const handleSearch = (
    nextSearch: BookingSearch
  ) => {
    saveBookingSearch(nextSearch);
    setSearch(nextSearch);
  };

  const matchingResults = useMemo(() => {
    if (!search) return [];

    const totalGuests =
      search.adults + search.children;

    return results.filter(
      (room) =>
        room.available_units >=
          search.rooms &&
        room.max_guests >=
          totalGuests &&
        room.bed_type ===
          search.bedType
    );
  }, [results, search]);

  return (
    <SiteShell>
      <PageTransition>
        <main>
          <section className="page-hero compact">
            <div className="container">
              <Breadcrumb
                items={[
                  {
                    label: "Booking",
                    to: "/booking",
                  },
                  {
                    label:
                      "Available rooms",
                  },
                ]}
              />

              <PageTitle
                eyebrow="LIVE AVAILABILITY"
                title="Choose your room."
                text={
                  search
                    ? `${search.adults} adults · ${search.children} children · ${search.rooms} room${
                        search.rooms > 1
                          ? "s"
                          : ""
                      }`
                    : "Select your dates to continue."
                }
              />
            </div>
          </section>

          <section className="availability-results section">
            <div className="container">
              <BookingSearchBar
                initialValue={
                  search ?? undefined
                }
                onSearch={handleSearch}
              />

              <div className="results-heading">
                <div>
                  <span className="eyebrow">
                    ROOM AVAILABILITY
                  </span>

                  <h2>
                    {loading
                      ? "Checking rooms..."
                      : `${matchingResults.length} room types available`}
                  </h2>
                </div>
              </div>

              {loading && (
                <LoadingState
                  text="Checking live availability..."
                />
              )}

              {!loading && error && (
                <ErrorState
                  title="Availability check failed"
                  text={error}
                  action={
                    search ? (
                      <Button
                        onClick={() =>
                          handleSearch(
                            search
                          )
                        }
                      >
                        Try again
                      </Button>
                    ) : undefined
                  }
                />
              )}

              {!loading &&
                !error &&
                search &&
                matchingResults.length ===
                  0 && (
                  <EmptyState
                    title="No rooms match your search"
                    text="Try another bed type, fewer rooms, or different dates."
                    action={
                      <Button
                        onClick={() =>
                          navigate(
                            "/booking"
                          )
                        }
                      >
                        Change search
                      </Button>
                    }
                  />
                )}

              {!loading &&
                !error &&
                matchingResults.length >
                  0 && (
                  <div className="available-room-list">
                    {matchingResults.map(
                      (room) => (
                        <motion.article
                          key={room.room_id}
                          className="available-room-card"
                          initial={{
                            opacity: 0,
                            y: 12,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                        >
                          <div>
                            <span className="eyebrow">
                              {
                                room.available_units
                              }{" "}
                              AVAILABLE
                            </span>

                            <h3>
                              {
                                room.room_name
                              }
                            </h3>

                            <div className="available-meta">
                              <span>
                                <BedDouble
                                  size={16}
                                />
                                {
                                  room.bed_type
                                }
                              </span>

                              <span>
                                <Users
                                  size={16}
                                />
                                Up to{" "}
                                {
                                  room.max_guests
                                }
                              </span>
                            </div>
                          </div>

                          <div className="available-price">
                            <strong>
                              ₹
                              {room.price_per_night.toLocaleString(
                                "en-IN"
                              )}
                            </strong>

                            <small>
                              per night
                            </small>

                            <Button
                              onClick={() => {
                                saveSelectedRoom(
                                  room
                                );

                                navigate(
                                  "/booking/details"
                                );
                              }}
                            >
                              Select room
                              <ChevronRight
                                size={16}
                              />
                            </Button>
                          </div>
                        </motion.article>
                      )
                    )}
                  </div>
                )}
            </div>
          </section>
        </main>

        <Footer />
      </PageTransition>
    </SiteShell>
  );
}

/* =========================
   GUEST DETAILS
========================= */

export function GuestDetails() {
  const navigate = useNavigate();

  const search =
    getBookingSearch();

  const selectedRoom =
    getSelectedRoom();

  const [guest, setGuest] =
    useState<Guest>({
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      special_request: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  if (!search || !selectedRoom) {
    return (
      <SiteShell>
        <PageTransition>
          <main className="section">
            <div className="container">
              <EmptyState
                title="Booking details are missing"
                text="Please start the booking process again."
                action={
                  <Button
                    onClick={() =>
                      navigate("/booking")
                    }
                  >
                    Start booking
                  </Button>
                }
              />
            </div>
          </main>

          <Footer />
        </PageTransition>
      </SiteShell>
    );
  }

  const nights = nightsBetween(
    search.checkIn,
    search.checkOut
  );

  const totalAmount =
    nights *
    selectedRoom.price_per_night *
    search.rooms;

  const handleSubmit = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    setError("");

    if (!guest.first_name.trim()) {
      setError(
        "Please enter your first name."
      );
      return;
    }

    if (!guest.last_name.trim()) {
      setError(
        "Please enter your last name."
      );
      return;
    }

    if (!guest.phone.trim()) {
      setError(
        "Please enter your phone number."
      );
      return;
    }

    if (!guest.email.trim()) {
      setError(
        "Please enter your email address."
      );
      return;
    }

    setLoading(true);

    try {
      const booking =
        await createBooking({
          roomId:
            selectedRoom.room_id,
          guest,
          checkIn:
            search.checkIn,
          checkOut:
            search.checkOut,
          adults:
            search.adults,
          children:
            search.children,
          roomsCount:
            search.rooms,
          bedType:
            search.bedType,
        });

      saveCreatedBooking(
        booking
      );

      navigate(
        "/booking/success"
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create your booking. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteShell>
      <PageTransition>
        <main>
          <section className="page-hero compact">
            <div className="container">
              <Breadcrumb
                items={[
                  {
                    label: "Booking",
                    to: "/booking",
                  },
                  {
                    label:
                      "Available rooms",
                    to: "/booking/rooms",
                  },
                  {
                    label:
                      "Guest details",
                  },
                ]}
              />

              <PageTitle
                eyebrow="FINAL STEP"
                title="Tell us about yourself."
                text="Your reservation will be created securely in our booking system."
              />
            </div>
          </section>

          <section className="section">
            <div className="container booking-layout">
              <form
                className="guest-form"
                onSubmit={handleSubmit}
              >
                <div className="form-section">
                  <h2>
                    Guest information
                  </h2>

                  <div className="form-grid">
                    <FormField
                      label="First name"
                      value={
                        guest.first_name
                      }
                      onChange={(
                        value
                      ) =>
                        setGuest(
                          (
                            current
                          ) => ({
                            ...current,
                            first_name:
                              value,
                          })
                        )
                      }
                      required
                    />

                    <FormField
                      label="Last name"
                      value={
                        guest.last_name
                      }
                      onChange={(
                        value
                      ) =>
                        setGuest(
                          (
                            current
                          ) => ({
                            ...current,
                            last_name:
                              value,
                          })
                        )
                      }
                      required
                    />

                    <FormField
                      label="Phone number"
                      type="tel"
                      value={
                        guest.phone
                      }
                      onChange={(
                        value
                      ) =>
                        setGuest(
                          (
                            current
                          ) => ({
                            ...current,
                            phone: value,
                          })
                        )
                      }
                      required
                    />

                    <FormField
                      label="Email address"
                      type="email"
                      value={
                        guest.email
                      }
                      onChange={(
                        value
                      ) =>
                        setGuest(
                          (
                            current
                          ) => ({
                            ...current,
                            email: value,
                          })
                        )
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h2>
                    Special request
                  </h2>

                  <TextAreaField
                    label="Anything we should know?"
                    value={
                      guest.special_request ||
                      ""
                    }
                    onChange={(
                      value
                    ) =>
                      setGuest(
                        (
                          current
                        ) => ({
                          ...current,
                          special_request:
                            value,
                        })
                      )
                    }
                    placeholder="Optional"
                  />
                </div>

                {error && (
                  <div className="form-error">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  full
                >
                  {loading
                    ? "Creating reservation..."
                    : "Confirm reservation"}

                  {!loading && (
                    <ArrowRight
                      size={17}
                    />
                  )}
                </Button>

                <p className="secure-note">
                  <ShieldCheck size={16} />
                  Your reservation is
                  protected by our secure
                  booking system.
                </p>
              </form>

              <BookingSummary
                roomName={
                  selectedRoom.room_name
                }
                checkIn={
                  search.checkIn
                }
                checkOut={
                  search.checkOut
                }
                adults={
                  search.adults
                }
                children={
                  search.children
                }
                rooms={
                  search.rooms
                }
                bedType={
                  search.bedType
                }
                nights={nights}
                pricePerNight={
                  selectedRoom.price_per_night
                }
                total={
                  totalAmount
                }
              />
            </div>
          </section>
        </main>

        <Footer />
      </PageTransition>
    </SiteShell>
  );
}

/* =========================
   BOOKING SUCCESS
========================= */

export function BookingSuccess() {
  const navigate = useNavigate();

  const booking =
    getCreatedBooking();

  if (!booking) {
    return (
      <SiteShell>
        <PageTransition>
          <main className="section">
            <div className="container">
              <EmptyState
                title="Booking not found"
                text="Your booking details are no longer available on this device."
                action={
                  <Button
                    onClick={() =>
                      navigate(
                        "/my-booking"
                      )
                    }
                  >
                    Find my booking
                  </Button>
                }
              />
            </div>
          </main>

          <Footer />
        </PageTransition>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <PageTransition>
        <main className="success-page">
          <div className="container narrow-container">
            <motion.div
              className="success-card"
              initial={{
                opacity: 0,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
            >
              <div className="success-icon">
                <CheckCircle2
                  size={42}
                />
              </div>

              <span className="eyebrow">
                RESERVATION CONFIRMED
              </span>

              <h1>
                Your stay is booked.
              </h1>

              <p>
                Thank you,{" "}
                {booking.guest_first_name}.
                Your reservation has
                been created successfully.
              </p>

              <div className="booking-code">
                <small>
                  BOOKING ID
                </small>

                <strong>
                  {booking.booking_code}
                </strong>
              </div>

              <div className="success-details">
                <div>
                  <span>Room</span>
                  <strong>
                    {booking.room?.name ||
                      "Selected room"}
                  </strong>
                </div>

                <div>
                  <span>
                    Check-in
                  </span>
                  <strong>
                    {booking.check_in}
                  </strong>
                </div>

                <div>
                  <span>
                    Check-out
                  </span>
                  <strong>
                    {booking.check_out}
                  </strong>
                </div>

                <div>
                  <span>Guests</span>
                  <strong>
                    {booking.adults} adults
                    {booking.children >
                    0
                      ? ` · ${booking.children} children`
                      : ""}
                  </strong>
                </div>

                <div>
                  <span>Total</span>
                  <strong>
                    ₹
                    {booking.total_amount.toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong className="status-badge">
                    {booking.status}
                  </strong>
                </div>
              </div>

              <div className="success-actions">
                <Button
                  onClick={() =>
                    navigate(
                      "/my-booking"
                    )
                  }
                >
                  View my booking
                </Button>

                <Link
                  className="button button-outline"
                  to="/"
                >
                  Back to home
                </Link>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </PageTransition>
    </SiteShell>
  );
}

/* =========================
   MY BOOKING
========================= */

export function MyBooking() {
  const [bookingCode, setBookingCode] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [booking, setBooking] =
    useState<Booking | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    setError("");
    setBooking(null);

    if (
      !bookingCode.trim() ||
      !phone.trim()
    ) {
      setError(
        "Please enter your booking ID and phone number."
      );
      return;
    }

    setLoading(true);

    try {
      const result =
        await findBooking(
          bookingCode.trim(),
          phone.trim()
        );

      if (!result) {
        setError(
          "No booking was found with those details."
        );
        return;
      }

      setBooking(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to find your booking."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteShell>
      <PageTransition>
        <main>
          <section className="page-hero">
            <div className="container">
              <Breadcrumb
                items={[
                  {
                    label:
                      "My Booking",
                  },
                ]}
              />

              <PageTitle
                eyebrow="MANAGE YOUR STAY"
                title="Find your booking."
                text="Enter your booking ID and phone number to view your reservation."
              />
            </div>
          </section>

          <section className="section">
            <div className="container narrow-container">
              <form
                className="lookup-card"
                onSubmit={
                  handleSubmit
                }
              >
                <div className="lookup-icon">
                  <Search size={22} />
                </div>

                <h2>
                  Reservation lookup
                </h2>

                <FormField
                  label="Booking ID"
                  value={
                    bookingCode
                  }
                  onChange={
                    setBookingCode
                  }
                  placeholder="e.g. ARH-ABC123"
                  required
                />

                <FormField
                  label="Phone number"
                  type="tel"
                  value={phone}
                  onChange={setPhone}
                  required
                />

                {error && (
                  <div className="form-error">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  full
                  disabled={loading}
                >
                  {loading
                    ? "Finding booking..."
                    : "Find booking"}
                </Button>
              </form>

              {booking && (
                <motion.div
                  className="booking-result"
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                >
                  <div className="result-header">
                    <div>
                      <span className="eyebrow">
                        BOOKING ID
                      </span>

                      <h2>
                        {
                          booking.booking_code
                        }
                      </h2>
                    </div>

                    <span
                      className={`status-badge ${booking.status}`}
                    >
                      {booking.status.replace(
                        "_",
                        " "
                      )}
                    </span>
                  </div>

                  <div className="booking-result-grid">
                    <div>
                      <span>
                        Guest
                      </span>

                      <strong>
                        {
                          booking.guest_first_name
                        }{" "}
                        {
                          booking.guest_last_name
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        Room
                      </span>

                      <strong>
                        {booking.room
                          ?.name ||
                          "Room"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Check-in
                      </span>

                      <strong>
                        {
                          booking.check_in
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        Check-out
                      </span>

                      <strong>
                        {
                          booking.check_out
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        Guests
                      </span>

                      <strong>
                        {
                          booking.adults
                        }{" "}
                        adults ·{" "}
                        {
                          booking.children
                        }{" "}
                        children
                      </strong>
                    </div>

                    <div>
                      <span>
                        Rooms
                      </span>

                      <strong>
                        {
                          booking.rooms_count
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        Bed
                      </span>

                      <strong>
                        {
                          booking.bed_type
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        Payment
                      </span>

                      <strong>
                        {
                          booking.payment_status
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        Total
                      </span>

                      <strong>
                        ₹
                        {booking.total_amount.toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </div>
                  </div>

                  {booking.special_request && (
                    <div className="special-request">
                      <span>
                        Special request
                      </span>

                      <p>
                        {
                          booking.special_request
                        }
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </PageTransition>
    </SiteShell>
  );
}

/* =========================
   FACILITIES
========================= */

export function Facilities() {
  return (
    <SiteShell>
      <PageTransition>
        <main>
          <section className="page-hero">
            <div className="container">
              <Breadcrumb
                items={[
                  {
                    label:
                      "Facilities",
                  },
                ]}
              />

              <PageTitle
                eyebrow="HOTEL FACILITIES"
                title="Designed around your comfort."
                text="Simple, useful amenities that make your stay easier."
              />
            </div>
          </section>

          <section className="section">
            <div className="container">
              <FacilityGrid
                facilities={facilities}
              />
            </div>
          </section>

          <BookingCTA />
        </main>

        <Footer />
      </PageTransition>
    </SiteShell>
  );
}

/* =========================
   EXPERIENCE
========================= */

export function Experience() {
  return (
    <SiteShell>
      <PageTransition>
        <main>
          <section className="cinematic-section">
            <HeroImage
              src={rooms[2].image_url}
              alt="Al Rahamat Hotel experience"
            />

            <div className="hero-overlay" />

            <div className="container cinematic-content">
              <span className="eyebrow hero-eyebrow">
                THE EXPERIENCE
              </span>

              <h1>
                Stay a little slower.
              </h1>

              <p>
                Warm hospitality, considered
                spaces and room to breathe.
              </p>
            </div>
          </section>

          <section className="section">
            <div className="container split-section">
              <div>
                <span className="eyebrow">
                  ARRIVE
                </span>

                <h2>
                  Feel at home, without being at home.
                </h2>

                <p className="lead">
                  From the moment you arrive,
                  our focus is simple: make your
                  stay comfortable and
                  uncomplicated.
                </p>
              </div>

              <div className="experience-copy">
                <p>
                  Whether you are travelling
                  for work, visiting family or
                  taking a break, Al Rahamat
                  Hotel is designed to give you
                  a calm base for your journey.
                </p>

                <p>
                  Thoughtful rooms, practical
                  facilities and warm service
                  come together without
                  unnecessary fuss.
                </p>
              </div>
            </div>
          </section>

          <section className="section section-ivory">
            <div className="container">
              <SectionHeading
                eyebrow="WHAT MATTERS"
                title="Comfort. Calm. Connection."
              />

              <div className="three-column">
                <div className="value-card">
                  <Sparkles size={24} />

                  <h3>
                    Considered spaces
                  </h3>

                  <p>
                    Rooms designed to feel
                    polished, comfortable and
                    easy to settle into.
                  </p>
                </div>

                <div className="value-card">
                  <Users size={24} />

                  <h3>
                    Warm hospitality
                  </h3>

                  <p>
                    Personal service with the
                    warmth of Indian
                    hospitality.
                  </p>
                </div>

                <div className="value-card">
                  <Clock3 size={24} />

                  <h3>
                    Easy stays
                  </h3>

                  <p>
                    Straightforward booking,
                    clear information and
                    thoughtful essentials.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <BookingCTA />
        </main>

        <Footer />
      </PageTransition>
    </SiteShell>
  );
}

/* =========================
   ABOUT
========================= */

export function About() {
  return (
    <SiteShell>
      <PageTransition>
        <main>
          <section className="page-hero">
            <div className="container">
              <Breadcrumb
                items={[
                  {
                    label: "About",
                  },
                ]}
              />

              <PageTitle
                eyebrow="ABOUT AL RAHAMAT"
                title="A hotel built around genuine hospitality."
                text="A welcoming place to stay, created with comfort and simplicity in mind."
              />
            </div>
          </section>

          <section className="section">
            <div className="container split-section">
              <div className="about-image">
                <img
                  src={rooms[3].image_url}
                  alt="Al Rahamat Hotel"
                />
              </div>

              <div>
                <span className="eyebrow">
                  OUR APPROACH
                </span>

                <h2>
                  Less noise. More comfort.
                </h2>

                <p className="lead">
                  Al Rahamat Hotel brings
                  together modern comfort and
                  the warmth of Indian
                  hospitality.
                </p>

                <p>
                  We believe a good hotel stay
                  should feel easy. From a
                  comfortable room to clear
                  communication and thoughtful
                  service, every part of the
                  experience should help you feel
                  settled.
                </p>

                <p>
                  Whether you are staying for one
                  night or several, our aim is to
                  make Al Rahamat feel like a
                  dependable part of your journey.
                </p>
              </div>
            </div>
          </section>

          <Reviews reviews={reviews} />

          <BookingCTA />
        </main>

        <Footer />
      </PageTransition>
    </SiteShell>
  );
}

/* =========================
   CONTACT
========================= */

export function Contact() {
  return (
    <SiteShell>
      <PageTransition>
        <main>
          <section className="page-hero">
            <div className="container">
              <Breadcrumb
                items={[
                  {
                    label:
                      "Contact",
                  },
                ]}
              />

              <PageTitle
                eyebrow="CONTACT"
                title="We're here to help."
                text="Have a question about your stay? Get in touch with us."
              />
            </div>
          </section>

          <section className="section">
            <div className="container contact-layout">
              <div>
                <ContactInfo
                  phone={hotelInfo.phone}
                  email={hotelInfo.email}
                  address={hotelInfo.address}
                />

                <HotelTimings
                  checkIn={
                    hotelInfo.checkIn
                  }
                  checkOut={
                    hotelInfo.checkOut
                  }
                />
              </div>

              <div className="contact-card">
                <span className="eyebrow">
                  AL RAHAMAT HOTEL
                </span>

                <h2>
                  Plan your stay with us.
                </h2>

                <p>
                  For booking questions,
                  room requests or general
                  enquiries, contact our team
                  directly.
                </p>

                <div className="contact-links">
                  <a
                    href={`tel:${hotelInfo.phone}`}
                  >
                    <Phone size={18} />
                    {hotelInfo.phone}
                  </a>

                  <a
                    href={`mailto:${hotelInfo.email}`}
                  >
                    <Mail size={18} />
                    {hotelInfo.email}
                  </a>

                  <div>
                    <MapPin size={18} />
                    {hotelInfo.address}
                  </div>
                </div>

                <Link
                  className="button button-primary"
                  to="/booking"
                >
                  Check availability
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </section>

          <section className="section section-ivory">
            <div className="container">
              <SectionHeading
                eyebrow="ARRIVAL"
                title="Good to know before you arrive."
              />

              <div className="three-column">
                <div className="value-card">
                  <CalendarDays
                    size={23}
                  />

                  <h3>
                    Check-in
                  </h3>

                  <p>
                    {hotelInfo.checkIn}
                  </p>
                </div>

                <div className="value-card">
                  <Clock3 size={23} />

                  <h3>
                    Check-out
                  </h3>

                  <p>
                    {hotelInfo.checkOut}
                  </p>
                </div>

                <div className="value-card">
                  <ShieldCheck
                    size={23}
                  />

                  <h3>
                    Booking support
                  </h3>

                  <p>
                    Contact us if you need
                    help with an existing
                    reservation.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </PageTransition>
    </SiteShell>
  );
}