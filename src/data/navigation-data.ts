import {
  CalendarIcon,
  ClockIcon,
  FolderIcon,
  HomeIcon,
  TagIcon,
  TimerIcon,
} from "@hugeicons/core-free-icons";

export const sidebarNavItems = [
  {
    label: "عمومی",
    items: [
      { title: "داشبورد", icon: HomeIcon, href: "/", badge: null },
      { title: "زمان‌ها", icon: ClockIcon, href: "#", badge: null },
    ],
  },
  {
    label: "پروژه‌ها",
    items: [
      { title: "همه پروژه‌ها", icon: FolderIcon, href: "/projects", badge: null },
      { title: "تقویم", icon: CalendarIcon, href: "#", badge: null },
      { title: "گزارش‌ها", icon: TimerIcon, href: "/reports", badge: null },
    ],
  },
];

export const bottomNavItems = [
  { title: "داشبورد", icon: HomeIcon, href: "/" },
  { title: "همه پروژه‌ها", icon: FolderIcon, href: "/projects" },
  { title: "گزارش‌ها", icon: TimerIcon, href: "/reports" },
  { title: "برچسب‌ها", icon: TagIcon, href: "/tags" },
];
