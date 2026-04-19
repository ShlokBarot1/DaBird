import { motion } from "framer-motion";

const ScrollSection = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-4xl"
      >
        Built for the Bold
      </motion.h2>
    </div>
  );
};

export default ScrollSection;