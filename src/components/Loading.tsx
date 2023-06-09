const Loading = ({ message }: { message?: string }): JSX.Element => (
  <main className="h-screen">
    <div className="flex h-full flex-col items-center justify-center">
      {message && (
        <p className="mt-6 text-lg leading-8 text-gray-600">{message}</p>
      )}
    </div>
  </main>
);

export default Loading;
