// components/withAuth.js
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/firebase/config";

const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.replace("/sign-in"); // redirect to login if not authenticated
        } else {
          setLoading(false);
        }
      });

      return () => unsubscribe();
    }, [router]);

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${getDisplayName(
    WrappedComponent
  )})`;

  return AuthenticatedComponent;
};

const getDisplayName = (WrappedComponent) => {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
};

export default withAuth;
