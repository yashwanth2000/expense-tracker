import Logo from "../../components/Logo";
import ThemeSwitcherBtn from "@/components/ThemeSwitcherBtn";
import Link from "next/link";

function Header() {
  return (
    <div className="p-5 flex items-center justify-between shadow-md dark:shadow-md">
      <Logo />
      <div className="flex items-center space-x-4">
        <ThemeSwitcherBtn />
        <Link
          href="/sign-up"
          className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium
  transition-all duration-200 ease-in-out transform hover:scale-105
  bg-primary text-white dark:text-black hover:bg-primary/90 shadow-lg
  hover:shadow-primary/50 dark:bg-primary dark:hover:bg-primary/90
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
  focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default Header;
