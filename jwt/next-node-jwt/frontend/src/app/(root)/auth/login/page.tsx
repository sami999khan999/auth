"use client";

import AuthForm from "@/components/ui/AuthForm";
import useResponse from "@/hooks/useAuth";
import apiClient from "@/lib/apiClient";
import { AuthFieldsType } from "@/types/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

const page = () => {
  const { error, loading, setData, setLoading, setError } = useResponse();
  const router = useRouter();

  const handleSubmit = async (values: Record<AuthFieldsType, string>) => {
    setError(undefined);
    setLoading(true);

    console.log(values);
    const { data, error, status } = await apiClient<any>("auth/login", {
      method: "POST",
      body: values,
    });

    setLoading(false);

    if (status >= 200 && status < 300 && !error) {
      setData(data);
      router.push("/");
    } else {
      setError(error || "Registration failed");
    }
  };
  return (
    <>
      <p className="absolute top-2 left-2">{error && JSON.stringify(error)}</p>
      <div className="h-screen flex items-center justify-center">
        <AuthForm
          fields={["email", "password"]}
          title={"Login to your account"}
          subtitle="Enter your credentials below to login to your account"
          submitHandler={handleSubmit}
          isLoading={loading}
          footerContent={
            <div>
              Don't have an account?{" "}
              <Link className="underline hover:scale-105" href="/auth/register">
                Sign Up
              </Link>
            </div>
          }
        />
      </div>
    </>
  );
};

export default page;
