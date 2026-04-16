
export function EyeIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 640"
      width="24"
      height="24"
      fill="currentColor"
      {...props}
    >
      <path d="M320 96C239.2 96 174.5 132.8 127.4 176.6C80.6 220.1 49.3 272 34.4 307.7C31.1 315.6 31.1 324.4 34.4 332.3C49.3 368 80.6 420 127.4 463.4C174.5 507.1 239.2 544 320 544C400.8 544 465.5 507.2 512.6 463.4C559.4 419.9 590.7 368 605.6 332.3C608.9 324.4 608.9 315.6 605.6 307.7C590.7 272 559.4 220 512.6 176.6C465.5 132.9 400.8 96 320 96zM176 320C176 240.5 240.5 176 320 176C399.5 176 464 240.5 464 320C464 399.5 399.5 464 320 464C240.5 464 176 399.5 176 320zM320 256C320 291.3 291.3 320 256 320C244.5 320 233.7 317 224.3 311.6C223.3 322.5 224.2 333.7 227.2 344.8C240.9 396 293.6 426.4 344.8 412.7C396 399 426.4 346.3 412.7 295.1C400.5 249.4 357.2 220.3 311.6 224.3C316.9 233.6 320 244.4 320 256z" />
    </svg>
  );
}

export function EyeSlashIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 640"
      width="24"
      height="24"
      fill="currentColor"
      {...props}
    >

      <path d="M73 39.1C63.6 29.7 48.4 29.7 39.1 39.1C29.8 48.5 29.7 63.7 39 73.1L567 601.1C576.4 610.5 591.6 610.5 600.9 601.1C610.2 591.7 610.3 576.5 600.9 567.2L504.5 470.8C507.2 468.4 509.9 466 512.5 463.6C559.3 420.1 590.6 368.2 605.5 332.5C608.8 324.6 608.8 315.8 605.5 307.9C590.6 272.2 559.3 220.2 512.5 176.8C465.4 133.1 400.7 96.2 319.9 96.2C263.1 96.2 214.3 114.4 173.9 140.4L73 39.1zM208.9 175.1C241 156.2 278.1 144 320 144C385.2 144 438.8 173.6 479.9 211.7C518.4 247.4 545 290 558.5 320C544.9 350 518.3 392.5 479.9 428.3C476.8 431.1 473.7 433.9 470.5 436.7L425.8 392C439.8 371.5 448 346.7 448 320C448 249.3 390.7 192 320 192C293.3 192 268.5 200.2 248 214.2L208.9 175.1zM390.9 357.1L282.9 249.1C294 243.3 306.6 240 320 240C364.2 240 400 275.8 400 320C400 333.4 396.7 346 390.9 357.1zM135.4 237.2L101.4 203.2C68.8 240 46.4 279 34.5 307.7C31.2 315.6 31.2 324.4 34.5 332.3C49.4 368 80.7 420 127.5 463.4C174.6 507.1 239.3 544 320.1 544C357.4 544 391.3 536.1 421.6 523.4L384.2 486C364.2 492.4 342.8 496 320 496C254.8 496 201.2 466.4 160.1 428.3C121.6 392.6 95 350 81.5 320C91.9 296.9 110.1 266.4 135.5 237.2z" />
    </svg>
  )
}


export function WelcomeIcon(props) {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 100 100"
      className="text-black"
      {...props}
    >
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" />
      <circle cx="35" cy="40" r="4" fill="currentColor" />
      <circle cx="65" cy="40" r="4" fill="currentColor" />
      <path d="M30 65 Q50 80 70 65" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function SearchIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.04 15.624a9.004 9.004 0 10-1.415 1.415l5.667 5.668a1 1 0 001.415-1.415l-5.668-5.668zm-7.036 1.393a7.013 7.013 0 110-14.026 7.013 7.013 0 010 14.026z"
        fill="currentColor"
      />
    </svg>
  );
}

export function DiscoveryIcon(props) {
  return (
    <svg
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      xmlSpace="preserve"
      {...props}
    >
      <path d="M12 24C5.4 24 0 18.6 0 12S5.4 0 12 0s12 5.4 12 12-5.4 12-12 12zm-2.5-7c.6 3.1 1.7 5 2.5 5s1.9-1.9 2.5-5h-5zm7.1 0c-.3 1.7-.8 3.3-1.4 4.5 2.3-.8 4.3-2.4 5.5-4.5h-4.1zM3.3 17c1.2 2.1 3.2 3.7 5.5 4.5-.6-1.2-1.1-2.8-1.4-4.5H3.3zm13.6-2h4.7c.2-.9.4-2 .4-3s-.2-2.1-.5-3h-4.7c.2 1 .2 2 .2 3s0 2-.1 3zm-7.7 0h5.7c.1-.9.2-1.9.2-3s-.1-2.1-.2-3H9.2c-.1.9-.2 1.9-.2 3s.1 2.1.2 3zm-6.7 0h4.7c-.1-1-.1-2-.1-3s0-2 .1-3H2.5c-.3.9-.5 2-.5 3s.2 2.1.5 3zm14.1-8h4.1c-1.2-2.1-3.2-3.7-5.5-4.5.6 1.2 1.1 2.8 1.4 4.5zM9.5 7h5.1c-.6-3.1-1.7-5-2.5-5s-2 1.9-2.6 5zM3.3 7h4.1c.3-1.7.8-3.3 1.4-4.5-2.3.8-4.2 2.4-5.5 4.5z" />
    </svg>
  );
}

