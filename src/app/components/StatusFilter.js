export default function StatusFilter({ filter, setFilter }) {
  const baseStyle = "px-4 py-2 w-32 text-center rounded transition text-white";
  const active = "bg-emerald-600";
  const inactive = "bg-gray-700 hover:bg-emerald-600";

  return (
    <div className="sm: gap-2 flex-wrap">
      <button
        onClick={() => setFilter("notCompleted")}
        className={`${baseStyle} ${filter === "notCompleted" ? active : inactive}`}
      >
        ❌
      </button>
      <button
        onClick={() => setFilter("completed")}
        className={`${baseStyle} ${filter === "completed" ? active : inactive}`}
      >
        ✅
      </button>
      <button
        onClick={() => setFilter("all")}
        className={`${baseStyle} ${filter === "all" ? active : inactive}`}
      >
        All
      </button>
    </div>
  );
}
