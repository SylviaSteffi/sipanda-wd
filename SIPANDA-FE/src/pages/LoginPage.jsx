import { useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { dummyUsers } from "../data/dummyUsers";

import FormCard from "../components/ui/FormCard";
import TextField from "../components/ui/TextField";
import PasswordField from "../components/ui/PasswordField";
import Button from "../components/ui/Button";
import axios from "axios";

function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

function normalizeEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function getLoginUsers(users = []) {
  return users.filter((user) => user.email && user.password && user.role);
}

function getDisplayedDemoAccounts(users = []) {
  const preferredEmails = ["admin@sipanda.test", "dosen@sipanda.test"];

  return preferredEmails
    .map((email) =>
      users.find(
        (user) => normalizeEmail(user.email) === normalizeEmail(email),
      ),
    )
    .filter(Boolean);
}

function LoginPage() {
  // const navigate = useNavigate();
  const { login } = useAuth();

  const loginUsers = useMemo(() => getLoginUsers(dummyUsers), []);
  const displayedDemoAccounts = useMemo(
    () => getDisplayedDemoAccounts(loginUsers),
    [loginUsers],
  );

  const [errors, setErrors] = useState({ email: "", password: "" });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    const formData = new FormData(event.currentTarget);
    const email = normalizeEmail(formData.get("email"));
    const password = String(formData.get("password") || "");

    const nextErrors = { email: "", password: "" };

    if (!email) {
      nextErrors.email = "Email wajib diisi.";
    } else if (!isValidEmail(email)) {
      nextErrors.email = "Format email tidak valid.";
    }

    if (!password) {
      nextErrors.password = "Password wajib diisi.";
    } else if (password.length < 6) {
      nextErrors.password = "Password minimal 6 karakter.";
    }

    if (nextErrors.email || nextErrors.password) {
      setErrors(nextErrors);
      return;
    }

    setErrors({ email: "", password: "" });
    setIsSubmitting(true);

    try {
      if (import.meta.env.VITE_AUTH_MODE === "demo") {
        const user = loginUsers.find(
          (item) =>
            normalizeEmail(item.email) === email && item.password === password,
        );
        if (!user) {
          setFormError("Email atau password salah.");
          return; // finally will still run
        }
        login({
          token: "dummy-token",
          role: user.role,
          userId: user.id,
          userEmail: user.email,
        });
      } else if (import.meta.env.VITE_AUTH_MODE === "api") {
        const res = await axios({
          url: "/api/auth/login",
          method: "POST",
          data: { email, password },
        });
        login({
          token: res.data?.token,
          role: res.data?.user?.role?.toUpperCase(),
          userId: res.data?.user?.id,
          userEmail: res.data?.user?.email,
        });
      }

      window.location.href = "/";
    } catch {
      setFormError("Email atau password salah.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-center p-6 py-12">
      <FormCard
        title="Selamat datang!"
        subtitle="Silakan masukkan email dan password Anda."
        onSubmit={handleSubmit}
      >
        <div className="space-y-1">
          <TextField
            label="Email"
            name="email"
            placeholder="Masukkan email Anda"
            type="email"
          />
          {errors.email ? (
            <p className="text-body-xxs-regular text-error-100">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="space-y-1">
          <PasswordField
            label="Password"
            name="password"
            placeholder="Masukkan password Anda"
          />
          {errors.password ? (
            <p className="text-body-xxs-regular text-error-100">
              {errors.password}
            </p>
          ) : null}
          {formError ? (
            <p className="text-body-xxs-regular text-error-100">{formError}</p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Memproses..." : "Login"}
        </Button>

        <div className="mt-2 text-body-xxs-regular text-black-80">
          <p>Akun dummy:</p>
          {displayedDemoAccounts.map((user) => (
            <p key={user.id}>
              • {user.email} / {user.password}
            </p>
          ))}
        </div>
      </FormCard>
    </div>
  );
}

export default LoginPage;
