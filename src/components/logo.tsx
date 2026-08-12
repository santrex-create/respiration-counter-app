import { Activity } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-1 group">
      <div className="relative">
        <Activity className="w-12 h-12 text-accent animate-pulse" style={{ filter: 'drop-shadow(0 0 8px hsl(var(--accent) / 0.8))' }} />
        <div className="absolute inset-0 border border-accent/20 rounded-full animate-ping [animation-duration:3s]" />
      </div>
      <h1 className="text-2xl font-mono font-bold text-foreground tracking-tighter uppercase">
        Vital<span className="text-accent">Scan</span> <span className="text-[10px] text-muted-foreground opacity-50">v2.5</span>
      </h1>
    </div>
  );
};

export default Logo;
