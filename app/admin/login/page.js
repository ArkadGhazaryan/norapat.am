import { redirect } from "next/navigation";
import { isAdminSession, setAdminSession } from "@/lib/auth";

async function login(formData) {
  "use server";
  const password = formData.get("password");
  if (password === (process.env.ADMIN_PASSWORD || "admin123")) {
    await setAdminSession();
    redirect("/admin");
  }
  redirect("/admin/login?error=1");
}

export default async function AdminLoginPage({ searchParams }) {
  if (await isAdminSession()) {
    redirect("/admin");
  }

  const params = (await searchParams) ?? {};

  return (
    <main className="page-shell auth-page">
      <form className="form-grid auth-form" action={login}>
        <p className="eyebrow">Админ</p>
        <h1>Вход в админ-панель</h1>
        {params.error ? <p className="form-error">Неверный пароль</p> : null}
        <label>
          Пароль
          <input name="password" type="password" required placeholder="admin123" />
        </label>
        <button className="primary-button" type="submit">Войти</button>
      </form>
    </main>
  );
}
