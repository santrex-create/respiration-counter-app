import { HeartPulse } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <HeartPulse className="w-8 h-8 text-accent" style={{ filter: 'drop-shadow(0 0 5px hsl(var(--accent) / 0.7))' }} />
      <h1 className="text-3xl font-bold text-foreground tracking-tight">
        Respiration Rate <span className="font-light">Monitor</span>
      </h1>
    </div>
  );
};

export default Logo;
