import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { CourseCard } from "@/components/CourseCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-offwhite flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="px-6 md:px-12 py-16 md:py-24 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-8">
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-deep-indigo leading-none">
              Learn Skills That <span className="bg-primary text-white px-2">Actually</span> Matter.
            </h1>
            <p className="text-xl md:text-2xl font-body text-dark-text max-w-xl">
              Ditch the boring corporate LMS. SkillPath is where modern creators learn, build, and grow.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" className="text-lg px-10 py-4">Explore Courses</Button>
              <Button variant="secondary" className="text-lg px-10 py-4">Join Community</Button>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-deep-indigo bg-secondary flex items-center justify-center font-bold text-xs shadow-[2px_2px_0px_#2D1B69]">
                    U{i}
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold text-deep-indigo">Join 10,000+ modern learners</p>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div className="w-full aspect-square bg-primary border-4 border-deep-indigo shadow-brutal-lg rounded-xl flex items-center justify-center rotate-3">
               <div className="w-4/5 h-4/5 bg-secondary border-4 border-deep-indigo -rotate-6 flex items-center justify-center p-8">
                 <div className="text-deep-indigo font-heading font-bold text-6xl text-center">SKILL PATH</div>
               </div>
            </div>
            {/* Sticker UI elements */}
            <div className="absolute -top-4 -right-4 bg-warning border-2 border-deep-indigo px-4 py-2 font-bold rotate-12 shadow-brutal">
              HOT!
            </div>
            <div className="absolute -bottom-8 -left-8 bg-success border-2 border-deep-indigo px-4 py-2 font-bold -rotate-6 shadow-brutal text-white">
              NEW CONTENT
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="bg-secondary/20 border-y-3 border-deep-indigo py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl font-heading font-bold text-deep-indigo">Featured Courses</h2>
                <p className="text-lg opacity-80">Hand-picked for your career growth</p>
              </div>
              <Button variant="ghost">View All</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <CourseCard 
                title="Mastering Brutalist Design" 
                category="Design" 
                instructor="Gary Bold" 
                rating={4.9} 
              />
              <CourseCard 
                title="Advanced SaaS Architecture" 
                category="Development" 
                instructor="Sarah Script" 
                rating={4.8} 
              />
              <CourseCard 
                title="Modern Marketing Secrets" 
                category="Business" 
                instructor="Mark Growth" 
                rating={4.7} 
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Courses', value: '150+' },
              { label: 'Students', value: '10K+' },
              { label: 'Mentors', value: '45+' },
              { label: 'Success Rate', value: '98%' },
            ].map((stat, i) => (
              <Card key={i} className="text-center space-y-2 bg-surface-lowest">
                <div className="text-4xl font-heading font-bold text-primary">{stat.value}</div>
                <div className="font-bold text-deep-indigo uppercase tracking-wider text-xs">{stat.label}</div>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-deep-indigo text-white py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary border-2 border-white flex items-center justify-center font-bold">S</div>
                <span className="font-heading font-bold text-2xl">SkillPath</span>
             </div>
             <p className="opacity-70 text-sm">Empowering the next generation of creators through chunky, tactile learning experiences.</p>
          </div>
          <div>
            <h4 className="font-heading font-bold mb-4">Platform</h4>
            <ul className="space-y-2 opacity-70 text-sm">
              <li>Courses</li>
              <li>Mentors</li>
              <li>Pricing</li>
              <li>Resources</li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-bold mb-4">Company</h4>
            <ul className="space-y-2 opacity-70 text-sm">
              <li>About</li>
              <li>Careers</li>
              <li>Contact</li>
              <li>Privacy</li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-bold mb-4">Newsletter</h4>
            <div className="flex gap-2">
              <input type="text" placeholder="Email" className="bg-white/10 border border-white/20 p-2 rounded flex-1 text-sm outline-none focus:border-primary" />
              <button className="bg-primary px-4 py-2 font-bold text-sm">Join</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-center opacity-50 text-xs">
          © 2026 SkillPath EdTech Platform. Stay Bold.
        </div>
      </footer>
    </div>
  );
}
