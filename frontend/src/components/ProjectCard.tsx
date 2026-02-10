'use client';

import { motion } from 'framer-motion';
import { Leaf, Users, Shield, ArrowUpRight } from 'lucide-react';
import { EsgProject } from '@/lib/types';
import { getCategoryLabel, getCategoryColor, getCategoryAccentColor } from '@/lib/utils';

const categoryIcons: Record<string, any> = {
  ENVIRONMENT: Leaf,
  SOCIAL: Users,
  GOVERNANCE: Shield,
};

interface ProjectCardProps {
  project: EsgProject;
  index: number;
  onClick: () => void;
}

export default function ProjectCard({ project, index, onClick }: ProjectCardProps) {
  const Icon = categoryIcons[project.category];
  const accentColor = getCategoryAccentColor(project.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative h-52 overflow-hidden bg-gray-100">
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: `${accentColor}15` }}
            >
              <Icon className="w-16 h-16" style={{ color: accentColor, opacity: 0.3 }} />
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md ${getCategoryColor(
                project.category
              )} border`}
            >
              <Icon className="w-3 h-3" />
              {getCategoryLabel(project.category)}
            </span>
          </div>

          {/* Year badge */}
          <div className="absolute top-4 right-4">
            <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-semibold">
              {project.year}
            </span>
          </div>

          {/* Hover arrow */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-gray-900" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Department */}
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            {project.deptName}
          </p>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-gray-700 transition-colors line-clamp-2">
            {project.title}
          </h3>

          {/* Summary */}
          {project.oneLineSummary && (
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1">
              {project.oneLineSummary}
            </p>
          )}

          {/* Task tag */}
          <div className="mt-4 pt-4 border-t border-gray-50">
            <span className="inline-block px-3 py-1 rounded-md bg-gray-50 text-xs font-medium text-gray-500">
              {project.task}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
