import React from 'react';

const SurahHeader: React.FC<{ surahName: string }> = ({ surahName }) => {
  return (
    <div className="my-8" aria-label={`Beginning of Surah ${surahName}`}>
      <svg
        viewBox="0 0 1200 120"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="presentation"
      >
        {/* Frame lines */}
        <path d="M0 20 H1200 M0 100 H1200" stroke="black" strokeWidth="2" />

        {/* Central cartouche */}
        <path 
            d="M250,10 C240,10 230,20 230,30 V90 C230,100 240,110 250,110 H950 C960,110 970,100 970,90 V30 C970,20 960,10 950,10 Z" 
            stroke="black" 
            strokeWidth="3" 
            fill="white" 
        />
         <path 
            d="M255,13 C245,13 235,23 235,33 V87 C235,97 245,107 255,107 H945 C955,107 965,97 965,87 V33 C965,23 955,13 945,13 Z" 
            stroke="black" 
            strokeWidth="1" 
            fill="none" 
        />

        {/* Left Decoration */}
        <g>
            <path d="M20 20 H200 V100 H20 Z" stroke="black" strokeWidth="2.5" fill="none"/>
            <circle cx="110" cy="60" r="38" stroke="black" strokeWidth="3" fill="white" />
            <path d="M50 45 c 20 -20 80 -20 120 0" stroke="black" fill="none" strokeWidth="1.5"/>
            <path d="M50 75 c 20 20 80 20 120 0" stroke="black" fill="none" strokeWidth="1.5"/>
            <circle cx="110" cy="60" r="10" fill="black" />
        </g>
        
        {/* Right Decoration */}
        <g transform="translate(1180, 0) scale(-1, 1)">
             <path d="M20 20 H200 V100 H20 Z" stroke="black" strokeWidth="2.5" fill="none"/>
            <circle cx="110" cy="60" r="38" stroke="black" strokeWidth="3" fill="white" />
            <path d="M50 45 c 20 -20 80 -20 120 0" stroke="black" fill="none" strokeWidth="1.5"/>
            <path d="M50 75 c 20 20 80 20 120 0" stroke="black" fill="none" strokeWidth="1.5"/>
            <circle cx="110" cy="60" r="10" fill="black" />
        </g>
        
        <text
          x="50%"
          y="63"
          dominantBaseline="middle"
          textAnchor="middle"
          className="quran-text"
          fontSize="48"
          fill="black"
        >
          سورة {surahName}
        </text>
      </svg>
    </div>
  );
};
export default SurahHeader;
