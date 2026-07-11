import KaihoGenerator from "./components/KaihoGenerator";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
              会報<span className="text-blue-600">AI</span>
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">老人クラブ会報 自動作成ツール</p>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <span className="flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</span>情報入力</span>
            <span className="text-gray-200">―</span>
            <span className="flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold">2</span>AI生成</span>
            <span className="text-gray-200">―</span>
            <span className="flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold">3</span>ダウンロード</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <KaihoGenerator />
      </div>
    </main>
  );
}
