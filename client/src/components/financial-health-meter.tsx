import React, { useState, useEffect, useRef } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Shield, AlertTriangle, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Define the props for the component
interface FinancialHealthMeterProps {
  score: number;
  onChange?: (score: number) => void;
}

/**
 * Financial Health Meter Component
 * 
 * Displays a visual representation of the user's financial health score (0-100)
 * with appropriate color coding and animations.
 */
export default function FinancialHealthMeter({ score = 0, onChange }: FinancialHealthMeterProps) {
  // Animated score state
  const [animatedScore, setAnimatedScore] = useState(0);
  
  // Animate the score when it changes
  useEffect(() => {
    // Start from current animated score
    const startValue = animatedScore;
    const endValue = score;
    const duration = 1000; // 1 second animation
    const startTime = Date.now();
    
    const animateScore = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      
      if (elapsedTime < duration) {
        // Calculate the animated value using easeOutQuad easing function
        const t = elapsedTime / duration;
        const easeOut = t * (2 - t);
        const newValue = startValue + (endValue - startValue) * easeOut;
        
        setAnimatedScore(Math.round(newValue));
        requestAnimationFrame(animateScore);
      } else {
        // Animation completed, set the final value
        setAnimatedScore(endValue);
      }
    };
    
    requestAnimationFrame(animateScore);
  }, [score]);
  
  // Determine score status
  const getScoreStatus = (value: number) => {
    if (value >= 80) return { status: 'Excellent', color: 'bg-green-500', icon: Sparkles };
    if (value >= 60) return { status: 'Good', color: 'bg-blue-500', icon: Shield };
    if (value >= 40) return { status: 'Fair', color: 'bg-yellow-500', icon: Shield };
    return { status: 'Needs Attention', color: 'bg-red-500', icon: AlertTriangle };
  };
  
  const { status, color, icon: Icon } = getScoreStatus(score);
  
  // Get advice based on score
  const getScoreAdvice = (value: number) => {
    if (value >= 80) return 'Your finances are in excellent shape! Keep up the good work.';
    if (value >= 60) return 'Your financial health is good. Consider optimizing your savings.';
    if (value >= 40) return 'Your finances need some attention. Focus on reducing debt.';
    return 'Your financial health needs immediate attention. Consider financial counseling.';
  };
  
  // Track previous score for trend animation
  const [prevScore, setPrevScore] = useState(score);
  const [showTrend, setShowTrend] = useState(false);
  
  // On score change, determine if it's increasing or decreasing
  useEffect(() => {
    if (prevScore !== score) {
      setShowTrend(true);
      
      // Hide trend indicator after 3 seconds
      const timer = setTimeout(() => {
        setShowTrend(false);
        setPrevScore(score);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [score, prevScore]);
  
  // Animation variants for progress indicator
  const progressVariants = {
    initial: { width: '0%', opacity: 0 },
    animate: { 
      width: `${animatedScore}%`, 
      opacity: 1,
      transition: { 
        duration: 1.2,
        ease: [0.34, 1.56, 0.64, 1], // Custom spring-like ease
      }
    }
  };
  
  // Animation variants for score display
  const scoreVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }
  };
  
  // Card animation variants
  const cardVariants = {
    hover: { 
      y: -5,
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      transition: { 
        duration: 0.3 
      }
    }
  };
  
  // Icon animation variants
  const iconVariants = {
    initial: { rotate: -30, opacity: 0 },
    animate: { 
      rotate: 0, 
      opacity: 1,
      transition: {
        delay: 0.5,
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };
  
  // Trend indicator animation
  const trendVariants = {
    initial: { y: 10, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { y: -10, opacity: 0, transition: { duration: 0.3 } }
  };
  
  // Calculate which icon to show based on trend
  const TrendIcon = score > prevScore ? ArrowUp : ArrowDown;
  const trendColor = score > prevScore ? "text-green-500" : "text-red-500";
  
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={cardVariants}
    >
      <Card className="shadow-md overflow-hidden relative">
        <CardHeader className={cn("p-4 text-white", color)}>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <motion.div variants={iconVariants}>
                <Icon className="h-5 w-5" />
              </motion.div>
              Financial Health Score
            </CardTitle>
            <Badge variant="outline" className="text-white border-white font-semibold">
              {status}
            </Badge>
          </div>
          <CardDescription className="text-white/90">
            Your overall financial wellbeing
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-2 relative">
            <span className="text-sm text-gray-500 dark:text-gray-400">0</span>
            
            <div className="flex items-center justify-center relative">
              <motion.span 
                key={animatedScore}
                variants={scoreVariants}
                className="text-3xl font-bold"
              >
                {animatedScore}
              </motion.span>
              
              <AnimatePresence>
                {showTrend && (
                  <motion.div 
                    variants={trendVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className={cn("absolute -right-6 flex items-center", trendColor)}
                  >
                    <TrendIcon className="h-4 w-4 mr-1" />
                    <span className="text-xs">{Math.abs(score - prevScore)}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <span className="text-sm text-gray-500 dark:text-gray-400">100</span>
          </div>
          
          <div className="h-3 mb-4 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
            <motion.div
              variants={progressVariants}
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(to right, #ef4444, #f59e0b, #3b82f6, #22c55e)',
              }}
            />
          </div>
          
          <motion.p 
            className="text-sm text-gray-700 dark:text-gray-300 mt-4"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {getScoreAdvice(score)}
          </motion.p>
          
          <div className="grid grid-cols-3 gap-2 mt-6 text-center text-xs">
            {/* Savings */}
            <motion.div 
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              whileHover={{ y: -2 }}
            >
              <div className="font-semibold">Savings</div>
              <div className={cn(
                "mt-1 font-bold flex items-center justify-center",
                score >= 60 ? "text-green-500" : "text-red-500"
              )}>
                {score >= 60 ? 'Good' : 'Low'}
                {score >= 60 ? 
                  <Sparkles className="h-3 w-3 ml-1" /> : 
                  <AlertTriangle className="h-3 w-3 ml-1" />
                }
              </div>
            </motion.div>
            
            {/* Debt */}
            <motion.div 
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              whileHover={{ y: -2 }}
            >
              <div className="font-semibold">Debt</div>
              <div className={cn(
                "mt-1 font-bold flex items-center justify-center",
                score >= 50 ? "text-green-500" : "text-red-500"
              )}>
                {score >= 50 ? 'Managed' : 'High'}
                {score >= 50 ? 
                  <Shield className="h-3 w-3 ml-1" /> : 
                  <AlertTriangle className="h-3 w-3 ml-1" />
                }
              </div>
            </motion.div>
            
            {/* Planning */}
            <motion.div 
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              whileHover={{ y: -2 }}
            >
              <div className="font-semibold">Planning</div>
              <div className={cn(
                "mt-1 font-bold flex items-center justify-center",
                score >= 70 ? "text-green-500" : score >= 40 ? "text-yellow-500" : "text-red-500"
              )}>
                {score >= 70 ? 'Excellent' : score >= 40 ? 'Fair' : 'Poor'}
                {score >= 70 ? 
                  <TrendingUp className="h-3 w-3 ml-1" /> : 
                  score >= 40 ? 
                    <Shield className="h-3 w-3 ml-1" /> : 
                    <AlertTriangle className="h-3 w-3 ml-1" />
                }
              </div>
            </motion.div>
          </div>
          
          {/* Interactive elements - clickable arrows to test score change */}
          {onChange && (
            <motion.div 
              className="flex justify-center mt-6 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              <button 
                onClick={() => onChange(Math.max(0, score - 10))}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              <button 
                onClick={() => onChange(Math.min(100, score + 10))}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}