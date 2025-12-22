/**
 * RunnerIllustration Component
 *
 * SVG illustration of a runner being roasted
 */
export function RunnerIllustration() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle
        cx="200"
        cy="200"
        r="180"
        fill="none"
        stroke="black"
        strokeWidth="3"
      />

      {/* Roasting flames */}
      <g id="flames">
        {/* Left flame */}
        <path
          d="M 80 180 Q 70 160 75 130 Q 78 110 90 100"
          fill="none"
          stroke="#FF6B35"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M 80 180 Q 75 160 85 130 Q 92 105 105 95"
          fill="none"
          stroke="#FFA500"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Right flame */}
        <path
          d="M 320 180 Q 330 160 325 130 Q 322 110 310 100"
          fill="none"
          stroke="#FF6B35"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M 320 180 Q 325 160 315 130 Q 308 105 295 95"
          fill="none"
          stroke="#FFA500"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Top flames */}
        <path
          d="M 150 80 Q 140 60 145 30"
          fill="none"
          stroke="#FF6B35"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 200 70 Q 200 40 205 20"
          fill="none"
          stroke="#FFA500"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M 250 80 Q 260 60 255 30"
          fill="none"
          stroke="#FF6B35"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {/* Head */}
      <circle
        cx="200"
        cy="120"
        r="25"
        fill="black"
        stroke="black"
        strokeWidth="2"
      />

      {/* Face - simple expression */}
      <circle cx="195" cy="115" r="4" fill="white" />
      <circle cx="205" cy="115" r="4" fill="white" />
      <path
        d="M 195 125 Q 200 128 205 125"
        stroke="white"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Body - running position */}
      <rect
        x="185"
        y="150"
        width="30"
        height="50"
        fill="black"
        stroke="black"
        strokeWidth="2"
      />

      {/* Left arm - up */}
      <line
        x1="185"
        y1="160"
        x2="140"
        y2="140"
        stroke="black"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Right arm - back */}
      <line
        x1="215"
        y1="160"
        x2="260"
        y2="180"
        stroke="black"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Left leg - forward */}
      <line
        x1="195"
        y1="200"
        x2="165"
        y2="260"
        stroke="black"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Right leg - back */}
      <line
        x1="205"
        y1="200"
        x2="225"
        y2="270"
        stroke="black"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Left foot */}
      <circle
        cx="165"
        cy="265"
        r="8"
        fill="black"
        stroke="black"
        strokeWidth="2"
      />

      {/* Right foot */}
      <circle
        cx="225"
        cy="275"
        r="8"
        fill="black"
        stroke="black"
        strokeWidth="2"
      />

      {/* Pain/shock indicator - X eyes effect */}
      <text x="130" y="150" fontSize="24" fill="#FF6B35" fontWeight="bold">
        ⚡
      </text>
      <text x="260" y="150" fontSize="24" fill="#FF6B35" fontWeight="bold">
        ⚡
      </text>

      {/* Speed lines */}
      <line
        x1="100"
        y1="180"
        x2="130"
        y2="180"
        stroke="black"
        strokeWidth="2"
        strokeDasharray="5,5"
      />
      <line
        x1="90"
        y1="200"
        x2="120"
        y2="200"
        stroke="black"
        strokeWidth="2"
        strokeDasharray="5,5"
      />
      <line
        x1="280"
        y1="180"
        x2="310"
        y2="180"
        stroke="black"
        strokeWidth="2"
        strokeDasharray="5,5"
      />
      <line
        x1="280"
        y1="200"
        x2="310"
        y2="200"
        stroke="black"
        strokeWidth="2"
        strokeDasharray="5,5"
      />

      {/* Roast message banner */}
      <rect
        x="100"
        y="300"
        width="200"
        height="50"
        fill="white"
        stroke="black"
        strokeWidth="3"
      />
      <text
        x="200"
        y="330"
        fontSize="16"
        fontWeight="900"
        textAnchor="middle"
        fill="black"
      >
        GETTING ROASTED
      </text>
    </svg>
  );
}
