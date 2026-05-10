import heroImg from "@/assets/hero-school.jpg";
import classroomImg from "@/assets/classroom.jpg";
import eventIndependence from "@/assets/event-independence.jpg";
import eventSports from "@/assets/event-sports.jpg";
import eventAnnual from "@/assets/event-annual.jpg";
import eventScience from "@/assets/event-science.jpg";

export const SCHOOL = {
  name: "Bloom Public School",
  tagline: "Where curiosity blossoms into excellence.",
  phone: "+92 300 1234567",
  whatsapp: "923001234567",
  email: "info@bloompublic.edu.pk",
  address: "Main Campus, Education City, Pakistan",
  facebook: "https://facebook.com",
};

export const NAV = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Events", to: "/events" },
  { label: "Admissions", to: "/admissions" },
  { label: "Contact", to: "/contact" },
] as const;

export type AlertLevel = "normal" | "important" | "urgent";
export const NEWS: { text: string; level: AlertLevel }[] = [
  { text: "Admissions Open for Session 2026 — Limited seats", level: "urgent" },
  { text: "Annual Sports Gala scheduled for 15 March", level: "important" },
  { text: "Parent–Teacher Meeting on Saturday, 9:00 AM", level: "normal" },
  { text: "School closed on Pakistan Day (23 March)", level: "important" },
  { text: "Iqbal Day special assembly on 9 November", level: "normal" },
];

export const TIMINGS = {
  current: "winter" as "summer" | "winter",
  winter: { start: "08:00 AM", end: "02:00 PM", break: "11:00 – 11:30 AM" },
  summer: { start: "07:30 AM", end: "01:00 PM", break: "10:30 – 11:00 AM" },
  days: "Monday – Friday",
};

export const STATS = [
  { value: 1200, suffix: "+", label: "Happy Students" },
  { value: 60, suffix: "+", label: "Expert Faculty" },
  { value: 25, suffix: "yrs", label: "Of Excellence" },
  { value: 98, suffix: "%", label: "Board Results" },
];

export type EventCategory = "Academic" | "Sports" | "National" | "Cultural" | "Islamic";
export const EVENTS = [
  { id: "independence-day", title: "Independence Day Celebration", date: "14 Aug 2025", category: "National" as EventCategory, image: eventIndependence, excerpt: "Marching, tableaus, and patriotic spirit across the campus." },
  { id: "sports-gala", title: "Annual Sports Gala", date: "15 Mar 2026", category: "Sports" as EventCategory, image: eventSports, excerpt: "Track events, team sports and inter-house championships." },
  { id: "annual-function", title: "Annual Function 2025", date: "20 Dec 2025", category: "Cultural" as EventCategory, image: eventAnnual, excerpt: "An evening of music, drama and cultural performances." },
  { id: "science-fair", title: "Inter-Class Science Fair", date: "10 Feb 2026", category: "Academic" as EventCategory, image: eventScience, excerpt: "Innovative student projects across physics, chemistry & biology." },
  { id: "iqbal-day", title: "Iqbal Day Assembly", date: "9 Nov 2025", category: "National" as EventCategory, image: eventIndependence, excerpt: "Tribute to the philosopher-poet of the East." },
  { id: "milad", title: "Milad-un-Nabi Mehfil", date: "5 Sep 2025", category: "Islamic" as EventCategory, image: eventAnnual, excerpt: "Naat recitations and religious lectures." },
];

export const FACULTY = [
  { name: "Ms. Ayesha Khan", role: "Principal", subject: "M.Phil Education" },
  { name: "Mr. Imran Sheikh", role: "Head of Sciences", subject: "Physics, Chemistry" },
  { name: "Ms. Fatima Raza", role: "Head of English", subject: "English Literature" },
  { name: "Mr. Bilal Ahmed", role: "Senior Mathematician", subject: "Mathematics" },
];

export const TESTIMONIALS = [
  { name: "Sara Mahmood", role: "Parent, Grade 5", quote: "Bloom’s teachers genuinely care. My daughter looks forward to school every single day." },
  { name: "Ahmed Ali", role: "Alumnus, 2022", quote: "The discipline, mentorship and exposure I received here shaped my university journey." },
  { name: "Hira Saleem", role: "Parent, Grade 8", quote: "Modern facilities with old-school values. The communication with parents is excellent." },
];

export { heroImg, classroomImg };
