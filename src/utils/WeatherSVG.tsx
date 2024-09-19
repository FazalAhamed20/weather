export const WeatherSVG = () => (
    <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#87CEEB', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#E0F6FF', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#skyGradient)" />
      <circle cx="150" cy="50" r="30" fill="#FFD700" className="animate-pulse">
        <animate attributeName="r" values="28;32;28" dur="3s" repeatCount="indefinite" />
      </circle>
      <path d="M40,80 a30,30 0 0,1 0,60 h80 a30,30 0 0,0 0,-60 a15,15 0 0,0 -25,-15 a25,25 0 0,0 -55,15" fill="#FFFFFF" className="animate-float" />
      <path d="M110,60 a20,20 0 0,1 0,40 h50 a20,20 0 0,0 0,-40 a10,10 0 0,0 -15,-10 a15,15 0 0,0 -35,10" fill="#FFFFFF" className="animate-float-delayed" />
    </svg>
  );