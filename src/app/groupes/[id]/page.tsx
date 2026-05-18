"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { AppNavbar } from "@/components/Navbar";
import { GROUPS, ACTIVITIES } from "@/lib/data";

const AVATAR_COLORS = ["#C4603A", "#3A7CC4", "#60C43A", "#C43A7C", "#7C3AC4", "#C4A03A"];

export default function GroupDetailPage() {
  const params = useParams();
  const group = GROUPS.find((g) => g.id === Number(params.id));
  const [joined, setJoined] = useState(false);

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-ink-3">Groupe introuvable.</p>
      </div>
    );
  }

  const activity = ACTIVITIES.find((a) => a.id === group.activityId);
  const isFull = group.members.length >= group.maxMembers;

  return (
    <div className="min-h-screen bg-bg pb-20 md:pb-0">
      <AppNavbar />

      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="bg-ink px-8 pt-10 pb-20 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <Link
            href={`/activites/${group.activityId}`}
            className="flex items-center gap-1 text-white/40 text-sm hover:text-white/80 transition-colors mb-6"
          >
            ← Retour à {activity?.title ?? "l'activité"}
          </Link>

          <h1 className="font-head text-4xl font-black text-black tracking-tight leading-tight mb-5">
            {group.name}
          </h1>

          <div className="flex gap-3 flex-wrap">
            <span className="meta-pill">📅 {group.date}</span>
            <span className="meta-pill">📍 {group.location}</span>
            <span className="meta-pill">
              👥 {group.members.length}/{group.maxMembers} membres
            </span>
          </div>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-8 -mt-8 relative z-10 space-y-5">
        {/* Description + organizer */}
        <div className="card">
          <h2 className="font-semibold mb-3">Description</h2>
          <p className="text-sm text-ink-2 leading-relaxed mb-5">{group.description}</p>
          <div className="border-t border-bg-3 pt-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-ink-3 mb-1">Organisateur</p>
              <p className="font-semibold text-sm">{group.organizer}</p>
            </div>
            <a
              href={group.contactLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
            >
              💬 Rejoindre le Discord
            </a>
          </div>
        </div>

        {/* Members */}
        <div className="card">
          <h2 className="font-semibold mb-4">
            Membres{" "}
            <span className="text-ink-3 text-sm font-normal">
              ({group.members.length}/{group.maxMembers})
            </span>
          </h2>
          <div className="flex flex-wrap gap-3">
            {group.members.map((member, i) => (
              <div
                key={member}
                className="flex items-center gap-2 bg-white border border-bg-3 rounded-full px-3 py-1.5 text-sm"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                >
                  {member
                    .split(" ")
                    .map((x) => x[0])
                    .join("")}
                </div>
                <span>{member}</span>
              </div>
            ))}
          </div>

          {/* Remaining spots */}
          {!isFull && (
            <p className="text-xs text-ink-3 mt-4">
              {group.maxMembers - group.members.length} place
              {group.maxMembers - group.members.length > 1 ? "s" : ""} disponible
              {group.maxMembers - group.members.length > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Join button */}
        <div className="pb-6">
          {joined ? (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-2xl px-6 py-4 text-center font-semibold">
              ✅ Tu as rejoint ce groupe ! Check le lien de contact pour la suite.
            </div>
          ) : isFull ? (
            <div className="bg-bg-2 rounded-2xl px-6 py-4 text-center text-ink-3">
              Ce groupe est complet. Tu peux{" "}
              <Link href={`/activites/${group.activityId}`} className="text-tc font-semibold hover:underline">
                voir d&apos;autres groupes
              </Link>{" "}
              ou en créer un.
            </div>
          ) : (
            <button
              onClick={() => setJoined(true)}
              className="btn btn-primary w-full justify-center py-4 text-base rounded-2xl"
            >
              Rejoindre ce groupe
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
