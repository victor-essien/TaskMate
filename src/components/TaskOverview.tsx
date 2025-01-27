const TaskOverview: React.FC = () => {
  const tasks = [
    { title: "Personal", count: 6, bgColor: "bg-purple", icon: "📱" },
    { title: "Work", count: 12, bgColor: "bg-yellow", icon: "🖌️" },
    { title: "School", count: 5, bgColor: "bg-green", icon: "🌐" },
  ];

  return (
    <div className="px-4 pb-32 lg:pb-7">
      <h2 className="text-xl font-semibold mb-4 text-form">
        Browse through Categories
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {tasks.map((task, index) => (
          <div
            key={index}
            className={`flex flex-col items-start justify-center p-4  ${task.bgColor} rounded-xl text-[#050404] shadow-md space-y-2`}
          >
            <span className="text-3xl">{task.icon}</span>
            <h3 className="text-lg font-bold">{task.title}</h3>
            <p className="text-lg font-medium">{task.count} Tasks</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskOverview;
