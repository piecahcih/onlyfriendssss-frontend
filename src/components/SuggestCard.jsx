import { formatRelative } from 'date-fns';
import { HeartIcon, MicIcon, Notification, SearchIcon } from '../icons';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const SuggestCard = ({ act, onSwipe, index, total }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const bgColor = useTransform(x, [-100, 0, 100], ["#fee2e2", "#ffffff", "#dcfce7"]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      onSwipe(act.id, 'right');
    } else if (info.offset.x < -100) {
      onSwipe(act.id, 'left');
    }
  };

  return (
    <motion.div
      style={{ 
        x: index === 0 ? 0 : (index % 2 === 0 ? 30 : -30), 
        rotate, 
        opacity,
        zIndex: total - index,
        scale: index === 0 ? 1.07 : 1,
        // scale: 1 - index * 0.05,
        // y: index * 10
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05 }}
      className="absolute w-full h-[320px] cursor-grab active:cursor-grabbing"
    >
      <motion.div 
        className="w-full h-full rounded-[14px] overflow-hidden relative"
      >
        <img 
          src={act.coverPhoto} 
          alt={act.title} 
          className="w-full h-full object-cover pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        
        <div className="absolute bottom-6 left-6 right-6 text-white pointer-events-none">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wider text-primary mb-1">
                {act.category || 'Upcoming'}
              </p>
              <h4 className="text-[16px] font-bold mb-1">{act.title}</h4>
              <p className="text-sm opacity-90 flex items-center gap-1">
                <span className="opacity-70">{act?.place?.placeName}</span>
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-[11px]">
              {formatRelative(new Date(act.eventStartTime), new Date())}
            </div>
          </div>
        </div>

        {/* Swipe Indicators */}
        <motion.div 
          style={{ opacity: useTransform(x, [50, 100], [0, 1]) }}
          className="absolute top-10 left-10 border-4 border-green-500 text-green-500 font-black text-4xl px-4 py-2 rounded-xl rotate-[-20deg] pointer-events-none uppercase"
        >
          WISHLIST
        </motion.div>
        <motion.div 
          style={{ opacity: useTransform(x, [-100, -50], [1, 0]) }}
          className="absolute top-10 right-10 border-4 border-red-500 text-red-500 font-black text-4xl px-4 py-2 rounded-xl rotate-[20deg] pointer-events-none uppercase"
        >
          NOPE
        </motion.div>
      </motion.div>
    </motion.div>
  );
};


export default SuggestCard