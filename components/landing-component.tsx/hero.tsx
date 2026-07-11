import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeCheck, Play } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.4 },
  },
};

const divVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 } as const,
  },
};

const Hero = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{
        once: false,
        amount: 0.1,
      }}
      className="max-w-7xl mx-auto grid lg:grid-cols-3 grid-cols-1 gap-4 px-4 py-8 lg:py-16 items-center"
    >
      <motion.div variants={divVariants} className="space-y-4 col-span-2">
        <div className="flex items-center gap-2 px-3 py-3 bg-amber-700/80 text-white rounded-2xl lg:text-sm font-medium w-fit text-xs">
          <BadgeCheck /> Misson controle for fleet management and logistics
        </div>
        <div className="text-3xl font-light text-justify text-balance tracking-widest">
          Streamline Your Fleet,
          <p className="text-amber-600/90 text-4xl font-extrabold">
            Power Your Growth.
          </p>
        </div>
        <p className="text-sm text-justify font-semibold">
          Precision logistics management for small-to-medium fleet owners. Get
          real-time visibility, automated scheduling, and advanced fuel
          analytics in one unified dashboard.
        </p>

        <div className="flex items-center gap-4">
          <Button>
            Get Started{" "}
            <ArrowRight className="ml-2 animate-collapsible-up size-4" />
          </Button>
          <Button variant="outline" className="rounded-md">
            <Play className="size-4 mr-2" />
            Watch Demo
          </Button>
        </div>
      </motion.div>

      <motion.div variants={divVariants} className="flex items-center justify-center border border-dashed rounded-2xl p-2 border-gray-600">
        <div className="border-gray-400 border border-dashed rounded-2xl flex items-center justify-center p-2">
          <img
            src={"/image-landingpage.png"}
            alt="Fleet Management"
            className="border border-dashed object-cover rounded-xl"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Hero;
