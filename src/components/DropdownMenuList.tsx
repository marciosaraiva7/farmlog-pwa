import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListControlProps } from "@/types/schema";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface DropdownMenuListProps {
  list?: ListControlProps[];
}

export function DropdownMenuList({ list }: DropdownMenuListProps) {
  const [selected, setSelected] = useState<string>("");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex w-[50%] items-center justify-between focus-visible:outline-none focus-within:outline-none text-[#181A1880] bg-white rounded-[5px] border-none outline-none text-[18px] leading-[24px] font-normal">
          {selected == "" ? "Selecione" : selected}
          <ChevronDown color="#000000" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-[50px] bg-white border-none rounded-[20px] text-black p-3">
        <DropdownMenuItem key={"default"} onClick={() => setSelected("")}>
          <span>Nenhum</span>
        </DropdownMenuItem>
        {list?.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onClick={() => setSelected(item.name)}
          >
            <span>{item.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
