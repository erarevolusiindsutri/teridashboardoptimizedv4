import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Box, ArrowUpRight, Layers } from 'lucide-react';
import { useDashboardStore } from '../../store';
import { ProductVisualization } from './ProductVisualization';
import { ProjectDetailsPanel } from './ProjectDetailsPanel';
import { AnimatedCounter } from './AnimatedCounter';

const mockProjects = [
  {
    id: 'digital-ocean',
    name: 'Digital Ocean Dashboard',
    status: 'In Progress',
    statusColor: '#44ff88'
  },
  {
    id: 'aws',
    name: 'AWS Analytics Platform',
    status: 'Proposal',
    statusColor: '#ffd700'
  },
  {
    id: 'stripe',
    name: 'Stripe Integration',
    status: 'In Progress',
    statusColor: '#44ff88'
  },
  {
    id: 'netflix',
    name: 'Netflix Data Platform',
    status: 'In Progress',
    statusColor: '#44ff88'
  },
  {
    id: 'microsoft',
    name: 'Microsoft Cloud Services',
    status: 'Proposal',
    statusColor: '#ffd700'
  }
];

export function ProductOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const selectedUnit = useDashboardStore((state) => state.selectedUnit);

  useEffect(() => {
    setIsVisible(selectedUnit === 'product');
    if (selectedUnit !== 'product') {
      setSelectedProject(null);
    }
  }, [selectedUnit]);

  const handleClose = () => {
    setIsVisible(false);
    useDashboardStore.getState().setSelectedUnit(null);
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
                  <div className="w-4 h-4 rounded-sm bg-[#44ff88]/20 flex items-center justify-center">
                    <Box size={12} className="text-[#44ff88]" />
                  </div>
                  <h2 className="text-[#44ff88] text-sm font-medium">Project Overview</h2>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white/80 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <motion.div 
                  className="bg-black/20 rounded-lg p-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Layers size={12} className="text-[#4488ff]" />
                    <span className="text-white/60 text-xs">Active Projects</span>
                  </div>
                  <div className="text-xl font-bold text-white">
                    <AnimatedCounter value={5} />
                  </div>
                  <div className="flex items-center gap-1 text-[#44ff88] text-xs">
                    <ArrowUpRight size={12} />
                    <span>3 in progress</span>
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-black/20 rounded-lg p-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Box size={12} className="text-[#44ff88]" />
                    <span className="text-white/60 text-xs">Proposals</span>
                  </div>
                  <div className="text-xl font-bold text-white">
                    <AnimatedCounter value={8} />
                  </div>
                  <div className="flex items-center gap-1 text-[#44ff88] text-xs">
                    <ArrowUpRight size={12} />
                    <span>4 pending</span>
                  </div>
                </motion.div>
              </div>

              <div className="h-[200px] rounded-lg mb-4 overflow-hidden bg-black/20">
                <ProductVisualization onProjectSelect={setSelectedProject} />
              </div>

              <div className="max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                <div className="space-y-2">
                  {mockProjects.map((project, index) => (
                    <motion.button
                      key={project.id}
                      className="w-full flex items-center justify-between text-white bg-black/20 hover:bg-black/30 rounded-lg p-2 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedProject(project.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.statusColor }} />
                        <div className="text-xs text-left">{project.name}</div>
                      </div>
                      <div className="text-xs" style={{ color: project.statusColor }}>{project.status}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          <ProjectDetailsPanel 
            projectId={selectedProject || ''}
            isVisible={selectedProject !== null}
            onClose={() => setSelectedProject(null)}
          />
        </>
      )}
    </AnimatePresence>
  );
}