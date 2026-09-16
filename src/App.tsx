import { useMemo, useState } from "react";
import "./index.css";

type Room = {
  id: number;
  name: string;
  type: string;
  price: number;
  guests: number;
  beds: string;
  size: string;
  image: string;
};

const rooms: Room[] = [
  {
    id: 1,
    name: "Deluxe Garden Room",
    type: "Deluxe",
    price: 6999,
    guests: 2,
    beds: "King Bed",
    size: "35 m²",
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: 2,
    name: "Premium Lake Suite",
    type: "Suite",
    price: 9999,
    guests: 3,
    beds: "King Bed",
    size: "52 m²",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: 3,
    name: "Royal Villa",
    type: "Villa",
    price: 14999,
    guests: 4,
    beds: "2 King Beds",
    size: "85 m²",
    image:
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: 4,
    name: "Executive Room",
    type: "Standard",
    price: 4999,
    guests: 2,
    beds: "Queen Bed",
    size: "28 m²",
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: 5,
    name: "Presidential Suite",
    type: "Suite",
    price: 18999,
    guests: 4,
    beds: "King Bed",
    size: "110 m²",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: 6,
    name: "Garden Villa",
    type: "Villa",
    price: 12999,
    guests: 4,
    beds: "2 King Beds",
    size: "75 m²",
    image:
      "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=1200&q=85",
  },
];

const extras = [
  { id: "breakfast", name: "Breakfast", price: 799 },
  { id: "transfer", name: "Airport Transfer", price: 1499 },
  { id: "spa", name: "Spa Access", price: 2499 },
  { id: "late", name: "Late Check-out", price: 1000 },
];

