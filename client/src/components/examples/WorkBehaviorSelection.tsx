import WorkBehaviorSelection from "../WorkBehaviorSelection";

export default function WorkBehaviorSelectionExample() {
  const categories = [
    {
      id: "1",
      category: "Arbeitstempo",
      choices: ["zügig", "angemessen", "langsam", "unregelmäßig"],
    },
    {
      id: "2",
      category: "Arbeitsqualität",
      choices: ["sorgfältig", "genau", "ungenau", "nachlässig"],
    },
    {
      id: "3",
      category: "Selbstständigkeit",
      choices: ["eigenständig", "mit Anleitung", "mit Unterstützung", "unselbstständig"],
    },
  ];

  return (
    <div className="p-6 max-w-4xl">
      <WorkBehaviorSelection
        categories={categories}
        onGenerateText={(selections) => {
          console.log("Generated text with selections:", selections);
        }}
      />
    </div>
  );
}
