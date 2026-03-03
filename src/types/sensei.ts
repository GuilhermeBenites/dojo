export interface Sensei {
  id: string;
  name: string;
  rank: string;
  specialty: string;
  bio: string;
  photoUrl: string;
  photoAlt: string;
  profileHref: string;
}

export interface FounderSensei {
  name: string;
  rank: string;
  organization: string;
  bio: string[];
  quote: string;
  photoUrl: string;
  photoAlt: string;
}
