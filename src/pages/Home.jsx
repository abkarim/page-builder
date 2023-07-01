import NavContainer from '@/components/NavContainer';

export default function Home() {
  return (
    <main className="p-2 flex gap-2">
      <NavContainer
        icon="&#43;"
        text="Create new page"
        navigateTo="/create-new-page"
      />
    </main>
  );
}
