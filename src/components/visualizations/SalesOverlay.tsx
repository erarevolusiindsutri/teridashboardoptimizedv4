import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, TrendingUp, ArrowUpRight, Star } from 'lucide-react';
import { useDashboardStore } from '../../store';
import { SalesVisualization } from './SalesVisualization';
import { SalesDetailsPanel } from './SalesDetailsPanel';
import { AnimatedCounter } from './AnimatedCounter';

export function SalesOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [detailsType, setDetailsType] = useState<'leads' | 'meetings' | 'deals' | null>(null);
  const selectedUnit = useDashboardStore((state) => state.selectedUnit);

  useEffect(() => {
    setIsVisible(selectedUnit === 'sales');
    if (selectedUnit !== 'sales') {
      setDetailsType(null);
    }
  }, [selectedUnit]);

  const handleClose = () => {
    setIsVisible(false);
    useDashboardStore.getState().setSelectedUnit(null);
  };

  const handleDetailsClick = (type: 'leads' | 'meetings' | 'deals') => {
    setDetailsType(detailsType === type ? null : type);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-4 top-4 z-50 w-[280px]"
          >
            <motion.div
              className="rounded-xl bg-black/40 backdrop-blur-sm p-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm bg-[#4488ff]/20 flex items-center justify-center">
                    <TrendingUp size={12} className="text-[#4488ff]" />
                  </div>
                  <h2 className="text-[#4488ff] text-sm font-medium">Sales Overview</h2>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white/80 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <motion.div 
                className="text-3xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <AnimatedCounter value={47280} prefix="$" />
              </motion.div>

              <div className="relative h-[180px] rounded-lg mb-4 overflow-hidden">
                <SalesVisualization detailsType={detailsType} />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <motion.button 
                  className="text-left"
                  onClick={() => handleDetailsClick('leads')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div 
                    className="flex items-center gap-2 mb-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="w-2 h-2 rounded-full bg-[#4488ff]" />
                    <span className="text-white/60 text-xs">New Leads</span>
                  </motion.div>
                  <motion.div 
                    className="text-xl font-bold text-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <AnimatedCounter value={24} />
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-1 text-[#44ff88] text-xs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <ArrowUpRight size={12} />
                    <span>12%</span>
                  </motion.div>
                </motion.button>

                <motion.button 
                  className="text-left"
                  onClick={() => handleDetailsClick('meetings')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div 
                    className="flex items-center gap-2 mb-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="w-2 h-2 rounded-full bg-[#44ff88]" />
                    <span className="text-white/60 text-xs">Meetings</span>
                  </motion.div>
                  <motion.div 
                    className="text-xl font-bold text-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <AnimatedCounter value={8} />
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-1 text-[#44ff88] text-xs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <ArrowUpRight size={12} />
                    <span>8%</span>
                  </motion.div>
                </motion.button>

                <motion.button 
                  className="text-left"
                  onClick={() => handleDetailsClick('deals')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div 
                    className="flex items-center gap-2 mb-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Star className="w-2 h-2 text-[#ffd700]" />
                    <span className="text-white/60 text-xs">Closed</span>
                  </motion.div>
                  <motion.div 
                    className="text-xl font-bold text-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <AnimatedCounter value={5} />
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-1 text-[#44ff88] text-xs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <ArrowUpRight size={12} />
                    <span>15%</span>
                  </motion.div>
                </motion.button>
              </div>

              <div className="space-y-2">
                <motion.div 
                  className="flex items-center justify-between text-white bg-black/20 rounded-lg p-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#4488ff]" />
                    <div className="text-xs">New lead: Digital Ocean</div>
                  </div>
                  <div className="text-xs text-white/60">2m ago</div>
                </motion.div>
                <motion.div 
                  className="flex items-center justify-between text-white bg-black/20 rounded-lg p-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#44ff88]" />
                    <div className="text-xs">Meeting with AWS today</div>
                  </div>
                  <div className="text-xs text-white/60">2:30 PM</div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {detailsType && (
            <SalesDetailsPanel 
              type={detailsType} 
              isVisible={true}
              onClose={() => setDetailsType(null)}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
}