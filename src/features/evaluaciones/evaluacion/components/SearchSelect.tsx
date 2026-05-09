import { useState, useEffect, useRef } from "react";
import { Input } from "@/shared/components/ui/input";
import { ChevronDown, X, User, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchSelectProps<T> {
  items: T[];
  onSelect: (item: T) => void;
  onClear: () => void;
  selectedItem: T | null;
  placeholder: string;
  label: string;
  type: "student" | "company";
  getDisplayValue: (item: T) => string;
  getSubValue?: (item: T) => string;
  filterFn: (item: T, query: string) => boolean;
  disabled?: boolean;
}

export function SearchSelect<T>({
  items,
  onSelect,
  onClear,
  selectedItem,
  placeholder,
  label,
  type,
  getDisplayValue,
  getSubValue,
  filterFn,
  disabled = false,
}: SearchSelectProps<T>) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredItems = items.filter((item) => filterFn(item, query));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: T) => {
    onSelect(item);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full" ref={containerRef}>
      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">
        {label}
      </label>
      <div className="relative">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {type === "student" ? (
              <User className={cn("h-4 w-4", selectedItem ? "text-primary" : "text-muted-foreground")} />
            ) : (
              <Building2 className={cn("h-4 w-4", selectedItem ? "text-primary" : "text-muted-foreground")} />
            )}
          </div>
          <Input
            className={cn(
              "h-10 pl-9 pr-9 text-sm transition-all",
              selectedItem ? "border-primary/50 bg-primary/5 font-medium" : "bg-background"
            )}
            placeholder={placeholder}
            value={selectedItem ? getDisplayValue(selectedItem) : query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            disabled={disabled}
            readOnly={!!selectedItem}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {selectedItem ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                  setQuery("");
                }}
                className="p-1 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground mr-1" />
            )}
          </div>
        </div>

        {isOpen && !selectedItem && !disabled && (
          <div className="absolute z-50 w-full mt-1.5 bg-popover border border-border rounded-xl shadow-xl max-h-60 overflow-auto animate-in fade-in slide-in-from-top-2 duration-200">
            {filteredItems.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">No se encontraron resultados</p>
              </div>
            ) : (
              <div className="p-1.5 space-y-0.5">
                {filteredItems.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full text-left px-3 py-2.5 text-sm hover:bg-accent rounded-lg transition-colors flex flex-col gap-0.5 group"
                    onClick={() => handleSelect(item)}
                  >
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {getDisplayValue(item)}
                    </span>
                    {getSubValue && (
                      <span className="text-xs text-muted-foreground">
                        {getSubValue(item)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
