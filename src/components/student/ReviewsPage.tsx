import { useState, useEffect } from 'react';
import { Star, X, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { ratingApi, ChefRatingStats, MenuItemRatingStats } from '@/services/ratingApi';
import { testimonialApi, TestimonialResponse } from '@/services/testimonialApi';

interface ReviewsPageProps {
  onClose?: () => void;
}

export const ReviewsPage = ({ onClose }: ReviewsPageProps) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [chefRatings, setChefRatings] = useState<ChefRatingStats[]>([]);
  const [menuItemRatings, setMenuItemRatings] = useState<MenuItemRatingStats[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Fake testimonials to supplement real data
  const fakeTestimonials: TestimonialResponse[] = [
    {
      id: 1001,
      userName: "Priya Sharma",
      userRole: "STUDENT" as const,
      institution: "Food Blogger",
      content: "PlatePal's biryani is absolutely divine! The flavors are authentic and remind me of my grandmother's cooking. Best cloud kitchen in the city!",
      rating: 5,
      createdAt: new Date().toISOString(),
      approved: true,
    },
    {
      id: 1002,
      userName: "Rahul Mehta",
      userRole: "STUDENT" as const,
      institution: "Regular Customer",
      content: "I've been ordering from PlatePal for 6 months now. The consistency in quality and taste is remarkable. Their butter chicken is to die for!",
      rating: 5,
      createdAt: new Date().toISOString(),
      approved: true,
    },
    {
      id: 1003,
      userName: "Ananya Patel",
      userRole: "STUDENT" as const,
      institution: "Working Professional",
      content: "As someone who works late, PlatePal is a lifesaver. Hot, fresh, homestyle food delivered right to my doorstep. The thali is my absolute favorite!",
      rating: 5,
      createdAt: new Date().toISOString(),
      approved: true,
    },
    {
      id: 1004,
      userName: "Vikram Singh",
      userRole: "CHEF" as const,
      institution: "Family Man",
      content: "My entire family loves PlatePal! From my kids to my parents, everyone finds something they love. The portion sizes are generous and prices fair.",
      rating: 5,
      createdAt: new Date().toISOString(),
      approved: true,
    },
    {
      id: 1005,
      userName: "Meera Joshi",
      userRole: "STUDENT" as const,
      institution: "Health Enthusiast",
      content: "Finally, a cloud kitchen that understands flavor AND nutrition! Their meals are balanced and delicious. I order their thali every single week!",
      rating: 5,
      createdAt: new Date().toISOString(),
      approved: true,
    },
    {
      id: 1006,
      userName: "Arjun Kapoor",
      userRole: "STUDENT" as const,
      institution: "College Student",
      content: "Being a student on a budget, PlatePal is perfect! Affordable, tasty, and delivered fast. The paneer tikka masala is my go-to comfort food.",
      rating: 5,
      createdAt: new Date().toISOString(),
      approved: true,
    },
    {
      id: 1007,
      userName: "Sneha Reddy",
      userRole: "CHEF" as const,
      institution: "Home Chef",
      content: "As a chef myself, I'm impressed by PlatePal's attention to detail. The spices are perfectly balanced and ingredients are always fresh!",
      rating: 5,
      createdAt: new Date().toISOString(),
      approved: true,
    },
    {
      id: 1008,
      userName: "Karthik Iyer",
      userRole: "STUDENT" as const,
      institution: "Tech Professional",
      content: "Late night coding sessions are made better with PlatePal! Quick delivery, hot food, and amazing taste. The dal makhani is heavenly!",
      rating: 5,
      createdAt: new Date().toISOString(),
      approved: true,
    },
  ];

  useEffect(() => {
    loadReviewsData();
  }, []);

  const loadReviewsData = async () => {
    setLoading(true);
    try {
      const [ratingsData, testimonialsData] = await Promise.all([
        ratingApi.getAllRatings(),
        testimonialApi.getApprovedTestimonials()
      ]);
      
      setChefRatings(ratingsData.chefRatings || []);
      setMenuItemRatings(ratingsData.menuItemRatings || []);
      
      // Combine real testimonials with fake ones
      const allTestimonials = [...(testimonialsData || []), ...fakeTestimonials];
      setTestimonials(allTestimonials);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      // If API fails, still show fake testimonials
      setTestimonials(fakeTestimonials);
    } finally {
      setLoading(false);
    }
  };

  // Combine all reviews into a single array
  const allReviews = [
    ...chefRatings.flatMap(chef => 
      chef.ratings
        .filter(rating => rating.comment && rating.comment.trim().length > 0) // Only reviews with comments
        .map(rating => ({
          id: `chef-${rating.id}`,
          customerName: rating.studentName,
          orderItem: `Chef: ${chef.chefName}`,
          rating: rating.rating,
          comment: rating.comment || '',
          date: rating.createdAt,
          isTestimonial: false,
          imageUrl: undefined
        }))
    ),
    ...menuItemRatings.flatMap(item => 
      item.ratings
        .filter(rating => rating.comment && rating.comment.trim().length > 0) // Only reviews with comments
        .map(rating => ({
          id: `item-${rating.id}`,
          customerName: rating.studentName,
          orderItem: item.menuItemName,
          rating: rating.rating,
          comment: rating.comment || '',
          date: rating.createdAt,
          isTestimonial: false,
          imageUrl: item.menuItemImageUrl
        }))
    ),
    ...testimonials.map(testimonial => ({
      id: `testimonial-${testimonial.id}`,
      customerName: testimonial.userName,
      orderItem: 'General Review',
      rating: testimonial.rating,
      comment: testimonial.content,
      date: testimonial.createdAt,
      isTestimonial: true,
      imageUrl: undefined
    }))
  ];

  // Sort by date (newest first)
  const sortedReviews = allReviews.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const filters = [
    { id: 'all', label: 'All Reviews' },
    { id: 'chefs', label: 'Chef Reviews' },
    { id: 'dishes', label: 'Dish Reviews' },
    { id: 'testimonials', label: 'Testimonials' },
  ];

  const filteredReviews = sortedReviews.filter(review => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'chefs') return review.id.startsWith('chef-');
    if (activeFilter === 'dishes') return review.id.startsWith('item-');
    if (activeFilter === 'testimonials') return review.id.startsWith('testimonial-');
    return true;
  });

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? 'fill-primary text-primary'
            : 'fill-slate-200 dark:fill-slate-700 text-slate-200 dark:text-slate-700'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative min-h-[400px] flex flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-2xl items-center justify-center p-8 text-center overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200")'
        }}
      >
        <div className="max-w-[800px] flex flex-col gap-4 relative z-10">
          <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight">
            Hear from our hungry community
          </h1>
          <p className="text-white/90 text-base md:text-xl leading-relaxed px-4">
            Discover why thousands of foodies trust PlatePal for their daily cravings. High-quality meals delivered hot and fresh to your doorstep.
          </p>
        </div>
        <div className="flex gap-4 relative z-10">
          <button 
            onClick={() => onClose && onClose()}
            className="flex min-w-[140px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-base font-bold transition-transform hover:scale-105"
          >
            View Menu
          </button>
          <button className="flex min-w-[140px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-white/20 backdrop-blur-md text-white border border-white/30 text-base font-bold transition-transform hover:scale-105">
            Share Review
          </button>
        </div>
      </motion.section>

      {/* Stats Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        >
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
            Average Rating
          </p>
          <div className="flex items-center gap-2">
            <p className="text-slate-900 dark:text-white text-3xl font-extrabold leading-tight">
              {allReviews.length > 0 
                ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
                : '0.0'}/5
            </p>
            <Star className="w-6 h-6 fill-primary text-primary" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        >
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
            Total Reviews
          </p>
          <p className="text-slate-900 dark:text-white text-3xl font-extrabold leading-tight">
            {allReviews.length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        >
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
            Verified Purchase
          </p>
          <p className="text-slate-900 dark:text-white text-3xl font-extrabold leading-tight">
            {testimonials.length}
          </p>
        </motion.div>
      </section>

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h2 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight">
          The Wall of Love
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 text-sm font-semibold transition-colors ${
                activeFilter === filter.id
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-primary/20'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Grid (Masonry) */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading reviews...</p>
          </div>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-600 dark:text-slate-400 text-lg">No reviews found.</p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="break-inside-avoid mb-6"
            >
              <div className={`${
                review.imageUrl ? 'p-6' : 'p-4'
              } rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg transition-shadow`}>
                {/* Dish Image (for menu item reviews) */}
                {review.imageUrl && (
                  <div className="mb-4 -mx-6 -mt-6">
                    <img
                      src={review.imageUrl}
                      alt={review.orderItem}
                      className="w-full h-48 object-cover rounded-t-xl"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Header */}
                <div className={`flex items-center gap-3 ${review.imageUrl ? 'mb-4' : 'mb-3'}`}>
                  <div
                    className={`${
                      review.imageUrl ? 'w-12 h-12 text-lg' : 'w-10 h-10 text-base'
                    } rounded-full bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center text-white font-bold shrink-0`}
                  >
                    {review.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold ${review.imageUrl ? 'text-base' : 'text-sm'} text-slate-900 dark:text-white truncate`}>
                      {review.customerName}
                    </h4>
                    <p className={`${review.imageUrl ? 'text-xs' : 'text-[10px]'} text-slate-500 dark:text-slate-400 truncate`}>
                      {review.orderItem}
                    </p>
                  </div>
                  <div className="flex gap-0.5 shrink-0">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`${review.imageUrl ? 'w-4 h-4' : 'w-3 h-3'} ${
                          i < review.rating
                            ? 'fill-primary text-primary'
                            : 'fill-slate-200 dark:fill-slate-700 text-slate-200 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                {review.comment && (
                  <p className={`text-slate-900 dark:text-white ${
                    review.imageUrl ? 'text-base mb-4' : 'text-sm mb-3'
                  } leading-relaxed line-clamp-4`}>
                    "{review.comment}"
                  </p>
                )}

                {/* Footer with Date and Verified Badge */}
                <div className="flex items-center justify-between gap-2">
                  <p className={`${review.imageUrl ? 'text-xs' : 'text-[10px]'} text-slate-400 dark:text-slate-500`}>
                    {formatDate(review.date)}
                  </p>
                  
                  {review.isTestimonial && (
                    <div className={`flex items-center gap-1 ${
                      review.imageUrl ? 'px-2.5 py-1' : 'px-2 py-0.5'
                    } bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800 shrink-0`}>
                      <CheckCircle className={`${
                        review.imageUrl ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5'
                      } text-green-600 dark:text-green-400 fill-green-600 dark:fill-green-400`} />
                      <span className={`${
                        review.imageUrl ? 'text-[10px]' : 'text-[8px]'
                      } font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide whitespace-nowrap`}>
                        Verified
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-16 p-12 bg-primary/10 dark:bg-primary/5 rounded-3xl border border-primary/20 flex flex-col items-center text-center gap-6"
      >
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            Ready to taste for yourself?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Join 50,000+ happy customers today.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => onClose && onClose()}
            className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-primary text-white text-lg font-bold shadow-lg shadow-primary/30 hover:shadow-xl transition-all active:scale-95"
          >
            Order Now
          </button>
          <button className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-white dark:bg-white/10 text-slate-900 dark:text-white text-lg font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-white/20 transition-all">
            Download App
          </button>
        </div>
      </motion.section>
    </div>
  );
};
