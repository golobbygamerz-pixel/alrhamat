import type { Room } from "./types";

export const rooms: Room[] = [
  {
    id: "deluxe-room",
    slug: "deluxe-room",
    name: "Deluxe Room",
    description:
      "A calm and refined room designed for a comfortable city stay, with contemporary interiors and thoughtful amenities.",
    price_per_night: 3500,
    room_size: 280,
    max_guests: 2,
    bed_type: "King Bed",
    total_units: 6,
    image_url:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1587985064135-0366536eab42?auto=format&fit=crop&w=1600&q=85"
    ],
    amenities: [
      "King Bed",
      "Free Wi-Fi",
      "Air Conditioning",
      "Smart TV",
      "Room Service",
      "Private Bathroom"
    ]
  },

  {
    id: "premium-room",
    slug: "premium-room",
    name: "Premium Room",
    description:
      "A spacious premium stay combining warm hospitality, generous space and modern comforts.",
    price_per_night: 4500,
    room_size: 340,
    max_guests: 3,
    bed_type: "King Bed",
    total_units: 5,
    image_url:
      "https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1600&q=85"
    ],
    amenities: [
      "King Bed",
      "Free Wi-Fi",
      "Air Conditioning",
      "Smart TV",
      "Mini Fridge",
      "Room Service",
      "Private Bathroom"
    ]
  },

  {
    id: "family-room",
    slug: "family-room",
    name: "Family Room",
    description:
      "Comfortable and spacious accommodation designed for families and small groups.",
    price_per_night: 5500,
    room_size: 420,
    max_guests: 4,
    bed_type: "Twin Beds",
    total_units: 4,
    image_url:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1600&q=85"
    ],
    amenities: [
      "Twin Beds",
      "Free Wi-Fi",
      "Air Conditioning",
      "Smart TV",
      "Room Service",
      "Private Bathroom",
      "Extra Seating"
    ]
  },

  {
    id: "executive-suite",
    slug: "executive-suite",
    name: "Executive Suite",
    description:
      "An elevated suite with separate living space, refined interiors and premium hotel services.",
    price_per_night: 7500,
    room_size: 560,
    max_guests: 4,
    bed_type: "King Bed",
    total_units: 2,
    image_url:
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85"
    ],
    amenities: [
      "King Bed",
      "Separate Living Area",
      "Free Wi-Fi",
      "Air Conditioning",
      "Smart TV",
      "Mini Fridge",
      "Room Service",
      "Premium Bathroom"
    ]
  }
];

export const facilities = [
  {
    title: "24/7 Reception",
    description:
      "Our front desk is available around the clock for assistance whenever you need it."
  },
  {
    title: "Free Wi-Fi",
    description:
      "Stay connected throughout the hotel with complimentary high-speed Wi-Fi."
  },
  {
    title: "Restaurant",
    description:
      "Enjoy freshly prepared meals and a comfortable dining experience."
  },
  {
    title: "Room Service",
    description:
      "Convenient in-room dining and essential services throughout your stay."
  },
  {
    title: "Parking",
    description:
      "Convenient parking facilities are available for hotel guests."
  },
  {
    title: "Swimming Pool",
    description:
      "Take a refreshing break and relax by our pool."
  },
  {
    title: "Airport Transfer",
    description:
      "Transfer assistance can be arranged for a smoother journey."
  },
  {
    title: "Housekeeping",
    description:
      "Professional housekeeping keeps your room fresh and comfortable."
  }
];

export const experiences = [
  {
    title: "Dine",
    description:
      "Discover comforting flavours and carefully prepared meals in a relaxed setting."
  },
  {
    title: "Relax",
    description:
      "Slow down and enjoy a peaceful stay away from the pace of everyday life."
  },
  {
    title: "Celebrate",
    description:
      "Create memorable moments with spaces designed for gatherings and occasions."
  },
  {
    title: "Explore",
    description:
      "Discover the local area with helpful recommendations from our team."
  }
];

export const reviews = [
  {
    name: "Aarav Mehta",
    rating: 5,
    text:
      "Beautiful rooms, welcoming staff and a very comfortable stay."
  },
  {
    name: "Sara Khan",
    rating: 5,
    text:
      "The room was clean, spacious and exactly as expected. Would stay again."
  },
  {
    name: "Vikram Singh",
    rating: 5,
    text:
      "Excellent hospitality and a smooth check-in experience."
  }
];

export const hotelInfo = {
  name: "Al Rahamat Hotel",
  tagline: "A refined stay, designed around you.",
  phone: "+91 00000 00000",
  email: "stay@alrahamathotel.com",
  address: "Hotel Address, Rajasthan, India",
  checkInTime: "2:00 PM",
  checkOutTime: "11:00 AM"
};