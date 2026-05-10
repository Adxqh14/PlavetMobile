import { ModeToggle } from "../../main/components/mode-toggle";

export const Header = () => {
  return (
    <header className="flex justify-end items-center px-6 py-4 absolute top-0 w-full z-50">
      <div className="flex items-center gap-4">
        <ModeToggle />
      </div>
    </header>
  );
};
