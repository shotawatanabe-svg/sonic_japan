export type GuestSizeEntry = {
  type: "Man" | "Woman" | "Boy" | "Girl";
  size: string;
};

export type BookingState = {
  currentStep: 1 | 2 | 3 | 4 | 5;
  date: string | null;
  timeSlot: string | null;
  activities: string[];
  nickname: string;
  email: string;
  numberOfGuests: number | null;
  guestSizeEntries: GuestSizeEntry[];
  roomNumber: string;
  specialRequests: string;
  agreedToTerms: boolean;
  isSubmitting: boolean;
  error: string | null;
};

export type BookingRequest = {
  date: string;
  timeSlot: string;
  activities: string[];
  nickname: string;
  email: string;
  numberOfGuests: number;
  guestSizes: string;
  roomNumber: string;
  specialRequests?: string;
  agreedToTerms: boolean;
};

export const TIME_SLOTS = [
  { label: "16:00–17:30", value: "16:00-17:30" },
  { label: "18:00–19:30", value: "18:00-19:30" },
  { label: "20:00–21:30", value: "20:00-21:30" },
  { label: "22:00–23:30", value: "22:00-23:30" },
] as const;

export const INITIAL_BOOKING_STATE: BookingState = {
  currentStep: 1,
  date: null,
  timeSlot: null,
  activities: [],
  nickname: "",
  email: "",
  numberOfGuests: null,
  guestSizeEntries: [],
  roomNumber: "",
  specialRequests: "",
  agreedToTerms: false,
  isSubmitting: false,
  error: null,
};
