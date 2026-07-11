import KaihoGenerator from "./components/KaihoGenerator";

export default function Home() {
  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm text-blue-600 font-medium mb-4 shadow-sm border border-blue-100">
            AI会報作成ツール
          </div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">
            会報<span className="text-blue-600">AI</span>
          </h1>
          <p className="text-gray-500 text-base">
            必要な情報を入力するだけで、クラブ会報をかんたん自動生成
          </p>
        </div>
        <KaihoGenerator />
      </div>
    </main>
  );
}
