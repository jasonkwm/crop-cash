import { useGlobalState } from "../context/GlobalStateProvider";

export default function Home() {
  const { employee, setEmployee } = useGlobalState();
  return (
    <>
      <h1 className="">{employee}</h1>
      <button onClick={() => (employee === "Potato" ? setEmployee("Tomato") : setEmployee("Potato"))}>
        set employee
      </button>
    </>
  );
}