export function CreateIcon(props) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill="currentColor">
        <path d="M7 13.8a.8.8 0 01.8-.8H13V7.8a.797.797 0 01.8-.8h.4a.8.8 0 01.8.8V13h5.2a.798.798 0 01.8.8v.4a.8.8 0 01-.8.8H15v5.2a.8.8 0 01-.8.8h-.4a.8.8 0 01-.8-.8V15H7.8a.8.8 0 01-.8-.8v-.4z" />
        <path
          clipRule="evenodd"
          d="M1 14C1 6.82 6.82 1 14 1s13 5.82 13 13-5.82 13-13 13S1 21.18 1 14zM14 3C7.926 3 3 7.925 3 14s4.926 11 11 11 11-4.925 11-11S20.074 3 14 3z"
          fillRule="evenodd"
        />
      </g>
    </svg>
  );
}

export function ChatIcon(props) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M22 3a1 1 0 00-1-1H3a1 1 0 00-1 1v14a1 1 0 001 1h5.5l2.7 3.6a1 1 0 001.6 0l2.7-3.6H21a1 1 0 001-1zm-2 13h-5a1 1 0 00-.8.4L12 19.333 9.8 16.4A1 1 0 009 16H4V4h16zM7 8a1 1 0 011-1h8a1 1 0 010 2H8a1 1 0 01-1-1zm0 5a1 1 0 011-1h4a1 1 0 010 2H8a1 1 0 01-1-1z" />
    </svg>
  );
}

export function FacebookLogo(props) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M30.996 16.091C30.995 7.81 24.282 1.097 16 1.097S1.004 7.811 1.004 16.093c0 7.455 5.44 13.639 12.566 14.8l.086.012V20.427H9.848v-4.336h3.808v-3.302a5.293 5.293 0 015.684-5.834l-.018-.001c1.199.017 2.359.123 3.491.312l-.134-.019v3.69h-1.892a2.168 2.168 0 00-2.444 2.351l-.001-.009v2.812h4.159l-.665 4.336h-3.494v10.478c7.213-1.174 12.653-7.359 12.654-14.814z" />
    </svg>
  );
}

export function GoogleLogo(props) {
  return (
    <svg viewBox="-0.5 0 48 48" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
        <path
          d="M9.827 24c0-1.524.253-2.986.705-4.356l-7.909-6.04A23.456 23.456 0 00.213 24c0 3.737.868 7.26 2.407 10.388l7.905-6.05A13.885 13.885 0 019.827 24"
          fill="#FBBC05"
          transform="translate(-401 -860) translate(401 860)"
        />
        <path
          d="M23.714 10.133c3.311 0 6.302 1.174 8.652 3.094L39.202 6.4C35.036 2.773 29.695.533 23.714.533a23.43 23.43 0 00-21.09 13.071l7.908 6.04a13.849 13.849 0 0113.182-9.51"
          fill="#EB4335"
          transform="translate(-401 -860) translate(401 860)"
        />
        <path
          d="M23.714 37.867a13.849 13.849 0 01-13.182-9.51l-7.909 6.038a23.43 23.43 0 0021.09 13.072c5.732 0 11.205-2.036 15.312-5.849l-7.507-5.804c-2.118 1.335-4.786 2.053-7.804 2.053"
          fill="#34A853"
          transform="translate(-401 -860) translate(401 860)"
        />
        <path
          d="M46.145 24c0-1.387-.213-2.88-.534-4.267H23.714V28.8h12.604c-.63 3.091-2.346 5.468-4.8 7.014l7.507 5.804c4.314-4.004 7.12-9.969 7.12-17.618"
          fill="#4285F4"
          transform="translate(-401 -860) translate(401 860)"
        />
      </g>
    </svg>
  );
}