function formatPrice(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function App() {
  const [checkIn, setCheckIn] = useState("2026-09-20");
  const [checkOut, setCheckOut] = useState("2026-09-23");
  const [guests, setGuests] = useState(2);
  const [filter, setFilter] = useState("All");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingStep, setBookingStep] = useState<"rooms" | "details" | "extras" | "payment" | "confirmed">("rooms");
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const filteredRooms = useMemo(() => {
    if (filter === "All") return rooms;
    return rooms.filter((room) => room.type === filter);
  }, [filter]);

  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const extrasTotal = selectedExtras.reduce((total, id) => {
    const extra = extras.find((item) => item.id === id);
    return total + (extra?.price || 0);
  }, 0);

  const roomTotal = selectedRoom ? selectedRoom.price * nights : 0;
  const total = roomTotal + extrasTotal;

  const toggleExtra = (id: string) => {
    setSelectedExtras((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const startBooking = (room: Room) => {
    setSelectedRoom(room);
    setBookingStep("details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToExtras = () => {
    if (!customerName.trim() || !phone.trim()) {
      alert("Please enter your name and phone number.");
      return;
    }

    setBookingStep("extras");
  };

  const confirmBooking = () => {
    setBookingStep("confirmed");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="site">
      <header className="navbar">
        <div className="brand">
          <div className="brand-mark">A</div>
          <div>
            <strong>ALRAHAMAT</strong>
            <span>HOTELS & RESORTS</span>
          </div>
        </div>

        <nav>
          <a href="#home">Home</a>
          <a href="#rooms">Rooms</a>
          <a href="#experience">Experience</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Contact</a>
        </nav>

        <button className="nav-button" onClick={() => document.getElementById("rooms")?.scrollIntoView()}>
          Book Now
        </button>
      </header>

      {bookingStep === "confirmed" ? (
        <section className="confirmation-page">
          <div className="confirmation-card glass">
            <div className="success-icon">✓</div>
            <span className="eyebrow">ALRAHAMAT HOTELS & RESORTS</span>
            <h1>Booking Confirmed</h1>
            <p>Your stay has been reserved successfully.</p>

            <div className="booking-id">
              <span>BOOKING ID</span>
              <strong>AR-{Math.floor(100000 + Math.random() * 899999)}</strong>
            </div>

            <div className="confirmation-grid">
              <div>
                <small>Guest</small>
                <strong>{customerName}</strong>
              </div>
              <div>
                <small>Room</small>
                <strong>{selectedRoom?.name}</strong>
              </div>
              <div>
                <small>Check-in</small>
                <strong>{checkIn}</strong>
              </div>
              <div>
                <small>Check-out</small>
                <strong>{checkOut}</strong>
              </div>
            </div>

            <div className="confirmation-total">
              <span>Total Paid</span>
              <strong>{formatPrice(total)}</strong>
            </div>

            <button
              className="primary-button"
              onClick={() => {
                setBookingStep("rooms");
                setSelectedRoom(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Back to Alrahamat
            </button>
          </div>
        </section>
      ) : (
        <>
          <section className="hero" id="home">
            <div className="hero-overlay" />

            <div className="hero-content">
              <span className="eyebrow">A QUIET ESCAPE. A TIMELESS STAY.</span>

              <h1>
                More Than
                <br />
                <em>A Stay.</em>
              </h1>

              <p>
                Discover refined comfort, warm hospitality and unforgettable
                moments at Alrahamat Hotels & Resorts.
              </p>

              <div className="search-panel glass">
                <div className="search-field">
                  <span>CHECK IN</span>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>

                <div className="search-field">
                  <span>CHECK OUT</span>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>

                <div className="search-field">
                  <span>GUESTS</span>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                  >
                    <option value={1}>1 Adult</option>
                    <option value={2}>2 Adults</option>
                    <option value={3}>3 Adults</option>
                    <option value={4}>4 Adults</option>
                    <option value={5}>5 Adults</option>
                  </select>
                </div>

                <button
                  className="search-button"
                  onClick={() =>
                    document.getElementById("rooms")?.scrollIntoView({
                      behavior: "smooth",
                    })
                  }
                >
                  Find Rooms <span>→</span>
                </button>
              </div>

              <div className="hero-features">
                <span>✦ Best Rate Guarantee</span>
                <span>◌ Complimentary Wi-Fi</span>
                <span>◌ 24/7 Guest Support</span>
                <span>✦ Curated Experiences</span>
              </div>
            </div>

            <div className="hero-floating glass">
              <div className="floating-image">
                <img src={rooms[1].image} alt="Premium room" />
              </div>
              <div>
                <span>PREMIUM STAYS</span>
                <strong>Designed around you.</strong>
              </div>
              <span className="round-arrow">↗</span>
            </div>
          </section>

          <section className="rooms-section" id="rooms">
            <div className="section-heading">
              <div>
                <span className="eyebrow">OUR ROOMS</span>
                <h2>Find Your Perfect Room</h2>
              </div>

              <p>
                Carefully designed spaces combining modern luxury, comfort and
                privacy.
              </p>
            </div>

            <div className="filters">
              {["All", "Standard", "Deluxe", "Suite", "Villa"].map((item) => (
                <button
                  key={item}
                  className={filter === item ? "active" : ""}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="room-grid">
              {filteredRooms.map((room) => (
                <article className="room-card" key={room.id}>
                  <div className="room-image">
                    <img src={room.image} alt={room.name} />
                    <span className="room-tag">{room.type}</span>
                    <button
                      className="image-arrow"
                      onClick={() => startBooking(room)}
                    >
                      ↗
                    </button>
                  </div>

                  <div className="room-info">
                    <div className="room-title-row">
                      <div>
                        <h3>{room.name}</h3>
                        <span>{room.size}</span>
                      </div>

                      <div className="price">
                        <strong>{formatPrice(room.price)}</strong>
                        <span>/ night</span>
                      </div>
                    </div>

                    <div className="room-meta">
                      <span>♙ {room.guests} Guests</span>
                      <span>▱ {room.beds}</span>
                      <span>□ {room.size}</span>
                    </div>

                    <button
                      className="room-button"
                      onClick={() => startBooking(room)}
                    >
                      Book This Room <span>→</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="experience-section" id="experience">
            <div className="experience-image">
              <img src={rooms[2].image} alt="Alrahamat resort" />
            </div>

            <div className="experience-content">
              <span className="eyebrow">THE ALRAHAMAT EXPERIENCE</span>
              <h2>Stay somewhere that feels different.</h2>
              <p>
                From quiet mornings to beautifully designed interiors, every
                detail at Alrahamat is created to make your stay feel effortless.
              </p>

              <div className="experience-list">
                <div>
                  <span>01</span>
                  <strong>Thoughtful Spaces</strong>
                  <p>Rooms designed for comfort, calm and privacy.</p>
                </div>

                <div>
                  <span>02</span>
                  <strong>Warm Hospitality</strong>
                  <p>Personal service from arrival to departure.</p>
                </div>

                <div>
                  <span>03</span>
                  <strong>Curated Moments</strong>
                  <p>Experiences that make your stay memorable.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="gallery-section" id="gallery">
            <div className="section-heading centered">
              <span className="eyebrow">A GLIMPSE INSIDE</span>
              <h2>Designed To Be Remembered</h2>
            </div>

            <div className="gallery">
              <img src={rooms[0].image} alt="Hotel room" />
              <img src={rooms[2].image} alt="Luxury villa" />
              <img src={rooms[4].image} alt="Presidential suite" />
            </div>
          </section>

          <footer id="contact">
            <div className="footer-brand">
              <div className="brand">
                <div className="brand-mark">A</div>
                <div>
                  <strong>ALRAHAMAT</strong>
                  <span>HOTELS & RESORTS</span>
                </div>
              </div>

              <p>
                Refined stays. Thoughtful spaces. Memories worth keeping.
              </p>
            </div>

            <div>
              <span className="footer-label">EXPLORE</span>
              <a href="#rooms">Rooms</a>
              <a href="#experience">Experience</a>
              <a href="#gallery">Gallery</a>
            </div>

            <div>
              <span className="footer-label">CONTACT</span>
              <span>+91 00000 00000</span>
              <span>stay@alrahamat.com</span>
              <span>India</span>
            </div>
          </footer>
        </>
      )}

      {selectedRoom && bookingStep !== "rooms" && bookingStep !== "confirmed" && (
        <div className="booking-overlay">
          <div className="booking-modal glass">
            <button
              className="close-modal"
              onClick={() => {
                setSelectedRoom(null);
                setBookingStep("rooms");
              }}
            >
              ×
            </button>

            <div className="booking-progress">
              <span className={bookingStep === "details" ? "current" : ""}>01 Details</span>
              <span className={bookingStep === "extras" ? "current" : ""}>02 Extras</span>
              <span className={bookingStep === "payment" ? "current" : ""}>03 Payment</span>
            </div>

            {bookingStep === "details" && (
              <div className="booking-content">
                <div className="booking-room-preview">
                  <img src={selectedRoom.image} alt={selectedRoom.name} />
                  <div>
                    <span>{selectedRoom.type}</span>
                    <h2>{selectedRoom.name}</h2>
                    <p>
                      {checkIn} — {checkOut} · {nights} nights · {guests} guests
                    </p>
                  </div>
                </div>

                <h2 className="booking-title">Your Details</h2>

                <div className="form-grid">
                  <label>
                    Guest Name
                    <input
                      placeholder="Enter your full name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </label>

                  <label>
                    Phone Number
                    <input
                      placeholder="+91 00000 00000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </label>

                  <label className="full">
                    Email Address
                    <input
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                </div>

                <button className="primary-button" onClick={goToExtras}>
                  Continue to Extras →
                </button>
              </div>
            )}

            {bookingStep === "extras" && (
              <div className="booking-content">
                <span className="eyebrow">ENHANCE YOUR STAY</span>
                <h2 className="booking-title">Add Something Extra</h2>

                <div className="extras-list">
                  {extras.map((extra) => {
                    const selected = selectedExtras.includes(extra.id);

                    return (
                      <button
                        className={`extra-card ${selected ? "selected" : ""}`}
                        key={extra.id}
                        onClick={() => toggleExtra(extra.id)}
                      >
                        <div className="extra-icon">
                          {selected ? "✓" : "+"}
                        </div>

                        <div>
                          <strong>{extra.name}</strong>
                          <span>Enhance your Alrahamat experience</span>
                        </div>

                        <b>{formatPrice(extra.price)}</b>
                      </button>
                    );
                  })}
                </div>

                <button
                  className="primary-button"
                  onClick={() => setBookingStep("payment")}
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {bookingStep === "payment" && (
              <div className="booking-content">
                <span className="eyebrow">SECURE CHECKOUT</span>
                <h2 className="booking-title">Payment Details</h2>

                <div className="payment-layout">
                  <div className="payment-summary">
                    <div className="summary-room">
                      <img src={selectedRoom.image} alt={selectedRoom.name} />
                      <div>
                        <strong>{selectedRoom.name}</strong>
                        <span>
                          {formatPrice(selectedRoom.price)} × {nights} nights
                        </span>
                      </div>
                    </div>

                    <div className="summary-row">
                      <span>Room</span>
                      <b>{formatPrice(roomTotal)}</b>
                    </div>

                    <div className="summary-row">
                      <span>Extras</span>
                      <b>{formatPrice(extrasTotal)}</b>
                    </div>

                    <div className="summary-row total-row">
                      <span>Total</span>
                      <b>{formatPrice(total)}</b>
                    </div>
                  </div>

                  <div className="payment-form">
                    <label>
                      Card Number
                      <input placeholder="0000 0000 0000 0000" />
                    </label>

                    <div className="form-grid">
                      <label>
                        Expiry
                        <input placeholder="MM / YY" />
                      </label>

                      <label>
                        CVV
                        <input placeholder="•••" />
                      </label>
                    </div>

                    <button className="primary-button" onClick={confirmBooking}>
                      Pay {formatPrice(total)} →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}