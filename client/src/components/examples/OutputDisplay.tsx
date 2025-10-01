import OutputDisplay from "../OutputDisplay";

export default function OutputDisplayExample() {
  const sampleContent = `Arbeitsverhalten:
- Arbeitstempo: zügig
- Arbeitsqualität: sorgfältig
- Selbstständigkeit: eigenständig

Die beschäftigte Person arbeitet zügig und sorgfältig. Sie zeigt ein hohes Maß an Eigenständigkeit.`;

  return (
    <div className="p-6 max-w-2xl">
      <OutputDisplay
        content={sampleContent}
        onCopy={() => console.log("Content copied to clipboard")}
      />
    </div>
  );
}