export function AppleLogo(props) {
  return (
    <svg viewBox="-1.5 0 20 20" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M57.57 7282.193c.73-.845 1.221-2.022 1.087-3.193-1.05.04-2.322.671-3.075 1.515-.677.749-1.267 1.946-1.108 3.094 1.172.087 2.368-.57 3.097-1.416m2.628 7.432c.03 3.027 2.77 4.034 2.801 4.047-.022.07-.438 1.435-1.444 2.845-.87 1.218-1.774 2.43-3.196 2.457-1.398.025-1.848-.794-3.447-.794-1.597 0-2.097.768-3.42.819-1.373.049-2.42-1.318-3.296-2.532-1.794-2.483-3.164-7.017-1.324-10.077.915-1.52 2.548-2.482 4.321-2.506 1.348-.025 2.621.869 3.445.869.825 0 2.372-1.075 3.998-.917.68.027 2.591.263 3.818 1.984-.1.059-2.28 1.275-2.256 3.805"
        transform="translate(-102 -7439) translate(56 160)"
        fill="#000"
        stroke="none"
        strokeWidth={1}
        fillRule="evenodd"
      />
    </svg>
  );
}

export function PhotoIcon(props) {
  return (
    <svg viewBox="0 -0.5 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fill="#ffffff"
        fillRule="evenodd"
        d="M474.188 259.776h6.655l-3.293-3.293-3.174 3.174a.506.506 0 01-.188.119zm-.188-1.157v-10.843h12v7.193l-2.342-2.342a.504.504 0 00-.752.054l-3.872 3.872-1.115-1.115a.505.505 0 00-.411-.143.51.51 0 00-.333.149L474 258.619zm8.257 1.157H486v-3.399l-.003.003-2.688-2.688-3.568 3.568 2.516 2.516zm4.743-.37l.96.136a1.006 1.006 0 001.138-.857l1.668-11.87a1.006 1.006 0 00-.857-1.137l-11.87-1.668a1.006 1.006 0 00-1.137.857l-.268 1.909h-2.627c-.557 0-1.007.45-1.007 1.007v11.986c0 .557.45 1.007 1.007 1.007h11.986c.557 0 1.007-.45 1.007-1.007v-.362zm0-1.009l1.107.156 1.67-11.884-11.884-1.67-.25 1.777h8.35c.556 0 1.007.45 1.007 1.007v10.614z"
        transform="translate(-473 -244)"
      />
    </svg>
  );
}

export function Notification(props) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="icon line"
      {...props}
    >
      <path
        d="M19.38 14.38a2.12 2.12 0 01.62 1.5h0A2.12 2.12 0 0117.88 18H6.12A2.12 2.12 0 014 15.88h0a2.12 2.12 0 01.62-1.5L6 13V9a6 6 0 016-6h0a6 6 0 016 6v4zM15 18H9a3 3 0 003 3h0a3 3 0 003-3z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  )
}

export function LeftIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.707 4.293a1 1 0 010 1.414L9.414 12l6.293 6.293a1 1 0 01-1.414 1.414l-7-7a1 1 0 010-1.414l7-7a1 1 0 011.414 0z"
        fill="#000"
      />
    </svg>
  )
}

export function LocationIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      xmlSpace="preserve"
      fill="currentColor"
      {...props}
    >
      <path
        fill="currentColor"
        d="M32 0C18.746 0 8 10.746 8 24c0 5.219 1.711 10.008 4.555 13.93.051.094.059.199.117.289l16 24a4.001 4.001 0 006.656 0l16-24c.059-.09.066-.195.117-.289C54.289 34.008 56 29.219 56 24 56 10.746 45.254 0 32 0zm0 32a8 8 0 110-16 8 8 0 010 16z"
      />
    </svg>
  )
}

export function MicIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x={8} y={2} width={8} height={13} rx={4} fill="#222" />
      <path
        d="M5 11a7 7 0 1014 0M12 21v-2"
        stroke="#222"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SettingIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        stroke="currentColor"
        strokeWidth={2}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
        <path d="M2 12.88v-1.76c0-1.04.85-1.9 1.9-1.9 1.81 0 2.55-1.28 1.64-2.85-.52-.9-.21-2.07.7-2.59l1.73-.99c.79-.47 1.81-.19 2.28.6l.11.19c.9 1.57 2.38 1.57 3.29 0l.11-.19c.47-.79 1.49-1.07 2.28-.6l1.73.99c.91.52 1.22 1.69.7 2.59-.91 1.57-.17 2.85 1.64 2.85 1.04 0 1.9.85 1.9 1.9v1.76c0 1.04-.85 1.9-1.9 1.9-1.81 0-2.55 1.28-1.64 2.85.52.91.21 2.07-.7 2.59l-1.73.99c-.79.47-1.81.19-2.28-.6l-.11-.19c-.9-1.57-2.38-1.57-3.29 0l-.11.19c-.47.79-1.49 1.07-2.28.6l-1.73-.99a1.899 1.899 0 01-.7-2.59c.91-1.57.17-2.85-1.64-2.85-1.05 0-1.9-.86-1.9-1.9z" />
      </g>
    </svg>
  )
}


export const CalendarIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const EditIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export const CloseIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export const CameraIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

export function CIcon(props) {

}
