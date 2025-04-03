"use client"

import { useRef } from "react"
import { motion } from "framer-motion"

export default function HeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Food items that will float around
  const foodItems = [
    { id: 1, name: "apple", x: "10%", y: "20%", delay: 0 },
    { id: 2, name: "bread", x: "70%", y: "15%", delay: 0.5 },
    { id: 3, name: "carrot", x: "20%", y: "70%", delay: 1 },
    { id: 4, name: "milk", x: "60%", y: "60%", delay: 1.5 },
    { id: 5, name: "salad", x: "40%", y: "40%", delay: 2 },
  ]

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Background circle */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-purple-400/20 backdrop-blur-md"
        style={{ left: "calc(50% - 250px)", top: "calc(50% - 250px)" }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />

      {/* Central phone mockup */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[440px] bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="w-full h-full bg-gradient-to-b from-purple-100 to-purple-50 p-2">
          <div className="w-full h-[50px] bg-purple-800 rounded-t-lg flex items-center justify-center">
            <span className="text-white text-sm font-medium">Community Kitchen</span>
          </div>
          <div className="mt-4 p-2">
            <div className="w-full h-[60px] bg-white rounded-lg shadow-sm mb-3 flex items-center p-3">
              <div className="w-8 h-8 rounded-full bg-purple-200 mr-3"></div>
              <div className="flex-1">
                <div className="h-2 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="w-full h-[60px] bg-white rounded-lg shadow-sm mb-3 flex items-center p-3">
              <div className="w-8 h-8 rounded-full bg-green-200 mr-3"></div>
              <div className="flex-1">
                <div className="h-2 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="w-full h-[60px] bg-white rounded-lg shadow-sm flex items-center p-3">
              <div className="w-8 h-8 rounded-full bg-blue-200 mr-3"></div>
              <div className="flex-1">
                <div className="h-2 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating food items */}
      {foodItems.map((item) => (
        <motion.div
          key={item.id}
          className="absolute w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center"
          style={{ left: item.x, top: item.y }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            x: [0, 10, -10, 5, 0],
            y: [0, -15, 10, -5, 0],
          }}
          transition={{
            delay: item.delay,
            duration: 0.5,
            scale: { duration: 0.5 },
            opacity: { duration: 0.5 },
            x: { repeat: Number.POSITIVE_INFINITY, duration: 5, ease: "easeInOut" },
            y: { repeat: Number.POSITIVE_INFINITY, duration: 6, ease: "easeInOut" },
          }}
        >
          <span className="text-2xl">{getFoodEmoji(item.name)}</span>
        </motion.div>
      ))}

      {/* Connection lines (animated) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.path
          d="M 250,250 L 100,100"
          stroke="rgba(168, 85, 247, 0.4)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
        <motion.path
          d="M 250,250 L 400,100"
          stroke="rgba(168, 85, 247, 0.4)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.7 }}
        />
        <motion.path
          d="M 250,250 L 100,400"
          stroke="rgba(168, 85, 247, 0.4)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.9 }}
        />
        <motion.path
          d="M 250,250 L 400,400"
          stroke="rgba(168, 85, 247, 0.4)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.1 }}
        />
      </svg>
    </div>
  )
}

// Helper function to get food emoji
function getFoodEmoji(name: string): string {
  switch (name) {
    case "apple":
      return "🍎"
    case "bread":
      return "🍞"
    case "carrot":
      return "🥕"
    case "milk":
      return "🥛"
    case "salad":
      return "🥗"
    default:
      return "🍽️"
  }
}

