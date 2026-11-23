/** Remonté à chaque navigation : c'est ce qui déclenche le fondu d'entrée de page. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
