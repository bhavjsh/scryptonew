import { useRef, useState, useCallback, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, Play, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LiveVideoCardProps {
  className?: string;
}

export function LiveVideoCard({ className }: LiveVideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startSession = useCallback(async () => {
    console.log('Starting camera session...');
    setIsLoading(true);
    setPermissionDenied(false);
    
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('getUserMedia is not supported in this browser');
        setPermissionDenied(true);
        setIsLoading(false);
        return;
      }

      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: true
      });

      console.log('Camera access granted');
      streamRef.current = stream;
      setIsStreaming(true);
      setIsVideoEnabled(true);
      setIsMuted(true);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Camera access error:', error);
      setPermissionDenied(true);
      setIsStreaming(false);
      setIsLoading(false);
    }
  }, []);

  // Attach stream to video element when streaming starts
  useEffect(() => {
    if (isStreaming && streamRef.current && videoRef.current) {
      console.log('Attaching stream to video element');
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(err => {
        console.log('Autoplay issue:', err);
      });
    }
  }, [isStreaming]);

  const endSession = useCallback(() => {
    console.log('Ending session...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped track:', track.kind);
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setIsVideoEnabled(true);
    setIsMuted(true);
  }, []);

  const toggleMute = useCallback(() => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const toggleVideo = useCallback(() => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  }, [isVideoEnabled]);

  // Loading state
  if (isLoading) {
    return (
      <div className={cn(
        "relative rounded-xl bg-card/80 border border-border overflow-hidden aspect-video flex items-center justify-center",
        className
      )}>
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Starting session...</p>
        </div>
      </div>
    );
  }

  // Not streaming state - show Start button
  if (!isStreaming) {
    return (
      <div className={cn(
        "relative rounded-xl bg-card/80 border border-border overflow-hidden aspect-video flex items-center justify-center",
        className
      )}>
        <div className="text-center p-6">
          {permissionDenied ? (
            <>
              <VideoOff className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                Camera access not available
              </p>
              <Button
                onClick={startSession}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white gap-2 transition-all duration-300"
              >
                <Play className="h-4 w-4" />
                Try Again
              </Button>
            </>
          ) : (
            <>
              <Video className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                Start your live session
              </p>
              <Button
                onClick={startSession}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white gap-2 transition-all duration-300"
              >
                <Play className="h-4 w-4" />
                Start Session
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Streaming state - show single video
  return (
    <div className={cn(
      "relative rounded-xl bg-black/90 border border-white/10 overflow-hidden transition-all duration-300",
      className
    )}>
      {/* Live indicator */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
        <div className="relative">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <div className="absolute inset-0 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <span className="text-[10px] font-medium text-white">Live</span>
      </div>

      {/* Video */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isMuted}
        className={cn(
          "w-full aspect-video object-cover transition-opacity duration-300",
          isVideoEnabled ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Video disabled overlay */}
      {!isVideoEnabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/90">
          <VideoOff className="h-12 w-12 text-muted-foreground" />
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={toggleMute}
          className={cn(
            "rounded-full h-9 w-9 p-0 bg-black/60 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all duration-200",
            !isMuted && "bg-cyan-500/20 border-cyan-500/30"
          )}
        >
          {isMuted ? (
            <MicOff className="h-4 w-4 text-white" />
          ) : (
            <Mic className="h-4 w-4 text-cyan-400" />
          )}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={toggleVideo}
          className={cn(
            "rounded-full h-9 w-9 p-0 bg-black/60 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all duration-200",
            isVideoEnabled && "bg-cyan-500/20 border-cyan-500/30"
          )}
        >
          {isVideoEnabled ? (
            <Video className="h-4 w-4 text-cyan-400" />
          ) : (
            <VideoOff className="h-4 w-4 text-white" />
          )}
        </Button>
        <Button
          size="sm"
          onClick={endSession}
          className="rounded-full h-9 px-4 bg-muted/60 hover:bg-muted text-foreground border border-muted-foreground/30 gap-2 transition-all duration-200"
        >
          <PhoneOff className="h-4 w-4" />
          End
        </Button>
      </div>
    </div>
  );
}
