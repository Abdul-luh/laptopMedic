import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Logo (){
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const logoSizeClass = isAuthPage ? 'w-24 h-24' : 'w-16 h-16';

  return (
    <Link
      href="/"
      className="flex items-center space-x-2 text-decoration-none"
    >
      <Image height={500} width={500} src="/laptop-medic-logo.svg" alt="Logo" className={logoSizeClass}/>
    </Link>
  );
}