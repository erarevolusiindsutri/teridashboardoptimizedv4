import { AnimatePresence, motion } from 'framer-motion';
import { X, Calendar, CheckCircle2, Clock, Package, Bot, ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ProjectDetailsPanelProps {
  projectId: string;
  isVisible: boolean;
  onClose: () => void;
}

interface TeriModule {
  name: string;
  status: 'active' | 'pending';
  features: string[];
  metrics: {
    accuracy: number;
    efficiency: number;
    satisfaction?: number;
  };
  tasks?: {
    id: string;
    name: string;
    status: 'completed' | 'in-progress' | 'pending';
    dueDate: string;
  }[];
}

interface ProjectDetails {
  id: string;
  name: string;
  client: string;
  status: 'active' | 'proposal';
  startDate: string;
  modules: {
    sales?: TeriModule;
    'customer-service'?: TeriModule;
    data?: TeriModule;
    operation?: TeriModule;
  };
}

const mockProjectDetails: Record<string, ProjectDetails> = {
  'digital-ocean': {
    id: 'digital-ocean',
    name: 'Digital Ocean',
    client: 'Digital Ocean',
    status: 'active',
    startDate: '2024-02-15',
    modules: {
      sales: {
        name: 'T.E.R.I Sales',
        status: 'active',
        features: ['Lead Generation', 'Sales Pipeline', 'Revenue Forecasting'],
        metrics: {
          accuracy: 92,
          efficiency: 88,
          satisfaction: 95
        },
        tasks: [
          { id: '1', name: 'Pipeline Integration', status: 'completed', dueDate: '2024-03-01' },
          { id: '2', name: 'Sales Team Training', status: 'in-progress', dueDate: '2024-03-15' },
          { id: '3', name: 'Revenue Model Setup', status: 'pending', dueDate: '2024-03-30' }
        ]
      },
      'customer-service': {
        name: 'T.E.R.I Customer Service',
        status: 'active',
        features: ['Ticket Management', 'Customer Support', 'Knowledge Base'],
        metrics: {
          accuracy: 95,
          efficiency: 90,
          satisfaction: 94
        },
        tasks: [
          { id: '4', name: 'Ticket System Setup', status: 'completed', dueDate: '2024-03-05' },
          { id: '5', name: 'Knowledge Base Migration', status: 'in-progress', dueDate: '2024-03-20' }
        ]
      },
      data: {
        name: 'T.E.R.I Data',
        status: 'active',
        features: ['Data Analytics', 'Reporting', 'Insights'],
        metrics: {
          accuracy: 98,
          efficiency: 94
        },
        tasks: [
          { id: '6', name: 'Data Pipeline Setup', status: 'in-progress', dueDate: '2024-03-25' },
          { id: '7', name: 'Analytics Dashboard', status: 'pending', dueDate: '2024-04-05' }
        ]
      },
      operation: {
        name: 'T.E.R.I Operation',
        status: 'active',
        features: ['Resource Management', 'Process Automation', 'Performance Tracking'],
        metrics: {
          accuracy: 96,
          efficiency: 92
        },
        tasks: [
          { id: '8', name: 'Automation Setup', status: 'completed', dueDate: '2024-03-10' },
          { id: '9', name: 'Performance Metrics', status: 'in-progress', dueDate: '2024-03-28' }
        ]
      }
    }
  },
  // ... other projects
};

export function ProjectDetailsPanel({ projectId, isVisible, onClose }: ProjectDetailsPanelProps) {
  const project = mockProjectDetails[projectId];
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const panelWidth = viewportWidth < 640 ? '85vw' : '320px';
  const maxHeight = viewportHeight - 120;

  if (!project) return null;

  const getModuleColor = (moduleId: string) => {
    switch (moduleId) {
      case 'sales': return '#4488ff';
      case 'customer-service': return '#44ff88';
      case 'data': return '#ff4444';
      case 'operation': return '#ffd700';
      default: return '#ffffff';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-[#44ff88]';
      case 'in-progress': return 'text-[#4488ff]';
      case 'pending': return 'text-[#ffd700]';
      default: return 'text-white';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="fixed right-4 top-4 z-50"
          style={{ width: panelWidth }}
        >
          <motion.div
            className="bg-black/40 backdrop-blur-sm rounded-xl p-4"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            style={{ maxHeight }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-white text-sm font-medium mb-1">{project.name}</h2>
                <div className="text-white/60 text-xs">
                  {project.status === 'active' ? 'Active Client' : 'Proposal'}
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="text-white/80 hover:text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={16} />
              </motion.button>
            </div>

            <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2" style={{ maxHeight: maxHeight - 80 }}>
              {Object.entries(project.modules).map(([moduleId, module], index) => (
                <motion.div
                  key={moduleId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-black/20 rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedModule === moduleId ? 'bg-black/40' : ''
                  }`}
                  onClick={() => setSelectedModule(selectedModule === moduleId ? null : moduleId)}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getModuleColor(moduleId) }}
                    />
                    <div className="text-white text-sm font-medium">{module.name}</div>
                    <div className={`text-xs ml-auto ${
                      module.status === 'active' ? 'text-[#44ff88]' : 'text-[#ffd700]'
                    }`}>
                      {module.status.toUpperCase()}
                    </div>
                  </div>

                  {selectedModule === moduleId && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        {module.features.map((feature, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-2 text-white/60 text-xs"
                          >
                            <Bot size={12} />
                            <span>{feature}</span>
                          </motion.div>
                        ))}
                      </div>

                      {module.status === 'active' && (
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            <motion.div 
                              className="bg-black/20 rounded-lg p-2"
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="text-white/40 text-xs mb-1">Accuracy</div>
                              <div className="text-white text-sm font-medium">
                                {module.metrics.accuracy}%
                              </div>
                            </motion.div>
                            <motion.div 
                              className="bg-black/20 rounded-lg p-2"
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="text-white/40 text-xs mb-1">Efficiency</div>
                              <div className="text-white text-sm font-medium">
                                {module.metrics.efficiency}%
                              </div>
                            </motion.div>
                            {module.metrics.satisfaction && (
                              <motion.div 
                                className="col-span-2 bg-black/20 rounded-lg p-2"
                                whileHover={{ scale: 1.02 }}
                              >
                                <div className="text-white/40 text-xs mb-1">Satisfaction</div>
                                <div className="text-white text-sm font-medium">
                                  {module.metrics.satisfaction}%
                                </div>
                              </motion.div>
                            )}
                          </div>

                          {module.tasks && (
                            <div className="space-y-2">
                              <div className="text-white/60 text-xs font-medium">Tasks</div>
                              {module.tasks.map((task, i) => (
                                <motion.div
                                  key={task.id}
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="bg-black/20 rounded-lg p-2"
                                  whileHover={{ scale: 1.02 }}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="text-white text-xs">{task.name}</div>
                                    <div className={`text-xs ${getStatusColor(task.status)}`}>
                                      {task.status}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 text-white/40 text-xs">
                                    <Calendar size={10} />
                                    <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </motion.div>
                  )}

                  {!selectedModule && module.status === 'active' && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <motion.div 
                        className="bg-black/20 rounded-lg p-2"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="text-white/40 text-[10px]">Accuracy</div>
                        <div className="text-white text-xs font-medium">
                          {module.metrics.accuracy}%
                        </div>
                      </motion.div>
                      <motion.div 
                        className="bg-black/20 rounded-lg p-2"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="text-white/40 text-[10px]">Efficiency</div>
                        <div className="text-white text-xs font-medium">
                          {module.metrics.efficiency}%
                        </div>
                      </motion.div>
                      {module.tasks && (
                        <motion.div 
                          className="bg-black/20 rounded-lg p-2"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="text-white/40 text-[10px]">Tasks</div>
                          <div className="text-white text-xs font-medium">
                            {module.tasks.length}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}