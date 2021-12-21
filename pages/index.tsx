import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();
  return (
    <div>
      <div>This is the home page!</div>
      <button
        style={{ padding: 6, border: '1px solid lightgrey', borderRadius: 3 }}
        onClick={() => router.replace('/secret')}
      >
        Login
      </button>
    </div>
  );
}
