"use client";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const HomePage = () => {
  const [count, setCount] = useLocalStorage("count", 0);
  return (
    <div className="max-w-2xl mx-auto my-10">
      <header className="text-5xl font-bold mb-3">Home Page</header>
      <Separator />
      <header className="text-2xl font-semibold my-6">Count: {count}</header>

      <div className="flex items-center justify-center gap-2">
        <Button onClick={() => setCount((prev) => prev + 1)}>Increment</Button>
        <Button onClick={() => setCount((prev) => prev - 1)}>Decrement</Button>
        <Button onClick={() => setCount(0)}>Reset</Button>
      </div>
    </div>
  );
};

export default HomePage;
