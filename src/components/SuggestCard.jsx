import { formatRelative } from 'date-fns';
import { HeartIcon, MicIcon, Notification, SearchIcon } from '../icons';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import { NavLink } from 'react-router';

const SuggestCard = ({ act, onSwipe, index, total }) => {
    const initialX = index === 0 ? 0 : (index % 2 === 0 ? 30 : -30)
    const x = useMotionValue(initialX);
    // const x = useMotionValue(0);

    // const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
    const bgColor = useTransform(x, [-100, 0, 100], ["#fee2e2", "#ffffff", "#dcfce7"]);

    const handleDragEnd = (event, info) => {
        if (info.offset.x > 100) {
            onSwipe(act.id, 'right');
        } else if (info.offset.x < -100) {
            onSwipe(act.id, 'left');
        }
    };

    useEffect(() => {
        if (index === 0) {
            const controls = animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
            return () => controls.stop();
        }
    }, [index, x]);

    return (
        <NavLink to={`/activity-details?actid=${act.id}`}>
            <motion.div
                style={{
                    x: x,
                    // x: index === 0 ? 0 : (index % 2 === 0 ? 30 : -30), 
                    // rotate, 
                    opacity,
                    zIndex: total - index,
                    scale: index === 0 ? 1.1 : 1,
                    // y: index * 10,
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                whileDrag={{ scale: 1.05 }}
                className="absolute w-full h-[310px] cursor-grab active:cursor-grabbing"
            >
                <motion.div
                    className="bg-base-200 w-full h-full rounded-[14px] overflow-hidden relative"
                >
                    <img
                        src={act.coverPhoto}
                        alt={act.title}
                        className="w-full h-full object-cover pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute bottom-5 left-4 right-6 text-white pointer-events-none">
                        <div className="flex justify-between items-end">
                            <div className='w-45'>
                                <p className="text-[12px] font-bold uppercase tracking-wider text-primary mb-1">
                                    {act.category || 'Upcoming'}
                                </p>
                                <h4 className="text-[16px] font-bold mb-1">{act.title}</h4>
                                <p className="text-sm opacity-90 flex items-center gap-1">
                                    <span className="opacity-70 truncate">{act?.place?.placeName}</span>
                                </p>
                            </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                            <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-[11px]">
                                {formatRelative(new Date(act.eventStartTime), new Date())}
                            </div>
                        </div>
                    </div>

                    {/* Swipe Indicators */}
                    <motion.div
                        style={{ opacity: useTransform(x, [50, 100], [0, 1]) }}
                        className="absolute top-10 left-10 border-4 border-success text-success font-bold text-[14px] px-4 py-2 rounded-xl rotate-[-20deg] pointer-events-none uppercase"
                    >
                        Matched my vibe :)
                    </motion.div>
                    <motion.div
                        style={{ opacity: useTransform(x, [-100, -50], [1, 0]) }}
                        className="absolute top-10 right-10 border-4 border-red-500 text-red-500 font-bold text-[14px] px-4 py-2 rounded-xl rotate-[20deg] pointer-events-none uppercase"
                    >
                        Not my vibe :(
                    </motion.div>
                </motion.div>
            </motion.div>

        </NavLink>
    );
};


export default SuggestCard