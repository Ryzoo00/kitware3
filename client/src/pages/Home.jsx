import Hero from '../components/Home/Hero';
import FeaturedProducts from '../components/Home/FeaturedProducts';
import GiftBoxSection from '../components/Home/GiftBoxSection';
import TrendingProducts from '../components/Home/TrendingProducts';
import CustomerReviews from '../components/Home/CustomerReviews';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <FeaturedProducts />
      <GiftBoxSection />
      <TrendingProducts />
      <CustomerReviews />
    </motion.div>
  );
};

export default Home;
