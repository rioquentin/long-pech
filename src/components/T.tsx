import { Fragment } from "react";
import { ui } from "@/lib/content";
import { showTodos } from "@/lib/flags";

const SPLIT = /(\{\{TODO_CLIENT:[^}]+\}\})/g;

/** Affiche un texte de contenu. Les {{TODO_CLIENT}} deviennent des étiquettes visibles, ou un texte neutre. */
export function T({ children }: { children: string | null | undefined }) {
  if (!children) return null;
  const parts = children.split(SPLIT).filter((p) => p.trim() !== "");
  const onlyTodo = parts.every((p) => p.startsWith("{{TODO_CLIENT"));
  if (!showTodos && onlyTodo) return <>{ui.todoHidden}</>;
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("{{TODO_CLIENT") ? (
          showTodos ? (
            <span key={i} className="todo">
              {part}
            </span>
          ) : null
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
