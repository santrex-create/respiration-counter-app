import { Activity } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex flex-row items-center justify-center gap-3 group">
      <div className="relative">
        <Activity className="w-10 h-10 text-accent animate-pulse" style={{ filter: 'drop-shadow(0 0 8px hsl(var(--accent) / 0.8))' }} />
        <div className="absolute inset-0 border border-accent/20 rounded-full animate-ping [animation-duration:3s]" />
      </div>
      <h1 className="text-2xl font-mono font-bold text-foreground tracking-tighter uppercase">
        Spirex <span className="text-[10px] text-muted-foreground opacity-50">v2.5</span>
      </h1>
    </div>
  );
};

export default Logo;