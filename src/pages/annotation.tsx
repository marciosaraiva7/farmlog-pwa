import { useAuth } from "../context/auth";
function Annotation() {
  const { logout } = useAuth();
  return (
    <div>
      <p>Anotacoes</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
}

export default Annotation;
