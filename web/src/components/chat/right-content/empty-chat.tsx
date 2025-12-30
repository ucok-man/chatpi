export default function EmptyChat() {
  return (
    <div className="size-full flex flex-col items-center justify-center">
      <div className="w-[400px] h-[200px] mb-9">
        <img
          className="object-center object-cover size-full"
          src="/empty-chat.png"
          alt="Start Chat"
        />
      </div>

      <h3 className="text-4xl font-medium mb-6">ChatApp</h3>

      <p className="text-center text-sm text-muted-foreground leading-relaxed">
        Send and receive messages without keeping your phone online.
        <br />
        Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
      </p>
    </div>
  );
}
