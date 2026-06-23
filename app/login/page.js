import AuthForm from "@/components/AuthForm";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  return (
    <AuthForm
      action={login}
      title="로그인"
      submitLabel="로그인"
      altText="아직 계정이 없으신가요?"
      altHref="/signup"
      altLabel="회원가입"
    />
  );
}
