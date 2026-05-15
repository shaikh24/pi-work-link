import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MapPin, Clock, Briefcase, DollarSign, Users } from "lucide-react";
import jobTech from "@/assets/job-tech.jpg";
import jobMarketing from "@/assets/job-marketing.jpg";
import jobMobile from "@/assets/job-mobile.jpg";
import jobWriting from "@/assets/job-writing.jpg";
import designGig from "@/assets/gig-design.jpg";
import videoGig from "@/assets/gig-video.jpg";
import avatarAlex from "@/assets/avatar-alex.jpg";
import avatarSarah from "@/assets/avatar-sarah.jpg";

const dummyJobs = [
  {
    id: 1,
    title: "Senior React Developer for SaaS Dashboard",
    company: "TechFlow Inc.",
    companyAvatar: avatarAlex,
    location: "Remote",
    type: "Full-time",
    budget: 1500,
    duration: "3 months",
    proposals: 12,
    image: jobTech,
    tags: ["React", "TypeScript", "Tailwind", "Supabase"],
    description:
      "Build a modern analytics dashboard with real-time charts, auth, and team management features.",
    posted: "2 hours ago",
  },
  {
    id: 2,
    title: "Social Media Marketing Campaign Manager",
    company: "Bloom Cosmetics",
    companyAvatar: avatarSarah,
    location: "Remote",
    type: "Contract",
    budget: 850,
    duration: "1 month",
    proposals: 24,
    image: jobMarketing,
    tags: ["Instagram", "TikTok", "Ads", "Strategy"],
    description:
      "Plan and execute a 30-day product launch campaign across Instagram, TikTok and Facebook.",
    posted: "5 hours ago",
  },
  {
    id: 3,
    title: "Mobile App UI/UX Designer Needed",
    company: "FitTrack",
    companyAvatar: "",
    location: "Remote",
    type: "Project",
    budget: 1200,
    duration: "6 weeks",
    proposals: 31,
    image: jobMobile,
    tags: ["Figma", "UI", "Mobile", "Prototype"],
    description:
      "Design 25+ screens for a fitness tracking mobile app including onboarding and dashboards.",
    posted: "1 day ago",
  },
  {
    id: 4,
    title: "Long-form Blog Writer (Tech & Crypto)",
    company: "CryptoDaily",
    companyAvatar: "",
    location: "Remote",
    type: "Ongoing",
    budget: 60,
    duration: "Per article",
    proposals: 47,
    image: jobWriting,
    tags: ["Writing", "SEO", "Crypto", "Research"],
    description:
      "Write 2,000+ word SEO-optimized articles weekly about Web3, Pi Network, and blockchain.",
    posted: "1 day ago",
  },
  {
    id: 5,
    title: "Brand Identity & Logo Design",
    company: "GreenLeaf Co.",
    companyAvatar: avatarSarah,
    location: "Remote",
    type: "One-time",
    budget: 500,
    duration: "2 weeks",
    proposals: 18,
    image: designGig,
    tags: ["Branding", "Logo", "Illustrator"],
    description:
      "Create a complete brand identity for an eco-friendly home goods startup.",
    posted: "2 days ago",
  },
  {
    id: 6,
    title: "YouTube Video Editor (Weekly)",
    company: "Creator Studio",
    companyAvatar: avatarAlex,
    location: "Remote",
    type: "Part-time",
    budget: 400,
    duration: "Weekly",
    proposals: 9,
    image: videoGig,
    tags: ["Premiere", "After Effects", "Color Grading"],
    description:
      "Edit 2 long-form YouTube videos per week with motion graphics and thumbnails.",
    posted: "3 days ago",
  },
];

const HireWork = () => {
  const [query, setQuery] = useState("");
  const filtered = dummyJobs.filter(
    (j) =>
      j.title.toLowerCase().includes(query.toLowerCase()) ||
      j.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Hire Work</h1>
            <p className="text-muted-foreground">
              Browse open jobs from clients ready to hire freelancers.
            </p>
          </div>
          <Button className="btn-hero" asChild>
            <Link to="/post-job">
              <Briefcase className="mr-2 h-4 w-4" />
              Post a Job
            </Link>
          </Button>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search jobs by title or skill..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 pl-12 bg-card"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((job) => (
            <Card key={job.id} className="card-interactive overflow-hidden">
              <div className="aspect-video bg-muted">
                <img
                  src={job.image}
                  alt={job.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{job.type}</Badge>
                  <span className="text-xs text-muted-foreground">{job.posted}</span>
                </div>
                <h3 className="font-semibold line-clamp-2">{job.title}</h3>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={job.companyAvatar} />
                    <AvatarFallback className="text-xs bg-gradient-primary text-white">
                      {job.company.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{job.company}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                <div className="flex flex-wrap gap-1">
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground border-t pt-3">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    <span className="font-bold text-accent">{job.budget} π</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {job.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {job.proposals} proposals
                  </div>
                </div>
                <Button className="w-full" size="sm">
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No jobs match your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default HireWork;