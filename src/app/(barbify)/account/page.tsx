import UsersList from "@/components/UserList";

export default function Page() {
  return (
    <div className="">
      <h1 className="text-xl font-bold mb-4 p-4">Tu Cuenta</h1>
      <p className="text-muted-foreground mb-6 px-4">
        Ve la información de la cuenta asociada a tu usuario.
      </p>
      <UsersList />
    </div>
  );
}
