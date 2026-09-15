export type BookingStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export type RoomStatus =
  | "available"
  | "occupied"
  | "cleaning"
  | "maintenance";

export type BedType =
  | "King Bed"
  | "Queen Bed"
  | "Twin Beds"
  | "Single Bed";

export interface Room {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_per_night: number;
  room_size: number;
  max_guests: number;
  bed_type: BedType;
  total_units: number;
  image_url: string;
  gallery: string[];
  amenities: string[];
  created_at?: string;
}

export interface RoomAvailability {
  room_id: string;
  room_name: string;
  price_per_night: number;
  max_guests: number;
  bed_type: BedType;
  total_units: number;
  booked_units: number;
  available_units: number;
}

export interface Guest {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  special_request?: string;
}

export interface Booking {
  id: string;
  booking_code: string;

  room_id: string;
  room?: Room;

  guest_first_name: string;
  guest_last_name: string;
  phone: string;
  email: string;

  check_in: string;
  check_out: string;

  adults: number;
  children: number;
  rooms_count: number;

  bed_type: BedType;

  special_request?: string;

  nights: number;
  price_per_night: number;
  total_amount: number;

  status: BookingStatus;
  payment_status: PaymentStatus;

  created_at: string;
  updated_at?: string;
}

export interface BookingSearch {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  bedType: BedType;
}

export interface HotelStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  pendingBookings: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  todayRevenue: number;
}

export interface AdminUser {
  id: string;
  email: string;
}