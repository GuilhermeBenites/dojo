"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { BELT_OPTIONS } from "@/lib/constants";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface StudentsFilterBarProps {
  initialSearch?: string;
  initialBelt?: string;
  initialActive?: string;
}

export function StudentsFilterBar({
  initialSearch = "",
  initialBelt = "all",
  initialActive = "all",
}: StudentsFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebounce(search, 300);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams],
  );

  // Update URL when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== initialSearch) {
      router.push(`${pathname}?${createQueryString("search", debouncedSearch)}`);
    }
  }, [debouncedSearch, initialSearch, pathname, router, createQueryString]);

  function handleBeltChange(value: string) {
    router.push(`${pathname}?${createQueryString("belt", value)}`);
  }

  function handleActiveChange(value: string) {
    router.push(`${pathname}?${createQueryString("active", value)}`);
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={initialBelt} onValueChange={handleBeltChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Todas as faixas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as faixas</SelectItem>
            {BELT_OPTIONS.map((belt) => (
              <SelectItem key={belt.value} value={belt.value}>
                {belt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={initialActive} onValueChange={handleActiveChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button asChild>
        <Link href="?action=new">+ Novo Aluno</Link>
      </Button>
    </div>
  );
}
