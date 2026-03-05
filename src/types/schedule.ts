export type ScheduleCategory = "Infantil" | "Adultos";

export interface TimeSlot {
  time: string; // e.g. "16:00 - 17:00"
  sensei: string; // e.g. "Sensei Anna Santos"
}

export interface DayGroup {
  id: string; // e.g. "seg-qua-sex"
  label: string; // e.g. "Segunda / Quarta / Sexta"
  category: ScheduleCategory;
  slots: TimeSlot[];
  isPrimary: boolean; // true → red top bar; false → dark top bar
}

export interface Location {
  address: string;
  phone: string;
  mapsHref: string;
}
