import { Navigate, Route, Routes } from "react-router-dom";

import {
  Home,
  Rooms,
  RoomDetails,
  Booking,
  AvailableRooms,
  GuestDetails,
  BookingSuccess,
  MyBooking,
  Facilities,
  Experience,
  About,
  Contact,
} from "./pages";

import {
  AdminLogin,
  AdminDashboard,
  AdminBookings,
  AdminRooms,
  AdminCalendar,
} from "./admin";

function App() {
  return (
    <Routes>
      {/* CUSTOMER WEBSITE */}

      <Route path="/" element={<Home />} />

      <Route path="/rooms" element={<Rooms />} />

      <Route
        path="/rooms/:roomId"
        element={<RoomDetails />}
      />

      <Route
        path="/booking"
        element={<Booking />}
      />

      <Route
        path="/booking/rooms"
        element={<AvailableRooms />}
      />

      <Route
        path="/booking/details"
        element={<GuestDetails />}
      />

      <Route
        path="/booking/success"
        element={<BookingSuccess />}
      />

      <Route
        path="/my-booking"
        element={<MyBooking />}
      />

      <Route
        path="/facilities"
        element={<Facilities />}
      />

      <Route
        path="/experience"
        element={<Experience />}
      />

      <Route
        path="/about"
        element={<About />}
      />

      <Route
        path="/contact"
        element={<Contact />}
      />

      {/* ADMIN PANEL */}

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      <Route
        path="/admin"
        element={<AdminDashboard />}
      />

      <Route
        path="/admin/bookings"
        element={<AdminBookings />}
      />

      <Route
        path="/admin/rooms"
        element={<AdminRooms />}
      />

      <Route
        path="/admin/calendar"
        element={<AdminCalendar />}
      />

      {/* FALLBACK */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;