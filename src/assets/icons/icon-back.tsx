interface IconProp {
  fill?: string;
}
function IconBack({ fill }: IconProp) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10.403"
      height="20.832"
      viewBox="0 0 10.403 20.832"
    >
      <path
        id="Caminho_57"
        data-name="Caminho 57"
        d="M20.4,28.4a1.478,1.478,0,0,1-.951-.342l-8.911-7.426a1.487,1.487,0,0,1,1.9-2.287L20.4,24.994l7.961-6.416a1.485,1.485,0,0,1,1.092-.327,1.523,1.523,0,0,1,.795,2.718l-8.911,7.174A1.489,1.489,0,0,1,20.4,28.4Z"
        transform="translate(28.399 -9.996) rotate(90)"
        fill={fill || "#181a18"}
      />
    </svg>
  );
}

export default IconBack;
