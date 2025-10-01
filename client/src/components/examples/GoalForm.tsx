import GoalForm from "../GoalForm";

export default function GoalFormExample() {
  return (
    <div className="p-6 max-w-2xl">
      <GoalForm
        onSubmit={(data) => {
          console.log("Goal submitted:", data);
        }}
        onCancel={() => {
          console.log("Form cancelled");
        }}
      />
    </div>
  );
}
