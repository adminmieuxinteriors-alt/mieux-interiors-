import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
import mongoose from "mongoose";
import Admin from "../models/Admin";
import Project from "../models/Project";
import Testimonial from "../models/Testimonial";
import Service from "../models/Service";
import Setting from "../models/Setting";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function runSeed() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined");
    process.exit(1);
  }

  console.log("Connecting to database...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully.");

  // 1. Seed Admin
  if (ADMIN_EMAIL && ADMIN_PASSWORD) {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    
    // Clean up any other admins to keep credentials synchronized with .env.local
    await Admin.deleteMany({ email: { $ne: ADMIN_EMAIL } });

    // Upsert the current admin account
    await Admin.findOneAndUpdate(
      { email: ADMIN_EMAIL },
      { password: hashedPassword },
      { upsert: true, returnDocument: 'after' }
    );
    
    console.log(`Admin user synchronized: ${ADMIN_EMAIL}`);
  } else {
    console.warn("ADMIN_EMAIL or ADMIN_PASSWORD is not set in environment.");
  }

  // 2. Seed Projects (only if empty)
  const projectCount = await Project.countDocuments();
  if (projectCount === 0) {
    const dummyProjects = [
      {
        title: "The Bronze Villa",
        slug: "the-bronze-villa",
        category: "home",
        location: "Kallachi, Nadapuram",
        shortDescription: "A luxurious 4 BHK residential project featuring earthy tones and premium bronze accents.",
        fullDescription: "The Bronze Villa is designed to merge luxury with warmth. Every element in this home is carefully selected to reflect natural materials, with solid timber finishes, earthy olive accents, and custom bronze fixtures. The spatial layout is open, welcoming ample natural light throughout the double-height living room and dining spaces.",
        coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
        ],
        year: 2025,
        area: "3,800 sq ft",
        status: "featured",
        styleTags: ["Modern", "Bronze Accent", "Warm Minimalist"],
      },
      {
        title: "Earthy Slate Studio",
        slug: "earthy-slate-studio",
        category: "office",
        location: "Nadapuram, Kerala",
        shortDescription: "An ergonomic, productive office space for a creative design agency with natural accents.",
        fullDescription: "Earthy Slate Studio is a workplace that fosters productivity and creativity. Employing an open floor plan, acoustic wood paneling, slate-gray floor tiles, and custom linear lighting. The office features multiple collaborative pods, private call chambers, and a central social kitchen area that acts as the hub of the agency.",
        coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
        ],
        year: 2024,
        area: "2,200 sq ft",
        status: "published",
        styleTags: ["Ergonomic", "Industrial", "Creative"],
      },
      {
        title: "Olive Harmony Residence",
        slug: "olive-harmony-residence",
        category: "interior",
        location: "Kozhikode, Kerala",
        shortDescription: "Custom interior styling prioritizing material balance, natural ventilation, and muted olives.",
        fullDescription: "Olive Harmony Residence is an interior-only project designed for a family of four. It emphasizes material honesty and spatial efficiency. Custom-crafted wardrobes, cane sliding partitions, and a soothing color palette dominated by muted olive and warm white create a sanctuary-like atmosphere.",
        coverImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=800&q=80",
        ],
        year: 2025,
        area: "1,950 sq ft",
        status: "featured",
        styleTags: ["Custom Furniture", "Warm White", "Tropical Modernism"],
      }
    ];

    await Project.insertMany(dummyProjects);
    console.log("Dummy projects seeded.");
  }

  // 3. Seed Testimonials (only if empty)
  const testimonialCount = await Testimonial.countDocuments();
  if (testimonialCount === 0) {
    const dummyTestimonials = [
      {
        name: "Dr. Anoop Rahman",
        place: "Nadapuram",
        quote: "Mieux Interiors completely transformed our vision for our home. The attention to detail and choice of warm materials like bronze and oak exceeded our expectations.",
        rating: 5,
        featured: true,
      },
      {
        name: "Mariyam N.",
        place: "Kallachi",
        quote: "Highly recommended professional team. The office layout they designed is functional, elegant, and our staff absolutely loves the collaborative hubs.",
        rating: 5,
        featured: true,
      }
    ];

    await Testimonial.insertMany(dummyTestimonials);
    console.log("Dummy testimonials seeded.");
  }

  // 4. Seed Services (only if empty)
  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    const dummyServices = [
      {
        title: "Residential Homes",
        description: "Bespoke villas, luxury apartments, and residential architectural planning customized to reflect family lifestyles.",
        coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
        linkUrl: "/services",
        order: 0,
        active: true,
      },
      {
        title: "Office Workspaces",
        description: "Highly functional, productive corporate offices and commercial retail layouts emphasizing ergonomic layout and flow.",
        coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
        linkUrl: "/services",
        order: 1,
        active: true,
      },
      {
        title: "Custom Interiors",
        description: "Fine details including kitchen design, lighting design, material scheduling, and tailored wooden carpentry.",
        coverImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
        linkUrl: "/services",
        order: 2,
        active: true,
      },
    ];

    await Service.insertMany(dummyServices);
    console.log("Dummy services seeded.");
  }

  // 5. Seed Settings (only if empty)
  const settingCount = await Setting.countDocuments();
  if (settingCount === 0) {
    await Setting.create({
      heroBgImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=80",
    });
    console.log("Default settings seeded.");
  }

  console.log("Seeding process completed successfully!");
  process.exit(0);
}

runSeed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
