// For the hackathon demo, this is a fixed list. In a real product, the
// caregiver would add family members with real photos during onboarding -
// using initials-on-a-circle here avoids needing any real photos or
// network image loading, which also makes the demo fully offline-reliable.

export const PEOPLE = [
  { id: "p1", name: "Rita", color: "#378ADD" },
  { id: "p2", name: "Manoj", color: "#1D9E75" },
  { id: "p3", name: "Anita", color: "#EF9F27" },
  { id: "p4", name: "Deepak", color: "#D85A30" },
  { id: "p5", name: "Sunita", color: "#7F77DD" },
  { id: "p6", name: "Ravi", color: "#D4537E" },
  { id: "p7", name: "Kiran", color: "#639922" },
  { id: "p8", name: "Meena", color: "#BA7517" },
];

export function initialsFor(name) {
  return name.charAt(0).toUpperCase();
}
