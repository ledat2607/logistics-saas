import {
  Calendar,
  DiamondPlus,
  EvCharger,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";
import { motion } from "framer-motion";
import { Button } from "../ui/button";

const DataCard = [
  {
    title: "Real-time Tracking",
    description:
      "Monitor your fleet's location and status in real-time, ensuring timely deliveries and efficient route management.",
    icon: DiamondPlus,
    subContent: "Active tracking",
  },
  {
    title: "Automated Scheduling",
    description:
      "Streamline your operations with automated scheduling, reducing manual effort and optimizing resource allocation.",
    icon: Calendar,
    subContent: "Efficient +18% scheduling",
  },
  {
    title: "Fuel Analytics",
    description:
      "Gain insights into fuel consumption patterns, identify inefficiencies, and implement cost-saving strategies.",
    icon: EvCharger,
    subContent: "Cost-effective fuel management",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 } as const,
  },
};

const divVariants = {
  hidden: { opacity: 0, x: -30 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 } as const,
  },
};

const pulseVariants = {
  animate: (customDelay: number) => ({
    scale: [1, 1.3],
    opacity: [0.6, 0],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeOut",
      delay: customDelay,
    } as const,
  }),
};
const WhyChoose = () => {
  return (
    <div className="py-16 px-4 max-w-7xl mx-auto space-y-12">
      {/* Header Section */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="show"
        viewport={{
          once: false,
          amount: 0.2,
        }}
        className="text-center space-y-4 max-w-3xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white capitalize">
          Everything you need to manage your fleet
        </h2>
        <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed">
          Professional-grade tools designed for industrial efficiency and
          data-driven decision making.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{
          once: false,
          amount: 0.2,
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12"
      >
        {DataCard.map((card, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{
              y: -8,
              scale: 1.02,
              transition: { duration: 0.2, ease: "easeOut" },
            }}
            className="h-full flex"
          >
            <Card className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between overflow-hidden relative group w-full">
              <div>
                <CardHeader className="flex flex-row items-center gap-4 p-6 pb-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <card.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                    {card.title}
                  </h3>
                </CardHeader>

                <Separator className="bg-slate-100 dark:bg-slate-800" />

                <CardContent className="p-6 text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-normal">
                  {card.description}
                </CardContent>
              </div>

              <div>
                <Separator className="bg-slate-100 dark:bg-slate-800" />
                <CardContent className="p-4 px-6 bg-slate-50/50 dark:bg-slate-900/50 text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center justify-between">
                  <span>{card.subContent}</span>
                  <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                    →
                  </span>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={divVariants}
        initial="hidden"
        whileInView="show"
        viewport={{
          once: false,
          amount: 0.1,
        }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center justify-center p-4"
      >
        <div className="flex items-center justify-center p-2 relative bg-white dark:bg-slate-950 max-w-[320px] mx-auto group">
          <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
            <motion.div
              variants={pulseVariants}
              animate="animate"
              custom={0}
              className="absolute w-full h-full rounded-full border-2 border-blue-400 dark:border-slate-200"
            />
            <motion.div
              variants={pulseVariants}
              animate="animate"
              custom={0.8}
              className="absolute w-full h-full rounded-full border border-blue-400/60 dark:border-slate-200/60"
            />
            <motion.div
              variants={pulseVariants}
              animate="animate"
              custom={1.6}
              className="absolute w-full h-full rounded-full border border-blue-600 dark:border-slate-100"
            />
          </div>

          {/* BOX HÌNH ẢNH (Phải có nền màu bg-white để che tâm các vòng tròn đi) */}
          <div className="p-3 bg-white dark:bg-slate-950 z-10 w-full structure-img">
            <img
              src="./ceo.jpg"
              alt="CEO Profile"
              className="object-contain rounded-full w-full h-auto mx-auto"
            />
          </div>

          {/* NÚT VIEW PROFILE (Nổi lên trên cùng nhờ z-20) */}
          <Button
            variant={"outline"}
            className="absolute bottom-4 -right-4 z-20 rounded-xl shadow-md bg-white dark:bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:bg-green-500 hover:text-white hover:border-green-500"
          >
            <ShieldCheck className="w-4 h-4 mr-2" />
            View profile
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-4 h-4 text-yellow-400 fill-yellow-400"
              />
            ))}
          </div>
          <p className="text-sm md:text-lg font-bold text-slate-900 dark:text-white tracking-tight text-justify">
            "Switching to Logistics Core was the single best decision we made
            this year. We saved 20% on fuel costs in the first quarter alone,
            and the dispatch interface is so intuitive our drivers actually
            enjoy using it."
          </p>
          <div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              Marcus Thorne
            </p>
            <p className="font-light text-sm text-muted-foreground">
              CEO, Thorne Expedited Freight
            </p>
          </div>
          <span className="flex items-center gap-4 font-bold text-muted-foreground text-sm">
            <p>Forbers</p>
            <p>Logistics Day</p>
            <p>Tech Daily</p>
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default WhyChoose;
