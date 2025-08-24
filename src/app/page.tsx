import NewsList from "@/components/NewsList";

export default function Home() {
  return (
      <main>
        <h1 className="text-3xl font-bold text-center my-6">
          📰 Македонски Новости
        </h1>
        <NewsList />
      </main>
  );
}
