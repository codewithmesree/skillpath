"use client";

import React from 'react';
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Check, Sparkles, Zap, Shield, Rocket } from 'lucide-react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const [isYearly, setIsYearly] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const plans = [
    {
      name: "Hobbyist",
      price: "0",
      description: "Perfect for exploring the basics of brutalist design and coding.",
      features: [
        "Access to 5 free courses",
        "Public community access",
        "Standard support",
        "Basic progress tracking"
      ],
      buttonText: "Start for Free",
      variant: "secondary",
      icon: Zap
    },
    {
      name: "Professional",
      price: isYearly ? "39" : "49",
      description: "Our most popular plan for serious learners and career changers.",
      features: [
        "Unlimited course access",
        "Priority Discord channel",
        "Exclusive workshops",
        "Verified certificates",
        "Ad-free experience"
      ],
      buttonText: "Go Professional",
      variant: "primary",
      icon: Sparkles,
      popular: true
    },
    {
      name: "Enterprise",
      price: isYearly ? "159" : "199",
      description: "Tailored solutions for teams and high-growth organizations.",
      features: [
        "Bulk seat management",
        "Custom learning paths",
        "Dedicated success manager",
        "Advanced team analytics",
        "SLA & SSO support"
      ],
      buttonText: "Contact Sales",
      variant: "outline",
      icon: Shield
    }
  ];

  const handlePurchase = async (plan: any) => {
    if (plan.name === "Hobbyist") {
      router.push('/register');
      return;
    }

    setLoading(true);
    try {
      const orderRes = await fetch('/api/payment/create-plan-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          planName: plan.name, 
          amount: parseInt(plan.price) 
        }),
      });
      const order = await orderRes.json();

      if (!orderRes.ok) throw new Error(order.error || 'Failed to create order');

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "SkillPath",
        description: `${plan.name} Subscription`,
        order_id: order.id,
        handler: async function (response: any) {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });

          if (verifyRes.ok) {
            alert('Plan upgraded successfully! Please log in again to refresh your session.');
            router.push('/dashboard');
          } else {
            alert('Payment verification failed.');
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
        },
        theme: {
          color: "#9D7BFF",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-offwhite flex flex-col font-body">
      <Navbar />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <main className="flex-grow">
        {/* Header Section */}
        <section className="py-20 px-6 text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-deep-indigo uppercase tracking-tighter">Choose Your Path</h1>
          <p className="text-xl opacity-70 max-w-2xl mx-auto">
            Unlock the power of unconventional learning. Pick a plan that fits your ambition and start building the future today.
          </p>
          
          <div className="flex items-center justify-center gap-4 pt-4">
            <span className={`font-bold text-sm uppercase transition-all ${!isYearly ? 'text-primary scale-110' : 'opacity-40'}`}>Monthly</span>
            <button 
              onClick={() => setIsYearly(!isYearly)}
              className="w-16 h-8 bg-white border-3 border-deep-indigo rounded-full relative p-1 transition-all active:scale-95"
            >
              <div className={`absolute top-1 bottom-1 w-5 bg-primary border-2 border-deep-indigo rounded-full shadow-brutal-sm transition-all duration-300 ${isYearly ? 'translate-x-8' : 'translate-x-0'}`} />
            </button>
            <span className={`font-bold text-sm uppercase transition-all ${isYearly ? 'text-primary scale-110' : 'opacity-40'}`}>Yearly (Save 20%)</span>
          </div>
        </section>


        {/* Pricing Cards Grid */}
        <section className="px-6 md:px-12 max-w-7xl mx-auto pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {plans.map((plan, i) => {
              const Icon = plan.icon;
              return (
                <Card 
                  key={i} 
                  className={`relative flex flex-col p-10 border-4 shadow-brutal-lg hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all duration-300 ${
                    plan.popular ? 'border-primary bg-white scale-105 z-10' : 'border-deep-indigo bg-white'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-warning border-3 border-deep-indigo px-4 py-1 font-heading font-black text-xs uppercase italic shadow-brutal-sm">
                      Most Popular
                    </div>
                  )}

                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 flex items-center justify-center border-3 border-deep-indigo shadow-brutal ${
                      plan.variant === 'primary' ? 'bg-primary text-white' : 'bg-secondary/20 text-primary'
                    }`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="text-2xl font-heading font-black text-deep-indigo uppercase tracking-tight">{plan.name}</h3>
                  </div>

                  <p className="text-sm opacity-60 mb-8 leading-relaxed">{plan.description}</p>

                  <div className="mb-10 flex items-baseline gap-2">
                    <span className="text-6xl font-heading font-black text-deep-indigo italic">₹{plan.price}</span>
                    <span className="text-sm font-bold uppercase opacity-40">/ month</span>
                  </div>

                  <ul className="flex-1 space-y-5 mb-12">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <div className="mt-1 w-5 h-5 rounded-full bg-success/20 flex items-center justify-center text-success border-2 border-success/30">
                          <Check size={12} strokeWidth={4} />
                        </div>
                        <span className="text-sm font-bold text-deep-indigo/80 uppercase tracking-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    variant={plan.variant as any} 
                    className="w-full py-5 text-lg font-black uppercase shadow-brutal hover:shadow-none transition-all"
                    onClick={() => handlePurchase(plan)}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : plan.buttonText}
                  </Button>
                </Card>
              );
            })}
          </div>
        </section>


        {/* FAQ Section */}
        <section className="bg-secondary/20 py-24 px-6 md:px-12 border-t-4 border-deep-indigo">
           <div className="max-w-4xl mx-auto space-y-12">
             <div className="text-center space-y-4">
               <h2 className="text-4xl font-heading font-black text-deep-indigo uppercase">Still Confused?</h2>
               <p className="font-bold opacity-40 uppercase tracking-[0.2em]">Frequently Asked Questions</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {[
                 { q: "Can I switch plans anytime?", a: "Yes, you can upgrade or downgrade your plan at any moment from your settings panel." },
                 { q: "Do you offer student discounts?", a: "We have a massive 50% discount for students. Contact our support with your ID." },
                 { q: "What is your refund policy?", a: "We offer a 30-day money-back guarantee if you're not satisfied with the content." },
                 { q: "Can I cancel my subscription?", a: "Absolutely. No hidden fees, no messy paperwork. One click and you're out." }
               ].map((faq, i) => (
                 <Card key={i} className="bg-white border-3 border-deep-indigo p-6 space-y-3">
                   <h4 className="font-heading font-bold text-deep-indigo uppercase italic">{faq.q}</h4>
                   <p className="text-sm opacity-70 leading-relaxed">{faq.a}</p>
                 </Card>
               ))}
             </div>
           </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 text-center bg-primary border-t-4 border-deep-indigo">
           <div className="max-w-3xl mx-auto space-y-8">
             <Rocket size={64} className="mx-auto text-white animate-bounce" />
             <h2 className="text-4xl md:text-6xl font-heading font-black text-white uppercase leading-none">Ready to break the rules?</h2>
             <p className="text-xl text-white opacity-80">Join 50,000+ rebels who are learning design and code the unconventional way.</p>
             <Button variant="outline" className="bg-white text-deep-indigo border-deep-indigo py-5 px-12 text-xl shadow-brutal-lg hover:shadow-none transition-all">Get Started Today</Button>
           </div>
        </section>
      </main>

      <footer className="bg-deep-indigo text-white py-12 px-6 text-center border-t-4 border-primary">
        <p className="font-heading font-bold uppercase tracking-widest opacity-40 text-xs">SkillPath © 2026 — Built for the bold</p>
      </footer>
    </div>
  );
}
