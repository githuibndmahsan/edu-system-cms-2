export type Qualification = { degree: string; institution: string; year: string };
export type Experience = { role: string; organization: string; period: string; description?: string };
export type Certification = { title: string; issuer: string; year: string };

export type Teacher = {
  id: string;
  full_name: string;
  designation: string;
  department: string | null;
  teaching_level: string | null;
  subjects: string[];
  qualifications: Qualification[];
  experiences: Experience[];
  certifications: Certification[];
  skills: string[];
  languages: string[];
  achievements: string[];
  bio: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  facebook_url: string | null;
  photo_path: string | null;
  resume_path: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export const emptyTeacher = (): Omit<Teacher, "id" | "created_at" | "updated_at"> => ({
  full_name: "",
  designation: "",
  department: "",
  teaching_level: "",
  subjects: [],
  qualifications: [],
  experiences: [],
  certifications: [],
  skills: [],
  languages: [],
  achievements: [],
  bio: "",
  email: "",
  phone: "",
  linkedin_url: "",
  facebook_url: "",
  photo_path: null,
  resume_path: null,
  is_published: true,
  sort_order: 0,
});

export function publicPhotoUrl(path: string | null): string | null {
  if (!path) return null;
  const base = (import.meta.env.VITE_SUPABASE_URL as string) || "";
  return `${base}/storage/v1/object/public/teacher-photos/${path}`;
}
