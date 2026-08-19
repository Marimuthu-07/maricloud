const paths = {
  cloud: <path d="M6.5 18.5h10.7a4.3 4.3 0 0 0 .5-8.6A6.2 6.2 0 0 0 6 8.3a5.1 5.1 0 0 0 .5 10.2Z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  files: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H10l2 2.5h5.5A2.5 2.5 0 0 1 20 8v8.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-11Z" /><path d="M4 9h16" /></>,
  clock: <><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3.5 2" /></>,
  star: <path d="m12 3 2.75 5.58 6.16.9-4.46 4.35 1.05 6.14L12 17.08l-5.5 2.89 1.05-6.14L3.1 9.48l6.15-.9L12 3Z" />,
  trash: <><path d="M4.5 7h15M9.5 3h5l1 4h-7l1-4ZM7 7l.8 13h8.4L17 7" /><path d="M10 11v5M14 11v5" /></>,
  search: <><circle cx="10.8" cy="10.8" r="5.8" /><path d="m15.2 15.2 4 4" /></>,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  chevronLeft: <path d="m15 18-6-6 6-6" />,
  upload: <><path d="M12 15V3M7.5 7.5 12 3l4.5 4.5" /><path d="M5 14v4a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-4" /></>,
  download: <><path d="M12 3v12M7.5 10.5 12 15l4.5-4.5" /><path d="M5 20h14" /></>,
  folder: <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2.5h6.5A2.5 2.5 0 0 1 21 10v7.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-10Z" />,
  file: <><path d="M6 3h7l5 5v13H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M13 3v5h5" /></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m4 17 5-5 3.5 3.5 2.5-2.5 5 4" /></>,
  more: <><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /></>,
  close: <path d="m6 6 12 12M18 6 6 18" />,
}

function Icon({ name, size = 20, strokeWidth = 1.8 }) {
  return <svg aria-hidden="true" className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

export default Icon
