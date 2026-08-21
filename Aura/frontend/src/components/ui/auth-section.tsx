import React, { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useCloudNavigate } from "../experience/CloudTunnelTransition";

export default function AuthSectionThree() {
  const { navigateWithClouds } = useCloudNavigate();
  const [isSignIn, setIsSignIn] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState("Alex");
  const [lastName, setLastName] = useState("Vance");
  const [age, setAge] = useState("28");
  const [phone, setPhone] = useState("+1 (555) 234-8901");
  const [email, setEmail] = useState("alex.vance@somnus.ai");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);

  const handleGithubSignup = () => {
    navigateWithClouds("/dashboard");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save to local profile session
    localStorage.setItem(
      "somnus_user_profile",
      JSON.stringify({
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        userId: "alexvance",
        age,
        phone,
        email,
      })
    );
    navigateWithClouds("/dashboard");
  };

  return (
    <section className="min-h-screen bg-canvas px-4 py-8 text-ink antialiased [font-synthesis:none] relative celestial-grain flex flex-col justify-between select-none">
      {/* Return to Home link */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between py-2">
        <button
          onClick={() => navigateWithClouds("/")}
          className="flex items-center gap-2 text-xs font-nineties uppercase tracking-wider text-muted-ink hover:text-ink transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Somnus AI</span>
        </button>

        <div className="flex items-center gap-2 font-nineties text-xs tracking-wider text-muted-ink">
          <span>{isSignIn ? "Don't have an account?" : "Already have an account?"}</span>
          <button
            onClick={() => setIsSignIn(!isSignIn)}
            className="text-brand font-medium underline underline-offset-2 cursor-pointer hover:text-brand-dark"
          >
            {isSignIn ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center my-auto">
        <div className="w-full max-w-[480px] rounded-2xl border border-line bg-surface px-6 py-8 shadow-xs sm:px-10 sm:py-10">
          <div className="flex items-center gap-3 mb-6">
            <img
              src="/assets/logo.png"
              alt="Somnus AI Logo"
              className="w-9 h-9 object-contain"
            />
            <span className="font-jeanoti text-2xl font-normal text-ink">
              Somnus AI
            </span>
          </div>

          <div>
            <h1 className="font-ciberus text-2xl sm:text-3xl font-normal tracking-normal text-ink">
              {isSignIn ? "Welcome Back" : "Create an Account"}
            </h1>

            <p className="mt-1 text-xs text-muted-ink font-stenz">
              {isSignIn ? "Sign in to access your physiological sleep dashboard." : "Set up your personal profile and sleep monitoring telemetry."}
            </p>
          </div>

          {/* GitHub Signup */}
          <button
            type="button"
            onClick={handleGithubSignup}
            className="mt-6 flex h-10 w-full items-center justify-center gap-2.5 rounded-lg border border-line bg-canvas px-4 text-xs font-nineties uppercase tracking-wider text-ink transition-colors hover:bg-black/5 cursor-pointer shadow-2xs"
          >
            <GithubIcon />
            <span>{isSignIn ? "Sign in with GitHub" : "Sign up with GitHub"}</span>
          </button>

          <div className="my-5 flex items-center gap-4 text-xs font-stenz text-muted-ink">
            <div className="h-px flex-1 bg-line" />
            <span>or continue with email</span>
            <div className="h-px flex-1 bg-line" />
          </div>

          <form className="space-y-3.5" onSubmit={handleSubmit}>
            {!isSignIn && (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-stenz uppercase tracking-wider text-muted-ink font-medium">First name</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Alex"
                      className="w-full h-10 px-3 rounded-lg border border-line bg-canvas text-xs text-ink outline-none focus:border-brand"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-stenz uppercase tracking-wider text-muted-ink font-medium">Last name</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Vance"
                      className="w-full h-10 px-3 rounded-lg border border-line bg-canvas text-xs text-ink outline-none focus:border-brand"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-stenz uppercase tracking-wider text-muted-ink font-medium">Age</label>
                    <input
                      type="number"
                      min="12"
                      max="120"
                      required
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="28"
                      className="w-full h-10 px-3 rounded-lg border border-line bg-canvas text-xs text-ink outline-none focus:border-brand"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-stenz uppercase tracking-wider text-muted-ink font-medium">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 234-8901"
                      className="w-full h-10 px-3 rounded-lg border border-line bg-canvas text-xs text-ink outline-none focus:border-brand"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1 text-left">
              <label className="text-xs font-stenz uppercase tracking-wider text-muted-ink font-medium">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.vance@somnus.ai"
                className="w-full h-10 px-3 rounded-lg border border-line bg-canvas text-xs text-ink outline-none focus:border-brand"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-stenz uppercase tracking-wider text-muted-ink font-medium">Password</label>
              <div className="relative flex h-10 items-center rounded-lg border border-line bg-canvas px-3">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
                  className="w-full bg-transparent text-xs text-ink outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-muted-ink hover:text-ink cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 flex h-11 w-full items-center justify-center rounded-lg bg-brand text-xs font-nineties uppercase tracking-wider text-white transition-colors hover:bg-brand-dark cursor-pointer shadow-xs"
            >
              {isSignIn ? "Sign In to Telemetry" : "Complete Registration"}
            </button>
          </form>
        </div>
      </div>

      <div className="w-full text-center text-xs font-nineties uppercase tracking-wider text-muted-ink py-2">
        &copy; 2026 Somnus AI &mdash; Autonomous Sleep Biometrics
      </div>
    </section>
  );
}

function GithubIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.13c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.2-3.1-.12-.3-.52-1.47.11-3.06 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.82 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.06.75.81 1.2 1.84 1.2 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.07.78 2.16v3.2c0 .31.2.66.79.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}
