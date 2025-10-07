import { useEffect, useState } from "react";
import {getProfile} from '../api/api'

function mapToUserShape(any) {
  if (!any) return null;
  return {
    id: any.id ?? 0,
    name: any.name ?? any.username ?? "User",
    username: any.username ?? "",
    email: any.email ?? "",
    phone: any.phone ?? "",
    role: any.role ?? (any.roles?.[0] || "USER"),
    avatar: any.avatar ?? "",
  };
}

function Field({ label, value }) {
  return (
    <div className="space-y-1">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="font-semibold break-all">{value || "-"}</div>
    </div>
  );
}

export default function UserProfile() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
       
        const server = await getProfile();
        const shaped = mapToUserShape(server);
        if (shaped) {
          localStorage.setItem("user", JSON.stringify(shaped)); 
          setMe(shaped);
          return;
        }
        throw new Error("Empty server profile");
      } catch {
     
        try {
          const u = mapToUserShape(JSON.parse(localStorage.getItem("user") || "null"));
          if (u) { setMe(u); return; }
        } catch {
          console.log("error");
        }

       
        try {
          const a = mapToUserShape(JSON.parse(localStorage.getItem("auth") || "null"));
          if (a) { setMe(a); return; }
        } catch {
          console.log("error");
        }

        setErr("No profile data found.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6">Loading profile…</div>;
  if (!me)     return <div className="p-6 text-red-600">{err || "Cannot load profile."}</div>;

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-bold">User Profile</h1>
      <p className="text-gray-500 mt-1">Your personal information</p>

      <div className="mt-6 rounded-2xl border shadow-sm p-6">
        <div className="mb-6">
          <div className="text-xl font-semibold">Personal Information</div>
          <div className="text-gray-500 text-sm">Details of your account in the system</div>
        </div>

        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            {me.avatar ? (
              <img className="h-16 w-16 rounded-full object-cover border" src={me.avatar} alt="avatar" />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gray-100 border flex items-center justify-center">
                <span className="text-lg font-semibold">
                  {(me.name || "?").split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2)}
                </span>
              </div>
            )}
            <div>
              <div className="text-lg font-semibold">{me.name || me.username}</div>
              <div className="text-gray-500">@{me.username}</div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 border">
            {me.role}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
          <Field label="Full name" value={me.name} />
          <Field label="User ID" value={String(me.id)} />
          <Field label="Username" value={me.username} />
          <Field label="Role" value={me.role} />
          <Field label="Phone" value={me.phone} />
          <Field label="Email" value={me.email} />
        </div>
      </div>
    </div>
  );
}
