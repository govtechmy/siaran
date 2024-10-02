
export default function SearchButton({
    className = 'stroke-[#18181B] dark:stroke-[#FFFFFF]',
    ...props
  }) {
    return (
<svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_17618_7439)">
<rect x="3" y="2" width="32" height="32" rx="16" fill="url(#paint0_linear_17618_7439)" shapeRendering="crispEdges"/>
<rect x="3.5" y="2.5" width="31" height="31" rx="15.5" stroke="#DD420A" shapeRendering="crispEdges"/>
<path d="M26.25 25.25L22.5 21.5M11.75 17C11.75 13.5482 14.5482 10.75 18 10.75C21.4518 10.75 24.25 13.5482 24.25 17C24.25 20.4518 21.4518 23.25 18 23.25C14.5482 23.25 11.75 20.4518 11.75 17Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</g>
<defs>
<filter id="filter0_d_17618_7439" x="0" y="0" width="38" height="38" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
<feFlood floodOpacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="1.5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.07 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_17618_7439"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_17618_7439" result="shape"/>
</filter>
<linearGradient id="paint0_linear_17618_7439" x1="19" y1="34" x2="19.0001" y2="-14.7273" gradientUnits="userSpaceOnUse">
<stop stopColor="#DD420A"/>
<stop offset="1" stopColor="#FEAF73"/>
</linearGradient>
</defs>
</svg>

    );
  }
  