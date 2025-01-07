import Footer from "./Footer";
import Navbar from "./Navbar";
import DotPattern from "./DotPattern";
import { cn } from "../lib/utils";
import { useRouteError } from "@remix-run/react";

const ErrorPage = () => {
  const error = useRouteError() as any;
  console.error(error);
  return (
    <div className="relative min-h-screen">
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn("absolute inset-0 w-full h-full")}
      />
      <div className="relative min-h-screen flex flex-col justify-between z-10 mx-auto">
        <Navbar currentUser={null} />
        {error.status === 404 ? (
          <section>
            <div className="container mx-auto px-4 py-16">
              <h1 className="text-4xl font-bold text-center">{error.status} - Page Not Found</h1>
              <p className="text-center mt-4">The page you are looking for does not exist.</p>
            </div>
          </section>
        ) : (
          <section>
            <div className="container mx-auto px-4 py-16">
              <h1 className="text-4xl font-bold text-center">
                {error.status ?? 500} - Internal Server Error
              </h1>
              <p className="text-center mt-4">
                Oops! Something went wrong on our end. Please try again later.
              </p>
            </div>
          </section>
        )}
        <Footer />
      </div>
    </div>
  );
};

export default ErrorPage;
// const error = useRouteError();
// if (isRouteErrorResponse(error)) {
//   return (
//     <div className="bg-yellow-300">
//       <h1>
//         {error.status} {error.statusText}
//       </h1>
//       <p>{error.data}</p>
//     </div>
//   );
// } else if (error instanceof Error) {
//   return (
//     <div className="bg-red-400">
//       <h1></h1>
//       <p>{error.message}</p>
//       <p>The stack trace is:</p>
//       <pre>{error.stack}</pre>
//     </div>
//   );
// } else {
//   return <h1>Unknown Error</h1>;
// }
