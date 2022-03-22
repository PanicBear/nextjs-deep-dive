import Link from "next/link";

interface FloatingProps {
  children: React.ReactNode;
  href: string;
}

export default function FloatingButton({ children, href }: FloatingProps) {
  return (
    <Link href={href}>
      <a className="fixed hover:bg-orange-500 transition-colors cursor-pointer bottom-24 right-5 shadow-xl bg-orange-400 rounded-full p-4 text-white">
        {children}
      </a>
    </Link>
  );
}
