import List from "../components/List";

const Jobs = () => {
  return (
    <main className="bg-slate-100 min-h-screen flex justify-center items-center">
      <div className="bg-black text-white p-4 w-full max-w-6xl rounded-md shadow-lg">
        <List />
      </div>
    </main>
  );
};

export default Jobs;
