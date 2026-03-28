import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes/paths";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <div className="hidden flex-1 items-center justify-center lg:flex">
        <div className="max-w-xl px-10 text-white">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-400/20 text-cyan-300 ring-1 ring-white/10">
              <span className="text-2xl font-bold">S</span>
            </div>
            <div>
              <div className="text-3xl font-semibold tracking-tight">Stayo</div>
              <div className="text-sm text-slate-300">
                Enterprise hospitality operations platform
              </div>
            </div>
          </div>

          <h1 className="text-5xl font-semibold leading-tight">
            Operate hotels with clarity, speed, and control.
          </h1>
          <p className="mt-6 text-lg text-slate-300">
            Unified admin experience for properties, staff, billing, devices,
            reports, integrations, and enterprise governance.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-white p-6 lg:max-w-xl">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="text-3xl font-semibold tracking-tight text-slate-900">
              Stayo
            </div>
            <div className="text-sm text-slate-500">Enterprise Admin Portal</div>
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            Sign in
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Static login for product review. API auth will be connected later.
          </p>

          <div className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email / Username
              </label>
              <input
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-0 transition focus:border-blue-400"
                placeholder="admin@stayo.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-0 transition focus:border-blue-400"
                placeholder="••••••••"
              />
            </div>

            <button
              onClick={() => navigate(PATHS.dashboard)}
              className="w-full rounded-2xl bg-blue-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-800"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}