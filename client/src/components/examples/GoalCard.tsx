import GoalCard from "../GoalCard";

export default function GoalCardExample() {
  const goal = {
    id: "1",
    title: "Verbesserung der Konzentration",
    description: "Kann sich 30 Minuten am Stück auf eine Aufgabe konzentrieren ohne Ablenkung.",
    measure: "GL bietet strukturierte Arbeitsumgebung. Regelmäßige kurze Pausen nach 25 Minuten.",
    dueDate: "2025-10-15",
    status: "open",
  };

  return (
    <div className="p-6 max-w-2xl">
      <GoalCard
        goal={goal}
        onEdit={(g) => console.log("Edit goal:", g)}
        onDelete={(id) => console.log("Delete goal:", id)}
        onToggleStatus={(id) => console.log("Toggle status:", id)}
        onCopy={(text, label) => console.log(`Copied ${label}:`, text)}
      />
    </div>
  );
}
