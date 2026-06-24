import { connectDB } from "@/lib/db";
import Setting from "@/models/Setting";
import Project from "@/models/Project";
import Testimonial from "@/models/Testimonial";
import Service from "@/models/Service";
import HomePageClient from "@/components/public/HomePageClient";

export const revalidate = 0; // Ensure fresh data on each page request

const DEFAULT_HERO_BG_IMAGE = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=80";

const FALLBACK_PROJECTS = [
  {
    _id: "1",
    title: "The Bronze Villa",
    slug: "the-bronze-villa",
    category: "home",
    location: "Kallachi, Nadapuram",
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    shortDescription: "A luxurious 4 BHK residential project featuring earthy tones and premium bronze accents.",
  },
  {
    _id: "2",
    title: "Earthy Slate Studio",
    slug: "earthy-slate-studio",
    category: "office",
    location: "Nadapuram, Kerala",
    coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    shortDescription: "An ergonomic, productive office space for a creative design agency with natural accents.",
  },
  {
    _id: "3",
    title: "Olive Harmony Residence",
    slug: "olive-harmony-residence",
    category: "interior",
    location: "Kozhikode, Kerala",
    coverImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Custom interior styling prioritizing material balance, natural ventilation, and muted olives.",
  },
];

const FALLBACK_TESTIMONIALS = [
  {
    _id: "1",
    name: "Dr. Anoop Rahman",
    place: "Nadapuram",
    quote: "Mieux Interiors completely transformed our vision for our home. The attention to detail and choice of warm materials like bronze and oak exceeded our expectations.",
    rating: 5,
  },
  {
    _id: "2",
    name: "Mariyam N.",
    place: "Kallachi",
    quote: "Highly recommended professional team. The office layout they designed is functional, elegant, and our staff absolutely loves the collaborative hubs.",
    rating: 5,
  },
];

const FALLBACK_SERVICES = [
  {
    _id: "s1",
    title: "Residential Homes",
    description: "Bespoke villas, luxury apartments, and residential architectural planning customized to reflect family lifestyles.",
    coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
    linkUrl: "/services",
  },
  {
    _id: "s2",
    title: "Office Workspaces",
    description: "Highly functional, productive corporate offices and commercial retail layouts emphasizing ergonomic layout and flow.",
    coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
    linkUrl: "/services",
  },
  {
    _id: "s3",
    title: "Custom Interiors",
    description: "Fine details including kitchen design, lighting design, material scheduling, and tailored wooden carpentry.",
    coverImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80",
    linkUrl: "/services",
  },
];

const serialize = (data: any) => JSON.parse(JSON.stringify(data));

export default async function HomePage() {
  let heroBgImage = DEFAULT_HERO_BG_IMAGE;
  let projects = FALLBACK_PROJECTS;
  let testimonials = FALLBACK_TESTIMONIALS;
  let services = FALLBACK_SERVICES;

  try {
    await connectDB();

    // 1. Fetch settings
    const setting = await Setting.findOne().lean();
    if (setting && setting.heroBgImage) {
      heroBgImage = setting.heroBgImage;
    }

    // 2. Fetch projects
    const dbProjects = await Project.find({ status: "featured" }).lean();
    if (dbProjects && dbProjects.length > 0) {
      projects = dbProjects.slice(0, 3) as any;
    }

    // 3. Fetch testimonials
    const dbTestimonials = await Testimonial.find().lean();
    if (dbTestimonials && dbTestimonials.length > 0) {
      testimonials = dbTestimonials as any;
    }

    // 4. Fetch services
    const dbServices = await Service.find({ active: true }).lean();
    if (dbServices && dbServices.length > 0) {
      services = dbServices as any;
    }
  } catch (error) {
    console.error("Error loading homepage data from server:", error);
  }

  return (
    <HomePageClient
      initialHeroBgImage={heroBgImage}
      initialProjects={serialize(projects)}
      initialTestimonials={serialize(testimonials)}
      initialServices={serialize(services)}
    />
  );
}
