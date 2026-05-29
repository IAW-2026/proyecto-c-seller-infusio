interface Props {
  message: string;
}

export default function ErrorAlert({ message }: Props) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  );
}
