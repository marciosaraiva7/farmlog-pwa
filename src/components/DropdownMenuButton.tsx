import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { FaBars } from "react-icons/fa6";

type DropdownMenuButtonProps = {
  label: string;
  items: { id: string; label: string }[];
  onSelect?: (id: string) => void; // Callback opcional ao selecionar um item
};

export function DropdownMenuButton({
  label,
  items,
  onSelect,
}: DropdownMenuButtonProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>("ndvi");

  const handleSelect = (id: string) => {
    setSelectedItem(id);
    if (onSelect) {
      onSelect(id); // Chama o callback, se fornecido
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-lg" asChild>
        <Button className="flex h-[60px] w-[60px] items-center justify-center p-0 focus-visible:outline-none  focus-within:outline-none bg-[#181A18CC] rounded-[15px] border-none outline-none">
          <FaBars width={50} height={40} fill="white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-[50px] bg-white border-none rounded-[20px] text-black p-[20px]">
        <DropdownMenuLabel className="text-[12px] leading-[16px] font-normal text-[#181A1880]">
          {label}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {items.map((item) => (
            <DropdownMenuItem
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className="flex items-center gap-2"
            >
              <div
                className={`w-[10px] h-[10px] rounded-full ${
                  selectedItem === item.id ? "bg-[#EAC00F]" : "bg-transparent"
                }`}
              ></div>
              <span className="text-[20px] leading-[26px] text-[#181A18]">
                {item.label}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
