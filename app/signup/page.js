import AuthForm from "@/components/AuthForm";
import { signup } from "@/app/actions/auth";

export default function SignupPage() {
  return (
    <AuthForm
      action={signup}
      title="회원가입"
      submitLabel="가입하기"
      altText="이미 계정이 있으신가요?"
      altHref="/login"
      altLabel="로그인"
    />
  );
}
