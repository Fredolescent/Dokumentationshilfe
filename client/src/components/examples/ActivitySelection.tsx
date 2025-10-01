import ActivitySelection from "../ActivitySelection";

export default function ActivitySelectionExample() {
  const areas = [
    { id: "1", name: "Klosterperson" },
    { id: "2", name: "Werkstatt" },
  ];

  const activities = [
    {
      id: "1",
      areaId: "1",
      title: "Materialvorbereitung",
      description: "Legt eigenständig Material auf das Förderband zur Einschweißung.",
      measure: "GL überprüft die Richtigkeit der Charge.",
    },
    {
      id: "2",
      areaId: "1",
      title: "Materialverteilung",
      description: "Übernimmt die Verteilung der fertig verschweißten Packungen.",
      measure: "GL kontrolliert stichprobenartig die Gleichmäßigkeit.",
    },
  ];

  return (
    <div className="p-6 max-w-4xl">
      <ActivitySelection
        areas={areas}
        activities={activities}
        onGenerateText={(activity) => {
          console.log("Generated text for activity:", activity);
        }}
      />
    </div>
  );
}
