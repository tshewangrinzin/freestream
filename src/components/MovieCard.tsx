import { motion } from 'framer-motion';
import { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-2"
    >
      <div className="relative aspect-video rounded-lg md:rounded-xl overflow-hidden">
        <img
          src={movie.thumbnail}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-200"
        />
      </div>
      <div className="flex flex-col px-1">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base line-clamp-2">{movie.title}</h3>
        <div className="flex items-center gap-1 text-xs md:text-sm text-gray-500 dark:text-gray-400">
          <span>{movie.year}</span>
          <span>•</span>
          <span>{movie.duration}</span>
          <span>•</span>
          <span>{movie.genre}</span>
        </div>
        <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
          {movie.views} views
        </div>
      </div>
    </motion.div>
  );
}