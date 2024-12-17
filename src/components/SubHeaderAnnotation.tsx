import { useState } from "react";
import { FaEdit, FaEllipsisV, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface headerProps {
  idAnnotation: string;
  available: number;
  date: string;
  hour: string;
  onAnnotationDeleted: (id: string) => void; // Callback para atualizar a lista
}

const SubHeaderAnnotation = ({
  idAnnotation,
  available,
  date,
  hour,
  onAnnotationDeleted,
}: headerProps) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAnnotation = async (idAnnotation: string) => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `https://farmlog-api.wr-agro.dev.br:3003/api/deleteAnnotation/${idAnnotation}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        // Remove a anotação do localStorage
        const annotations = JSON.parse(
          localStorage.getItem("annotations") || "[]",
        );
        const updatedAnnotations = annotations.filter(
          (annotation: { id: string }) => annotation.id !== idAnnotation,
        );
        localStorage.setItem("annotations", JSON.stringify(updatedAnnotations));

        // Chama a função de callback para atualizar a lista
        onAnnotationDeleted(idAnnotation);
      } else {
        alert("Erro ao deletar a anotação");
      }
    } catch (error) {
      console.error("Erro ao deletar a anotação:", error);
      alert("Erro ao deletar a anotação");
    } finally {
      setIsDeleting(false);
    }
  };

  const dropdownItems = [
    {
      icon: <FaEdit fill="#EAC00F" size={20} />,
      name: "Editar",
      onClick: () =>
        navigate(`/register?idAnnotation=${encodeURIComponent(idAnnotation)}`), // Adiciona o ID como parâmetro na URL
    },
    {
      icon: <FaTrash fill="#EAC00F" size={20} />,
      name: "Apagar",
      onClick: () => handleDeleteAnnotation(idAnnotation),
    },
  ];

  return (
    <div className="w-full h-[3rem] bg-white flex justify-between items-center ">
      <div className="flex">
        <p className="font-bold mr-1">Avaliação {available} - </p>{" "}
        <p className="font-light">
          {date},{hour}
        </p>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex p-0 items-center m-0 justify-between shadow-none focus-visible:outline-none focus-within:outline-none text-[#181A1880] bg-white rounded-[5px] border-none outline-none text-[18px] leading-[24px] font-normal">
              <FaEllipsisV fill="#000000" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full bg-white border-none rounded-[20px] text-black p-3">
            {dropdownItems?.map((item) => (
              <DropdownMenuItem
                className="text-[20px] leading-[26px] text-[#181A18] flex gap-2 "
                key={item.name}
                onClick={item.onClick}
              >
                {item.icon}
                <span>{item.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SubHeaderAnnotation;
