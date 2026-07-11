import KaihoGenerator from "./components/KaihoGenerator";

export default function Home() {
  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-2">
          会報AI
        </h1>
        <p className="text-center text-[var(--text-sub)] mb-8">
          必要な情報を入力するだけで、クラブ会報を自動生成
        </p>
        <KaihoGenerator />
      </div>
    </main>
  );
}
