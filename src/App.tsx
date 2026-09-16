import { useMemo, useState } from "react";

type Room = {
  id: number;
  name: string;
  type: string;
  price: number;
  image: string;
  size: string;
  guests: string;
  description: string;
  amenities: string[];
};

type Booking = {
  room: Room | null;
  name: string;
  phone: string;
  email: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  breakfast: boolean;
  transfer: boolean;
  spa: boolean;
  lateCheckout: boolean;
};

const rooms: Room[] = [
  {
    id: 1,
    name: "Deluxe Garden Room",
    type: "Deluxe",
    price: 7200,
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1400&q=85",
    size: "42 m²",
    guests: "2 Guests",
    description:
      "A calm, beautifully appointed room with warm natural textures and views across the gardens.",
    amenities: ["King Bed", "Garden View", "Rain Shower", "Smart TV"],
  },
  {
    id: 2,
    name: "Alrahamat Suite",
    type: "Suite",
    price: 12500,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=85",
    size: "68 m²",
    guests: "3 Guests",
    description:
      "Our signature suite combines generous space, refined details and a private living area.",
    amenities: ["King Bed", "Living Room", "Bathtub", "Mini Bar"],
  },
  {
    id: 3,
    name: "Executive Room",
    type: "Executive",
    price: 8900,
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1400&q=85",
    size: "50 m²",
    guests: "2 Guests",
    description:
      "A sophisticated stay designed for guests who appreciate comfort, privacy and quiet.",
    amenities: ["King Bed", "City View", "Work Desk", "Rain Shower"],
  },
  {
    id: 4,
    name: "Presidential Suite",
    type: "Suite",
    price: 18500,
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1400&q=85",
    size: "110 m²",
    guests: "4 Guests",
    description:
      "An expansive private retreat with exceptional interiors and a separate lounge.",
    amenities: ["King Bed", "Private Lounge", "Bathtub", "Dining Area"],
  },
];

const extras = [
  { key: "breakfast", name: "Breakfast Experience", price: 799, text: "Daily breakfast for your stay" },
  { key: "transfer", name: "Airport Transfer", price: 1499, text: "Private one-way transfer" },
  { key: "spa", name: "Wellness Access", price: 2499, text: "Spa and wellness access" },
  { key: "lateCheckout", name: "Late Check-out", price: 1000, text: "Extend your stay until 4 PM" },
] as const;

