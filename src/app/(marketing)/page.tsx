import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen p-24">
      <div className="mx-auto max-w-2xl h-fit rounded-md border border-gray-300 shadow-sm py-2 px-2 flex flex-col gap-4">
        <div className="w-full flex flex-col items-center justify-center">
          <h1 className="text-xl text-slate-900 font-semibold">
            Welcome to Healthy Haven
          </h1>
          <p className="text-sm text-slate-800 font-medium ">
            Where dieting is done right
          </p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/auth/signup"
            className="focus:shadow-green-200 inline-flex items-center justify-center w-24 h-10 rounded-md bg-green-100 text-green-900 font-semibold py-2 px-2 border border-green-300"
          >
            sign up
          </Link>
          <Link
            href="/auth/signin"
            className="focus:shadow-gray-200 inline-flex items-center justify-center w-20 h-10 rounded-md bg-white-100 text-slate-900 font-semibold py-2 px-2 border border-gray-300 shadow-sm"
          >
            sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
