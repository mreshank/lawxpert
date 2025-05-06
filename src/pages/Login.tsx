
import LoginForm from "@/components/LoginForm";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Link to="/" className="mb-8 text-2xl font-serif font-bold text-lawxpert-navy dark:text-lawxpert-gold">
        LawXpert
      </Link>
      <LoginForm />
      <div className="mt-8">
        <Link to="/" className="text-sm text-lawxpert-navy hover:underline dark:text-lawxpert-gold">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Login;
