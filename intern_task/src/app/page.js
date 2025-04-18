import Image from "next/image";
import Event from "./components/Event";

export default function Home() {
  return (
    <div>
      <Event event={{title:"Hello", description:"This is the new description"}}/>
    </div>
  );
}
