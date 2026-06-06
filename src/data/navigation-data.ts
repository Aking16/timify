import {
  Analytics01Icon,
  CalendarIcon,
  ClockIcon,
  FolderIcon,
  HomeIcon,
  Hourglass,
  TagIcon,
  TimerIcon,
} from "@hugeicons/core-free-icons";

export const sidebarNavItems = [
  {
    label: "عمومی",
    items: [
      { title: "داشبورد", icon: HomeIcon, href: "/app", badge: null },
      { title: "زمان‌ها", icon: ClockIcon, href: "#", badge: null },
    ],
  },
  {
    label: "پروژه‌ها",
    items: [
      { title: "همه پروژه‌ها", icon: FolderIcon, href: "/app/projects", badge: null },
      { title: "تقویم", icon: CalendarIcon, href: "#", badge: null },
      { title: "گزارش‌ها", icon: Analytics01Icon, href: "/app/reports", badge: null },
    ],
  },
  {
    label: "ابزارها",
    items: [
      { title: "زمان‌‌‌ سنج", icon: TimerIcon, href: "/app/timer", badge: null },
      { title: "شمارش معکوس", icon: Hourglass, href: "/app/countdown", badge: null },
    ],
  },
];

export const bottomNavItems = [
  { title: "داشبورد", icon: HomeIcon, href: "/app" },
  { title: "همه پروژه‌ها", icon: FolderIcon, href: "/app/projects" },
  { title: "گزارش‌ها", icon: TimerIcon, href: "/app/reports" },
  { title: "برچسب‌ها", icon: TagIcon, href: "/app/tags" },
];
