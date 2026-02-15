// === 予約送信（Googleフォーム隠し送信） ===

// フォーム作成後に取得した entry ID をここに設定
const FORM_ACTION_URL = process.env.NEXT_PUBLIC_GOOGLE_FORM_URL!;
const ENTRY_IDS = {
  date:            'entry.1320907285',
  timeSlot:        'entry.107939701',
  activity1:       'entry.1265307041',
  activity2:       'entry.957390727',
  activity3:       'entry.1790454942',
  nickname:        'entry.289897214',
  email:           'entry.1391089621',
  numberOfGuests:  'entry.268241437',
  guestSizes:      'entry.446764668',
  roomNumber:      'entry.1937501250',
  specialRequests: 'entry.1624378624',
};

export type BookingData = {
  date: string;
  timeSlot: string;
  activities: string[];
  nickname: string;
  email: string;
  numberOfGuests: number;
  guestSizes: string;  // "Man-L,Woman-M" format
  roomNumber: string;
  specialRequests: string;
  agreedToTerms: boolean;
};

export async function submitBooking(data: BookingData): Promise<{ success: boolean }> {
  const formData = new FormData();
  formData.append(ENTRY_IDS.date, data.date);
  formData.append(ENTRY_IDS.timeSlot, data.timeSlot);
  formData.append(ENTRY_IDS.activity1, data.activities[0] || '');
  formData.append(ENTRY_IDS.activity2, data.activities[1] || '');
  formData.append(ENTRY_IDS.activity3, data.activities[2] || '');
  formData.append(ENTRY_IDS.nickname, data.nickname);
  formData.append(ENTRY_IDS.email, data.email);
  formData.append(ENTRY_IDS.numberOfGuests, String(data.numberOfGuests));
  formData.append(ENTRY_IDS.guestSizes, data.guestSizes);
  formData.append(ENTRY_IDS.roomNumber, data.roomNumber);
  formData.append(ENTRY_IDS.specialRequests, data.specialRequests || '');

  try {
    await fetch(FORM_ACTION_URL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors',
    });
    return { success: true };
  } catch (error) {
    console.error('Form submission failed:', error);
    return { success: false };
  }
}
