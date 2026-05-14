import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-bg-offwhite flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center border-3 p-12">
          <div className="w-20 h-20 bg-success border-3 border-deep-indigo rounded-full flex items-center justify-center mx-auto mb-6 shadow-brutal">
             <span className="text-4xl">✓</span>
          </div>
          <h1 className="text-3xl font-heading font-bold text-deep-indigo uppercase mb-2">Payment Successful!</h1>
          <p className="text-lg opacity-60 mb-8">Welcome to the course. Your learning journey begins now.</p>
          
          <div className="bg-surface-low border-2 border-deep-indigo p-4 rounded-md mb-8 text-left">
             <div className="flex justify-between text-sm mb-1 font-bold">
                <span>Transaction ID:</span>
                <span className="opacity-50">#ABC123XYZ</span>
             </div>
             <div className="flex justify-between text-sm font-bold">
                <span>Status:</span>
                <span className="text-success">Confirmed</span>
             </div>
          </div>

          <Link href="/dashboard">
            <Button variant="primary" className="w-full">Go to Dashboard</Button>
          </Link>
        </Card>
      </main>
    </div>
  );
}
