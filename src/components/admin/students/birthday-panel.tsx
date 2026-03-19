"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronDown, ChevronUp, Gift } from "lucide-react";
import type { StudentRow } from "@/types/database";
import { BELT_OPTIONS } from "@/lib/constants";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BirthdayPanelProps {
  birthdays: StudentRow[];
}

export function BirthdayPanel({ birthdays }: BirthdayPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getBeltLabel = (beltValue: string) => {
    return (
      BELT_OPTIONS.find((b) => b.value === beltValue)?.label || beltValue
    );
  };

  const currentMonthName = format(new Date(), "MMMM", { locale: ptBR });
  const displayCount = isExpanded ? birthdays.length : Math.min(5, birthdays.length);
  const visibleBirthdays = birthdays.slice(0, displayCount);

  return (
    <Card className="bg-muted/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Gift className="h-5 w-5 text-primary" />
          Aniversariantes do mês ({birthdays.length})
        </CardTitle>
        {birthdays.length > 5 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 px-2 text-xs"
          >
            {isExpanded ? (
              <>
                Ocultar <ChevronUp className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                Ver todos <ChevronDown className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {birthdays.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum aniversariante em {currentMonthName}.
          </p>
        ) : (
          <div className="space-y-2">
            {visibleBirthdays.map((student) => {
              const birthDate = new Date(student.birth_date!);
              // Add timezone offset to prevent day shifting
              const adjustedDate = new Date(
                birthDate.getTime() + birthDate.getTimezoneOffset() * 60000,
              );
              
              return (
                <div
                  key={student.id}
                  className="flex items-center justify-between rounded-md bg-background px-4 py-2 text-sm shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{student.name}</span>
                    <Badge variant="outline" className="hidden sm:inline-flex">
                      {getBeltLabel(student.belt)}
                    </Badge>
                  </div>
                  <span className="text-muted-foreground">
                    {format(adjustedDate, "dd/MM")}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
