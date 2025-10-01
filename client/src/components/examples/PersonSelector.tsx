import { useState } from "react";
import PersonSelector from "../PersonSelector";

export default function PersonSelectorExample() {
  const [persons, setPersons] = useState([
    { id: "1", name: "Max Mustermann" },
    { id: "2", name: "Anna Schmidt" },
    { id: "3", name: "Thomas Weber" },
    { id: "4", name: "Lisa Müller" },
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleAddPerson = (name: string) => {
    const newPerson = { id: String(persons.length + 1), name };
    setPersons([...persons, newPerson]);
    console.log("Person added:", name);
  };

  return (
    <div className="p-6 max-w-6xl">
      <PersonSelector
        persons={persons}
        selectedPersonId={selectedId}
        onSelectPerson={(id) => {
          setSelectedId(id);
          console.log("Selected person:", id);
        }}
        onAddPerson={handleAddPerson}
      />
    </div>
  );
}
