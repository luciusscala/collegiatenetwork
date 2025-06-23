interface WelcomeHeaderProps {
  username: string;
}

export default function WelcomeHeader({ username }: WelcomeHeaderProps) {
  return (
    <header className="mb-4">
      <h1 className="text-2xl md:text-3xl font-semibold">
        Welcome back, <span className="text-primary">{username}</span>
      </h1>
    </header>
  );
}