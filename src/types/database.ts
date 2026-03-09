// -------------------------------------------------------
// Row types (SELECT shape returned by Supabase)
// -------------------------------------------------------

export interface SenseiRow {
  id: string;
  name: string;
  rank: string;
  specialty: string | null;
  bio: string | null;
  photo_url: string | null;
  is_founder: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface TestimonialRow {
  id: string;
  author: string;
  role: string;
  quote: string;
  display_order: number;
  created_at: string;
}

export interface ScheduleRow {
  id: string;
  day_group_id: string;
  day_label: string;
  time_start: string;
  time_end: string;
  category: "infantil" | "adultos";
  instructor: string | null;
  display_order: number;
  created_at: string;
}

export interface GalleryImageRow {
  id: string;
  title: string;
  category: string;
  image_url: string;
  aspect_ratio: string;
  display_order: number;
  created_at: string;
}

export interface ChampionshipRow {
  id: string;
  name: string;
  event_date: string;
  location: string;
  status: "finalizado" | "em-andamento" | "futuro";
  gold: number;
  silver: number;
  bronze: number;
  display_order: number;
  created_at: string;
}

export interface ChampionshipResultRow {
  id: string;
  championship_id: string;
  athlete_name: string;
  placement: 1 | 2 | 3;
  category: string;
  created_at: string;
}

export interface HallOfFameRow {
  id: string;
  name: string;
  achievement: string;
  photo_url: string | null;
  display_order: number;
  created_at: string;
}

export interface DojoStatsRow {
  id: string;
  total_gold: number;
  total_silver: number;
  total_bronze: number;
  total_trophies: number;
  updated_at: string;
}

export interface PlanRow {
  id: string;
  plan_key: string;
  title: string;
  subtitle: string;
  recommended: boolean;
  tiers: Array<{
    label: string;
    price: string;
    isMonthlyHighlight: boolean;
    suffix?: string;
  }>;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface BeltExamRow {
  id: string;
  belt: string;
  price: string;
  family_price: string;
  highlighted: boolean;
  display_order: number;
}

export interface DropInClassRow {
  id: string;
  label: string;
  price: string;
  display_order: number;
}

export interface FaqItemRow {
  id: string;
  question: string;
  answer: string;
  display_order: number;
}

export interface StudentRow {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  belt: string;
  plan_id: string | null;
  enrollment_date: string;
  birth_date: string | null;
  active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadRow {
  id: string;
  name: string;
  phone: string;
  source: string;
  created_at: string;
}

// -------------------------------------------------------
// Insert types (omit generated fields when inserting)
// -------------------------------------------------------

export type SenseiInsert = Omit<SenseiRow, "id" | "created_at" | "updated_at">;
export type ScheduleInsert = Omit<ScheduleRow, "id" | "created_at">;
export type GalleryImageInsert = Omit<GalleryImageRow, "id" | "created_at">;
export type ChampionshipInsert = Omit<ChampionshipRow, "id" | "created_at">;
export type ChampionshipResultInsert = Omit<
  ChampionshipResultRow,
  "id" | "created_at"
>;
export type PlanInsert = Omit<PlanRow, "id" | "created_at" | "updated_at">;

// -------------------------------------------------------
// Database interface (passed as generic to createClient<Database>)
// -------------------------------------------------------

export interface Database {
  public: {
    Tables: {
      senseis: {
        Row: SenseiRow;
        Insert: SenseiInsert;
        Update: Partial<SenseiInsert>;
      };
      testimonials: {
        Row: TestimonialRow;
        Insert: Omit<TestimonialRow, "id" | "created_at">;
        Update: Partial<Omit<TestimonialRow, "id" | "created_at">>;
      };
      schedules: {
        Row: ScheduleRow;
        Insert: ScheduleInsert;
        Update: Partial<ScheduleInsert>;
      };
      gallery_images: {
        Row: GalleryImageRow;
        Insert: GalleryImageInsert;
        Update: Partial<GalleryImageInsert>;
      };
      championships: {
        Row: ChampionshipRow;
        Insert: ChampionshipInsert;
        Update: Partial<ChampionshipInsert>;
      };
      championship_results: {
        Row: ChampionshipResultRow;
        Insert: ChampionshipResultInsert;
        Update: Partial<ChampionshipResultInsert>;
      };
      hall_of_fame: {
        Row: HallOfFameRow;
        Insert: Omit<HallOfFameRow, "id" | "created_at">;
        Update: Partial<Omit<HallOfFameRow, "id" | "created_at">>;
      };
      dojo_stats: {
        Row: DojoStatsRow;
        Insert: Omit<DojoStatsRow, "id">;
        Update: Partial<Omit<DojoStatsRow, "id">>;
      };
      plans: { Row: PlanRow; Insert: PlanInsert; Update: Partial<PlanInsert> };
      belt_exams: {
        Row: BeltExamRow;
        Insert: Omit<BeltExamRow, "id">;
        Update: Partial<Omit<BeltExamRow, "id">>;
      };
      drop_in_classes: {
        Row: DropInClassRow;
        Insert: Omit<DropInClassRow, "id">;
        Update: Partial<Omit<DropInClassRow, "id">>;
      };
      faq_items: {
        Row: FaqItemRow;
        Insert: Omit<FaqItemRow, "id">;
        Update: Partial<Omit<FaqItemRow, "id">>;
      };
      students: {
        Row: StudentRow;
        Insert: Omit<StudentRow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<StudentRow, "id" | "created_at" | "updated_at">>;
      };
      leads: {
        Row: LeadRow;
        Insert: Omit<LeadRow, "id" | "created_at">;
        Update: never;
      };
    };
  };
}
