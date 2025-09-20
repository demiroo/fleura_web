"use client";

import { Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export function SearchModal() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setOpen(false);
    }
  };

  const popularSearches = [
    { term: "Red Roses", icon: "🌹", description: "Classic romantic roses" },
    { term: "Wedding Bouquets", icon: "💐", description: "Perfect for special days" }, 
    { term: "Birthday Flowers", icon: "🎂", description: "Celebrate with flowers" },
    { term: "Indoor Plants", icon: "🪴", description: "Green your space" },
    { term: "Seasonal Arrangements", icon: "🌸", description: "Fresh seasonal picks" },
    { term: "Gift Bouquets", icon: "🎁", description: "Perfect presents" }
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative border-none">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search flowers</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Search className="h-4 w-4 text-primary" />
            </div>
            <DialogTitle className="text-xl font-semibold">Discover Beautiful Flowers</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            Find the perfect flowers for every occasion
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 pb-4">
          <Command className="rounded-lg border border-border bg-background">
            <CommandInput 
              placeholder="Search for bouquets, plants, occasions..." 
              className="h-12 border-none text-base focus:ring-0 focus:ring-offset-0 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const query = (e.target as HTMLInputElement).value;
                  handleSearch(query);
                }
              }}
            />
            <Separator />
            <CommandList className="max-h-[320px] p-2">
              <CommandEmpty>
                <div className="text-center py-8">
                  <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium mb-1">No results found</p>
                  <p className="text-xs text-muted-foreground">
                    Try searching for roses, bouquets, or plants
                  </p>
                </div>
              </CommandEmpty>
              <CommandGroup heading="🌟 Popular Searches">
                <div className="grid gap-1 mt-2">
                  {popularSearches.map((search) => (
                    <CommandItem
                      key={search.term}
                      onSelect={() => handleSearch(search.term)}
                      className="cursor-pointer rounded-md px-3 py-3 hover:bg-accent"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <span className="text-lg">{search.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{search.term}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {search.description}
                          </p>
                        </div>
                        <Sparkles className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </CommandItem>
                  ))}
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
        
        <div className="px-6 py-4 bg-muted/30 rounded-b-lg">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>💡 Tip: Try searching by color, occasion, or flower type</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">↵</span>
            </kbd>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
