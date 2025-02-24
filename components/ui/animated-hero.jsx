"use client"
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function Hero() {
  const route = useRouter()
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(() => ["launch", "showcase", "grow", "connect", "succeed"], []);
  const handleClick = () => {

  }
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full bg-gradient-to-b z-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-8 py-16">
          {/* Top Section */}
          <div className="flex flex-col items-center gap-6 text-center lg:pt-10">
            {/* <Button variant="secondary" size="sm" className="gap-2">
              Read launch article <MoveRight className="w-4 h-4" />
            </Button> */}

            <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-8 w-full max-w-6xl">
              {/* Headline Section */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl tracking-tight font-medium text-left">
                  <span className="text-spektr-cyan-50 text-gray-200">Empowering Developers to</span>
                  <span className="block relative h-16 md:h-20 overflow-hidden text-gray-200">
                    {titles.map((title, index) => (
                      <motion.span
                        key={index}
                        className="absolute inset-0 font-semibold"
                        initial={{ opacity: 0, y: "-100" }}
                        transition={{ type: "spring", stiffness: 50 }}
                        animate={
                          titleNumber === index
                            ? {
                              y: 0,
                              opacity: 1,
                            }
                            : {
                              y: titleNumber > index ? -150 : 150,
                              opacity: 0,
                            }
                        }>
                        {title}
                      </motion.span>
                    ))}
                  </span>
                </h1>
              </div>

              {/* Description Section */}
              <div className="flex flex-col justify-center">
                <p className="text-lg text-gray-300 leading-relaxed border-l-2 border-spektr-cyan-50 pl-6">
                  Showcase projects, get feedback, connect with community, and find developer jobs.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col items-center gap-4 z-50 relative">
            <Button
              size="lg"
              className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => route.push('/login')}
            >
              Lanuch Now <MoveRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <p className="text-sm text-gray-500">Join thousands of developers worldwide</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
