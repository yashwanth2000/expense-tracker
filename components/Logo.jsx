import { PiggyBank } from "lucide-react";

function Logo() {
  return (
    <div className="flex items-center gap-3 group">
      <PiggyBank
        className="h-12 w-12 transition-all duration-300 ease-out
        stroke-[#8B5CF6] dark:stroke-[#A78BFA]
        group-hover:stroke-[#7C3AED] dark:group-hover:stroke-[#8B5CF6]
        stroke-[1.5] cursor-pointer
        transform group-hover:scale-110
        drop-shadow-[0_0_8px_rgba(139,92,246,0.2)]
        dark:drop-shadow-[0_0_8px_rgba(167,139,250,0.2)]"
      />

      <p
        className="text-3xl font-bold tracking-tight cursor-pointer
        bg-[linear-gradient(to_right,#8B5CF6,#7C3AED,#6D28D9)]
        dark:bg-[linear-gradient(to_right,#A78BFA,#8B5CF6,#7C3AED)]
        bg-clip-text text-transparent
        transition-all duration-300 ease-in-out
        hover:bg-[linear-gradient(to_right,#7C3AED,#6D28D9,#8B5CF6)]
        dark:hover:bg-[linear-gradient(to_right,#8B5CF6,#7C3AED,#A78BFA)]
        drop-shadow-[0_0_8px_rgba(139,92,246,0.2)]
        dark:drop-shadow-[0_0_8px_rgba(167,139,250,0.2)]"
      >
        Expense Tracker
      </p>
    </div>
  );
}

export function LogoMobile() {
  return (
    <div className="flex items-center gap-3 group">
      <p
        className="text-3xl font-bold tracking-tight cursor-pointer
        bg-[linear-gradient(to_right,#8B5CF6,#7C3AED,#6D28D9)]
        dark:bg-[linear-gradient(to_right,#A78BFA,#8B5CF6,#7C3AED)]
        bg-clip-text text-transparent
        transition-all duration-300 ease-in-out
        hover:bg-[linear-gradient(to_right,#7C3AED,#6D28D9,#8B5CF6)]
        dark:hover:bg-[linear-gradient(to_right,#8B5CF6,#7C3AED,#A78BFA)]
        drop-shadow-[0_0_8px_rgba(139,92,246,0.2)]
        dark:drop-shadow-[0_0_8px_rgba(167,139,250,0.2)]"
      >
        Expense Tracker
      </p>
    </div>
  );
}

export default Logo;
