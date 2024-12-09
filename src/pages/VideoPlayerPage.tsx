import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Subtitles, ThumbsUp, Share2, Send, Check } from 'lucide-react';
import screenfull from 'screenfull';
import { movies } from '../data/movies';
import MovieCard from '../components/MovieCard';
import { VideoPlayerSkeleton } from '../components/LoadingSkeleton';

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
}

export default function VideoPlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [quality, setQuality] = useState('1080p');
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [selectedSubtitle, setSelectedSubtitle] = useState('Off');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(1234);
  const [commentText, setCommentText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const settingsRef = useRef<HTMLDivElement>(null);
  const subtitlesRef = useRef<HTMLDivElement>(null);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: { name: 'Alice Johnson', avatar: 'https://picsum.photos/seed/alice/40/40' },
      text: 'Great movie! The cinematography is amazing.',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      user: { name: 'Bob Smith', avatar: 'https://picsum.photos/seed/bob/40/40' },
      text: 'The plot twist at the end was unexpected!',
      timestamp: '5 hours ago'
    }
  ]);

  const currentMovie = movies.find(movie => movie.id === id);
  const recommendedMovies = movies.filter(movie => movie.id !== id).slice(0, 4);

  const qualityOptions = ['1080p', '720p', '480p', '360p'];
  const subtitleOptions = ['Off', 'English', 'Spanish', 'French', 'German'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click was outside settings menu
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
      // Check if click was outside subtitles menu
      if (subtitlesRef.current && !subtitlesRef.current.contains(event.target as Node)) {
        setShowSubtitleMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!currentMovie) {
      navigate('/');
    }

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentMovie, navigate]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          setIsPlaying(prev => !prev);
          break;
        case 'm':
          setIsMuted(prev => !prev);
          break;
        case 'f':
          handleFullscreen();
          break;
        case 'arrowleft':
          handleSeek(-10);
          break;
        case 'arrowright':
          handleSeek(10);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleSeek = (seekTime: number) => {
    const player = document.querySelector('video');
    if (player) {
      player.currentTime += seekTime;
    }
  };

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    setProgress(state.playedSeconds);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleFullscreen = () => {
    const player = document.querySelector('.player-wrapper');
    if (player && screenfull.isEnabled) {
      screenfull.toggle(player);
      setIsFullscreen(!isFullscreen);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: currentMovie?.title,
        text: `Check out ${currentMovie?.title} on CinemaStream!`,
        url: window.location.href,
      });
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      user: {
        name: 'You',
        avatar: 'https://picsum.photos/seed/you/40/40'
      },
      text: commentText,
      timestamp: 'Just now'
    };

    setComments(prev => [newComment, ...prev]);
    setCommentText('');
  };

  const SettingsMenu = () => (
    <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-800/95 rounded-lg overflow-hidden shadow-lg backdrop-blur-sm">
      {/* Quality Settings */}
      <div className="p-3 border-b border-gray-700">
        <div className="text-sm text-gray-400 mb-2">Quality</div>
        <div className="space-y-1">
          {qualityOptions.map((q) => (
            <button
              key={q}
              onClick={() => setQuality(q)}
              className="w-full flex items-center justify-between px-2 py-1 text-sm hover:bg-gray-700 rounded"
            >
              <span className="text-gray-300">{q}</span>
              {quality === q && <Check className="w-4 h-4 text-blue-500" />}
            </button>
          ))}
        </div>
      </div>

      {/* Autoplay Toggle */}
      <div className="p-3">
        <button
          onClick={() => setAutoplay(!autoplay)}
          className="w-full flex items-center justify-between px-2 py-1 text-sm hover:bg-gray-700 rounded"
        >
          <span className="text-gray-300">Autoplay</span>
          <div className={`w-8 h-4 rounded-full transition-colors ${
            autoplay ? 'bg-blue-500' : 'bg-gray-600'
          }`}>
            <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
              autoplay ? 'translate-x-4' : 'translate-x-0'
            }`} />
          </div>
        </button>
      </div>
    </div>
  );

  const SubtitleMenu = () => (
    <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-800/95 rounded-lg overflow-hidden shadow-lg backdrop-blur-sm">
      <div className="p-3">
        <div className="text-sm text-gray-400 mb-2">Subtitles</div>
        <div className="space-y-1">
          {subtitleOptions.map((subtitle) => (
            <button
              key={subtitle}
              onClick={() => {
                setSelectedSubtitle(subtitle);
                setShowSubtitles(subtitle !== 'Off');
              }}
              className="w-full flex items-center justify-between px-2 py-1 text-sm hover:bg-gray-700 rounded"
            >
              <span className="text-gray-300">{subtitle}</span>
              {selectedSubtitle === subtitle && <Check className="w-4 h-4 text-blue-500" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <VideoPlayerSkeleton />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-6 bg-white dark:bg-gray-900">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player Section */}
          <div className="lg:col-span-2">
            <div className="player-wrapper relative bg-black rounded-xl overflow-hidden">
              <ReactPlayer
                url={currentMovie?.thumbnail} // Replace with actual video URL
                width="100%"
                height="100%"
                playing={isPlaying}
                volume={volume}
                muted={isMuted}
                onProgress={handleProgress}
                onDuration={handleDuration}
                className="react-player"
                style={{ aspectRatio: '16/9' }}
                config={{
                  file: {
                    attributes: {
                      controlsList: 'nodownload'
                    }
                  }
                }}
              />
              
              {/* Custom Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                {/* Progress Bar */}
                <div className="relative group">
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatTime(progress)}
                  </div>
                  <div className="relative w-full h-1 bg-gray-600 rounded cursor-pointer mb-4"
                       onClick={(e) => {
                         const rect = e.currentTarget.getBoundingClientRect();
                         const percent = (e.clientX - rect.left) / rect.width;
                         const player = document.querySelector('video');
                         if (player) {
                           player.currentTime = percent * duration;
                         }
                       }}>
                    <div
                      className="absolute top-0 left-0 h-full bg-blue-500 rounded"
                      style={{ width: `${(progress / duration) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="hover:text-blue-400 transition-colors"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </button>

                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="hover:text-blue-400 transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                    </button>

                    <span className="text-sm">
                      {formatTime(progress)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="relative" ref={subtitlesRef}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowSubtitleMenu(!showSubtitleMenu);
                          setShowSettings(false);
                        }}
                        className={`hover:text-blue-400 transition-colors ${showSubtitleMenu ? 'text-blue-400' : ''}`}
                      >
                        <Subtitles className="w-6 h-6" />
                      </button>
                      {showSubtitleMenu && <SubtitleMenu />}
                    </div>

                    <div className="relative" ref={settingsRef}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowSettings(!showSettings);
                          setShowSubtitleMenu(false);
                        }}
                        className={`hover:text-blue-400 transition-colors ${showSettings ? 'text-blue-400' : ''}`}
                      >
                        <Settings className="w-6 h-6" />
                      </button>
                      {showSettings && <SettingsMenu />}
                    </div>

                    <button
                      onClick={handleFullscreen}
                      className="hover:text-blue-400 transition-colors"
                    >
                      <Maximize className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Info and Actions */}
            <div className="mt-4 space-y-4">
              <h1 className="text-2xl font-bold dark:text-white">{currentMovie?.title}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>{currentMovie?.year}</span>
                <span>•</span>
                <span>{currentMovie?.duration}</span>
                <span>•</span>
                <span>{currentMovie?.genre}</span>
                <span>•</span>
                <span>{currentMovie?.views} views</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isLiked
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{likeCount.toLocaleString()}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>

              {/* Comments Section */}
              <div className="mt-8 space-y-4">
                <h2 className="text-xl font-bold dark:text-white">Comments</h2>
                
                {/* Comment Form */}
                <form onSubmit={handleComment} className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    disabled={!commentText.trim()}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <img
                        src={comment.user.avatar}
                        alt={comment.user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium dark:text-white">{comment.user.name}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{comment.timestamp}</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Videos */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Recommended</h2>
            <div className="space-y-4">
              {recommendedMovies.map((movie) => (
                <motion.div
                  key={movie.id}
                  onClick={() => navigate(`/watch/${movie.id}`)}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                >
                  <MovieCard movie={movie} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}