function formatPrice(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function App() {
  const [page, setPage] = useState("home");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [filter, setFilter] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);

  const [booking, setBooking] = useState<Booking>({
    room: null,
    name: "",
    phone: "",
    email: "",
    checkIn: "",
    checkOut: "",
    guests: 2,
    breakfast: false,
    transfer: false,
    spa: false,
    lateCheckout: false,
  });

  const filteredRooms = useMemo(() => {
    if (filter === "All") return rooms;
    return rooms.filter((room) => room.type === filter);
  }, [filter]);

  const roomTotal = booking.room?.price || 0;

  const extrasTotal = extras.reduce((total, item) => {
    return booking[item.key] ? total + item.price : total;
  }, 0);

  const total = roomTotal + extrasTotal;

  const openRoom = (room: Room) => {
    setSelectedRoom(room);
    setPage("room");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startBooking = (room = selectedRoom) => {
    if (!room) return;
    setBooking((current) => ({ ...current, room }));
    setPage("booking");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const go = (nextPage: string) => {
    setPage(nextPage);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateBooking = (key: keyof Booking, value: string | number | boolean) => {
    setBooking((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <div className="app">
      <header className="navbar">
        <button className="logo" onClick={() => go("home")}>
          <span>ALRAHAMAT</span>
          <small>HOTELS & RESORTS</small>
        </button>

        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <button onClick={() => go("home")}>Home</button>
          <button onClick={() => go("rooms")}>Rooms</button>
          <button onClick={() => go("experience")}>Experience</button>
          <button onClick={() => go("gallery")}>Gallery</button>
          <button onClick={() => go("contact")}>Contact</button>
        </nav>

        <button className="nav-book" onClick={() => go("rooms")}>
          Book a stay
        </button>

        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "×" : "☰"}
        </button>
      </header>

      {page === "home" && (
        <>
          <section className="hero">
            <div className="hero-overlay" />

            <div className="hero-content">
              <p className="eyebrow">A NEW STANDARD OF STAY</p>
              <h1>
                Stay somewhere
                <em>extraordinary.</em>
              </h1>
              <p className="hero-text">
                A refined hotel experience shaped around quiet luxury,
                thoughtful service and unforgettable moments.
              </p>

              <button className="primary-button" onClick={() => go("rooms")}>
                Explore rooms <span>↗</span>
              </button>
            </div>

            <div className="hero-room-card glass">
              <img src={rooms[1].image} alt="Alrahamat Suite" />
              <div>
                <span>FEATURED STAY</span>
                <h3>Alrahamat Suite</h3>
                <p>From {formatPrice(rooms[1].price)} / night</p>
              </div>
              <button onClick={() => openRoom(rooms[1])}>↗</button>
            </div>

            <div className="hero-bottom">
              <span>01 — 04</span>
              <div className="hero-line">
                <i />
              </div>
              <span>ALRAHAMAT / 2026</span>
            </div>

            <div className="booking-bar glass">
              <div className="booking-field">
                <span>DESTINATION</span>
                <strong>Alrahamat Hotel</strong>
              </div>

              <div className="booking-field">
                <span>CHECK IN</span>
                <input
                  type="date"
                  value={booking.checkIn}
                  onChange={(e) => updateBooking("checkIn", e.target.value)}
                />
              </div>

              <div className="booking-field">
                <span>CHECK OUT</span>
                <input
                  type="date"
                  value={booking.checkOut}
                  onChange={(e) => updateBooking("checkOut", e.target.value)}
                />
              </div>

              <div className="booking-field">
                <span>GUESTS</span>
                <select
                  value={booking.guests}
                  onChange={(e) =>
                    updateBooking("guests", Number(e.target.value))
                  }
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                </select>
              </div>

              <button className="search-button" onClick={() => go("rooms")}>
                <span>Find a room</span>
                <b>→</b>
              </button>
            </div>
          </section>

          <section className="intro section">
            <div className="section-label">01 / THE ALRAHAMAT EXPERIENCE</div>
            <div className="intro-grid">
              <h2>
                A place to slow down,
                <span> reconnect and stay well.</span>
              </h2>

              <div>
                <p>
                  Designed for modern travellers, Alrahamat brings together
                  considered architecture, warm hospitality and spaces made
                  for meaningful stays.
                </p>
                <button className="text-button" onClick={() => go("experience")}>
                  Discover our story <span>↗</span>
                </button>
              </div>
            </div>
          </section>

          <section className="rooms-section section">
            <div className="section-heading">
              <div>
                <div className="section-label">02 / STAY YOUR WAY</div>
                <h2>Rooms & suites</h2>
              </div>
              <button className="text-button" onClick={() => go("rooms")}>
                View all rooms <span>↗</span>
              </button>
            </div>

            <div className="room-grid">
              {rooms.slice(0, 3).map((room) => (
                <RoomCard key={room.id} room={room} onClick={openRoom} />
              ))}
            </div>
          </section>

          <section className="statement">
            <div className="statement-image">
              <img src={rooms[3].image} alt="Presidential Suite" />
            </div>
            <div className="statement-content">
              <p className="eyebrow">THE ALRAHAMAT DIFFERENCE</p>
              <h2>Luxury is found in the details.</h2>
              <p>
                From the first welcome to your final morning, every part of
                your stay has been carefully considered.
              </p>
              <button className="primary-button" onClick={() => go("experience")}>
                Explore the experience <span>↗</span>
              </button>
            </div>
          </section>
        </>
      )}

      {page === "rooms" && (
        <main className="page-shell">
          <PageHero
            eyebrow="ALRAHAMAT COLLECTION"
            title="Rooms designed"
            italic="to stay."
            text="Choose a space that feels like your own."
          />

          <section className="rooms-page section">
            <div className="filter-row">
              {["All", "Deluxe", "Executive", "Suite"].map((item) => (
                <button
                  key={item}
                  className={filter === item ? "filter active" : "filter"}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="room-list">
              {filteredRooms.map((room) => (
                <RoomCard key={room.id} room={room} onClick={openRoom} large />
              ))}
            </div>
          </section>
        </main>
      )}

      {page === "room" && selectedRoom && (
        <main className="page-shell">
          <section className="room-detail">
            <button className="back-button" onClick={() => go("rooms")}>
              ← Back to rooms
            </button>

            <div className="detail-image">
              <img src={selectedRoom.image} alt={selectedRoom.name} />
              <div className="image-tag">ALRAHAMAT / {selectedRoom.type}</div>
            </div>

            <div className="detail-content">
              <p className="eyebrow">ROOM {String(selectedRoom.id).padStart(2, "0")}</p>
              <h1>{selectedRoom.name}</h1>
              <p className="detail-description">{selectedRoom.description}</p>

              <div className="room-specs">
                <div>
                  <span>SIZE</span>
                  <strong>{selectedRoom.size}</strong>
                </div>
                <div>
                  <span>GUESTS</span>
                  <strong>{selectedRoom.guests}</strong>
                </div>
                <div>
                  <span>FROM</span>
                  <strong>{formatPrice(selectedRoom.price)}</strong>
                </div>
              </div>

              <div className="amenities">
                <span>ROOM AMENITIES</span>
                <div>
                  {selectedRoom.amenities.map((amenity) => (
                    <label key={amenity}>{amenity}</label>
                  ))}
                </div>
              </div>

              <div className="detail-actions">
                <div>
                  <small>PER NIGHT</small>
                  <strong>{formatPrice(selectedRoom.price)}</strong>
                </div>
                <button className="primary-button" onClick={() => startBooking()}>
                  Book this room <span>→</span>
                </button>
              </div>
            </div>
          </section>
        </main>
      )}

      {page === "booking" && (
        <main className="page-shell booking-page">
          <CheckoutHeader step={1} />

          <div className="checkout-layout">
            <section className="checkout-main">
              <p className="eyebrow">01 / YOUR DETAILS</p>
              <h1>Tell us about your stay.</h1>

              <div className="selected-room-mini">
                {booking.room && (
                  <>
                    <img src={booking.room.image} alt={booking.room.name} />
                    <div>
                      <span>YOUR ROOM</span>
                      <h3>{booking.room.name}</h3>
                      <p>{formatPrice(booking.room.price)} / night</p>
                    </div>
                  </>
                )}
              </div>

              <div className="form-grid">
                <label>
                  <span>CUSTOMER NAME</span>
                  <input
                    value={booking.name}
                    onChange={(e) => updateBooking("name", e.target.value)}
                    placeholder="Your full name"
                  />
                </label>

                <label>
                  <span>PHONE NUMBER</span>
                  <input
                    value={booking.phone}
                    onChange={(e) => updateBooking("phone", e.target.value)}
                    placeholder="+91 00000 00000"
                  />
                </label>

                <label className="full">
                  <span>EMAIL ADDRESS</span>
                  <input
                    type="email"
                    value={booking.email}
                    onChange={(e) => updateBooking("email", e.target.value)}
                    placeholder="you@example.com"
                  />
                </label>

                <label>
                  <span>CHECK IN</span>
                  <input
                    type="date"
                    value={booking.checkIn}
                    onChange={(e) => updateBooking("checkIn", e.target.value)}
                  />
                </label>

                <label>
                  <span>CHECK OUT</span>
                  <input
                    type="date"
                    value={booking.checkOut}
                    onChange={(e) => updateBooking("checkOut", e.target.value)}
                  />
                </label>

                <label>
                  <span>GUESTS</span>
                  <select
                    value={booking.guests}
                    onChange={(e) =>
                      updateBooking("guests", Number(e.target.value))
                    }
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                  </select>
                </label>
              </div>

              <button
                className="primary-button wide-button"
                disabled={!booking.name || !booking.phone || !booking.email}
                onClick={() => go("extras")}
              >
                Continue to enhance your stay <span>→</span>
              </button>
            </section>

            <BookingSummary booking={booking} total={roomTotal} />
          </div>
        </main>
      )}

      {page === "extras" && (
        <main className="page-shell booking-page">
          <CheckoutHeader step={2} />

          <div className="checkout-layout">
            <section className="checkout-main">
              <p className="eyebrow">02 / ENHANCE YOUR STAY</p>
              <h1>Make it yours.</h1>
              <p className="muted">
                Add a few thoughtful extras to make your Alrahamat stay even
                more comfortable.
              </p>

              <div className="extras-list">
                {extras.map((extra) => (
                  <button
                    key={extra.key}
                    className={
                      booking[extra.key] ? "extra-card selected" : "extra-card"
                    }
                    onClick={() =>
                      updateBooking(extra.key, !booking[extra.key])
                    }
                  >
                    <div className="extra-check">
                      {booking[extra.key] ? "✓" : ""}
                    </div>
                    <div className="extra-copy">
                      <span>OPTIONAL EXPERIENCE</span>
                      <h3>{extra.name}</h3>
                      <p>{extra.text}</p>
                    </div>
                    <strong>+{formatPrice(extra.price)}</strong>
                  </button>
                ))}
              </div>

              <div className="checkout-buttons">
                <button className="secondary-button" onClick={() => go("booking")}>
                  ← Back
                </button>
                <button className="primary-button" onClick={() => go("payment")}>
                  Continue to payment <span>→</span>
                </button>
              </div>
            </section>

            <BookingSummary booking={booking} total={total} />
          </div>
        </main>
      )}

      {page === "payment" && (
        <main className="page-shell booking-page">
          <CheckoutHeader step={3} />

          <div className="checkout-layout">
            <section className="checkout-main">
              <p className="eyebrow">03 / PAYMENT</p>
              <h1>Complete your reservation.</h1>

              <div className="payment-card">
                <div className="payment-title">
                  <span>SECURE PAYMENT</span>
                  <b>SSL</b>
                </div>

                <label>
                  <span>CARDHOLDER NAME</span>
                  <input placeholder={booking.name || "Full name"} />
                </label>

                <label>
                  <span>CARD NUMBER</span>
                  <input placeholder="0000 0000 0000 0000" />
                </label>

                <div className="form-grid">
                  <label>
                    <span>EXPIRY</span>
                    <input placeholder="MM / YY" />
                  </label>
                  <label>
                    <span>CVV</span>
                    <input placeholder="•••" />
                  </label>
                </div>
              </div>

              <p className="secure-note">
                Your payment details are encrypted and securely processed.
              </p>

              <button className="primary-button wide-button" onClick={() => go("confirmed")}>
                Pay {formatPrice(total)} <span>→</span>
              </button>
            </section>

            <BookingSummary booking={booking} total={total} />
          </div>
        </main>
      )}

      {page === "confirmed" && (
        <main className="page-shell confirmation-page">
          <div className="confirmation-card">
            <div className="confirmation-icon">✓</div>
            <p className="eyebrow">RESERVATION CONFIRMED</p>
            <h1>Your stay is reserved.</h1>
            <p>
              Thank you, {booking.name || "Guest"}. We look forward to welcoming
              you to Alrahamat.
            </p>

            <div className="booking-id">
              <span>BOOKING ID</span>
              <strong>ALR-{Math.floor(100000 + Math.random() * 899999)}</strong>
            </div>

            <div className="confirmation-details">
              <div>
                <span>ROOM</span>
                <strong>{booking.room?.name}</strong>
              </div>
              <div>
                <span>CHECK IN</span>
                <strong>{booking.checkIn || "—"}</strong>
              </div>
              <div>
                <span>CHECK OUT</span>
                <strong>{booking.checkOut || "—"}</strong>
              </div>
              <div>
                <span>GUESTS</span>
                <strong>{booking.guests}</strong>
              </div>
              <div>
                <span>TOTAL</span>
                <strong>{formatPrice(total)}</strong>
              </div>
            </div>

            <button className="primary-button" onClick={() => go("home")}>
              Back to Alrahamat <span>↗</span>
            </button>
          </div>
        </main>
      )}

      {page === "experience" && (
        <main className="page-shell">
          <PageHero
            eyebrow="THE ALRAHAMAT EXPERIENCE"
            title="More than a"
            italic="hotel."
            text="A considered approach to hospitality, comfort and the art of slowing down."
          />

          <section className="experience-grid section">
            <div className="experience-image">
              <img src={rooms[0].image} alt="Alrahamat experience" />
            </div>
            <div className="experience-copy">
              <p className="eyebrow">OUR PHILOSOPHY</p>
              <h2>Quiet luxury. Genuine hospitality.</h2>
              <p>
                Alrahamat was created around a simple idea: the best stays
                should feel effortless. Natural materials, warm lighting,
                considered rooms and personal service come together to create
                an atmosphere that feels calm from the moment you arrive.
              </p>
              <p>
                Whether you're here for business, a weekend away or a longer
                escape, every detail is designed to give you room to breathe.
              </p>
            </div>
          </section>
        </main>
      )}

      {page === "gallery" && (
        <main className="page-shell">
          <PageHero
            eyebrow="ALRAHAMAT / VISUAL JOURNAL"
            title="A closer"
            italic="look."
            text="Spaces, details and moments from around the property."
          />

          <section className="gallery-grid section">
            {[
              rooms[0].image,
              rooms[1].image,
              rooms[2].image,
              rooms[3].image,
              "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=85",
              "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
            ].map((image, index) => (
              <div className={`gallery-item gallery-${index + 1}`} key={image}>
                <img src={image} alt={`Alrahamat gallery ${index + 1}`} />
              </div>
            ))}
          </section>
        </main>
      )}

      {page === "contact" && (
        <main className="page-shell">
          <PageHero
            eyebrow="GET IN TOUCH"
            title="We're here"
            italic="for you."
            text="Questions about your stay? Our team is always happy to help."
          />

          <section className="contact-section section">
            <div className="contact-card">
              <span>RESERVATIONS</span>
              <h2>+91 00000 00000</h2>
              <p>reservations@alrahamat.com</p>
            </div>
            <div className="contact-card">
              <span>LOCATION</span>
              <h2>Alrahamat Hotel</h2>
              <p>India · Your destination awaits</p>
            </div>
          </section>
        </main>
      )}

      <footer>
        <div className="footer-top">
          <div>
            <div className="footer-logo">ALRAHAMAT</div>
            <p>Stay somewhere extraordinary.</p>
          </div>

          <div className="footer-links">
            <button onClick={() => go("rooms")}>Rooms</button>
            <button onClick={() => go("experience")}>Experience</button>
            <button onClick={() => go("gallery")}>Gallery</button>
            <button onClick={() => go("contact")}>Contact</button>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 ALRAHAMAT HOTELS & RESORTS</span>
          <span>DESIGNED FOR THE MODERN STAY</span>
        </div>
      </footer>
    </div>
  );
}

function RoomCard({
  room,
  onClick,
  large = false,
}: {
  room: Room;
  onClick: (room: Room) => void;
  large?: boolean;
}) {
  return (
    <article className={large ? "room-card room-card-large" : "room-card"}>
      <button className="room-image" onClick={() => onClick(room)}>
        <img src={room.image} alt={room.name} />
        <span>VIEW ROOM ↗</span>
      </button>

      <div className="room-info">
        <div>
          <small>{room.type.toUpperCase()}</small>
          <h3>{room.name}</h3>
          <p>
            {room.size} · {room.guests}
          </p>
        </div>
        <strong>
          {formatPrice(room.price)}
          <small>/night</small>
        </strong>
      </div>
    </article>
  );
}

function PageHero({
  eyebrow,
  title,
  italic,
  text,
}: {
  eyebrow: string;
  title: string;
  italic: string;
  text: string;
}) {
  return (
    <section className="page-hero">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>
          {title}
          <em>{italic}</em>
        </h1>
      </div>
      <p>{text}</p>
    </section>
  );
}

function CheckoutHeader({ step }: { step: number }) {
  return (
    <div className="checkout-header">
      <div className={step >= 1 ? "checkout-step active" : "checkout-step"}>
        <b>01</b>
        <span>Details</span>
      </div>
      <i />
      <div className={step >= 2 ? "checkout-step active" : "checkout-step"}>
        <b>02</b>
        <span>Enhance</span>
      </div>
      <i />
      <div className={step >= 3 ? "checkout-step active" : "checkout-step"}>
        <b>03</b>
        <span>Payment</span>
      </div>
    </div>
  );
}

function BookingSummary({
  booking,
  total,
}: {
  booking: Booking;
  total: number;
}) {
  return (
    <aside className="booking-summary glass">
      <p className="eyebrow">YOUR RESERVATION</p>

      {booking.room && (
        <div className="summary-room">
          <img src={booking.room.image} alt={booking.room.name} />
          <div>
            <strong>{booking.room.name}</strong>
            <span>{booking.room.type}</span>
          </div>
        </div>
      )}

      <div className="summary-lines">
        <div>
          <span>Room</span>
          <strong>{formatPrice(booking.room?.price || 0)}</strong>
        </div>

        {extras.map(
          (extra) =>
            booking[extra.key] && (
              <div key={extra.key}>
                <span>{extra.name}</span>
                <strong>{formatPrice(extra.price)}</strong>
              </div>
            )
        )}

        <div className="summary-total">
          <span>Total</span>
          <strong>{formatPrice(total)}</strong>
        </div>
      </div>
    </aside>
  );
}

export default App;