import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import {
  AtSign,
  Car,
  Earth,
  Globe,
  Link2,
  MessageCircleCheck,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 } as const,
  },
};

const Footer = () => {
  return (
    <div className="w-full text-white py-12 lg:space-y-16 space-y-12">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="show"
        className="cursor-pointer"
      >
        <Card className="max-w-7xl h-100 mx-auto bg-slate-600 dark:bg-slate-800 text-white p-8 rounded-lg shadow-lg flex items-center justify-center flex-col">
          <CardContent className="text-center space-y-7">
            <p className="text-5xl font-bold tracking-tighter">
              Ready to optimize your logistics?
            </p>
            <p className="text-5xl text-amber-500/80 font-extrabold">
              Join 500+ businesses today
            </p>
            <p className="text-sm font-light text-muted">
              Start your 14-day free trial. No credit card required. Full access
              to all premium tracking and optimization features.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button className="px-3 py-5">Start Free Trial</Button>
              <Button variant={"outline"} className="px-3 py-5">
                Talk to Sales
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <footer className="w-full border-t border-gray-200 bg-white px-4 py-8 dark:bg-zinc-950 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
            <div className="space-y-4">
              <span className="flex items-center gap-2">
                <Car className="size-6 text-amber-600 animate-pulse" />
                <h2 className="text-xl text-zinc-900 dark:text-zinc-100 font-bold tracking-tight">
                  Logistics Core
                </h2>
              </span>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
                Advanced fleet management for the modern era. Reliability,
                precision, and mission control at your fingertips.
              </p>
              <div className="flex items-center gap-4 text-zinc-600 dark:text-zinc-400 pt-2">
                <Globe className="size-5 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100" />
                <AtSign className="size-5 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100" />
                <MessageSquare className="size-5 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100" />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase">
                Product
              </h3>
              <ul className="space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
                <li>
                  <a href="#" className="hover:underline">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase">
                Support
              </h3>
              <ul className="space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
                <li>
                  <a href="#" className="hover:underline">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase">
                Newsletter
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Stay updated with the latest in logistics tech.
              </p>
              <form
                className="flex items-center gap-2 max-w-sm"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full rounded bg-zinc-100 text-zinc-900 dark:text-zinc-100 dark:bg-zinc-900 px-3 py-2 text-xs border border-transparent focus:outline-none focus:border-zinc-400"
               
               />
                <button
                  type="submit"
                  className="rounded bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-xs font-bold hover:opacity-90 transition-opacity"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-zinc-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            <p>© 2026 Logistics Core. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 cursor-pointer hover:underline">
                <Globe className="size-3.5" />
                English (US)
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-zinc-500" />
                System Online
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
