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
  onSelect?: (id: string) => void; // Callback para retornar o ID do item selecionado
}

export function DropdownMenuList({ list, onSelect }: DropdownMenuListProps) {
  const [selected, setSelected] = useState<string>("");

  const handleSelect = (id: string, name: string) => {
    setSelected(name); // Define o texto exibido no botão
    if (onSelect) {
      onSelect(id); // Retorna o ID do item selecionado ao callback
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex w-[50%] items-center justify-between focus-visible:outline-none focus-within:outline-none text-[#181A1880] bg-white rounded-[5px] border-none outline-none text-[18px] leading-[24px] font-normal">
          {selected === "" ? "Selecione" : selected}
          <ChevronDown color="#000000" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-[50px] bg-white border-none rounded-[20px] text-black p-3">
        <DropdownMenuItem
          key={"default"}
          onClick={() => handleSelect("", "Nenhum")}
        >
          <span>Nenhum</span>
        </DropdownMenuItem>
        {list?.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onClick={() => handleSelect(item.id, item.name)}
          >
            <span>{item.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
