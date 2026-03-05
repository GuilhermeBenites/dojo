import type { DayGroup, Location } from "@/types/schedule";

export const LOCATION: Location = {
  address: "R. Guia Lopes, 173 - Amambai, Campo Grande - MS, 79005-330",
  phone: "(67) 99287-9411",
  mapsHref: "https://www.google.com/maps/place/R.+Guia+Lopes,+173+-+Amambai,+Campo+Grande+-+MS,+79005-330/@-20.4695393,-54.6370046,17z/data=!3m1!4b1!4m6!3m5!1s0x9486e66a7f157adb:0xf0fb240dd8e96bf6!8m2!3d-20.4695393!4d-54.6344297!16s%2Fg%2F11svtf89zx?entry=ttu&g_ep=EgoyMDI2MDMwMS4xIKXMDSoASAFQAw%3D%3D",
};

export const SCHEDULE_GROUPS: DayGroup[] = [
  {
    id: "seg-qua-sex-infantil",
    label: "Segunda / Quarta / Sexta",
    category: "Infantil",
    slots: [
      { time: "16:00 - 17:00", sensei: "Sensei Anna Santos" },
      { time: "18:15 - 19:15", sensei: "Sensei Luciano dos Santos" },
    ],
    isPrimary: true,
  },
  {
    id: "ter-qui-infantil",
    label: "Terça / Quinta",
    category: "Infantil",
    slots: [
      { time: "09:00 - 10:00", sensei: "Sensei Wynner Armoa" },
      { time: "16:00 - 17:00", sensei: "Sensei Anna Santos" },
      { time: "17:00 - 18:00", sensei: "Sensei Letícia Mendez" },
      { time: "18:15 - 19:15", sensei: "Sensei Letícia Mendez" },
    ],
    isPrimary: false,
  },
  {
    id: "seg-qua-sex-adultos",
    label: "Segunda / Quarta / Sexta",
    category: "Adultos",
    slots: [
      { time: "19:30 - 21:00", sensei: "Sensei Luciano dos Santos" },
      { time: "06:30 - 07:30", sensei: "Sensei Wynner Armoa" },
    ],
    isPrimary: true,
  },
  {
    id: "ter-qui-adultos",
    label: "Terça / Quinta",
    category: "Adultos",
    slots: [
      { time: "07:00 - 08:00", sensei: "Sensei Letícia Mendez" },
      { time: "19:30 - 21:00", sensei: "Sensei Luciano dos Santos" },
    ],
    isPrimary: false,
  },
];
