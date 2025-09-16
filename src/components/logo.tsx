import { HeartPulse } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center justify-center gap-3">
      <HeartPulse className="w-10 h-10 text-accent" style={{ filter: 'drop-shadow(0 0 6px hsl(var(--accent) / 0.7))' }} />
      <h1 className="text-4xl font-bold text-foreground tracking-tight">
        Respiration Rate <span className="font-light">Monitor</span>
      </h1>
    </div>
  );
};

export default Logo;
