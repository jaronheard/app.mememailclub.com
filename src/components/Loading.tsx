const Loading = ({
  message,
  children,
}: {
  message?: string;
  children?: JSX.Element;
}): JSX.Element => (
  <main className="h-[80vh]">
    <div className="flex h-full flex-col items-center justify-center">
      {message && (
        <p className="mt-6 text-lg leading-8 text-gray-600">{message}</p>
      )}
      {children}
    </div>
  </main>
);

export default Loading;
